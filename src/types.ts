// Portal Mandiri SKD CPNS - Shared Types & Interfaces

export interface UserProfile {
  id: string;
  name: string;
  degree: string;
  displayName: string;
  status: string;
  photoFileId: string;
  photoUrl?: string; // base64 or drive URL
  createdAt?: string;
  updatedAt?: string;
}

export type ScheduleStatus = 'Belum' | 'Sedang Belajar' | 'Selesai' | 'OFF' | 'Tryout';

export interface ScheduleItem {
  id: string;
  date: string;
  week: number; // 1 (Ganjil) or 2 (Genap)
  day: string; // 'Senin' | 'Selasa' | ... | 'Minggu'
  category: 'TWK' | 'TIU' | 'TKP' | 'OFF' | 'TRYOUT';
  material: string;
  objective: string;
  keyPoints: string[];
  duration: string; // e.g. '90 Menit'
  targetQuestions: number; // e.g. 30
  status: ScheduleStatus;
  notes: string;
}

export interface ProgressRecord {
  id: string;
  date: string;
  tryoutName: string;
  twk: number;
  tiu: number;
  tkp: number;
  total: number;
  correctTWK: number;
  correctTIU: number;
  correctTKP: number;
  answered: number;
  unanswered: number;
  marked: number;
  notes: string;
  createdAt: string;
}

export interface TryoutResult {
  id: string;
  package: string;
  packageName?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration: string; // e.g. '01:27:43'
  twk: number;
  tiu: number;
  tkp: number;
  total: number;
  answered?: number;
  unanswered?: number;
  marked?: number;
  details?: string;
  answersJSON?: string;
  createdAt: string;
  subtestDetails?: {
    twk: { correct: number; wrong: number; empty: number; score: number; maxScore: number };
    tiu: { correct: number; wrong: number; empty: number; score: number; maxScore: number };
    tkp: { score: number; maxScore: number };
  };
  answers?: Record<number, string>;
  markedQuestions?: Record<number, boolean>;
}

export interface DashboardData {
  user: UserProfile;
  stats: {
    totalStudySessions: number;
    tryoutCompleted: number;
    averageScore: number;
    targetProgressPercent: number;
    highestScore: number;
    lastScore: number;
  };
  todaySchedule: ScheduleItem | null;
  weeklyProgress: {
    completedDays: number;
    totalDays: number;
    currentWeek: number;
  };
  recentTryouts: TryoutResult[];
  chartData: {
    labels: string[];
    twk: number[];
    tiu: number[];
    tkp: number[];
    total: number[];
  };
}
