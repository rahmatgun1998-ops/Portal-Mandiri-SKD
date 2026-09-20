import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Question } from '../data/tryoutBank';

interface TryoutExamViewProps {
  packageName: string;
  packageTitle: string;
  questions: Question[];
  onFinishExam: (summary: {
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
  }) => void;
  onExitExam: () => void;
}

export const TryoutExamView: React.FC<TryoutExamViewProps> = ({
  packageName,
  packageTitle,
  questions,
  onFinishExam,
  onExitExam,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Record<number, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState<boolean>(false);

  // 100 Menit Timer berbasis Timestamp (Refresh-safe)
  const DURATION_SECONDS = 100 * 60; // 6000 detik
  const [secondsRemaining, setSecondsRemaining] = useState<number>(DURATION_SECONDS);
  const startTimeRef = useRef<number>(Date.now());
  const timerIdRef = useRef<any>(null);

  // Inisialisasi Timestamp dari localStorage agar aman dari reload
  useEffect(() => {
    const storageKey = `TO_TIMER_${packageName}`;
    const storedStart = localStorage.getItem(storageKey);
    let startTs = Date.now();

    if (storedStart) {
      startTs = parseInt(storedStart, 10);
    } else {
      localStorage.setItem(storageKey, String(startTs));
    }
    startTimeRef.current = startTs;

    // Load saved answers if any
    const savedAnswers = localStorage.getItem(`TO_ANSWERS_${packageName}`);
    if (savedAnswers) {
      try { setAnswers(JSON.parse(savedAnswers)); } catch (e) {}
    }
    const savedMarked = localStorage.getItem(`TO_MARKED_${packageName}`);
    if (savedMarked) {
      try { setMarkedQuestions(JSON.parse(savedMarked)); } catch (e) {}
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTs) / 1000);
      const left = DURATION_SECONDS - elapsed;
      if (left <= 0) {
        clearInterval(interval);
        setSecondsRemaining(0);
        handleFinalSubmit(); // Otomatis submit saat waktu habis 00:00:00
      } else {
        setSecondsRemaining(left);
      }
    }, 1000);

    timerIdRef.current = interval;

    // Warning jika user mencoba refresh atau leave
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Tryout sedang berlangsung. Apakah Anda yakin ingin meninggalkan halaman?';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [packageName]);

  // Format Timer HH : MM : SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
  };

  // Timer Warning levels
  const isCritical = secondsRemaining <= 300; // < 5 menit
  const isWarning = secondsRemaining <= 600 && !isCritical; // < 10 menit

  // Pertanyaan Aktif
  const currentQ = questions[currentIdx] || questions[0];
  const questionNumber = currentIdx + 1;
  const currentAnswer = answers[questionNumber] || '';
  const isMarked = !!markedQuestions[questionNumber];

  // Memilih Jawaban
  const handleSelectOption = (key: string) => {
    const nextAnswers = { ...answers, [questionNumber]: key };
    setAnswers(nextAnswers);
    localStorage.setItem(`TO_ANSWERS_${packageName}`, JSON.stringify(nextAnswers));
  };

  // Toggle Ragu-Ragu
  const handleToggleMarked = () => {
    const nextMarked = { ...markedQuestions, [questionNumber]: !isMarked };
    setMarkedQuestions(nextMarked);
    localStorage.setItem(`TO_MARKED_${packageName}`, JSON.stringify(nextMarked));
  };

  // Status Perhitungan
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedQuestions).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  // Selesaikan Ujian & Hitung Skor
  const handleFinalSubmit = () => {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    localStorage.removeItem(`TO_TIMER_${packageName}`);
    localStorage.removeItem(`TO_ANSWERS_${packageName}`);
    localStorage.removeItem(`TO_MARKED_${packageName}`);

    const elapsedSeconds = DURATION_SECONDS - secondsRemaining;
    const hours = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    const secs = elapsedSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const durationTaken = `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

    // Perhitungan Skor:
    // TWK (1-30): Benar = 5 (atau standar 5 poin per soal, total max 150)
    // TIU (31-65): Benar = 5 (total max 175)
    // TKP (66-110): Skor opsi 1-5 (total max 225)
    let twkScore = 0;
    let tiuScore = 0;
    let tkpScore = 0;

    questions.forEach(q => {
      const userAns = answers[q.id];
      if (q.category === 'TWK') {
        if (userAns && userAns === q.correctAnswer) {
          twkScore += 5;
        }
      } else if (q.category === 'TIU') {
        if (userAns && userAns === q.correctAnswer) {
          tiuScore += 5;
        }
      } else if (q.category === 'TKP') {
        if (userAns) {
          const opt = q.options.find(o => o.key === userAns);
          tkpScore += (opt?.score || 1);
        }
      }
    });

    const totalScore = twkScore + tiuScore + tkpScore;

    onFinishExam({
      packageName,
      answers,
      markedQuestions,
      durationTaken,
      twkScore,
      tiuScore,
      tkpScore,
      totalScore,
      answeredCount,
      unansweredCount,
      markedCount,
    });
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-['Inter',sans-serif] select-none">
      {/* 1. STICKY HEADER TRYOUT */}
      <header className="sticky top-0 z-40 h-20 bg-[#023047] text-white px-4 sm:px-8 flex items-center justify-between border-b border-white/10 shadow-md">
        {/* Kiri: Brand & Exit */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Tryout sedang berlangsung. Apakah Anda yakin ingin keluar ke dashboard? Jawaban akan tetap tersimpan.')) {
                onExitExam();
              }
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Keluar ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8ECAE6]" />
              <span className="text-xs font-bold tracking-wider uppercase text-white font-['Poppins',sans-serif]">
                PORTAL MANDIRI SKD CPNS
              </span>
            </div>
            <p className="text-[11px] text-[#8ECAE6] font-medium hidden sm:block">
              Sistem Simulasi CAT Terpadu
            </p>
          </div>
        </div>

        {/* Tengah: Nama Paket */}
        <div className="hidden md:block text-center">
          <span className="text-xs font-bold text-[#FFB703] uppercase tracking-widest block">
            SIMULASI CAT AKBAR
          </span>
          <h1 className="text-sm lg:text-base font-extrabold text-white">
            {packageTitle}
          </h1>
        </div>

        {/* Kanan: TIMER DIGITAL (HH : MM : SS) */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#FFB703]" /> Sisa Waktu
            </span>
            <div
              className={`font-mono text-base sm:text-xl md:text-2xl font-black tracking-widest px-3 sm:px-4 py-1 rounded-xl shadow-inner border transition-all ${
                isCritical
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                  : isWarning
                  ? 'bg-amber-950/80 border-amber-500 text-[#FFB703]'
                  : 'bg-[#011c2b] border-white/15 text-[#FFB703]'
              }`}
            >
              {formatTime(secondsRemaining)}
            </div>
          </div>

          {/* Mobile Toggle Drawer Button */}
          <button
            onClick={() => setShowMobileDrawer(true)}
            className="lg:hidden p-2.5 rounded-xl bg-[#219EBC] text-white shadow-md flex items-center gap-1.5 cursor-pointer text-xs font-bold"
            title="Daftar Soal"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">Daftar Soal</span>
          </button>
        </div>
      </header>

      {/* 2. DUA KOLOM LAYOUT: KIRI (70-75% SOAL), KANAN (25-30% NOMOR) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start">
        {/* KOLOM KIRI (70-75% SOAL AREA) */}
        <div className="w-full lg:w-[72%] flex flex-col gap-6">
          {/* Progress Bar & Subtest Info */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                  currentQ.category === 'TWK'
                    ? 'bg-[#023047] text-white'
                    : currentQ.category === 'TIU'
                    ? 'bg-[#219EBC] text-white'
                    : 'bg-[#8ECAE6] text-[#023047]'
                }`}>
                  [ {currentQ.category} ]
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {currentQ.subCategory}
                </span>
              </div>

              <div className="text-xs font-bold text-[#023047]">
                <span className="text-[#219EBC] font-extrabold">{answeredCount}</span> / {questions.length} Terjawab
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#219EBC] h-full rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* KARTU PERTANYAAN */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-bold text-[#023047]">
                Soal <span className="text-lg text-[#FB8500] font-extrabold">{String(questionNumber).padStart(2, '0')}</span> dari {questions.length}
              </h2>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                Tingkat: {currentQ.difficulty}
              </span>
            </div>

            {/* Teks Pertanyaan (Font: 17–19px, Line-height: 1.6–1.8) */}
            <div className="text-[17px] sm:text-[18px] md:text-[19px] leading-[1.7] md:leading-[1.8] text-slate-800 font-medium">
              {currentQ.question}
            </div>

            {/* Opsi Pilihan Jawaban A, B, C, D, E */}
            <div className="space-y-3.5 pt-4">
              {currentQ.options.map(opt => {
                const isSelected = currentAnswer === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[#E8F7FB] border-[#219EBC] shadow-sm ring-2 ring-[#219EBC]/20'
                        : 'bg-white border-slate-200 hover:border-[#8ECAE6] hover:bg-slate-50/70'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 min-w-9 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                        isSelected
                          ? 'bg-[#219EBC] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {opt.key}
                    </div>
                    <span className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed pt-1 flex-1">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. NAVIGASI SOAL: [← Sebelumnya] [⚑ Ragu-ragu] [Selanjutnya →] / [AKHIRI UJIAN] */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Tombol Ragu-Ragu (#FFB703) */}
            <button
              type="button"
              onClick={handleToggleMarked}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isMarked
                  ? 'bg-[#FFB703] text-[#023047] ring-4 ring-[#FFB703]/30'
                  : 'bg-[#FFB703]/15 text-[#b07d00] hover:bg-[#FFB703]/25 border border-[#FFB703]/40'
              }`}
            >
              <Flag className={`w-4 h-4 ${isMarked ? 'fill-[#023047]' : ''}`} />
              <span>{isMarked ? 'Tandai Ragu (Aktif)' : 'Ragu-ragu'}</span>
            </button>

            {/* Tombol Selanjutnya atau Akhiri Ujian pada Soal 110 */}
            {questionNumber === questions.length ? (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="px-6 py-3 rounded-xl bg-[#FB8500] hover:bg-[#e07700] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#FB8500]/30 transition-all cursor-pointer active:scale-95 animate-pulse"
              >
                <span>AKHIRI UJIAN</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-6 py-3 rounded-xl bg-[#219EBC] hover:bg-[#1a859e] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#219EBC]/30 transition-all cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* KOLOM KANAN (25-30% STICKY PANEL NOMOR SOAL: 01 s.d. 110 TANPA SUBTEST DIVIDER) */}
        <div className="hidden lg:block w-[28%] sticky top-24">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#023047] font-['Poppins',sans-serif]">
                Daftar Nomor Soal (110)
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                Lompat Langsung
              </span>
            </div>

            {/* Grid Nomor Soal 01–110 (Tanpa pengelompokan TWK/TIU/TKP) */}
            <div className="max-h-[500px] overflow-y-auto pr-1">
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((q, idx) => {
                  const num = idx + 1;
                  const isCur = idx === currentIdx;
                  const hasAns = !!answers[num];
                  const isMrk = !!markedQuestions[num];

                  // Warna Status Nomor Soal:
                  // BELUM DIJAWAB: #F1F5F9
                  // SUDAH DIJAWAB: #219EBC
                  // AKTIF: #FB8500
                  // RAGU-RAGU: #FFB703
                  let bgClass = 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200';
                  if (isCur) {
                    bgClass = 'bg-[#FB8500] text-white font-black ring-2 ring-[#FB8500]/40 shadow-sm';
                  } else if (isMrk) {
                    bgClass = 'bg-[#FFB703] text-[#023047] font-bold';
                  } else if (hasAns) {
                    bgClass = 'bg-[#219EBC] text-white font-semibold';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-9 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer ${bgClass}`}
                    >
                      {String(num).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend Sesuai Spesifikasi 39 */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#F1F5F9] border border-slate-300" />
                <span>Belum Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#219EBC]" />
                <span>Sudah Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#FFB703]" />
                <span>Ragu-ragu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#FB8500]" />
                <span>Sedang Dibuka</span>
              </div>
            </div>

            {/* Akhiri Ujian Quick Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#FB8500] hover:bg-[#e07700] text-white text-xs font-bold shadow-md shadow-[#FB8500]/20 transition-all cursor-pointer"
            >
              Akhiri Ujian Sekarang
            </button>
          </div>
        </div>
      </main>

      {/* MOBILE DRAWER NOMOR SOAL */}
      {showMobileDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="bg-white w-full max-w-xs h-full p-5 flex flex-col justify-between shadow-2xl animate-slide-left">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-[#023047] text-sm">
                  Daftar Nomor Soal (110)
                </h3>
                <button
                  onClick={() => setShowMobileDrawer(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const num = idx + 1;
                    const isCur = idx === currentIdx;
                    const hasAns = !!answers[num];
                    const isMrk = !!markedQuestions[num];

                    let bgClass = 'bg-[#F1F5F9] text-slate-700';
                    if (isCur) {
                      bgClass = 'bg-[#FB8500] text-white font-black';
                    } else if (isMrk) {
                      bgClass = 'bg-[#FFB703] text-[#023047] font-bold';
                    } else if (hasAns) {
                      bgClass = 'bg-[#219EBC] text-white font-bold';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentIdx(idx);
                          setShowMobileDrawer(false);
                        }}
                        className={`h-9 rounded-lg text-xs flex items-center justify-center transition-all ${bgClass}`}
                      >
                        {String(num).padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowMobileDrawer(false);
                setShowConfirmModal(true);
              }}
              className="w-full py-3 rounded-xl bg-[#FB8500] text-white font-bold text-xs shadow-md"
            >
              Akhiri Ujian
            </button>
          </div>
        </div>
      )}

      {/* 4. MODAL KONFIRMASI AKHIRI UJIAN (Sesuai Spesifikasi 50) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 border border-slate-100 text-center animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-[#FB8500]/15 text-[#FB8500] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-[#023047] font-['Poppins',sans-serif]">
              AKHIRI UJIAN?
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Pastikan Anda telah memeriksa kembali seluruh jawaban sebelum mengirim lembar ujian.
            </p>

            {/* Statistik Jawaban */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-[#219EBC]/10 border border-[#219EBC]/20">
                <span className="text-[11px] text-slate-500 font-semibold block">Sudah Dijawab</span>
                <span className="text-xl font-extrabold text-[#219EBC]">{answeredCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block">Belum Dijawab</span>
                <span className="text-xl font-extrabold text-slate-700">{unansweredCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFB703]/15 border border-[#FFB703]/30">
                <span className="text-[11px] text-slate-500 font-semibold block">Ragu-ragu</span>
                <span className="text-xl font-extrabold text-[#b07d00]">{markedCount}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 font-medium">
              Apakah Anda yakin ingin mengakhiri ujian sekarang?
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 py-3 rounded-xl bg-[#FB8500] hover:bg-[#e07700] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#FB8500]/30 transition-all cursor-pointer"
              >
                AKHIRI UJIAN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
