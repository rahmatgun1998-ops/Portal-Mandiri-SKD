import React, { useState, useRef } from 'react';
import {
  User,
  Shield,
  Sliders,
  Upload,
  Save,
  KeyRound,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Camera,
  Trash2,
  HardDrive
} from 'lucide-react';
import { UserProfile, ScheduleItem, ProgressRecord, TryoutResult } from '../types';
import { GoogleWorkspacePanel } from './GoogleWorkspacePanel';

interface SettingsViewProps {
  user: UserProfile;
  scheduleList?: ScheduleItem[];
  progressList?: ProgressRecord[];
  tryoutResults?: TryoutResult[];
  onSaveProfile: (profile: Partial<UserProfile>) => Promise<void>;
  onUploadPhoto: (base64: string, mime: string, name: string) => Promise<void>;
  onChangePasscode: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  onResetProgress: () => Promise<void>;
  onResetSchedule: () => Promise<void>;
  onResetTryoutData: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  scheduleList = [],
  progressList = [],
  tryoutResults = [],
  onSaveProfile,
  onUploadPhoto,
  onChangePasscode,
  onResetProgress,
  onResetSchedule,
  onResetTryoutData,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'workspace' | 'application'>('profile');

  // Profile Form States
  const [name, setName] = useState<string>(user.name || 'Rahmat Gunawan');
  const [degree, setDegree] = useState<string>(user.degree || 'S.Psi');
  const [status, setStatus] = useState<string>(user.status || 'Pejuang CPNS');
  const [previewPhoto, setPreviewPhoto] = useState<string>(user.photoUrl || '');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Drag & Drop
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Security Form States
  const [oldPasscode, setOldPasscode] = useState<string>('');
  const [newPasscode, setNewPasscode] = useState<string>('');
  const [confirmPasscode, setConfirmPasscode] = useState<string>('');
  const [isChangingPass, setIsChangingPass] = useState<boolean>(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Application Reset States
  const [resetConfirmText, setResetConfirmText] = useState<string>('');
  const [resetTarget, setResetTarget] = useState<'progress' | 'schedule' | 'tryout' | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetMsg, setResetMsg] = useState<string>('');

