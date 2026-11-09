import React from 'react';
import { Users, Award, Trophy, Medal, Sparkles } from 'lucide-react';

interface StatsCardsProps {
  totalContingents: number;
  totalGold: number;
  totalSilver: number;
  totalBronze: number;
  totalAllMedals: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalContingents,
  totalGold,
  totalSilver,
  totalBronze,
  totalAllMedals
}) => {
  return (
    <div className="w-full space-y-3">
      {/* 4 Main Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Kontingen */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-blue-950/70 border border-slate-700/80 p-4 sm:p-5 shadow-lg shadow-black/30 group hover:border-sky-500/50 transition-all">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-sky-500/10 rounded-full blur-xl group-hover:bg-sky-500/20 transition-all"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Kontingen
              </p>
              <h3 className="text-2xl sm:text-4xl font-extrabold font-scoreboard text-white mt-1">
                {totalContingents}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2 font-medium">
            Sekolah Dasar se-Kec. Benjeng
          </p>
        </div>

        {/* Card 2: Total Medali Emas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-amber-950/40 to-yellow-950/50 border border-amber-500/40 p-4 sm:p-5 shadow-lg shadow-amber-500/10 group hover:border-amber-400 transition-all">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/15 rounded-full blur-xl group-hover:bg-amber-500/25 transition-all"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <span>Emas</span>
                <span className="text-amber-400">🥇</span>
              </p>
              <h3 className="text-2xl sm:text-4xl font-extrabold font-scoreboard text-amber-300 mt-1">
                {totalGold}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-amber-200/70 mt-2 font-medium">
            Penentu Utama Peringkat
          </p>
        </div>

        {/* Card 3: Total Medali Perak */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/60 to-slate-800/80 border border-slate-400/40 p-4 sm:p-5 shadow-lg shadow-black/20 group hover:border-slate-300 transition-all">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-slate-300/10 rounded-full blur-xl group-hover:bg-slate-300/20 transition-all"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span>Perak</span>
                <span className="text-slate-300">🥈</span>
              </p>
              <h3 className="text-2xl sm:text-4xl font-extrabold font-scoreboard text-slate-100 mt-1">
                {totalSilver}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-400/20 border border-slate-300/40 flex items-center justify-center text-slate-200 shadow-inner">
              <Medal className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2 font-medium">
            Pemecah Urutan Tampilan
          </p>
        </div>

        {/* Card 4: Total Medali Perunggu */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-orange-950/40 to-amber-950/60 border border-orange-500/40 p-4 sm:p-5 shadow-lg shadow-orange-500/10 group hover:border-orange-400 transition-all">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-600/15 rounded-full blur-xl group-hover:bg-orange-600/25 transition-all"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-300 flex items-center gap-1.5">
                <span>Perunggu</span>
                <span className="text-orange-400">🥉</span>
              </p>
              <h3 className="text-2xl sm:text-4xl font-extrabold font-scoreboard text-orange-300 mt-1">
                {totalBronze}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shadow-inner">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-orange-200/70 mt-2 font-medium">
            Pemecah Urutan Visual
          </p>
        </div>
      </div>

      {/* Total Seluruh Medali Bar */}
      <div className="rounded-xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-red-950/80 border border-slate-700/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-slate-300 font-medium">TOTAL SELURUH MEDALI KESELURUHAN:</span>
          <span className="font-extrabold font-scoreboard text-white text-base sm:text-lg bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-600">
            {totalAllMedals} Medali
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Komposisi:</span>
          <span className="text-amber-300 font-bold">{totalGold} Emas</span>
          <span>•</span>
          <span className="text-slate-200 font-bold">{totalSilver} Perak</span>
          <span>•</span>
          <span className="text-orange-400 font-bold">{totalBronze} Perunggu</span>
        </div>
      </div>
    </div>
  );
};
