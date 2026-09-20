// Local / Simulated Google Apps Script Storage Adapter
// Menyediakan sinkronisasi identik dengan Code.gs untuk live preview di AI Studio,
// dan jika dijalankan di Google Apps Script akan memanggil google.script.run secara transparan.

import { UserProfile, ScheduleItem, ProgressRecord, TryoutResult, DashboardData } from '../types';
import { INITIAL_SCHEDULE } from '../data/initialSchedule';

const STORAGE_KEYS = {
  USER: 'portal_mandiri_user',
  PASSCODE: 'portal_mandiri_passcode',
  SCHEDULE: 'portal_mandiri_schedule',
  PROGRESS: 'portal_mandiri_progress',
  TRYOUT_RESULTS: 'portal_mandiri_tryout_results',
  TRYOUT_STATE: 'portal_mandiri_tryout_state',
  SESSION: 'portal_mandiri_session',
};

const DEFAULT_USER: UserProfile = {
  id: 'USER001',
  name: 'Rahmat Gunawan',
  degree: 'S.Psi',
  displayName: 'Rahmat Gunawan, S.Psi',
  status: 'Pejuang CPNS',
  photoFileId: '',
  photoUrl: '', // Will default to a stylized vector avatar if empty
};

export const gasApi = {
  isGasEnvironment(): boolean {
    return typeof (window as any).google !== 'undefined' &&
           typeof (window as any).google.script !== 'undefined' &&
           typeof (window as any).google.script.run !== 'undefined';
  },

  // USER PROFILE
  async getUserProfile(): Promise<UserProfile> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .getUserProfile();
      });
    }
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(saved);
  },

  async saveUserProfile(profile: Partial<UserProfile>): Promise<{ success: boolean; message: string }> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .saveUserProfile(profile);
      });
    }
    const current = await this.getUserProfile();
    const updated = {
      ...current,
      ...profile,
      displayName: profile.degree ? `${profile.name}, ${profile.degree}` : (profile.name || current.name),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return { success: true, message: 'Profil berhasil diperbarui' };
  },

  async uploadProfilePhoto(base64Data: string, mimeType: string, fileName: string): Promise<{ success: boolean; photoUrl: string; fileId?: string; message: string }> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .uploadProfilePhoto(base64Data, mimeType, fileName);
      });
    }
    // Browser persistence
    const current = await this.getUserProfile();
    const updated = { ...current, photoUrl: base64Data, photoFileId: 'DRIVE_MOCK_' + Date.now() };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return {
      success: true,
      photoUrl: base64Data,
      message: 'Foto profil berhasil disimpan ke persistent storage',
    };
  },

  // PASSCODE
  async validatePasscode(passcode: string): Promise<{ valid: boolean; message: string }> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .validatePasscode(passcode);
      });
    }
    const savedPass = localStorage.getItem(STORAGE_KEYS.PASSCODE) || '123456';
    const isValid = passcode.trim() === savedPass.trim();
    return { valid: isValid, message: isValid ? 'Passcode valid' : 'Passcode salah' };
  },

  async verifyPasscode(passcode: string): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    const val = await this.validatePasscode(passcode);
    const user = await this.getUserProfile();
    return { success: val.valid, user, message: val.message };
  },

  async changePasscode(oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .changePasscode(oldPass, newPass);
      });
    }
    const savedPass = localStorage.getItem(STORAGE_KEYS.PASSCODE) || '123456';
    if (oldPass.trim() !== savedPass.trim()) {
      return { success: false, message: 'Passcode lama tidak sesuai' };
    }
    if (!/^\d{6}$/.test(newPass.trim())) {
      return { success: false, message: 'Passcode baru harus berupa 6 digit angka' };
    }
    localStorage.setItem(STORAGE_KEYS.PASSCODE, newPass.trim());
    return { success: true, message: 'Passcode berhasil diperbarui' };
  },

  // SCHEDULE
  async getSchedule(): Promise<ScheduleItem[]> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .getSchedule();
      });
    }
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(INITIAL_SCHEDULE));
      return INITIAL_SCHEDULE;
    }
    return JSON.parse(saved);
  },

  async saveScheduleStatus(scheduleId: string, status: any, notes?: string): Promise<{ success: boolean }> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .saveScheduleStatus(scheduleId, status, notes);
      });
    }
    const items = await this.getSchedule();
    const updated = items.map(it => it.id === scheduleId ? { ...it, status, notes: notes !== undefined ? notes : it.notes } : it);
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(updated));
    return { success: true };
  },

  async updateScheduleStatus(scheduleId: string, status: any, notes?: string): Promise<{ success: boolean }> {
    return this.saveScheduleStatus(scheduleId, status, notes);
  },

  async resetSchedule(): Promise<{ success: boolean; message: string }> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .resetSchedule();
      });
    }
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(INITIAL_SCHEDULE));
    return { success: true, message: 'Jadwal berhasil direset ke siklus 2 minggu awal' };
  },

  // PROGRESS
  async getProgress(): Promise<ProgressRecord[]> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .getProgress();
      });
    }
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return saved ? JSON.parse(saved) : [];
  },

  async deleteProgress(id: string): Promise<{ success: boolean; message: string }> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .deleteProgress(id);
      });
    }
    const list = await this.getProgress();
    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(filtered));
    return { success: true, message: 'Data progres berhasil dihapus' };
  },

  async resetProgress(): Promise<{ success: boolean; message: string }> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .resetProgress();
      });
    }
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    return { success: true, message: 'Riwayat progres belajar berhasil direset' };
  },

  // TRYOUT RESULTS
  async getTryoutResults(): Promise<TryoutResult[]> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .getTryoutResults();
      });
    }
    const saved = localStorage.getItem(STORAGE_KEYS.TRYOUT_RESULTS);
    return saved ? JSON.parse(saved) : [];
  },

  async saveTryoutResult(result: Omit<TryoutResult, 'id' | 'createdAt'>): Promise<{ success: boolean; id: string }> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .saveTryoutResult(result);
      });
    }
    const results = await this.getTryoutResults();
    const newId = 'TO-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newRecord: TryoutResult = {
      ...result,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    results.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.TRYOUT_RESULTS, JSON.stringify(results));

    // Otomatis sinkronkan ke Progress
    const progressList = await this.getProgress();
    const newProg: ProgressRecord = {
      id: 'PRG-' + newId,
      date: result.date,
      tryoutName: result.packageName || result.package,
      twk: result.twk,
      tiu: result.tiu,
      tkp: result.tkp,
      total: result.total,
      correctTWK: Math.round(result.twk / 5),
      correctTIU: Math.round(result.tiu / 5),
      correctTKP: 45,
      answered: result.answered ?? 0,
      unanswered: result.unanswered ?? 0,
      marked: result.marked ?? 0,
      notes: `Simulasi CAT: ${result.packageName || result.package} (${result.duration})`,
      createdAt: new Date().toISOString(),
    };
    progressList.unshift(newProg);
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressList));

    return { success: true, id: newId };
  },

  async resetTryoutData(): Promise<{ success: boolean; message: string }> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .resetTryoutData();
      });
    }
    localStorage.removeItem(STORAGE_KEYS.TRYOUT_RESULTS);
    return { success: true, message: 'Seluruh riwayat Tryout berhasil direset' };
  },

  async resetTryoutResults(): Promise<{ success: boolean; message: string }> {
    return this.resetTryoutData();
  },

  // DASHBOARD DATA
  async getDashboardData(): Promise<DashboardData> {
    if (this.isGasEnvironment()) {
      return new Promise((resolve, reject) => {
        (window as any).google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .getDashboardData();
      });
    }
    const user = await this.getUserProfile();
    const schedule = await this.getSchedule();
    const progressList = await this.getProgress();

    const tryoutCompleted = progressList.length;
    let totalScoreSum = 0;
    let highestScore = 0;
    let lastScore = 0;

    progressList.forEach((p, idx) => {
      totalScoreSum += p.total;
      if (p.total > highestScore) highestScore = p.total;
      if (idx === 0) lastScore = p.total;
    });

    const averageScore = tryoutCompleted > 0 ? Math.round(totalScoreSum / tryoutCompleted) : 0;
    const completedSessions = schedule.filter(s => s.status === 'Selesai').length;
    const targetProgressPercent = highestScore > 0 ? Math.min(100, Math.round((highestScore / 450) * 100)) : 0;

    const todaySchedule = schedule.find(s => s.status === 'Sedang Belajar') ||
                          schedule.find(s => s.status === 'Belum') ||
                          schedule[0] || null;

    const completedDays = schedule.filter(s => s.status === 'Selesai' || s.status === 'OFF').length;

    const chronological = [...progressList].reverse().slice(-7);
    const chartData = {
      labels: chronological.map((c, i) => c.tryoutName.replace('TRYOUT SKD ', 'TO ') || `TO ${i + 1}`),
      twk: chronological.map(c => c.twk),
      tiu: chronological.map(c => c.tiu),
      tkp: chronological.map(c => c.tkp),
      total: chronological.map(c => c.total),
    };

    return {
      user,
      stats: {
        totalStudySessions: completedSessions,
        tryoutCompleted,
        averageScore,
        targetProgressPercent,
        highestScore,
        lastScore,
      },
      todaySchedule,
      weeklyProgress: {
        completedDays,
        totalDays: schedule.length || 14,
        currentWeek: 1,
      },
      recentTryouts: (await this.getTryoutResults()).slice(0, 5),
      chartData,
    };
  }
};
