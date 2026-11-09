import React, { useState } from 'react';
import { Contingent } from '../types/index.js';
import { Trophy, Medal, Award, X, Check, Plus } from 'lucide-react';

interface QuickAddModalProps {
  contingent: Contingent | null;
  onClose: () => void;
  onSubmit: (contingentId: string, type: 'gold' | 'silver' | 'bronze', delta: number, note: string) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  contingent,
  onClose,
  onSubmit
}) => {
  const [medalType, setMedalType] = useState<'gold' | 'silver' | 'bronze'>('gold');
  const [delta, setDelta] = useState<number>(1);
  const [sportNote, setSportNote] = useState('');

  if (!contingent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(contingent.id, medalType, delta, sportNote);
    onClose();
  };

  const sampleSports = [
    'Bulutangkis Tunggal Putra',
    'Bulutangkis Tunggal Putri',
    'Atletik Lari 60m',
    'Atletik Lompat Jauh',
    'Tenis Meja',
    'Catur Standar',
    'Voli Mini',
    'Sepak Takraw',
    'Senam Ritmik'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-slate-800 p-1.5 border border-slate-700 flex items-center justify-center">
            {contingent.logoUrl ? (
              <img src={contingent.logoUrl} alt={contingent.name} className="max-h-full max-w-full object-contain" />
            ) : (
              <Trophy className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white leading-tight">{contingent.name}</h3>
            <p className="text-xs text-sky-400">Input Perolehan Medali Cabor</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Medal Type Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Jenis Medali
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMedalType('gold')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border font-bold text-sm transition ${
                  medalType === 'gold'
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-2 ring-amber-400/30'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-6 h-6 text-amber-400 mb-1" />
                <span>GOLD 🥇</span>
                <span className="text-[10px] opacity-75 font-normal">Penentu Juara</span>
              </button>

              <button
                type="button"
                onClick={() => setMedalType('silver')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border font-bold text-sm transition ${
                  medalType === 'silver'
                    ? 'bg-slate-400/25 border-slate-300 text-slate-100 ring-2 ring-slate-300/30'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Medal className="w-6 h-6 text-slate-200 mb-1" />
                <span>SILVER 🥈</span>
                <span className="text-[10px] opacity-75 font-normal">Perak</span>
              </button>

              <button
                type="button"
                onClick={() => setMedalType('bronze')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border font-bold text-sm transition ${
                  medalType === 'bronze'
                    ? 'bg-orange-600/25 border-orange-400 text-orange-300 ring-2 ring-orange-400/30'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-6 h-6 text-orange-400 mb-1" />
                <span>BRONZE 🥉</span>
                <span className="text-[10px] opacity-75 font-normal">Perunggu</span>
              </button>
            </div>
          </div>

          {/* Quantity Stepper */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Jumlah Tambahan Medali
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDelta((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-xl font-bold flex items-center justify-center border border-slate-700"
              >
                -
              </button>
              <div className="flex-1 text-center font-scoreboard font-black text-2xl text-white bg-slate-950/80 py-1.5 rounded-xl border border-slate-800">
                +{delta}
              </div>
              <button
                type="button"
                onClick={() => setDelta((prev) => prev + 1)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-xl font-bold flex items-center justify-center border border-slate-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Sport Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Keterangan Cabang Olahraga (Opsional)
            </label>
            <input
              type="text"
              value={sportNote}
              onChange={(e) => setSportNote(e.target.value)}
              placeholder="Contoh: Bulutangkis Tunggal Putra"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sampleSports.slice(0, 4).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSportNote(s)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Simpan & Siarkan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
