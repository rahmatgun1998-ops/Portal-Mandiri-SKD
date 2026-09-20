import React from 'react';
import { Play, Clock, BookOpen, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { TRYOUT_PACKAGES_METADATA } from '../data/tryoutBank';

interface TryoutSelectViewProps {
  onSelectPackage: (pkgId: string) => void;
}

export const TryoutSelectView: React.FC<TryoutSelectViewProps> = ({ onSelectPackage }) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12 font-['Inter',sans-serif]">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FB8500]/15 text-[#FB8500] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Standar CAT BKN Resmi: 110 Soal • 100 Menit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#023047] font-['Poppins',sans-serif]">
            Pilih Paket Tryout CAT SKD CPNS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Simulasi terpadu tanpa pengelompokan nomor subtest, dilengkapi timer jam digital real-time, evaluasi passing grade otomatis, dan rekam jejak nilai ke Google Sheets.
          </p>
        </div>

        {/* Passing Grade Pill */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs space-y-1">
          <span className="font-bold text-[#023047] block">Batas Passing Grade (PG):</span>
          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
            <span>TWK: <strong>65</strong></span>
            <span>•</span>
            <span>TIU: <strong>80</strong></span>
            <span>•</span>
            <span>TKP: <strong>166</strong></span>
          </div>
        </div>
      </div>

      {/* 3 Paket Tryout Cards (TRYOUT SKD 01, TRYOUT SKD 02, TRYOUT SKD 03) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TRYOUT_PACKAGES_METADATA.map((pkg, idx) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-[#023047] text-white">
                  PAKET {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-bold text-[#FB8500] bg-[#FB8500]/10 px-2.5 py-1 rounded-full">
                  110 Soal
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#023047] group-hover:text-[#219EBC] transition-colors font-['Poppins',sans-serif]">
                {pkg.title}
              </h3>
              <p className="text-xs font-medium text-[#219EBC] mt-0.5">
                {pkg.subtitle}
              </p>

              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                {pkg.description}
              </p>

              {/* Komposisi Soal */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] font-semibold text-slate-400 block">TWK</span>
                  <span className="font-extrabold text-[#023047]">30 Soal</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] font-semibold text-slate-400 block">TIU</span>
                  <span className="font-extrabold text-[#219EBC]">35 Soal</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] font-semibold text-slate-400 block">TKP</span>
                  <span className="font-extrabold text-[#FB8500]">45 Soal</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#219EBC]" />
                  Durasi: 100 Menit
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Original Reasoning
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectPackage(pkg.id)}
              className="mt-6 w-full py-3.5 px-4 rounded-2xl bg-[#FB8500] hover:bg-[#e07700] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#FB8500]/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mulai Ujian CAT (Paket {idx + 1})</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
