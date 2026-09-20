import React, { useState } from 'react';
import {
  Trophy,
  Award,
  BarChart2,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Plus,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ProgressRecord } from '../types';

interface ProgressViewProps {
  progressList: ProgressRecord[];
  onDeleteProgress: (id: string) => Promise<void>;
  onResetProgress: () => Promise<void>;
  onStartTryout: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progressList,
  onDeleteProgress,
  onResetProgress,
  onStartTryout,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Statistics
  const totalTryouts = progressList.length;
  let highestScore = 0;
  let totalScoreSum = 0;
  let lastScore = 0;

  progressList.forEach((p, idx) => {
    totalScoreSum += p.total;
    if (p.total > highestScore) highestScore = p.total;
    if (idx === 0) lastScore = p.total;
  });

  const averageScore = totalTryouts > 0 ? Math.round(totalScoreSum / totalTryouts) : 0;

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus catatan progres ini dari database?')) {
      setDeletingId(id);
      try {
        await onDeleteProgress(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8ECAE6]/25 text-[#023047] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#219EBC]" />
            <span>Rekam Jejak Evaluasi Nilai</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#023047] font-['Poppins',sans-serif]">
            Progress & Riwayat Tryout
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analisis capaian nilai terhadap standar Passing Grade resmi: TWK 65, TIU 80, TKP 166.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onStartTryout}
            className="px-4 py-2 rounded-xl bg-[#FB8500] hover:bg-[#e07700] text-white text-xs font-bold shadow-md shadow-[#FB8500]/25 transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Mulai Tryout Baru</span>
          </button>

          <button
            onClick={onResetProgress}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
            title="Reset Data Progres"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Kartu Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nilai Terakhir */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nilai Terakhir</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#023047] mt-1 font-['Poppins',sans-serif]">
            {lastScore || '-'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {lastScore >= 311 ? '✓ Memenuhi Passing Grade' : 'Di bawah batas Passing Grade'}
          </p>
        </div>

        {/* Nilai Tertinggi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nilai Tertinggi</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#FB8500] mt-1 font-['Poppins',sans-serif]">
            {highestScore || '-'}
          </h3>
          <p className="text-[11px] text-[#FB8500] font-medium mt-1 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Rekor skor personal
          </p>
        </div>

        {/* Rata-Rata */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rata-Rata Nilai</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#219EBC] mt-1 font-['Poppins',sans-serif]">
            {averageScore || '-'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Dari {totalTryouts} kali simulasi
          </p>
        </div>

        {/* Jumlah Tryout */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jumlah Tryout Selesai</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#023047] mt-1 font-['Poppins',sans-serif]">
            {totalTryouts}
            <span className="text-xs font-normal text-slate-400 ml-1.5">Kali</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Award className="w-3 h-3 text-[#FFB703]" /> Konsistensi CAT teruji
          </p>
        </div>
      </div>

      {/* Chart Visual Perkembangan Nilai Tryout */}
      {progressList.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#023047] font-['Poppins',sans-serif]">
              Kurva Nilai Subtest (TWK, TIU, TKP, TOTAL)
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1 text-[#023047]">
                <span className="w-3 h-3 rounded-full bg-[#023047]" /> TWK (PG: 65)
              </span>
              <span className="flex items-center gap-1 text-[#219EBC]">
                <span className="w-3 h-3 rounded-full bg-[#219EBC]" /> TIU (PG: 80)
              </span>
              <span className="flex items-center gap-1 text-[#8ECAE6]">
                <span className="w-3 h-3 rounded-full bg-[#8ECAE6]" /> TKP (PG: 166)
              </span>
              <span className="flex items-center gap-1 text-[#FB8500]">
                <span className="w-3 h-3 rounded-full bg-[#FB8500]" /> TOTAL
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {[...progressList].reverse().slice(-5).map((p, idx) => (
              <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#023047]">{p.tryoutName}</span>
                  <span className="text-xs font-extrabold text-[#FB8500]">Total: {p.total} / 550</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">TWK: {p.twk} / 150</span>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-[#023047] h-full rounded-full" style={{ width: `${Math.min(100, (p.twk / 150) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">TIU: {p.tiu} / 175</span>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-[#219EBC] h-full rounded-full" style={{ width: `${Math.min(100, (p.tiu / 175) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">TKP: {p.tkp} / 225</span>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-[#8ECAE6] h-full rounded-full" style={{ width: `${Math.min(100, (p.tkp / 225) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabel Riwayat Nilai Tryout */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#023047] font-['Poppins',sans-serif]">
            Tabel Riwayat Nilai Tryout
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Total {progressList.length} data tersimpan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="p-3.5 pl-5">No</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Tryout</th>
                <th className="p-3.5 text-center">TWK</th>
                <th className="p-3.5 text-center">TIU</th>
                <th className="p-3.5 text-center">TKP</th>
                <th className="p-3.5 text-center">Total</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {progressList.length > 0 ? (
                progressList.map((row, idx) => {
                  const isPassTWK = row.twk >= 65;
                  const isPassTIU = row.tiu >= 80;
                  const isPassTKP = row.tkp >= 166;
                  const isAllPass = isPassTWK && isPassTIU && isPassTKP;

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-slate-400">{idx + 1}</td>
                      <td className="p-3.5 font-medium text-slate-600 whitespace-nowrap">{row.date}</td>
                      <td className="p-3.5 font-bold text-[#023047]">{row.tryoutName}</td>
                      <td className={`p-3.5 text-center font-bold ${isPassTWK ? 'text-[#023047]' : 'text-rose-500'}`}>
                        {row.twk}
                      </td>
                      <td className={`p-3.5 text-center font-bold ${isPassTIU ? 'text-[#219EBC]' : 'text-rose-500'}`}>
                        {row.tiu}
                      </td>
                      <td className={`p-3.5 text-center font-bold ${isPassTKP ? 'text-teal-700' : 'text-rose-500'}`}>
                        {row.tkp}
                      </td>
                      <td className="p-3.5 text-center font-extrabold text-[#FB8500] text-sm">
                        {row.total}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isAllPass
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {isAllPass ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isAllPass ? 'LULUS PG' : 'TIDAK LULUS'}
                        </span>
                      </td>
                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(row.id)}
                          disabled={deletingId === row.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 text-xs">
                    Belum ada riwayat hasil Tryout di database Google Sheets.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
