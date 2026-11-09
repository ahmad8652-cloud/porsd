import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createInitialContingents, DEFAULT_HEADER_SETTINGS, DEFAULT_THEME_SETTINGS, calculateRankings } from './src/utils/ranking.js';
import { AppData, MedalLog } from './src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'standings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory state initialized from file or defaults
function getInitialData(): AppData {
  const initial = createInitialContingents();
  return {
    contingents: calculateRankings(initial),
    header: DEFAULT_HEADER_SETTINGS,
    theme: DEFAULT_THEME_SETTINGS,
    logs: [
      {
        id: 'init-1',
        timestamp: Date.now() - 3600000,
        contingentName: 'UPT SD Negeri 93 Gresik',
        contingentId: 'cont-1',
        type: 'gold',
        delta: 1,
        note: 'Cabor Bulutangkis Tunggal Putra'
      },
      {
        id: 'init-2',
        timestamp: Date.now() - 1800000,
        contingentName: 'UPT SD Negeri 94 Gresik',
        contingentId: 'cont-2',
        type: 'gold',
        delta: 1,
        note: 'Cabor Atletik Lari 60m Putri'
      }
    ],
    lastUpdated: new Date().toISOString()
  };
}

let appData: AppData = getInitialData();

// Load from disk if exists
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.contingents)) {
      appData = {
        ...getInitialData(),
        ...parsed,
        contingents: calculateRankings(parsed.contingents)
      };
    }
  } else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');
  }
} catch (e) {
  console.error('Failed to read standings data file, using defaults', e);
}

function saveData(data: AppData) {
  appData = {
    ...data,
    contingents: calculateRankings(data.contingents),
    lastUpdated: new Date().toISOString()
  };
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data to disk', err);
  }
  broadcastUpdate(appData);
}

// SSE Clients for Live Scoreboard Push
type SSEClient = {
  id: number;
  res: Response;
};
let sseClients: SSEClient[] = [];
let nextClientId = 1;

function broadcastUpdate(data: AppData) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch {
      // client disconnected
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '15mb' }));

  // API Routes
  app.get('/api/standings', (_req: Request, res: Response) => {
    res.json(appData);
  });

  app.post('/api/standings', (req: Request, res: Response) => {
    const newContingents = req.body.contingents;
    const newHeader = req.body.header || appData.header;
    const newTheme = req.body.theme || appData.theme;
    const newLogs = req.body.logs || appData.logs;

    if (!Array.isArray(newContingents)) {
      res.status(400).json({ error: 'Invalid contingents data' });
      return;
    }

    saveData({
      contingents: newContingents,
      header: newHeader,
      theme: newTheme,
      logs: newLogs,
      lastUpdated: new Date().toISOString()
    });

    res.json({ success: true, data: appData });
  });

  app.post('/api/reset', (_req: Request, res: Response) => {
    const fresh = getInitialData();
    saveData(fresh);
    res.json({ success: true, data: appData });
  });

  app.post('/api/log-medal', (req: Request, res: Response) => {
    const { contingentId, type, delta, note } = req.body;
    const target = appData.contingents.find((c) => c.id === contingentId);
    if (!target) {
      res.status(404).json({ error: 'Contingent not found' });
      return;
    }

    if (type === 'gold') target.gold = Math.max(0, target.gold + delta);
    if (type === 'silver') target.silver = Math.max(0, target.silver + delta);
    if (type === 'bronze') target.bronze = Math.max(0, target.bronze + delta);
    target.total = target.gold + target.silver + target.bronze;

    const newLog: MedalLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      contingentName: target.name,
      contingentId: target.id,
      type,
      delta,
      note: note || undefined
    };

    const updatedLogs = [newLog, ...(appData.logs || [])].slice(0, 30);
    saveData({
      ...appData,
      logs: updatedLogs
    });

    res.json({ success: true, log: newLog, data: appData });
  });

  // Server-Sent Events Endpoint for real-time live sync across devices
  app.get('/api/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = nextClientId++;
    sseClients.push({ id: clientId, res });

    // Send immediate initial data on connect
    res.write(`data: ${JSON.stringify(appData)}\n\n`);

    req.on('close', () => {
      sseClients = sseClients.filter((c) => c.id !== clientId);
    });
  });

  // Mount Vite or static server
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Live Medal Standing POR SD Benjeng server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
