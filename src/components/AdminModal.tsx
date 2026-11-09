import React, { useState } from 'react';
import { Contingent, AppHeaderSettings, AppThemeSettings, MedalLog } from '../types/index.js';
import {
  X,
  Lock,
  LogOut,
  Save,
  RotateCcw,
  FileSpreadsheet,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  Trophy,
  Medal,
  Award,
  Layers,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { exportContingentsToCSV, parseCSVToContingents } from '../utils/csv.js';
import { generateDefaultSchoolLogo } from '../utils/ranking.js';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  contingents: Contingent[];
  headerSettings: AppHeaderSettings;
  themeSettings: AppThemeSettings;
  onSaveAll: (contingents: Contingent[], header: AppHeaderSettings, theme: AppThemeSettings) => Promise<void>;
  onResetData: () => Promise<void>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  onLogin,
  onLogout,
  contingents: initialContingents,
  headerSettings: initialHeader,
  themeSettings: initialTheme,
  onSaveAll,
  onResetData
}) => {
  // Login state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'medals' | 'contingents' | 'header' | 'theme' | 'data'>('medals');

  // Working state copy
  const [contingents, setContingents] = useState<Contingent[]>(initialContingents);
  const [header, setHeader] = useState<AppHeaderSettings>(initialHeader);
  const [theme, setTheme] = useState<AppThemeSettings>(initialTheme);

  // Status feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New Contingent Form State
  const [newContingentName, setNewContingentName] = useState('');

  // Confirmation Modal
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Keep in sync when initial props change
  React.useEffect(() => {
    setContingents(initialContingents);
  }, [initialContingents]);

  React.useEffect(() => {
    setHeader(initialHeader);
  }, [initialHeader]);

  React.useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  if (!isOpen) return null;

  // Handle Login
  const handleDoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(passwordInput);
    if (ok) {
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Password salah! Gunakan password: admin123');
    }
  };

  // Medal Handlers (Feature B)
  const updateMedal = (id: string, type: 'gold' | 'silver' | 'bronze', delta: number) => {
    setContingents((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const current = c[type] || 0;
        const next = Math.max(0, current + delta);
        return {
          ...c,
          [type]: next,
          total: (type === 'gold' ? next : c.gold) +
                 (type === 'silver' ? next : c.silver) +
                 (type === 'bronze' ? next : c.bronze)
        };
      })
    );
  };

  const setMedalExact = (id: string, type: 'gold' | 'silver' | 'bronze', value: number) => {
    const val = Math.max(0, Number(value) || 0);
    setContingents((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          [type]: val,
          total: (type === 'gold' ? val : c.gold) +
                 (type === 'silver' ? val : c.silver) +
                 (type === 'bronze' ? val : c.bronze)
        };
      })
    );
  };

  // Contingents Handlers (Feature A)
  const handleUpdateName = (id: string, name: string) => {
    setContingents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c))
    );
  };

  const handleAddNewContingent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContingentName.trim()) return;
    const newId = `cont-${Date.now()}`;
    const newSchool: Contingent = {
      id: newId,
      name: newContingentName.trim(),
      gold: 0,
      silver: 0,
      bronze: 0,
      total: 0,
      logoUrl: generateDefaultSchoolLogo(newContingentName.trim(), contingents.length)
    };
    setContingents((prev) => [...prev, newSchool]);
    setNewContingentName('');
  };

  const handleDeleteContingent = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Kontingen?',
      message: `Apakah Anda yakin ingin menghapus "${name}" dari daftar kontingen POR SD? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: () => {
        setContingents((prev) => prev.filter((c) => c.id !== id));
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
      }
    });
  };

  // Logo upload to base64
  const handleUploadLogo = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setContingents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, logoUrl: base64 } : c))
      );
    };
    reader.readAsDataURL(file);
  };

  // Header Logo uploads (Feature C)
  const handleUploadHeaderLogo = (logoKey: 'logo1' | 'logo2' | 'logo3', file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setHeader((prev) => ({ ...prev, [logoKey]: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // Data Management Handlers (Feature E)
  const handleSave = async () => {
    setIsSaving(true);
    await onSaveAll(contingents, header, theme);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Seluruh Data?',
      message: 'Perolehan medali akan direset kembali ke susunan awal 28 kontingen resmi POR SD Kecamatan Benjeng. Lanjutkan?',
      onConfirm: async () => {
        setIsSaving(true);
        await onResetData();
        setIsSaving(false);
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  const handleExportCSV = () => {
    const csv = exportContingentsToCSV(contingents);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Medal_Standing_POR_SD_Benjeng_2026_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const parsed = parseCSVToContingents(text, contingents);
      setContingents(parsed);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">DASHBOARD ADMIN POR SD BENJENG 2026</h2>
              <p className="text-xs text-slate-400">Pusat Kendali Perolehan Medali & Pengaturan Website</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={onLogout}
                title="Keluar dari sesi Admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-800/60 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isLoggedIn ? (
          /* LOGIN SCREEN */
          <div className="p-8 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Autentikasi Admin</h3>
              <p className="text-xs text-slate-400 mt-1">
                Masukkan kata sandi untuk mengakses penginputan medali dan pengaturan sistem scoreboard.
              </p>
            </div>

            <form onSubmit={handleDoLogin} className="space-y-4">
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Password Admin
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan password admin..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  autoFocus
                />
                {loginError && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{loginError}</span>
                  </p>
                )}
              </div>

              {/* Friendly Hint Box */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-left text-xs text-amber-300">
                <span className="font-bold">Password Default Panitia:</span>{' '}
                <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-200 font-mono font-bold">
                  admin123
                </code>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20"
              >
                Masuk ke Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* ADMIN DASHBOARD TABS */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tabs Bar */}
            <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-950/40 overflow-x-auto text-xs sm:text-sm font-semibold">
              <button
                onClick={() => setActiveTab('medals')}
                className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'medals'
                    ? 'border-amber-400 text-amber-300 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>B. Input Medali</span>
              </button>

              <button
                onClick={() => setActiveTab('contingents')}
                className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'contingents'
                    ? 'border-sky-400 text-sky-300 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 text-sky-400" />
                <span>A. Kelola Kontingen</span>
              </button>

              <button
                onClick={() => setActiveTab('header')}
                className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'header'
                    ? 'border-amber-400 text-amber-300 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>C. Header & Logo</span>
              </button>

              <button
                onClick={() => setActiveTab('theme')}
                className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'theme'
                    ? 'border-indigo-400 text-indigo-300 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 text-indigo-400" />
                <span>D. Tema & Tampilan</span>
              </button>

              <button
                onClick={() => setActiveTab('data')}
                className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'data'
                    ? 'border-emerald-400 text-emerald-300 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>E. Manajemen Data</span>
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB B: INPUT MEDALI */}
              {activeTab === 'medals' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <h4 className="font-bold text-white text-base">Input & Stepper Perolehan Medali</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Gunakan tombol + / - atau ketik langsung angka perolehan medali untuk masing-masing kontingen. Total otomatis dihitung.
                      </p>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden">
                    {contingents.map((contingent, idx) => (
                      <div
                        key={contingent.id}
                        className="p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-800/40 transition"
                      >
                        <div className="flex items-center gap-3 min-w-[260px]">
                          <span className="w-6 text-xs font-mono text-slate-500">{idx + 1}.</span>
                          <div className="w-9 h-9 rounded-lg bg-slate-800 p-1 flex items-center justify-center border border-slate-700">
                            {contingent.logoUrl ? (
                              <img src={contingent.logoUrl} alt={contingent.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                              <span className="text-xs font-bold text-slate-400">SD</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white">{contingent.name}</p>
                            <p className="text-[11px] text-slate-400">
                              Total: <span className="font-bold text-white">{contingent.total || 0}</span> Medali
                            </p>
                          </div>
                        </div>

                        {/* Gold, Silver, Bronze Steppers */}
                        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                          {/* Gold Stepper */}
                          <div className="flex items-center gap-1 bg-amber-500/10 p-1.5 rounded-xl border border-amber-500/30">
                            <span className="text-xs font-bold text-amber-400 px-1">🥇</span>
                            <button
                              type="button"
                              onClick={() => updateMedal(contingent.id, 'gold', -1)}
                              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center text-sm"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={contingent.gold}
                              onChange={(e) => setMedalExact(contingent.id, 'gold', parseInt(e.target.value, 10))}
                              className="w-12 text-center bg-slate-900 border border-slate-700 rounded-lg text-sm font-bold text-amber-300 py-1"
                            />
                            <button
                              type="button"
                              onClick={() => updateMedal(contingent.id, 'gold', 1)}
                              className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>

                          {/* Silver Stepper */}
                          <div className="flex items-center gap-1 bg-slate-400/10 p-1.5 rounded-xl border border-slate-400/30">
                            <span className="text-xs font-bold text-slate-300 px-1">🥈</span>
                            <button
                              type="button"
                              onClick={() => updateMedal(contingent.id, 'silver', -1)}
                              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center text-sm"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={contingent.silver}
                              onChange={(e) => setMedalExact(contingent.id, 'silver', parseInt(e.target.value, 10))}
                              className="w-12 text-center bg-slate-900 border border-slate-700 rounded-lg text-sm font-bold text-slate-100 py-1"
                            />
                            <button
                              type="button"
                              onClick={() => updateMedal(contingent.id, 'silver', 1)}
                              className="w-7 h-7 rounded-lg bg-slate-300 hover:bg-slate-200 text-slate-950 font-bold flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>

                          {/* Bronze Stepper */}
                          <div className="flex items-center gap-1 bg-orange-500/10 p-1.5 rounded-xl border border-orange-500/30">
                            <span className="text-xs font-bold text-orange-400 px-1">🥉</span>
                            <button
                              type="button"
                              onClick={() => updateMedal(contingent.id, 'bronze', -1)}
                              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center text-sm"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={contingent.bronze}
                              onChange={(e) => setMedalExact(contingent.id, 'bronze', parseInt(e.target.value, 10))}
                              className="w-12 text-center bg-slate-900 border border-slate-700 rounded-lg text-sm font-bold text-orange-300 py-1"
                            />
                            <button
                              type="button"
                              onClick={() => updateMedal(contingent.id, 'bronze', 1)}
                              className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB A: KELOLA KONTINGEN */}
              {activeTab === 'contingents' && (
                <div className="space-y-6">
                  {/* Add New Contingent */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <h4 className="font-bold text-white text-sm mb-2">Tambah Kontingen Baru</h4>
                    <form onSubmit={handleAddNewContingent} className="flex gap-2">
                      <input
                        type="text"
                        value={newContingentName}
                        onChange={(e) => setNewContingentName(e.target.value)}
                        placeholder="Contoh: SD Islam Terpadu Benjeng..."
                        className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      />
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Kontingen</span>
                      </button>
                    </form>
                  </div>

                  {/* List of Contingents with Name edit and Logo Upload */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-sm">
                      Daftar Kontingen Terdaftar ({contingents.length})
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {contingents.map((contingent) => (
                        <div
                          key={contingent.id}
                          className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3 group"
                        >
                          {/* Logo Preview & Upload trigger */}
                          <label className="relative w-12 h-12 rounded-xl bg-slate-800 p-1 flex items-center justify-center border border-slate-700 cursor-pointer overflow-hidden flex-shrink-0 hover:border-amber-400 transition">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleUploadLogo(contingent.id, e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                            {contingent.logoUrl ? (
                              <img src={contingent.logoUrl} alt={contingent.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-[9px] text-white font-bold text-center">
                              Ubah
                            </div>
                          </label>

                          {/* Editable Name */}
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={contingent.name}
                              onChange={(e) => handleUpdateName(contingent.id, e.target.value)}
                              className="w-full bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-400 text-sm font-semibold text-white px-1 py-0.5 focus:outline-none transition"
                            />
                            <p className="text-[11px] text-slate-400 px-1 mt-0.5">
                              {contingent.gold}E • {contingent.silver}P • {contingent.bronze}B
                            </p>
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteContingent(contingent.id, contingent.name)}
                            title="Hapus Kontingen"
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB C: HEADER & 3 ORGANIZER LOGOS */}
              {activeTab === 'header' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                    <h4 className="font-bold text-white text-base">Teks Judul & Informasi Header</h4>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                        Judul Utama
                      </label>
                      <input
                        type="text"
                        value={header.mainTitle}
                        onChange={(e) => setHeader((prev) => ({ ...prev, mainTitle: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                        Subjudul
                      </label>
                      <input
                        type="text"
                        value={header.subTitle}
                        onChange={(e) => setHeader((prev) => ({ ...prev, subTitle: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                        Teks Tambahan / Slogan
                      </label>
                      <input
                        type="text"
                        value={header.tagline}
                        onChange={(e) => setHeader((prev) => ({ ...prev, tagline: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* 3 Header Organizer Logos */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-base">Tiga Logo Penyelenggara di Bagian Atas</h4>
                    <p className="text-xs text-slate-400">
                      Unggah logo dari komputer untuk mengganti logo resmi Pemkab/Disdik Gresik, POR SD Benjeng, atau KORWIL.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Logo 1 */}
                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                        <p className="text-xs font-bold text-slate-300">Logo 1 (Kiri)</p>
                        <div className="w-20 h-20 mx-auto rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center">
                          <img src={header.logo1} alt="Logo 1" className="max-h-full max-w-full object-contain" />
                        </div>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 cursor-pointer border border-slate-700 transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Ganti Gambar</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleUploadHeaderLogo('logo1', e.target.files[0]);
                            }}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          value={header.logo1Label || ''}
                          onChange={(e) => setHeader((prev) => ({ ...prev, logo1Label: e.target.value }))}
                          placeholder="Label (contoh: Disdik Gresik)"
                          className="w-full text-xs text-center px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300"
                        />
                      </div>

                      {/* Logo 2 (Center) */}
                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/40 text-center space-y-3">
                        <p className="text-xs font-bold text-amber-300">Logo 2 (Tengah - Utama)</p>
                        <div className="w-20 h-20 mx-auto rounded-xl bg-slate-900 border-2 border-amber-500/40 p-2 flex items-center justify-center">
                          <img src={header.logo2} alt="Logo 2" className="max-h-full max-w-full object-contain" />
                        </div>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold cursor-pointer border border-amber-500/40 transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Ganti Gambar</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleUploadHeaderLogo('logo2', e.target.files[0]);
                            }}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          value={header.logo2Label || ''}
                          onChange={(e) => setHeader((prev) => ({ ...prev, logo2Label: e.target.value }))}
                          placeholder="Label (contoh: POR SD 2026)"
                          className="w-full text-xs text-center px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300"
                        />
                      </div>

                      {/* Logo 3 */}
                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                        <p className="text-xs font-bold text-slate-300">Logo 3 (Kanan)</p>
                        <div className="w-20 h-20 mx-auto rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center">
                          <img src={header.logo3} alt="Logo 3" className="max-h-full max-w-full object-contain" />
                        </div>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 cursor-pointer border border-slate-700 transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Ganti Gambar</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleUploadHeaderLogo('logo3', e.target.files[0]);
                            }}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          value={header.logo3Label || ''}
                          onChange={(e) => setHeader((prev) => ({ ...prev, logo3Label: e.target.value }))}
                          placeholder="Label (contoh: KORWIL Benjeng)"
                          className="w-full text-xs text-center px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB D: TAMPILAN & TEMA */}
              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                    <h4 className="font-bold text-white text-base">Pilihan Latar Belakang & Nuansa Warna</h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={() => setTheme((prev) => ({ ...prev, themeMode: 'navy' }))}
                        className={`p-3 rounded-xl border text-left font-semibold text-xs transition ${
                          theme.themeMode === 'navy'
                            ? 'bg-blue-950 border-sky-400 text-white ring-2 ring-sky-400/30'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="w-full h-8 rounded-lg bg-blue-900 mb-2 border border-blue-700"></div>
                        <p className="font-bold">Navy Scoreboard</p>
                        <p className="text-[10px] text-slate-400">Resmi kejuaraan</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme((prev) => ({ ...prev, themeMode: 'dark' }))}
                        className={`p-3 rounded-xl border text-left font-semibold text-xs transition ${
                          theme.themeMode === 'dark'
                            ? 'bg-slate-950 border-sky-400 text-white ring-2 ring-sky-400/30'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="w-full h-8 rounded-lg bg-slate-950 mb-2 border border-slate-800"></div>
                        <p className="font-bold">Dark Arena</p>
                        <p className="text-[10px] text-slate-400">Kontras tinggi proyektor</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme((prev) => ({ ...prev, themeMode: 'royal' }))}
                        className={`p-3 rounded-xl border text-left font-semibold text-xs transition ${
                          theme.themeMode === 'royal'
                            ? 'bg-indigo-950 border-indigo-400 text-white ring-2 ring-indigo-400/30'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="w-full h-8 rounded-lg bg-indigo-900 mb-2 border border-indigo-700"></div>
                        <p className="font-bold">Royal Blue</p>
                        <p className="text-[10px] text-slate-400">Elegan & dinamis</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme((prev) => ({ ...prev, themeMode: 'goldAccent' }))}
                        className={`p-3 rounded-xl border text-left font-semibold text-xs transition ${
                          theme.themeMode === 'goldAccent'
                            ? 'bg-amber-950/40 border-amber-400 text-amber-300 ring-2 ring-amber-400/30'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="w-full h-8 rounded-lg bg-amber-900/60 mb-2 border border-amber-600"></div>
                        <p className="font-bold">Gold Champion</p>
                        <p className="text-[10px] text-slate-400">Nuansa piala emas</p>
                      </button>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={theme.tickerEnabled}
                          onChange={(e) => setTheme((prev) => ({ ...prev, tickerEnabled: e.target.checked }))}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                        />
                        <span className="text-sm font-semibold text-white">
                          Aktifkan Running Text / Ticker Notifikasi Perolehan Medali
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB E: MANAJEMEN DATA & EXPORT/IMPORT */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Export to CSV */}
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Ekspor ke Excel / CSV</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Unduh berkas CSV berisi peringkat, nama kontingen, medali Emas, Perak, Perunggu, dan Total. Cocok dibuka di Microsoft Excel atau Google Sheets.
                      </p>
                      <button
                        type="button"
                        onClick={handleExportCSV}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Unduh File CSV Klasemen</span>
                      </button>
                    </div>

                    {/* Import from CSV */}
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                        <Upload className="w-4 h-4" />
                        <span>Impor Data dari CSV</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Unggah berkas CSV perolehan medali untuk memperbarui daftar kontingen dan jumlah medali secara massal.
                      </p>
                      <label className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Pilih Berkas CSV</span>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleImportCSV(e.target.files[0]);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Danger Zone: Reset Data */}
                  <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/40 space-y-3">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Zona Bahaya: Reset Data</span>
                    </div>
                    <p className="text-xs text-red-300/80">
                      Mereset seluruh perolehan medali dan mengembalikan daftar ke 28 kontingen awal POR SD Kecamatan Benjeng 2026.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs transition flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset Data ke Awal (28 Kontingen)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Action Bar */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {saveSuccess ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                    <Check className="w-4 h-4" />
                    <span>Perubahan berhasil disimpan dan disiarkan live!</span>
                  </span>
                ) : (
                  <span>Perubahan yang disimpan akan langsung tampak di semua layar yang terbuka.</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Tutup
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog Overlay */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-white">{confirmDialog.title}</h4>
            <p className="text-xs text-slate-300">{confirmDialog.message}</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