  // Handle File Selection & Conversion to Base64
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar (JPG, JPEG, PNG) yang diperbolehkan.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreviewPhoto(base64);
      try {
        await onUploadPhoto(base64, file.type, file.name);
        setProfileMsg({ type: 'success', text: 'Foto berhasil disimpan secara permanen ke Google Drive!' });
      } catch (e) {
        setProfileMsg({ type: 'error', text: 'Gagal mengunggah foto.' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg(null);
    try {
      await onSaveProfile({ name, degree, status });
      setProfileMsg({ type: 'success', text: 'Data profil berhasil diperbarui ke Google Sheets!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: 'Gagal menyimpan profil: ' + err.message });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPasscode.length !== 6 || !/^\d{6}$/.test(newPasscode)) {
      setPassMsg({ type: 'error', text: 'Passcode baru harus berupa 6 digit angka.' });
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setPassMsg({ type: 'error', text: 'Konfirmasi passcode tidak cocok.' });
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await onChangePasscode(oldPasscode, newPasscode);
      if (res.success) {
        setPassMsg({ type: 'success', text: 'Passcode berhasil diperbarui!' });
        setOldPasscode('');
        setNewPasscode('');
        setConfirmPasscode('');
      } else {
        setPassMsg({ type: 'error', text: res.message });
      }
    } catch (e: any) {
      setPassMsg({ type: 'error', text: 'Gagal mengubah passcode.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleExecuteReset = async () => {
    if (resetConfirmText.trim() !== 'RESET') {
      alert('Ketik kata "RESET" untuk mengonfirmasi tindakan ini.');
      return;
    }

    setIsResetting(true);
    try {
      if (resetTarget === 'progress') {
        await onResetProgress();
        setResetMsg('Data riwayat progres berhasil direset.');
      } else if (resetTarget === 'schedule') {
        await onResetSchedule();
        setResetMsg('Jadwal belajar berhasil direset ke siklus 2 mingguan awal.');
      } else if (resetTarget === 'tryout') {
        await onResetTryoutData();
        setResetMsg('Seluruh riwayat Tryout berhasil direset.');
      }
      setResetTarget(null);
      setResetConfirmText('');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-16 font-['Inter',sans-serif]">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#023047] font-['Poppins',sans-serif]">
            Pengaturan Sistem & Akun
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola profil pejuang CPNS, keamanan passcode 6-digit, serta pemeliharaan data database Google Sheets.
          </p>
        </div>
      </div>

      {/* Tabs Selector: PROFILE | SECURITY | APPLICATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#023047] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4 text-[#8ECAE6]" />
          <span>Profil Pengguna</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-[#023047] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4 text-[#FFB703]" />
          <span>Keamanan Passcode</span>
        </button>

        <button
          onClick={() => setActiveTab('workspace')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'workspace'
              ? 'bg-[#023047] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HardDrive className="w-4 h-4 text-[#219EBC]" />
          <span>Google Workspace</span>
        </button>

        <button
          onClick={() => setActiveTab('application')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'application'
              ? 'bg-[#023047] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#FB8500]" />
          <span>Pemeliharaan Aplikasi</span>
        </button>
      </div>

      {/* 1. TAB PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-bold text-[#023047] font-['Poppins',sans-serif]">
              Data Diri Pejuang CPNS
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data ini ditampilkan pada greeting card dashboard dan laporan kelulusan Tryout.
            </p>
          </div>

          {profileMsg && (
            <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          {/* Area Upload Foto Profile Persistent (Google Drive Storage) */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-bold text-[#023047] uppercase tracking-wider">
              Foto Profil Persistent (Tersimpan di Google Drive)
            </h4>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Preview Foto */}
              <div className="relative">
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt="Preview Profil"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-contain bg-white border-2 border-[#219EBC] shadow-md p-1"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#023047] text-[#FFB703] border-2 border-[#219EBC] flex items-center justify-center font-bold text-2xl shadow-md">
                    {name.charAt(0) || 'R'}
                  </div>
                )}
                <span className="absolute -bottom-2 -right-2 bg-[#219EBC] text-white p-1.5 rounded-full shadow-sm">
                  <Camera className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#219EBC] bg-[#8ECAE6]/10'
                    : 'border-slate-300 hover:border-[#219EBC] bg-white'
                }`}
              >
                <Upload className="w-7 h-7 text-[#219EBC] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#023047]">
                  Drag & Drop Foto di Sini, atau <span className="text-[#219EBC] underline">Pilih File</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Mendukung format JPG, JPEG, PNG transparan. Foto otomatis tersimpan permanen di Google Drive.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Form Biodata */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#219EBC] text-slate-800"
                  placeholder="Contoh: Rahmat Gunawan"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Gelar Akademik
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={e => setDegree(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#219EBC] text-slate-800"
                  placeholder="Contoh: S.Psi"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Status / Target
              </label>
              <input
                type="text"
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#219EBC] text-slate-800"
                placeholder="Contoh: Pejuang CPNS Formasi Analis Kebijakan"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-3 rounded-xl bg-[#219EBC] hover:bg-[#1a859e] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#219EBC]/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. TAB SECURITY (GANTI PASSCODE 6 DIGIT) */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#023047] font-['Poppins',sans-serif]">
              Keamanan Passcode Masuk
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Passcode 6-digit digunakan untuk mengamankan data belajar pribadi Anda.
            </p>
          </div>

          {passMsg && (
            <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              passMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {passMsg.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{passMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePasscode} className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Passcode Lama
              </label>
              <input
                type="password"
                maxLength={6}
                value={oldPasscode}
                onChange={e => setOldPasscode(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full p-3 font-mono text-sm tracking-widest rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                placeholder="6 digit angka"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Passcode Baru
              </label>
              <input
                type="password"
                maxLength={6}
                value={newPasscode}
                onChange={e => setNewPasscode(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full p-3 font-mono text-sm tracking-widest rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                placeholder="6 digit angka baru"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Konfirmasi Passcode Baru
              </label>
              <input
                type="password"
                maxLength={6}
                value={confirmPasscode}
                onChange={e => setConfirmPasscode(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full p-3 font-mono text-sm tracking-widest rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                placeholder="Ulangi 6 digit baru"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isChangingPass}
                className="w-full py-3 rounded-xl bg-[#023047] hover:bg-[#034466] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-[#FFB703]" />
                <span>{isChangingPass ? 'Memproses...' : 'Perbarui Passcode'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. TAB APPLICATION (RESET DATA DENGAN KONFIRMASI "RESET") */}
      {activeTab === 'application' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#023047] font-['Poppins',sans-serif]">
              Pemeliharaan & Reset Database
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Gunakan fungsi ini jika Anda ingin memulai ulang siklus belajar atau membersihkan catatan simulasi.
            </p>
          </div>

          {resetMsg && (
            <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{resetMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Reset Progress */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#023047]">Reset Riwayat Progress</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menghapus seluruh catatan rekam jejak nilai di sheet PROGRESS.
                </p>
              </div>
              <button
                onClick={() => { setResetTarget('progress'); setResetConfirmText(''); }}
                className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Progress
              </button>
            </div>

            {/* Reset Schedule */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#023047]">Reset Jadwal Belajar</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mengembalikan status jadwal 2 mingguan ke status "Belum".
                </p>
              </div>
              <button
                onClick={() => { setResetTarget('schedule'); setResetConfirmText(''); }}
                className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Schedule
              </button>
            </div>

            {/* Reset Tryout Data */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#023047]">Reset Riwayat Tryout</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menghapus seluruh riwayat lembar jawaban di sheet TRYOUT_RESULTS.
                </p>
              </div>
              <button
                onClick={() => { setResetTarget('tryout'); setResetConfirmText(''); }}
                className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Tryout Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB GOOGLE WORKSPACE (DRIVE & SHEETS) */}
      {activeTab === 'workspace' && (
        <GoogleWorkspacePanel
          user={user}
          scheduleList={scheduleList}
          progressList={progressList}
          tryoutResults={tryoutResults}
          onPhotoUploadedToDrive={(driveUrl) => {
            setPreviewPhoto(driveUrl);
          }}
        />
      )}

      {/* Confirmation Modal: Type "RESET" */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 border border-slate-100 text-center animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-[#023047] font-['Poppins',sans-serif]">
              Konfirmasi Tindakan Reset
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Tindakan ini akan menghapus data pada Google Sheets. Untuk melanjutkan, ketik kata <strong className="text-rose-600">RESET</strong> di bawah:
            </p>

            <input
              type="text"
              value={resetConfirmText}
              onChange={e => setResetConfirmText(e.target.value)}
              className="w-full p-3 text-center text-sm font-bold tracking-widest rounded-xl border-2 border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-700 uppercase mb-5"
              placeholder="Ketik RESET"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setResetTarget(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
              >
                Batalkan
              </button>
              <button
                onClick={handleExecuteReset}
                disabled={resetConfirmText.trim() !== 'RESET' || isResetting}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-40"
              >
                {isResetting ? 'Mereset...' : 'Konfirmasi Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
