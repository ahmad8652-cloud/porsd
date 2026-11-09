import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppData, Contingent, AppHeaderSettings, AppThemeSettings, MedalLog } from './types/index.js';
import {
  createInitialContingents,
  DEFAULT_HEADER_SETTINGS,
  DEFAULT_THEME_SETTINGS,
  calculateRankings,
  calculateStatistics
} from './utils/ranking.js';
import { Header } from './components/Header.js';
import { StatsCards } from './components/StatsCards.js';
import { LiveTicker } from './components/LiveTicker.js';
import { MedalTable } from './components/MedalTable.js';
import { AdminModal } from './components/AdminModal.js';
import { QuickAddModal } from './components/QuickAddModal.js';
import { Trophy, CheckCircle, Wifi, WifiOff } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'por_sd_benjeng_data_2026';

export default function App() {
  // App State
  const [data, setData] = useState<AppData>(() => {
    // Try to load cached data from localStorage
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.contingents)) {
          return {
            ...parsed,
            contingents: calculateRankings(parsed.contingents)
          };
        }
      }
    } catch {
      // ignore
    }
    const initial = createInitialContingents();
    return {
      contingents: calculateRankings(initial),
      header: DEFAULT_HEADER_SETTINGS,
      theme: DEFAULT_THEME_SETTINGS,
      logs: [],
      lastUpdated: new Date().toISOString()
    };
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('por_admin_logged_in') === 'true';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [quickAddContingent, setQuickAddContingent] = useState<Contingent | null>(null);
  const [recentWinnerId, setRecentWinnerId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // local storage might be full or private mode
    }
  }, [data]);

  // Fetch initial data from server
  const fetchFromServer = useCallback(async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/standings');
      if (res.ok) {
        const serverData: AppData = await res.json();
        setData((prev) => ({
          ...serverData,
          contingents: calculateRankings(serverData.contingents || prev.contingents)
        }));
        setIsOnline(true);
      }
    } catch {
      setIsOnline(false);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Connect to Server-Sent Events (SSE) for live push updates
  useEffect(() => {
    fetchFromServer();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onopen = () => {
        setIsOnline(true);
      };
      eventSource.onmessage = (event) => {
        try {
          const incoming: AppData = JSON.parse(event.data);
          if (incoming && Array.isArray(incoming.contingents)) {
            setData({
              ...incoming,
              contingents: calculateRankings(incoming.contingents)
            });
            setIsOnline(true);
          }
        } catch (e) {
          console.error('Failed to parse SSE update', e);
        }
      };
      eventSource.onerror = () => {
        setIsOnline(false);
      };
    } catch {
      setIsOnline(false);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [fetchFromServer]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Admin login handler
  const handleAdminLogin = (password: string) => {
    if (password === 'admin123' || password === 'admin') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('por_admin_logged_in', 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('por_admin_logged_in');
  };

  // Save all settings to server
  const handleSaveAll = async (
    newContingents: Contingent[],
    newHeader: AppHeaderSettings,
    newTheme: AppThemeSettings
  ) => {
    const updatedRanked = calculateRankings(newContingents);
    const updated: AppData = {
      ...data,
      contingents: updatedRanked,
      header: newHeader,
      theme: newTheme,
      lastUpdated: new Date().toISOString()
    };

    setData(updated);

    try {
      await fetch('/api/standings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch {
      // saved locally in state & localStorage
    }

    showToast('Perubahan berhasil disimpan & disiarkan langsung!');
  };

  // Reset to initial 28 contingents
  const handleResetData = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        const serverData: AppData = await res.json();
        setData({
          ...serverData,
          contingents: calculateRankings(serverData.contingents)
        });
      }
    } catch {
      const fresh = createInitialContingents();
      setData({
        ...data,
        contingents: calculateRankings(fresh),
        header: DEFAULT_HEADER_SETTINGS,
        theme: DEFAULT_THEME_SETTINGS,
        logs: [],
        lastUpdated: new Date().toISOString()
      });
    }
    showToast('Data berhasil direset ke susunan awal 28 kontingen.');
  };

  // Quick Add Medal submission (from table or modal)
  const handleQuickAddMedal = async (
    contingentId: string,
    type: 'gold' | 'silver' | 'bronze',
    delta: number,
    note: string
  ) => {
    const target = data.contingents.find((c) => c.id === contingentId);
    if (!target) return;

    // Pulse highlight for recent winner
    setRecentWinnerId(contingentId);
    setTimeout(() => setRecentWinnerId(null), 5000);

    const medalEmoji = type === 'gold' ? '🥇 Emas' : type === 'silver' ? '🥈 Perak' : '🥉 Perunggu';
    showToast(`🎉 +${delta} ${medalEmoji} untuk ${target.name}!`);

    try {
      const res = await fetch('/api/log-medal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contingentId, type, delta, note })
      });
      if (res.ok) {
        const respData = await res.json();
        if (respData.data) {
          setData({
            ...respData.data,
            contingents: calculateRankings(respData.data.contingents)
          });
        }
      }
    } catch {
      // Local fallback
      const updatedList = data.contingents.map((c) => {
        if (c.id !== contingentId) return c;
        const current = c[type] || 0;
        const next = Math.max(0, current + delta);
        return {
          ...c,
          [type]: next,
          total: (type === 'gold' ? next : c.gold) +
                 (type === 'silver' ? next : c.silver) +
                 (type === 'bronze' ? next : c.bronze)
        };
      });

      const newLog: MedalLog = {
        id: `log-${Date.now()}`,
        timestamp: Date.now(),
        contingentName: target.name,
        contingentId: target.id,
        type,
        delta,
        note: note || undefined
      };

      setData({
        ...data,
        contingents: calculateRankings(updatedList),
        logs: [newLog, ...data.logs].slice(0, 30),
        lastUpdated: new Date().toISOString()
      });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Compute live statistics
  const stats = useMemo(() => {
    return calculateStatistics(data.contingents);
  }, [data.contingents]);

  // Background styling based on theme settings
  const bgClasses = useMemo(() => {
    switch (data.theme?.themeMode) {
      case 'dark':
        return 'bg-slate-950 text-slate-100 bg-scoreboard-lines';
      case 'royal':
        return 'bg-gradient-to-b from-indigo-950 via-slate-950 to-blue-950 text-slate-100 bg-dots-pattern';
      case 'goldAccent':
        return 'bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 text-slate-100 bg-grid-pattern';
      case 'navy':
      default:
        return 'bg-gradient-to-b from-blue-950/70 via-slate-950 to-slate-950 text-slate-100 bg-grid-pattern';
    }
  }, [data.theme?.themeMode]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${bgClasses}`}>
      {/* Top Header */}
      <Header
        settings={data.header}
        lastUpdated={data.lastUpdated}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onPrint={handlePrint}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onRefresh={fetchFromServer}
        isSyncing={isSyncing}
      />

      {/* Live Medal Ticker Announcement Bar */}
      <LiveTicker
        logs={data.logs}
        enabled={data.theme?.tickerEnabled ?? true}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Section 8: Statistics Cards */}
        <StatsCards
          totalContingents={stats.totalContingents}
          totalGold={stats.totalGold}
          totalSilver={stats.totalSilver}
          totalBronze={stats.totalBronze}
          totalAllMedals={stats.totalAllMedals}
        />

        {/* Section 3 & 4: Live Medal Standing Table */}
        <MedalTable
          contingents={data.contingents}
          isAdmin={isAdminLoggedIn}
          onQuickAddMedal={(c) => setQuickAddContingent(c)}
          recentWinnerId={recentWinnerId}
        />
      </main>

      {/* Scoreboard Footer */}
      <footer className="no-print mt-auto border-t border-slate-800/80 bg-slate-950/90 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">
              POR SD KECAMATAN BENJENG 2026
            </span>
            <span className="text-slate-600">|</span>
            <span>Kabupaten Gresik, Jawa Timur</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Koneksi Server:</span>
            {isOnline ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <Wifi className="w-3.5 h-3.5" />
                <span>Terhubung Real-Time</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Mode Offline (Disimpan di Perangkat)</span>
              </span>
            )}
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-amber-500/60 text-white shadow-2xl shadow-black/60 animate-bounce">
          <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Admin Dashboard Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isLoggedIn={isAdminLoggedIn}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        contingents={data.contingents}
        headerSettings={data.header}
        themeSettings={data.theme}
        onSaveAll={handleSaveAll}
        onResetData={handleResetData}
      />

      {/* Quick Add Medal Modal */}
      <QuickAddModal
        contingent={quickAddContingent}
        onClose={() => setQuickAddContingent(null)}
        onSubmit={handleQuickAddMedal}
      />
    </div>
  );
}
