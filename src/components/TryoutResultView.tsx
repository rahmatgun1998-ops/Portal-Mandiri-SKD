import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart2,
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  Award,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Question } from '../data/tryoutBank';

interface TryoutResultViewProps {
  summary: {
    packageName: string;
    answers: Record<number, string>;
    markedQuestions: Record<number, boolean>;
    durationTaken: string;
    twkScore: number;
    tiuScore: number;
    tkpScore: number;
    totalScore: number;
    answeredCount: number;
    unansweredCount: number;
    markedCount: number;
  };
  questions: Question[];
  onNavigateProgress: () => void;
  onNavigateDashboard: () => void;
}

export const TryoutResultView: React.FC<TryoutResultViewProps> = ({
  summary,
  questions,
  onNavigateProgress,
  onNavigateDashboard,
}) => {
  const [showReview, setShowReview] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'TWK' | 'TIU' | 'TKP'>('ALL');

  // Trigger confetti if passed total passing grade
  useEffect(() => {
    if (summary.totalScore >= 311) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#219EBC', '#8ECAE6', '#FFB703', '#FB8500'],
        });
      } catch (e) {}
    }
  }, [summary.totalScore]);

  // Breakdown detail per subtest
  // TWK: 30 soal (5 poin/soal, max 150, PG 65)
  // TIU: 35 soal (5 poin/soal, max 175, PG 80)
  // TKP: 45 soal (max 225, PG 166)
  let twkCorrect = 0;
  let twkWrong = 0;
  let twkEmpty = 0;

  let tiuCorrect = 0;
  let tiuWrong = 0;
  let tiuEmpty = 0;

  questions.forEach(q => {
    const ans = summary.answers[q.id];
    if (q.category === 'TWK') {
      if (!ans) twkEmpty++;
      else if (ans === q.correctAnswer) twkCorrect++;
      else twkWrong++;
    } else if (q.category === 'TIU') {
      if (!ans) tiuEmpty++;
      else if (ans === q.correctAnswer) tiuCorrect++;
      else tiuWrong++;
    }
  });

  const isPassTWK = summary.twkScore >= 65;
  const isPassTIU = summary.tiuScore >= 80;
  const isPassTKP = summary.tkpScore >= 166;
  const isAllPass = isPassTWK && isPassTIU && isPassTKP;

  // Evaluasi Performa
  const getPerformanceSummary = () => {
    if (!isPassTWK && !isPassTIU) {
      return 'Performa TWK dan TIU menjadi bagian yang perlu mendapat perhatian lebih dan pendalaman konsep pada sesi latihan berikutnya.';
    }
    if (!isPassTIU) {
      return 'Performa TIU menjadi bagian yang perlu mendapat perhatian lebih dan latihan hitung cepat secara intensif.';
    }
    if (!isPassTWK) {
      return 'Performa TWK memerlukan penguatan penalaran analisis kasus dan implementasi pilar kebangsaan.';
    }
    if (!isPassTKP) {
      return 'Performa TKP perlu disesuaikan dengan pola pikir ASN yang berorientasi pada pelayanan publik prima dan integritas tinggi.';
    }
    if (summary.twkScore >= summary.tiuScore && summary.twkScore >= summary.tkpScore) {
      return 'TWK menjadi bagian dengan hasil tertinggi pada Tryout ini. Pertahankan konsistensi pemahaman pilar kebangsaan Anda!';
    }
    if (summary.tiuScore >= summary.twkScore && summary.tiuScore >= summary.tkpScore) {
      return 'TIU menjadi bagian dengan hasil tertinggi pada Tryout ini. Logika numerik dan analitis Anda sudah sangat prima!';
    }
    return 'TKP menjadi bagian dengan capaian sangat memuaskan. Karakter kepribadian dan integritas profesional Anda sangat baik!';
  };

  const filteredQuestions = questions.filter(q => {
    if (filterCategory === 'ALL') return true;
    return q.category === filterCategory;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-16 font-['Inter',sans-serif]">
      {/* 1. HEADER HASIL TRYOUT */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#219EBC] via-[#FFB703] to-[#FB8500]" />

        <span className="text-xs font-bold text-[#219EBC] uppercase tracking-widest block mb-1">
          LEMBAR EVALUASI CAT RESMI
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#023047] font-['Poppins',sans-serif]">
          HASIL TRYOUT SKD CPNS
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          {summary.packageName} • {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        {/* SKOR TOTAL DISPLAY BESAR */}
        <div className="my-8 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            SKOR TOTAL
          </span>
          <div className="text-6xl sm:text-7xl font-black text-[#023047] font-['Poppins',sans-serif] tracking-tight">
            {summary.totalScore}
            <span className="text-lg sm:text-xl font-normal text-slate-400 ml-2">/ 550</span>
          </div>

          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase ${
              isAllPass
                ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300'
                : 'bg-rose-100 text-rose-800 ring-2 ring-rose-300'
            }`}>
              {isAllPass ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {isAllPass ? 'LULUS PASSING GRADE (PG: 311)' : 'BELUM MEMENUHI PASSING GRADE'}
            </span>
          </div>
        </div>

        {/* 3 KARTU NILAI SUBTEST (TWK, TIU, TKP) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
          {/* TWK Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">TWK</span>
              <span className={`text-[11px] font-bold ${isPassTWK ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isPassTWK ? 'PG: 65 ✓' : 'Di Bawah 65'}
              </span>
            </div>
            <div className="text-2xl font-black text-[#023047] mt-1 font-['Poppins',sans-serif]">
              {summary.twkScore}
              <span className="text-xs font-normal text-slate-400 ml-1">/ 150</span>
            </div>
          </div>

          {/* TIU Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">TIU</span>
              <span className={`text-[11px] font-bold ${isPassTIU ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isPassTIU ? 'PG: 80 ✓' : 'Di Bawah 80'}
              </span>
            </div>
            <div className="text-2xl font-black text-[#219EBC] mt-1 font-['Poppins',sans-serif]">
              {summary.tiuScore}
              <span className="text-xs font-normal text-slate-400 ml-1">/ 175</span>
            </div>
          </div>

          {/* TKP Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">TKP</span>
              <span className={`text-[11px] font-bold ${isPassTKP ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isPassTKP ? 'PG: 166 ✓' : 'Di Bawah 166'}
              </span>
            </div>
            <div className="text-2xl font-black text-[#FB8500] mt-1 font-['Poppins',sans-serif]">
              {summary.tkpScore}
              <span className="text-xs font-normal text-slate-400 ml-1">/ 225</span>
            </div>
          </div>
        </div>

        {/* Detail Pengerjaan: Total Soal, Dijawab, Kosong, Ragu, Durasi */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[11px]">Total Soal</span>
            <span className="font-bold text-slate-800 text-sm">110 Soal</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Dijawab</span>
            <span className="font-bold text-[#219EBC] text-sm">{summary.answeredCount}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Tidak Dijawab</span>
            <span className="font-bold text-slate-700 text-sm">{summary.unansweredCount}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Ragu-ragu</span>
            <span className="font-bold text-[#FFB703] text-sm">{summary.markedCount}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Waktu Selesai</span>
            <span className="font-bold text-[#023047] text-sm">{summary.durationTaken}</span>
          </div>
        </div>
      </div>

      {/* 2. HASIL PER SUBTEST & EVALUASI PERFORMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rincian Jawaban Per Subtest */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#023047] font-['Poppins',sans-serif]">
            Rincian Jawaban Subtest
          </h3>

          <div className="space-y-3 text-xs">
            {/* TWK Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between font-bold text-[#023047] mb-2">
                <span>TWK (30 Soal)</span>
                <span className="text-sm font-extrabold text-[#023047]">{summary.twkScore} Poin</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-slate-600">
                <span className="text-emerald-700 font-semibold">Benar: {twkCorrect}</span>
                <span className="text-rose-700 font-semibold">Salah: {twkWrong}</span>
                <span className="text-slate-400 font-semibold">Kosong: {twkEmpty}</span>
              </div>
            </div>

            {/* TIU Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between font-bold text-[#219EBC] mb-2">
                <span>TIU (35 Soal)</span>
                <span className="text-sm font-extrabold text-[#219EBC]">{summary.tiuScore} Poin</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-slate-600">
                <span className="text-emerald-700 font-semibold">Benar: {tiuCorrect}</span>
                <span className="text-rose-700 font-semibold">Salah: {tiuWrong}</span>
                <span className="text-slate-400 font-semibold">Kosong: {tiuEmpty}</span>
              </div>
            </div>

            {/* TKP Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between font-bold text-[#FB8500] mb-2">
                <span>TKP (45 Soal)</span>
                <span className="text-sm font-extrabold text-[#FB8500]">{summary.tkpScore} Poin</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Setiap pilihan bernilai 1 s.d 5 poin. Total akumulasi nilai skenario situasional.
              </p>
            </div>
          </div>
        </div>

        {/* Ringkasan Performa Evaluasi & Grafik Batang Sederhana */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#023047] font-['Poppins',sans-serif] mb-2">
              Evaluasi Performa Mandiri
            </h3>
            <p className="text-xs text-slate-600 bg-[#8ECAE6]/15 border-l-4 border-[#219EBC] p-3.5 rounded-r-xl leading-relaxed">
              {getPerformanceSummary()}
            </p>

            <div className="mt-5 space-y-3">
              <span className="text-xs font-bold text-slate-500 block uppercase">
                Perbandingan Nilai Terhadap Target Max
              </span>

              {/* Bar TWK */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>TWK ({summary.twkScore}/150)</span>
                  <span>{Math.round((summary.twkScore / 150) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#023047] h-full rounded-full" style={{ width: `${(summary.twkScore / 150) * 100}%` }} />
                </div>
              </div>

              {/* Bar TIU */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>TIU ({summary.tiuScore}/175)</span>
                  <span>{Math.round((summary.tiuScore / 175) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#219EBC] h-full rounded-full" style={{ width: `${(summary.tiuScore / 175) * 100}%` }} />
                </div>
              </div>

              {/* Bar TKP */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>TKP ({summary.tkpScore}/225)</span>
                  <span>{Math.round((summary.tkpScore / 225) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#FB8500] h-full rounded-full" style={{ width: `${(summary.tkpScore / 225) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400">
            ✓ Data otomatis tersimpan ke spreadsheet <strong className="text-slate-600">TRYOUT_RESULTS</strong> dan <strong className="text-slate-600">PROGRESS</strong>.
          </div>
        </div>
      </div>

      {/* 3. TOMBOL AKSI HASIL */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={() => setShowReview(!showReview)}
          className="px-6 py-3 rounded-xl bg-[#023047] hover:bg-[#034466] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-[#8ECAE6]" />
          <span>{showReview ? 'Sembunyikan Pembahasan' : 'Review Jawaban & Pembahasan'}</span>
          {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <button
          onClick={onNavigateProgress}
          className="px-6 py-3 rounded-xl bg-[#219EBC] hover:bg-[#1a859e] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <BarChart2 className="w-4 h-4" />
          <span>Lihat Riwayat Progress</span>
        </button>

        <button
          onClick={onNavigateDashboard}
          className="px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4 text-slate-500" />
          <span>Kembali ke Dashboard</span>
        </button>
      </div>

      {/* 4. REVIEW JAWABAN & PEMBAHASAN LENGKAP (110 SOAL) */}
      {showReview && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-[#023047] font-['Poppins',sans-serif]">
                Review Jawaban & Kunci Pembahasan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kaji seluruh 110 soal untuk membedah titik kekeliruan dan kunci skor tertinggi
              </p>
            </div>

            {/* Filter Subtest */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {(['ALL', 'TWK', 'TIU', 'TKP'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-[#023047] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua (110)' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* List Soal Pembahasan */}
          <div className="space-y-6">
            {filteredQuestions.map(q => {
              const userAns = summary.answers[q.id] || 'Tidak Dijawab';
              const isTwkOrTiu = q.category === 'TWK' || q.category === 'TIU';
              const isCorrect = isTwkOrTiu && userAns === q.correctAnswer;
              const isWrong = isTwkOrTiu && userAns !== 'Tidak Dijawab' && userAns !== q.correctAnswer;
              const isEmpty = userAns === 'Tidak Dijawab';

              // Untuk TKP: Tampilkan skor pilihan user
              let tkpChosenScore = 0;
              if (q.category === 'TKP' && userAns !== 'Tidak Dijawab') {
                const chosen = q.options.find(o => o.key === userAns);
                tkpChosenScore = chosen?.score || 1;
              }

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3 text-xs"
                >
                  {/* Header Soal */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#023047] text-sm">
                        SOAL {String(q.id).padStart(2, '0')}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-semibold text-[10px]">
                        {q.category} • {q.subCategory}
                      </span>
                    </div>

                    {/* Status Badge */}
                    {isTwkOrTiu ? (
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-700'
                          : isWrong
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isCorrect ? '✓ Benar (+5)' : isWrong ? '✕ Salah (0)' : '○ Kosong (0)'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFB703]/20 text-[#023047] font-bold text-[11px]">
                        Skor Anda: {tkpChosenScore} Poin (Max: 5)
                      </span>
                    )}
                  </div>

                  {/* Pertanyaan */}
                  <p className="text-slate-800 text-sm font-medium leading-relaxed">
                    {q.question}
                  </p>

                  {/* Jawaban Anda & Kunci */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-semibold">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500">Jawaban Anda:</span>
                      <span className={`font-bold ${isCorrect ? 'text-emerald-600' : isWrong ? 'text-rose-600' : 'text-slate-500'}`}>
                        {userAns}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500">
                        {isTwkOrTiu ? 'Kunci Jawaban:' : 'Opsi Bobot 5 (Tertinggi):'}
                      </span>
                      <span className="font-bold text-[#023047]">
                        {q.correctAnswer}
                      </span>
                    </div>
                  </div>

                  {/* Pembahasan */}
                  <div className="p-3.5 rounded-xl bg-[#219EBC]/10 border border-[#219EBC]/20 text-slate-700 leading-relaxed">
                    <span className="font-bold text-[#023047] block mb-1">Pembahasan:</span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
