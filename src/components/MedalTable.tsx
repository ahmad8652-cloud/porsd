import React, { useState, useMemo } from 'react';
import { Contingent } from '../types/index.js';
import { Trophy, Medal, Award, Search, PlusCircle, ArrowUpDown, Info } from 'lucide-react';

interface MedalTableProps {
  contingents: Contingent[];
  isAdmin: boolean;
  onQuickAddMedal?: (contingent: Contingent) => void;
  recentWinnerId?: string | null;
}

export const MedalTable: React.FC<MedalTableProps> = ({
  contingents,
  isAdmin,
  onQuickAddMedal,
  recentWinnerId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'podium' | 'with-medals'>('all');

  const filteredContingents = useMemo(() => {
    let list = contingents;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }

    if (filterMode === 'podium') {
      list = list.filter((c) => (c.officialRank || 999) <= 3);
    } else if (filterMode === 'with-medals') {
      list = list.filter((c) => (c.total || 0) > 0);
    }

    return list;
  }, [contingents, searchQuery, filterMode]);

  return (
    <div className="w-full space-y-4">
      {/* Search and Filter Controls */}
      <div className="no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/70 p-3 sm:p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama kontingen (contoh: SDN 93, Muhammadiyah, NU)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              filterMode === 'all'
                ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Semua ({contingents.length})
          </button>
          <button
            onClick={() => setFilterMode('podium')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              filterMode === 'podium'
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Peringkat 1-3
          </button>
          <button
            onClick={() => setFilterMode('with-medals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              filterMode === 'with-medals'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Pernah Raih Medali
          </button>
        </div>
      </div>

      {/* Official Ranking Rule banner */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-sky-300">
        <Info className="w-4 h-4 flex-shrink-0 text-amber-400" />
        <span>
          <strong>Aturan Peringkat Resmi:</strong> Peringkat ditentukan dari jumlah perolehan medali{' '}
          <span className="text-amber-300 font-bold">GOLD (Emas)</span>. Kontingen dengan jumlah Emas yang sama menempati peringkat resmi yang sama. Perak dan Perunggu menjadi penentu urutan tampilan visual.
        </span>
      </div>

      {/* Table Container */}
      <div className="relative overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b-2 border-slate-700 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-xs sm:text-sm font-extrabold tracking-wider uppercase text-slate-300">
              <th scope="col" className="py-4 px-3 sm:px-6 w-20 text-center">
                <span className="flex items-center justify-center gap-1">
                  RANK
                  <ArrowUpDown className="w-3 h-3 text-slate-500 no-print" />
                </span>
              </th>
              <th scope="col" className="py-4 px-4 sm:px-6 min-w-[240px]">
                KONTINGEN
              </th>
              <th scope="col" className="py-4 px-3 sm:px-6 w-28 sm:w-36 text-center text-amber-400 bg-amber-500/10">
                <span className="flex items-center justify-center gap-1.5">
                  <span className="text-base">🥇</span>
                  <span>GOLD</span>
                </span>
              </th>
              <th scope="col" className="py-4 px-3 sm:px-6 w-28 sm:w-36 text-center text-slate-200 bg-slate-400/10">
                <span className="flex items-center justify-center gap-1.5">
                  <span className="text-base">🥈</span>
                  <span>SILVER</span>
                </span>
              </th>
              <th scope="col" className="py-4 px-3 sm:px-6 w-28 sm:w-36 text-center text-orange-400 bg-orange-500/10">
                <span className="flex items-center justify-center gap-1.5">
                  <span className="text-base">🥉</span>
                  <span>BRONZE</span>
                </span>
              </th>
              <th scope="col" className="py-4 px-3 sm:px-6 w-28 sm:w-36 text-center text-white bg-blue-600/15 font-black">
                TOTAL
              </th>
              {isAdmin && (
                <th scope="col" className="no-print py-4 px-3 w-28 text-center text-slate-400">
                  AKSI
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/80 text-sm">
            {filteredContingents.map((contingent) => {
              const rank = contingent.officialRank ?? 99;
              const isRank1 = rank === 1;
              const isRank2 = rank === 2;
              const isRank3 = rank === 3;
              const isPodium = isRank1 || isRank2 || isRank3;
              const isRecentlyUpdated = recentWinnerId === contingent.id;

              // Special Podium Styling
              let rowBgClass = 'hover:bg-slate-800/50 transition-all duration-300';
              if (isRank1) {
                rowBgClass = 'bg-gradient-to-r from-amber-500/15 via-slate-900/80 to-amber-950/30 hover:from-amber-500/20';
              } else if (isRank2) {
                rowBgClass = 'bg-gradient-to-r from-slate-400/10 via-slate-900/80 to-slate-800/30 hover:from-slate-400/15';
              } else if (isRank3) {
                rowBgClass = 'bg-gradient-to-r from-orange-500/10 via-slate-900/80 to-orange-950/20 hover:from-orange-500/15';
              }

              if (isRecentlyUpdated) {
                rowBgClass += ' ring-2 ring-amber-400/80 animate-pulse bg-amber-500/25';
              }

              return (
                <tr
                  key={contingent.id}
                  className={`${rowBgClass}`}
                >
                    {/* Rank Badge */}
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center font-scoreboard font-black">
                      <div className="flex items-center justify-center">
                        {isRank1 ? (
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 text-slate-950 flex flex-col items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-300">
                            <Trophy className="w-4 h-4 fill-current" />
                            <span className="text-sm font-black leading-none">1</span>
                          </div>
                        ) : isRank2 ? (
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-slate-400 via-slate-200 to-white text-slate-900 flex flex-col items-center justify-center shadow-md shadow-slate-400/20 border border-slate-300">
                            <Medal className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-black leading-none">2</span>
                          </div>
                        ) : isRank3 ? (
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-300 text-slate-950 flex flex-col items-center justify-center shadow-md shadow-orange-500/20 border border-orange-400">
                            <Award className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-black leading-none">3</span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-sm font-bold font-mono">
                            {rank}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Contingent Name and Logo */}
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Contingent Logo */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 p-1 flex items-center justify-center shadow-sm">
                          {contingent.logoUrl ? (
                            <img
                              src={contingent.logoUrl}
                              alt={contingent.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                // fallback if image fails
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="text-xs font-bold text-slate-400">
                              {contingent.name.substring(0, 3)}
                            </div>
                          )}
                        </div>

                        {/* Name and details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm sm:text-base tracking-wide truncate ${
                              isRank1 ? 'text-amber-300 font-extrabold' : isPodium ? 'text-white' : 'text-slate-200'
                            }`}>
                              {contingent.name}
                            </span>
                            {isRank1 && (
                              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-slate-950 rounded uppercase tracking-wider">
                                LEADER
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 block sm:hidden">
                            Rank #{rank} • Total {contingent.total || 0}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* GOLD Column */}
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center bg-amber-500/5">
                      <span className="font-scoreboard text-xl sm:text-2xl font-black text-amber-400 drop-shadow-sm">
                        {contingent.gold}
                      </span>
                    </td>

                    {/* SILVER Column */}
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center bg-slate-400/5">
                      <span className="font-scoreboard text-xl sm:text-2xl font-black text-slate-200">
                        {contingent.silver}
                      </span>
                    </td>

                    {/* BRONZE Column */}
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center bg-orange-500/5">
                      <span className="font-scoreboard text-xl sm:text-2xl font-black text-orange-400">
                        {contingent.bronze}
                      </span>
                    </td>

                    {/* TOTAL Column */}
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-center bg-blue-600/10">
                      <span className="font-scoreboard text-xl sm:text-2xl font-extrabold text-white">
                        {contingent.total ?? (contingent.gold + contingent.silver + contingent.bronze)}
                      </span>
                    </td>

                    {/* Admin Action */}
                    {isAdmin && (
                      <td className="no-print py-3 sm:py-4 px-3 text-center">
                        <button
                          onClick={() => onQuickAddMedal && onQuickAddMedal(contingent)}
                          title="Tambah perolehan medali untuk kontingen ini"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-semibold text-xs transition border border-amber-500/40"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+ Medali</span>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}

            {filteredContingents.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center text-slate-400">
                  Tidak ada kontingen yang cocok dengan pencarian "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-center text-xs text-slate-500 pt-1 pb-4">
        Menampilkan seluruh {filteredContingents.length} dari {contingents.length} Kontingen POR SD Kecamatan Benjeng 2026.
      </div>
    </div>
  );
};
