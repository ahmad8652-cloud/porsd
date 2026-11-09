import React from 'react';
import { AppHeaderSettings } from '../types/index.js';
import { Maximize, Minimize, Printer, Shield, RefreshCw, Radio } from 'lucide-react';

interface HeaderProps {
  settings: AppHeaderSettings;
  lastUpdated: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onPrint: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onRefresh: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  lastUpdated,
  isFullscreen,
  onToggleFullscreen,
  onPrint,
  onOpenAdmin,
  isAdminLoggedIn,
  onRefresh,
  isSyncing
}) => {
  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(lastUpdated);
      return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return lastUpdated;
    }
  }, [lastUpdated]);

  return (
    <header className="relative w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md z-30 transition-all duration-300">
      {/* Top utility bar */}
      <div className="no-print border-b border-slate-800/60 bg-slate-900/60 px-4 py-2 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Live Indicator & Timestamp */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px] tracking-wide uppercase shadow-sm shadow-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE STANDING</span>
            </span>

            <span className="text-slate-400 hidden sm:inline-flex items-center gap-1.5">
              <span>Pembaruan Terakhir:</span>
              <span className="text-slate-200 font-medium font-mono">{formattedDate}</span>
            </span>
          </div>

          {/* Action buttons: Refresh, Fullscreen, Print, Admin */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isSyncing}
              title="Perbarui data"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-400' : ''}`} />
              <span className="hidden md:inline">Sinkronisasi</span>
            </button>

            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Proyektor / LED)'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60"
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Keluar Layar Penuh</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Layar Penuh (LED/TV)</span>
                </>
              )}
            </button>

            <button
              onClick={onPrint}
              title="Cetak Klasemen Medali Resmi"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Cetak / PDF</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition border shadow-sm ${
                isAdminLoggedIn
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-amber-500/20'
                  : 'bg-red-600 hover:bg-red-500 text-white border-red-500/60 shadow-red-600/20'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'PANEL ADMIN' : 'LOGIN ADMIN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 text-center">
        {/* Requirement 2: Three organizer logos horizontally in the center, directly above title */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 mb-4">
          {/* Logo 1 */}
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 p-1.5 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 shadow-lg shadow-black/40 flex items-center justify-center transition-transform hover:scale-105">
              <img
                src={settings.logo1}
                alt="Logo Penyelenggara 1"
                className="max-h-full max-w-full object-contain filter drop-shadow"
              />
            </div>
            {settings.logo1Label && (
              <span className="text-[10px] sm:text-xs text-slate-400 mt-1.5 font-medium max-w-[100px] sm:max-w-[120px] truncate">
                {settings.logo1Label}
              </span>
            )}
          </div>

          {/* Logo 2 (Center - prominent POR SD badge) */}
          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 p-2 rounded-2xl bg-gradient-to-b from-blue-900/60 via-slate-800/90 to-slate-950 border-2 border-amber-500/60 shadow-xl shadow-amber-500/10 flex items-center justify-center transition-transform hover:scale-105 ring-4 ring-amber-500/10">
              <img
                src={settings.logo2}
                alt="Logo Penyelenggara 2"
                className="max-h-full max-w-full object-contain filter drop-shadow"
              />
            </div>
            {settings.logo2Label && (
              <span className="text-[10px] sm:text-xs text-amber-300 font-bold mt-1.5 max-w-[120px] sm:max-w-[140px] truncate">
                {settings.logo2Label}
              </span>
            )}
          </div>

          {/* Logo 3 */}
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 p-1.5 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 shadow-lg shadow-black/40 flex items-center justify-center transition-transform hover:scale-105">
              <img
                src={settings.logo3}
                alt="Logo Penyelenggara 3"
                className="max-h-full max-w-full object-contain filter drop-shadow"
              />
            </div>
            {settings.logo3Label && (
              <span className="text-[10px] sm:text-xs text-slate-400 mt-1.5 font-medium max-w-[100px] sm:max-w-[120px] truncate">
                {settings.logo3Label}
              </span>
            )}
          </div>
        </div>

        {/* Titles */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider uppercase font-scoreboard text-white drop-shadow-md">
            <span className="bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
              {settings.mainTitle}
            </span>
          </h1>

          <h2 className="text-base sm:text-xl md:text-2xl font-bold tracking-wide text-sky-300 max-w-3xl mx-auto">
            {settings.subTitle}
          </h2>

          <div className="pt-2 flex items-center justify-center gap-2">
            <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-red-500"></span>
            <p className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-red-400 bg-red-950/40 px-3 py-0.5 rounded-full border border-red-500/30">
              {settings.tagline}
            </p>
            <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-red-500"></span>
          </div>
        </div>
      </div>
    </header>
  );
};
