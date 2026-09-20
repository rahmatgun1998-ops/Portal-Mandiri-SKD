import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoginPanel } from './components/LoginPanel';
import { DashboardView } from './components/DashboardView';
import { ScheduleView } from './components/ScheduleView';
import { ProgressView } from './components/ProgressView';
import { TryoutSelectView } from './components/TryoutSelectView';
import { TryoutExamView } from './components/TryoutExamView';
import { TryoutResultView } from './components/TryoutResultView';
import { SettingsView } from './components/SettingsView';
import { gasApi } from './services/gasApi';
import { UserProfile, DashboardData, ScheduleItem, ProgressRecord, ScheduleStatus, TryoutResult } from './types';
import { TRYOUT_PACKAGES_METADATA, getQuestionsForPackage, Question } from './data/tryoutBank';
import { Loader2, Code2, X, Copy, Check } from 'lucide-react';

export default function App() {
  // Auth & User State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  // Layout & Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Tryout State Sub-flow
  const [tryoutMode, setTryoutMode] = useState<'select' | 'exam' | 'result'>('select');
  const [activePackageId, setActivePackageId] = useState<string>('tryout-01');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [examResultSummary, setExamResultSummary] = useState<any>(null);

  // Core Data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([]);
  const [progressList, setProgressList] = useState<ProgressRecord[]>([]);
  const [tryoutResultsList, setTryoutResultsList] = useState<TryoutResult[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // 1. Initial Load: Check saved session and load default user
  useEffect(() => {
    const initApp = async () => {
      try {
        const sessionAuth = localStorage.getItem('PORTAL_SKD_AUTH');
        const profile = await gasApi.getUserProfile();
        setUser(profile);
        if (sessionAuth === 'true') {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to load user profile:', e);
      } finally {
        setIsLoadingUser(false);
      }
    };
    initApp();
  }, []);

  // 2. Load Dashboard & Schedule Data when authenticated
  const loadAllAppData = async () => {
    setIsLoadingData(true);
    try {
      const [dash, sched, prog, toRes] = await Promise.all([
        gasApi.getDashboardData(),
        gasApi.getSchedule(),
        gasApi.getProgress(),
        gasApi.getTryoutResults(),
      ]);
      setDashboardData(dash);
      setScheduleList(sched);
      setProgressList(prog);
      setTryoutResultsList(toRes);
    } catch (err) {
      console.error('Failed to load app data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllAppData();
    }
  }, [isAuthenticated]);

  // Passcode validation for LoginPanel
  const handleValidatePasscode = async (code: string) => {
    return await gasApi.validatePasscode(code);
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('PORTAL_SKD_AUTH', 'true');
    setIsAuthenticated(true);
  };

  // Logout handler
  const handleLogout = () => {
    if (window.confirm('Keluar dari sesi belajar?')) {
      localStorage.removeItem('PORTAL_SKD_AUTH');
      setIsAuthenticated(false);
      setActiveTab('dashboard');
      setTryoutMode('select');
    }
  };

  // Schedule Status Update
  const handleUpdateScheduleStatus = async (id: string, status: ScheduleStatus, notes?: string) => {
    const res = await gasApi.updateScheduleStatus(id, status, notes);
    if (res.success) {
      await loadAllAppData();
    }
  };

  // Reset Schedule
  const handleResetSchedule = async () => {
    if (window.confirm('Reset jadwal belajar ke kurikulum 2 mingguan awal?')) {
      await gasApi.resetSchedule();
      await loadAllAppData();
    }
  };

  // Delete Progress Row
  const handleDeleteProgress = async (id: string) => {
    const res = await gasApi.deleteProgress(id);
    if (res.success) {
      await loadAllAppData();
    }
  };

  // Reset All Progress
  const handleResetProgress = async () => {
    await gasApi.resetProgress();
    await loadAllAppData();
  };

  // Reset Tryout Data
  const handleResetTryoutData = async () => {
    await gasApi.resetTryoutResults();
    await loadAllAppData();
  };

  // Save Profile
  const handleSaveProfile = async (updates: Partial<UserProfile>) => {
    const res = await gasApi.saveUserProfile(updates);
    if (res.success) {
      const updatedUser = await gasApi.getUserProfile();
      setUser(updatedUser);
      await loadAllAppData();
    }
  };

  // Upload Profile Photo to Google Drive
  const handleUploadPhoto = async (base64: string, mime: string, name: string) => {
    const res = await gasApi.uploadProfilePhoto(base64, mime, name);
    if (res.success && res.photoUrl) {
      const updated = await gasApi.getUserProfile();
      setUser(updated);
      await loadAllAppData();
    }
  };

  // Change Passcode
  const handleChangePasscode = async (oldPass: string, newPass: string) => {
    return await gasApi.changePasscode(oldPass, newPass);
  };

  // Tryout Package Selection -> Start Exam
  const handleSelectPackage = (pkgId: string) => {
    const questions = getQuestionsForPackage(pkgId);
    setActivePackageId(pkgId);
    setActiveQuestions(questions);
    setTryoutMode('exam');
  };

  // Finish CAT Exam -> Save to Google Sheets -> Show Result
  const handleFinishExam = async (summary: any) => {
    setExamResultSummary(summary);
    setTryoutMode('result');

    // Save to Google Sheets backend via gasApi
    try {
      await gasApi.saveTryoutResult({
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        package: summary.packageName,
        packageName: summary.packageName,
        twk: summary.twkScore,
        tiu: summary.tiuScore,
        tkp: summary.tkpScore,
        total: summary.totalScore,
        duration: summary.durationTaken,
        answered: summary.answeredCount,
        unanswered: summary.unansweredCount,
        marked: summary.markedCount,
        details: JSON.stringify({
          answers: summary.answers,
          marked: summary.markedQuestions,
        }),
      });
      // Refresh background stats
      loadAllAppData();
    } catch (e) {
      console.error('Failed to auto-save tryout result to Google Sheets:', e);
    }
  };

  // Exit Exam
  const handleExitExam = () => {
    setTryoutMode('select');
  };

  const defaultUser: UserProfile = {
    id: 'USER001',
    name: 'Rahmat Gunawan',
    degree: 'S.Psi',
    displayName: 'Rahmat Gunawan, S.Psi',
    status: 'Pejuang CPNS',
    photoFileId: '',
    photoUrl: '',
  };

  const currentUser: UserProfile = user || defaultUser;

  // Loading Screen
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-[#219EBC] animate-spin mb-4" />
        <p className="text-sm font-bold text-[#023047]">Memuat Portal Mandiri SKD CPNS...</p>
      </div>
    );
  }

  // If Not Authenticated -> Show Login Lock Panel
  if (!isAuthenticated) {
    return (
      <LoginPanel
        onSuccess={handleLoginSuccess}
        onValidate={handleValidatePasscode}
      />
    );
  }

  // If currently taking the CAT Tryout Exam, display in FULLSCREEN mode (no sidebar, no topbar)
  if (activeTab === 'tryout' && tryoutMode === 'exam') {
    const selectedPkgMeta = TRYOUT_PACKAGES_METADATA.find(p => p.id === activePackageId);
    return (
      <TryoutExamView
        packageName={selectedPkgMeta?.title || 'TRYOUT SKD 01'}
        packageTitle={selectedPkgMeta?.title || 'TRYOUT SKD 01'}
        questions={activeQuestions}
        onFinishExam={handleFinishExam}
        onExitExam={handleExitExam}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-['Inter',sans-serif] text-slate-800 antialiased">
      {/* 1. TOPBAR (Fixed Header) */}
      <Topbar
        currentTab={activeTab}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => {
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setMobileMenuOpen(prev => !prev);
          } else {
            setSidebarCollapsed(prev => !prev);
          }
        }}
        user={currentUser}
        onNavigateProfile={() => {
          setActiveTab('settings');
          setTryoutMode('select');
          setMobileMenuOpen(false);
        }}
      />

      {/* 2. BODY CONTAINER: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex pt-16">
        {/* SIDEBAR NAVIGATION (Desktop: Collapsible 270px/75px, Mobile/Tablet: Off-canvas Drawer) */}
        <Sidebar
          currentTab={activeTab}
          onSelectTab={tab => {
            setActiveTab(tab);
            if (tab === 'tryout' && tryoutMode !== 'result') {
              setTryoutMode('select');
            }
            setMobileMenuOpen(false);
          }}
          user={currentUser}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onLogout={handleLogout}
          onOpenExportModal={() => {
            setShowExportModal(true);
            setMobileMenuOpen(false);
          }}
        />

        {/* MAIN CONTENT AREA */}
        <main
          className={`flex-1 min-w-0 p-3.5 sm:p-5 md:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all ${
            sidebarCollapsed ? 'lg:pl-[95px]' : 'lg:pl-[290px]'
          }`}
        >
          {isLoadingData && !dashboardData ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="w-8 h-8 text-[#219EBC] animate-spin mb-3" />
              <p className="text-xs font-semibold text-slate-500">Menghubungkan ke Google Sheets...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && dashboardData && (
                <DashboardView
                  data={dashboardData}
                  user={currentUser}
                  onNavigateTab={tab => {
                    setActiveTab(tab);
                    if (tab === 'tryout') setTryoutMode('select');
                  }}
                  onStartTryout={() => {
                    setActiveTab('tryout');
                    handleSelectPackage('tryout-01');
                  }}
                />
              )}

              {/* TAB 2: JADWAL BELAJAR */}
              {activeTab === 'schedule' && (
                <ScheduleView
                  schedule={scheduleList}
                  onUpdateStatus={handleUpdateScheduleStatus}
                  onResetSchedule={handleResetSchedule}
                  onStartTryout={() => {
                    setActiveTab('tryout');
                    handleSelectPackage('tryout-01');
                  }}
                />
              )}

              {/* TAB 3: TRYOUT CAT */}
              {activeTab === 'tryout' && (
                <>
                  {tryoutMode === 'select' && (
                    <TryoutSelectView onSelectPackage={handleSelectPackage} />
                  )}

                  {tryoutMode === 'result' && examResultSummary && (
                    <TryoutResultView
                      summary={examResultSummary}
                      questions={activeQuestions}
                      onNavigateProgress={() => {
                        setActiveTab('progress');
                        setTryoutMode('select');
                      }}
                      onNavigateDashboard={() => {
                        setActiveTab('dashboard');
                        setTryoutMode('select');
                      }}
                    />
                  )}
                </>
              )}

              {/* TAB 4: PROGRESS & RIWAYAT */}
              {activeTab === 'progress' && (
                <ProgressView
                  progressList={progressList}
                  onDeleteProgress={handleDeleteProgress}
                  onResetProgress={handleResetProgress}
                  onStartTryout={() => {
                    setActiveTab('tryout');
                    setTryoutMode('select');
                  }}
                />
              )}

              {/* TAB 5: PENGATURAN */}
              {activeTab === 'settings' && (
                <SettingsView
                  user={currentUser}
                  scheduleList={scheduleList}
                  progressList={progressList}
                  tryoutResults={tryoutResultsList}
                  onSaveProfile={handleSaveProfile}
                  onUploadPhoto={handleUploadPhoto}
                  onChangePasscode={handleChangePasscode}
                  onResetProgress={handleResetProgress}
                  onResetSchedule={handleResetSchedule}
                  onResetTryoutData={handleResetTryoutData}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL GOOGLE APPS SCRIPT CODE.GS VIEWER */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up">
            <div className="bg-[#023047] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-[#8ECAE6]" />
                <div>
                  <h3 className="text-base font-bold">Google Apps Script Backend (Code.gs)</h3>
                  <p className="text-[11px] text-[#8ECAE6]">Integrasi Database Google Spreadsheet & Drive Storage</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600">
              <p className="leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                Script ini bertindak sebagai server-side backend yang mengelola database 4 sheets: <strong className="text-[#023047]">PROFILE</strong>, <strong className="text-[#023047]">SCHEDULE</strong>, <strong className="text-[#023047]">PROGRESS</strong>, dan <strong className="text-[#023047]">TRYOUT_RESULTS</strong>, serta menyimpan foto profil ke Google Drive.
              </p>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-80">
                <pre>{`// Fungsi Deployment & Setup Otomatis:
// 1. Buka spreadsheet baru di Google Sheets
// 2. Klik Extensions > Apps Script
// 3. Paste file Code.gs dari proyek ini
// 4. Jalankan fungsi setupDatabase() untuk inisialisasi tabel
// 5. Deploy sebagai Web App`}</pre>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">File: Code.gs tersedia di root workspace</span>
              <button
                onClick={() => {
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-[#219EBC] hover:bg-[#1a859e] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Disalin ke Clipboard' : 'Salin Konfigurasi'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
