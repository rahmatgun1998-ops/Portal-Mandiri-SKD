import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  HardDrive,
  ExternalLink,
  RefreshCw,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  LogOut,
  Trash2,
  FileText,
  Clock,
  ShieldAlert
} from 'lucide-react';
import {
  auth,
  signInWithGoogleWorkspace,
  googleSignOut,
  getGoogleAccessToken,
} from '../services/googleAuth';
import { googleWorkspaceApi, GoogleDriveFile } from '../services/googleWorkspaceApi';
import { UserProfile, ScheduleItem, ProgressRecord, TryoutResult } from '../types';
import { onAuthStateChanged, User } from 'firebase/auth';

interface GoogleWorkspacePanelProps {
  user: UserProfile;
  scheduleList: ScheduleItem[];
  progressList: ProgressRecord[];
  tryoutResults: TryoutResult[];
  onPhotoUploadedToDrive?: (driveUrl: string, fileId: string) => void;
}

export const GoogleWorkspacePanel: React.FC<GoogleWorkspacePanelProps> = ({
  user,
  scheduleList,
  progressList,
  tryoutResults,
  onPhotoUploadedToDrive,
}) => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [spreadsheetInfo, setSpreadsheetInfo] = useState<{ id: string; url: string } | null>(null);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);

  // Sync state & Modals
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showSyncConfirmModal, setShowSyncConfirmModal] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Delete modal state
  const [fileToDelete, setFileToDelete] = useState<GoogleDriveFile | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);

  // Upload to Drive state
  const [isUploadingToDrive, setIsUploadingToDrive] = useState<boolean>(false);

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setGoogleUser(u);
      if (u) {
        loadDriveFiles();
        checkExistingSpreadsheet();
      } else {
        setDriveFiles([]);
        setSpreadsheetInfo(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const checkExistingSpreadsheet = async () => {
    const cachedId = localStorage.getItem('PORTAL_SKD_SHEET_ID');
    if (cachedId) {
      setSpreadsheetInfo({
        id: cachedId,
        url: `https://docs.google.com/spreadsheets/d/${cachedId}/edit`,
      });
    }
  };

  const loadDriveFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const files = await googleWorkspaceApi.listAppDriveFiles();
      setDriveFiles(files);
    } catch (e) {
      console.error('Failed to load drive files:', e);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignInGoogle = async () => {
    setIsAuthenticating(true);
    setSyncStatusMsg(null);
    try {
      const res = await signInWithGoogleWorkspace();
      setGoogleUser(res.user);
      await loadDriveFiles();
      await checkExistingSpreadsheet();
      setSyncStatusMsg({
        type: 'success',
        text: `Berhasil terhubung ke akun Google Workspace: ${res.user.email}`,
      });
    } catch (err: any) {
      setSyncStatusMsg({
        type: 'error',
        text: err.message || 'Gagal login ke Google Workspace',
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOutGoogle = async () => {
    if (window.confirm('Putuskan koneksi Google Workspace dari aplikasi ini?')) {
      await googleSignOut();
      setGoogleUser(null);
      setDriveFiles([]);
      setSyncStatusMsg(null);
    }
  };

  // Perform Google Sheets Sync (after user confirmation)
  const handleConfirmSyncToSheets = async () => {
    setShowSyncConfirmModal(false);
    setIsSyncing(true);
    setSyncStatusMsg(null);

    try {
      // 1. Get or create spreadsheet
      const sheet = await googleWorkspaceApi.getOrCreateSpreadsheet();
      setSpreadsheetInfo({ id: sheet.spreadsheetId, url: sheet.spreadsheetUrl });

      // 2. Sync all tables
      const syncRes = await googleWorkspaceApi.syncAllDataToGoogleSheets(
        sheet.spreadsheetId,
        user,
        scheduleList,
        progressList,
        tryoutResults,
        true // Explicit user confirmation passed
      );

      setSyncStatusMsg({
        type: 'success',
        text: syncRes.message,
      });
    } catch (e: any) {
      setSyncStatusMsg({
        type: 'error',
        text: e.message || 'Gagal melakukan sinkronisasi ke Google Sheets',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete file from Google Drive (after user confirmation)
  const handleConfirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeletingFile(true);
    try {
      await googleWorkspaceApi.deleteDriveFile(fileToDelete.id, true);
      setDriveFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
      setSyncStatusMsg({
        type: 'success',
        text: `Berkas "${fileToDelete.name}" berhasil dihapus dari Google Drive.`,
      });
      setFileToDelete(null);
    } catch (err: any) {
      setSyncStatusMsg({
        type: 'error',
        text: err.message || 'Gagal menghapus berkas di Google Drive',
      });
    } finally {
      setIsDeletingFile(false);
    }
  };

  // Handle direct file upload to Google Drive
  const handleDriveFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingToDrive(true);
    setSyncStatusMsg(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const uploadRes = await googleWorkspaceApi.uploadFileToDrive(
          file.name,
          file.type || 'application/octet-stream',
          base64
        );

        if (uploadRes.webViewLink && onPhotoUploadedToDrive && file.type.startsWith('image/')) {
          onPhotoUploadedToDrive(uploadRes.webViewLink, uploadRes.fileId);
        }

        await loadDriveFiles();
        setSyncStatusMsg({
          type: 'success',
          text: `Berkas "${file.name}" berhasil diunggah ke Google Drive!`,
        });
      } catch (err: any) {
        setSyncStatusMsg({
          type: 'error',
          text: err.message || 'Gagal mengunggah ke Google Drive',
        });
      } finally {
        setIsUploadingToDrive(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* STATUS BANNER */}
      {syncStatusMsg && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border ${
            syncStatusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {syncStatusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs font-semibold leading-relaxed">{syncStatusMsg.text}</div>
        </div>
      )}

      {/* 1. GOOGLE WORKSPACE CONNECTION CARD */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#023047] flex items-center justify-center text-white shadow-xs">
              <HardDrive className="w-6 h-6 text-[#8ECAE6]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#023047]">Integrasi Google Drive & Sheets</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sinkronisasi database belajar dan penyimpanan berkas dokumen langsung ke Google Workspace Anda.
              </p>
            </div>
          </div>

          <div>
            {googleUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-800 block">{googleUser.displayName || 'Akun Google'}</span>
                  <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">{googleUser.email}</span>
                </div>
                {googleUser.photoURL && (
                  <img
                    src={googleUser.photoURL}
                    alt="Google Profile"
                    className="w-10 h-10 rounded-full border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                )}
                <button
                  onClick={handleSignOutGoogle}
                  title="Putuskan koneksi Google"
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignInGoogle}
                disabled={isAuthenticating}
                className="px-5 py-2.5 bg-[#023047] hover:bg-[#034363] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#8ECAE6]" />
                ) : (
                  <LogIn className="w-4 h-4 text-[#8ECAE6]" />
                )}
                <span>Hubungkan Google Workspace</span>
              </button>
            )}
          </div>
        </div>

        {/* CONNECTION HIGHLIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* SHEETS SYNC CARD */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-emerald-900">Google Sheets Database</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  v4 API
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Menyimpan 4 sheet terpadu: <strong className="text-emerald-950">PROFILE</strong>, <strong className="text-emerald-950">SCHEDULE</strong> (jadwal 2 minggu), <strong className="text-emerald-950">PROGRESS</strong>, dan <strong className="text-emerald-950">TRYOUT_RESULTS</strong>.
              </p>

              {spreadsheetInfo && (
                <a
                  href={spreadsheetInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline mb-4"
                >
                  <span>Buka Spreadsheet di Google Sheets</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <button
              onClick={() => {
                if (!googleUser) {
                  handleSignInGoogle();
                } else {
                  setShowSyncConfirmModal(true);
                }
              }}
              disabled={isSyncing}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{isSyncing ? 'Menyinkronkan Data...' : 'Sinkronkan Data ke Google Sheets'}</span>
            </button>
          </div>

          {/* DRIVE STORAGE CARD */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 to-white border border-blue-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#219EBC] text-white flex items-center justify-center shadow-xs">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-blue-900">Google Drive Storage</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  v3 API
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Penyimpanan aman untuk berkas foto profil resmi, resume ringkasan belajar, dan arsip dokumen latihan tanpa batasan browser storage.
              </p>
            </div>

            <label className="w-full py-2.5 px-4 rounded-xl bg-[#219EBC] hover:bg-[#1a859e] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer text-center">
              {isUploadingToDrive ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              <span>{isUploadingToDrive ? 'Mengunggah ke Drive...' : 'Unggah Berkas ke Google Drive'}</span>
              <input
                type="file"
                className="hidden"
                disabled={isUploadingToDrive}
                onChange={handleDriveFileUpload}
              />
            </label>
          </div>
        </div>
      </div>

      {/* 2. DRIVE FILES LIST */}
      {googleUser && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-5 h-5 text-[#219EBC]" />
              <h4 className="text-sm font-bold text-[#023047]">Berkas Aplikasi di Google Drive</h4>
            </div>
            <button
              onClick={loadDriveFiles}
              disabled={isLoadingFiles}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer"
              title="Segarkan daftar berkas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isLoadingFiles ? (
            <div className="py-8 text-center text-xs text-slate-400">Memuat berkas dari Google Drive...</div>
          ) : driveFiles.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              Belum ada berkas yang diunggah ke Google Drive melalui portal ini.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {driveFiles.map(file => (
                <div key={file.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {file.createdTime ? new Date(file.createdTime).toLocaleDateString('id-ID') : 'Drive File'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Lihat</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => setFileToDelete(file)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                      title="Hapus berkas dari Drive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: CONFIRM SYNC TO GOOGLE SHEETS (Mandatory User Confirmation for Destructive/Write ops) */}
      {showSyncConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#023047]">Konfirmasi Sinkronisasi Google Sheets</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Tindakan ini akan menulis atau memperbarui data di Google Spreadsheet Anda, mencakup data Profil Pengguna, Jadwal 2 Mingguan, Riwayat Progres, dan Hasil Tryout CAT.
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div>• Spreadsheet: <strong>Portal Mandiri SKD CPNS — Database Belajar & Tryout</strong></div>
              <div>• Akun: <strong>{googleUser?.email}</strong></div>
              <div>• Izin: Diperbarui dengan persetujuan Anda</div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSyncConfirmModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSyncToSheets}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
              >
                Ya, Sinkronkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM DELETE DRIVE FILE (Mandatory User Confirmation for Destructive operations) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">Hapus Berkas dari Google Drive?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus berkas <strong className="text-slate-900">"{fileToDelete.name}"</strong> secara permanen dari Google Drive Anda? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setFileToDelete(null)}
                disabled={isDeletingFile}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteFile}
                disabled={isDeletingFile}
                className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
              >
                {isDeletingFile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeletingFile ? 'Menghapus...' : 'Ya, Hapus Berkas'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
