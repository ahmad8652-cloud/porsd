import { Contingent } from '../types/index.js';

export function exportContingentsToCSV(contingents: Contingent[]): string {
  const headers = ['Peringkat', 'Nama Kontingen', 'Emas', 'Perak', 'Perunggu', 'Total'];
  const rows = contingents.map((c) => [
    c.officialRank ?? '-',
    `"${c.name.replace(/"/g, '""')}"`,
    c.gold,
    c.silver,
    c.bronze,
    (c.gold + c.silver + c.bronze)
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function parseCSVToContingents(csvText: string, currentContingents: Contingent[]): Contingent[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return currentContingents;

  const result: Contingent[] = [];
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parser supporting quotes
    const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))/g;
    const cols: string[] = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      // index 1 is quoted, index 2 is unquoted
      const val = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
      cols.push(val.trim());
      if (regex.lastIndex >= line.length) break;
    }

    if (cols.length >= 2) {
      // Column format: [Rank, Name, Gold, Silver, Bronze] or [Name, Gold, Silver, Bronze]
      let name = '';
      let gold = 0;
      let silver = 0;
      let bronze = 0;

      if (cols.length >= 5 && !isNaN(Number(cols[0])) && isNaN(Number(cols[1]))) {
        name = cols[1];
        gold = parseInt(cols[2], 10) || 0;
        silver = parseInt(cols[3], 10) || 0;
        bronze = parseInt(cols[4], 10) || 0;
      } else {
        name = cols[0];
        gold = parseInt(cols[1], 10) || 0;
        silver = parseInt(cols[2], 10) || 0;
        bronze = parseInt(cols[3], 10) || 0;
      }

      if (name) {
        // Find existing to preserve logo or generate new
        const existing = currentContingents.find((c) => c.name.toLowerCase() === name.toLowerCase());
        result.push({
          id: existing?.id || `cont-${Date.now()}-${i}`,
          name,
          logoUrl: existing?.logoUrl,
          gold: Math.max(0, gold),
          silver: Math.max(0, silver),
          bronze: Math.max(0, bronze),
          total: gold + silver + bronze
        });
      }
    }
  }

  return result.length > 0 ? result : currentContingents;
}
