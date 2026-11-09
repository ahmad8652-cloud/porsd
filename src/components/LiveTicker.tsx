import React from 'react';
import { MedalLog } from '../types/index.js';
import { Bell, Trophy } from 'lucide-react';

interface LiveTickerProps {
  logs: MedalLog[];
  enabled: boolean;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ logs, enabled }) => {
  if (!enabled || !logs || logs.length === 0) return null;

  return (
    <div className="no-print w-full bg-gradient-to-r from-blue-900/40 via-slate-900 to-red-900/40 border-y border-slate-800/80 overflow-hidden py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>UPDATE MEDALI TERKINI</span>
        </div>

        {/* Scrolling or marquee ticker */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 text-xs whitespace-nowrap text-slate-300">
          {logs.slice(0, 10).map((log) => {
            const medalEmoji = log.type === 'gold' ? '🥇 Emas' : log.type === 'silver' ? '🥈 Perak' : '🥉 Perunggu';
            const colorClass = log.type === 'gold' ? 'text-amber-400 font-bold' : log.type === 'silver' ? 'text-slate-200 font-bold' : 'text-orange-400 font-bold';

            return (
              <div key={log.id} className="inline-flex items-center gap-2 bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700/50">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-white">{log.contingentName}</span>
                <span>meraih</span>
                <span className={colorClass}>{medalEmoji}</span>
                {log.note && <span className="text-slate-400 italic">({log.note})</span>}
                <span className="text-[10px] text-slate-500 ml-1">
                  {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
