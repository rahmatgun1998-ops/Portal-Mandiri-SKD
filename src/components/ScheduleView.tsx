import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  BookOpen,
  X,
  Play,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ScheduleItem, ScheduleStatus } from '../types';

interface ScheduleViewProps {
  schedule: ScheduleItem[];
  onUpdateStatus: (id: string, status: ScheduleStatus, notes?: string) => Promise<void>;
  onResetSchedule: () => Promise<void>;
  onStartTryout: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedule,
  onUpdateStatus,
  onResetSchedule,
  onStartTryout,
}) => {
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const [activeWeekTab, setActiveWeekTab] = useState<number>(1);
  const [notesInput, setNotesInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const week1Items = schedule.filter(s => s.week === 1);
  const week2Items = schedule.filter(s => s.week === 2);
  const currentWeekItems = activeWeekTab === 1 ? week1Items : week2Items;

  const handleOpenModal = (item: ScheduleItem) => {
    setSelectedItem(item);
    setNotesInput(item.notes || '');
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleStatusChange = async (newStatus: ScheduleStatus) => {
    if (!selectedItem) return;
    setIsSaving(true);
    try {
      await onUpdateStatus(selectedItem.id, newStatus, notesInput);
      setSelectedItem(prev => prev ? { ...prev, status: newStatus, notes: notesInput } : null);
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'TWK':
        return 'bg-[#023047] text-white';
      case 'TIU':
        return 'bg-[#219EBC] text-white';
      case 'TKP':
        return 'bg-[#8ECAE6] text-[#023047]';
      case 'TRYOUT':
        return 'bg-[#FB8500] text-white animate-pulse';
      case 'OFF':
        return 'bg-slate-200 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8ECAE6]/25 text-[#023047] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FB8500]" />
            <span>Kurikulum Siklus 2 Mingguan Berulang</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#023047] font-['Poppins',sans-serif]">
            Jadwal Belajar SKD CPNS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Pola latihan terjadwal: TWK berbasis penalaran, TIU verbal/numerik/figural, TKP skenario, dan simulasi CAT mingguan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onResetSchedule}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
            title="Reset ke silabus default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Silabus</span>
          </button>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveWeekTab(1)}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeWeekTab === 1
              ? 'bg-[#023047] text-white shadow-md shadow-[#023047]/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#8ECAE6]" />
          <span>Minggu Ganjil (Hari ke-1 s.d 7)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-[#FFB703]">Minggu OFF</span>
        </button>

        <button
          onClick={() => setActiveWeekTab(2)}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeWeekTab === 2
              ? 'bg-[#023047] text-white shadow-md shadow-[#023047]/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#8ECAE6]" />
          <span>Minggu Genap (Hari ke-8 s.d 14)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FB8500] text-white">Tryout CAT</span>
        </button>
      </div>

      {/* Grid Kartu Jadwal 7 Hari */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentWeekItems.map(item => {
          const isDone = item.status === 'Selesai';
          const isOngoing = item.status === 'Sedang Belajar';
          const isOff = item.status === 'OFF';
          const isTryout = item.category === 'TRYOUT';

          return (
            <div
              key={item.id}
              onClick={() => handleOpenModal(item)}
              className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 group ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : isOngoing
                  ? 'border-[#219EBC] ring-2 ring-[#219EBC]/20'
                  : isTryout
                  ? 'border-[#FB8500] ring-1 ring-[#FB8500]/30'
                  : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${getCategoryBadgeClass(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.day}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#023047] group-hover:text-[#219EBC] transition-colors line-clamp-2 mb-2">
                  {item.material}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {item.objective}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-[#219EBC]" />
                  <span>{item.duration}</span>
                </div>

                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-700'
                    : isOngoing
                    ? 'bg-amber-100 text-amber-700'
                    : isOff
                    ? 'bg-slate-200 text-slate-600'
                    : isTryout
                    ? 'bg-[#FB8500]/15 text-[#FB8500]'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL JADWAL MODAL (Sesuai Spesifikasi 30) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-scale-up">
            {/* Modal Header */}
            <div className="bg-[#023047] text-white p-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${getCategoryBadgeClass(selectedItem.category)}`}>
                    {selectedItem.category}
                  </span>
                  <span className="text-xs text-slate-300">
                    Minggu ke-{selectedItem.week} • {selectedItem.day} ({selectedItem.date})
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-snug">
                  {selectedItem.material}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Tujuan Belajar */}
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Tujuan Pembelajaran
                </h5>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  {selectedItem.objective}
                </p>
              </div>

              {/* Poin Penting */}
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Poin Penting Penalaran
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedItem.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#219EBC] mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Durasi & Target Soal */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[11px] font-medium text-slate-400 block">Estimasi Durasi</span>
                  <span className="text-sm font-bold text-[#023047] flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-[#219EBC]" />
                    {selectedItem.duration}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[11px] font-medium text-slate-400 block">Target Latihan</span>
                  <span className="text-sm font-bold text-[#023047] flex items-center gap-1.5 mt-0.5">
                    <Target className="w-4 h-4 text-[#FB8500]" />
                    {selectedItem.targetQuestions} Soal
                  </span>
                </div>
              </div>

              {/* Catatan Pribadi */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Catatan Evaluasi Pribadi
                </label>
                <textarea
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                  rows={2}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#219EBC] text-slate-700 resize-none"
                  placeholder="Tulis ringkasan rumus atau evaluasi pengerjaan Anda..."
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {selectedItem.category === 'TRYOUT' ? (
                <button
                  onClick={() => {
                    handleCloseModal();
                    onStartTryout();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FB8500] hover:bg-[#e07700] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#FB8500]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Mulai Tryout CAT 110 Soal</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleStatusChange('Sedang Belajar')}
                    disabled={isSaving}
                    className="px-4 py-2.5 rounded-xl border border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC]/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Mulai Belajar</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange('Selesai')}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#219EBC] hover:bg-[#1a859e] text-white text-xs font-bold shadow-md shadow-[#219EBC]/30 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Tandai Selesai</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
