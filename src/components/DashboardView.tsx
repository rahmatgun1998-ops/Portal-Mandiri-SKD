import React from 'react';
import {
  BookOpen,
  Trophy,
  BarChart3,
  Target,
  ArrowRight,
  Clock,
  CheckCircle2,
  CalendarCheck2,
  AlertCircle
} from 'lucide-react';
import { UserProfile, DashboardData } from '../types';
import { GreetingCard } from './GreetingCard';

interface DashboardViewProps {
  data: DashboardData;
  user: UserProfile;
  onNavigateTab: (tab: string) => void;
  onStartTryout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  user,
  onNavigateTab,
  onStartTryout,
}) => {
  const { stats, todaySchedule, weeklyProgress, recentTryouts, chartData } = data;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 1. GREETING CARD */}
      <GreetingCard
        user={user}
        todaySchedule={todaySchedule}
        onNavigateSchedule={() => onNavigateTab('schedule')}
      />

      {/* 2. STAT CARDS (Calculated dynamically from Google Sheets) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Sesi Belajar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Sesi Belajar
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#023047] mt-1 font-['Poppins',sans-serif]">
              {stats.totalStudySessions}
              <span className="text-xs font-normal text-slate-400 ml-1.5">Sesi</span>
            </h3>
            <p className="text-xs text-[#219EBC] font-medium mt-1 flex items-center gap-1">
              <CalendarCheck2 className="w-3.5 h-3.5" />
              <span>Dari jadwal 2 mingguan</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#8ECAE6]/25 text-[#219EBC] flex items-center justify-center">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Tryout Selesai */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tryout Selesai
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#023047] mt-1 font-['Poppins',sans-serif]">
              {stats.tryoutCompleted}
              <span className="text-xs font-normal text-slate-400 ml-1.5">Paket</span>
            </h3>
            <p className="text-xs text-[#FB8500] font-medium mt-1 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Skor tertinggi: {stats.highestScore || '-'}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FB8500]/15 text-[#FB8500] flex items-center justify-center">
            <Trophy className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Rata-rata Nilai */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Rata-rata Nilai
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#023047] mt-1 font-['Poppins',sans-serif]">
              {stats.averageScore || 0}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Passing Grade SKD: <span className="font-bold text-[#023047]">311</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#219EBC]/15 text-[#219EBC] flex items-center justify-center">
            <BarChart3 className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Progress Target */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Progress Target (450)
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#023047] mt-1 font-['Poppins',sans-serif]">
              {stats.targetProgressPercent}%
            </h3>
            <div className="w-28 bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#219EBC] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.targetProgressPercent)}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFB703]/20 text-[#023047] flex items-center justify-center">
            <Target className="w-6 h-6 stroke-[2.2] text-[#FFB703]" />
          </div>
        </div>
      </div>

      {/* 3. GRID 2 KOLOM: JADWAL HARI INI & PROGRESS MINGGUAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jadwal Hari Ini (2 Kolom di Desktop) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FB8500]" />
                <h3 className="text-base sm:text-lg font-bold text-[#023047] font-['Poppins',sans-serif]">
                  Jadwal Belajar Terkini
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('schedule')}
                className="text-xs font-semibold text-[#219EBC] hover:text-[#023047] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Lihat 2 Minggu Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaySchedule ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#023047] text-white">
                      {todaySchedule.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Minggu ke-{todaySchedule.week} ({todaySchedule.day})
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    todaySchedule.status === 'Selesai'
                      ? 'bg-emerald-100 text-emerald-700'
                      : todaySchedule.status === 'Sedang Belajar'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {todaySchedule.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#023047]">
                  {todaySchedule.material}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {todaySchedule.objective}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#219EBC]" />
                    <span>Durasi: {todaySchedule.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#FB8500]" />
                    <span>Target: {todaySchedule.targetQuestions} Soal</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs">
                Belum ada jadwal yang dijadwalkan hari ini.
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('schedule')}
              className="px-4 py-2 rounded-xl bg-[#219EBC] hover:bg-[#1a859e] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              Buka Modul Belajar
            </button>
          </div>
        </div>

        {/* Progress Siklus Mingguan */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#023047] font-['Poppins',sans-serif] mb-3">
              Progress Siklus 2 Minggu
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pola belajar TWK, TIU, TKP, dan Tryout Minggu genap secara sistematis.
            </p>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[#F7FAFC] to-[#8ECAE6]/20 border border-slate-200/80 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">Penyelesaian Sesi</span>
                <span className="text-xs font-bold text-[#023047]">
                  {weeklyProgress.completedDays} / {weeklyProgress.totalDays} Hari
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#219EBC] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((weeklyProgress.completedDays / weeklyProgress.totalDays) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 text-right">
                {Math.round((weeklyProgress.completedDays / weeklyProgress.totalDays) * 100)}% Terselesaikan
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#219EBC]" />
                <span>Minggu Ganjil: Hari Minggu = <strong className="text-slate-700">OFF (Istirahat)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FB8500]" />
                <span>Minggu Genap: Hari Minggu = <strong className="text-[#FB8500]">TRYOUT AKBAR</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onStartTryout}
            className="w-full mt-5 py-2.5 px-4 rounded-xl bg-[#FB8500] hover:bg-[#e07700] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FB8500]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Simulasi Tryout CAT Sekarang</span>
          </button>
        </div>
      </div>

      {/* 4. GRAFIK TRYOUT & RECENT TRYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Skor Tryout (2 Kolom) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#023047] font-['Poppins',sans-serif]">
                Perkembangan Nilai Tryout
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Riwayat total skor aktual dari database Google Sheets
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#219EBC]">
                <span className="w-3 h-3 rounded-sm bg-[#219EBC]" /> Total Skor
              </span>
            </div>
          </div>

          {chartData.labels.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2 border-b border-slate-200">
              {chartData.labels.map((label, idx) => {
                const score = chartData.total[idx] || 0;
                // Skala max 550 poin SKD
                const heightPercent = Math.min(100, Math.max(10, Math.round((score / 550) * 100)));
                const isPassing = score >= 311;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[11px] font-bold text-[#023047] mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {score}
                    </span>
                    <div
                      className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-sm ${
                        isPassing
                          ? 'bg-gradient-to-t from-[#219EBC] to-[#8ECAE6]'
                          : 'bg-gradient-to-t from-amber-500 to-[#FFB703]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[11px] font-medium text-slate-500 mt-2 truncate max-w-[60px]">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 p-6 text-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-medium">Belum ada riwayat Tryout.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Selesaikan simulasi pertama untuk memetakan kurva nilai.</p>
            </div>
          )}
        </div>

        {/* Recent Tryout List */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#023047] font-['Poppins',sans-serif]">
                Tryout Terakhir
              </h3>
              <button
                onClick={() => onNavigateTab('progress')}
                className="text-xs font-semibold text-[#219EBC] hover:underline cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {recentTryouts.length > 0 ? (
                recentTryouts.map(item => {
                  const isPass = item.total >= 311;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-[#023047]">
                          {item.packageName || item.package}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.date} • {item.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-extrabold ${isPass ? 'text-[#219EBC]' : 'text-[#FB8500]'}`}>
                          {item.total}
                        </span>
                        <p className="text-[10px] font-semibold text-slate-500">
                          {isPass ? 'Lulus PG' : 'Di Bawah PG'}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Belum ada hasil Tryout.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('progress')}
            className="w-full mt-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Buka Riwayat Nilai & Evaluasi
          </button>
        </div>
      </div>
    </div>
  );
};
