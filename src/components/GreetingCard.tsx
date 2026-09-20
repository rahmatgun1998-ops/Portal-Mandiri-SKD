import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { UserProfile, ScheduleItem } from '../types';
import { MOTIVATIONAL_QUOTES } from '../data/initialSchedule';

interface GreetingCardProps {
  user: UserProfile;
  todaySchedule: ScheduleItem | null;
  onNavigateSchedule: () => void;
}

export const GreetingCard: React.FC<GreetingCardProps> = ({ user, todaySchedule, onNavigateSchedule }) => {
  const [quote, setQuote] = useState<string>('');

  useEffect(() => {
    // Pilih quote secara acak dari kumpulan 12 quote
    const rand = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(rand);
  }, []);

  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#023047] via-[#0b4866] to-[#219EBC] text-white p-5 sm:p-7 md:p-8 lg:p-10 shadow-lg overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[240px] md:min-h-[290px]">
      {/* Subtle Background Glows */}
      <div className="absolute -top-16 -left-16 w-60 h-60 rounded-full bg-[#8ECAE6]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 w-60 h-60 rounded-full bg-[#FFB703]/10 blur-3xl pointer-events-none" />

      {/* Sisi Kiri: Text & Informasi */}
      <div className="relative z-10 w-full md:w-3/5 space-y-3 sm:space-y-3.5 text-left pb-2 md:pb-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-[#8ECAE6] font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" />
          <span>Fokus & Konsistensi Harian</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-white font-['Poppins',sans-serif] leading-tight">
            Selamat Datang Kembali,
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-[2.1rem] font-bold text-[#8ECAE6] tracking-tight leading-snug">
            {user.displayName || 'Rahmat Gunawan, S.Psi'}
          </p>
        </div>

        {/* Motivational Quote */}
        <p className="text-xs sm:text-sm text-slate-200/90 italic font-light max-w-xl leading-relaxed border-l-2 border-[#FFB703] pl-3 py-0.5">
          “{quote || 'Setiap sesi belajar membawa kamu satu langkah lebih dekat pada tujuan.'}”
        </p>

        {/* Quick action: Jadwal Hari ini */}
        {todaySchedule && (
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateSchedule}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-[#FB8500] hover:bg-[#e07700] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#FB8500]/30 transition-all cursor-pointer active:scale-95 max-w-full"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="truncate">Jadwal: {todaySchedule.category} — {todaySchedule.material}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        )}
      </div>

      {/* Sisi Kanan: Objek Foto Cut-Out Transparan Tanpa Frame (Fit Desktop, Tablet, dan Mobile) */}
      <div className="relative z-10 w-full md:w-auto shrink-0 flex items-end justify-center md:justify-end mt-4 md:mt-0 pointer-events-none self-center md:self-end md:-mb-8 sm:-mb-7 -mb-5 md:-mt-8">
        {user.photoUrl ? (
          <div className="relative flex items-end justify-center">
            <img
              src={user.photoUrl}
              alt={user.displayName}
              className="h-56 sm:h-64 md:h-80 lg:h-96 max-h-[390px] w-auto max-w-[220px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[390px] object-contain select-none transition-transform duration-300"
              style={{
                background: 'transparent',
                filter:
                  'drop-shadow(0px -3.5px 0 #ffffff) drop-shadow(0px 3.5px 0 #ffffff) drop-shadow(-3.5px 0px 0 #ffffff) drop-shadow(3.5px 0px 0 #ffffff) drop-shadow(2.5px 2.5px 0 #ffffff) drop-shadow(-2.5px -2.5px 0 #ffffff) drop-shadow(2.5px -2.5px 0 #ffffff) drop-shadow(-2.5px 2.5px 0 #ffffff) drop-shadow(0 16px 28px rgba(2, 48, 71, 0.55))',
              }}
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          /* High-Fidelity Transparent Cut-Out Vector Avatar dengan List Putih Mengikuti Objek (Crop pas tanpa gap atas) */
          <div className="relative flex items-end justify-center">
            <svg
              viewBox="20 25 160 215"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-56 sm:h-64 md:h-80 lg:h-96 max-h-[390px] w-auto max-w-[220px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[390px] object-contain select-none"
              style={{
                background: 'transparent',
                filter:
                  'drop-shadow(0px -3.5px 0 #ffffff) drop-shadow(0px 3.5px 0 #ffffff) drop-shadow(-3.5px 0px 0 #ffffff) drop-shadow(3.5px 0px 0 #ffffff) drop-shadow(2.5px 2.5px 0 #ffffff) drop-shadow(-2.5px -2.5px 0 #ffffff) drop-shadow(2.5px -2.5px 0 #ffffff) drop-shadow(-2.5px 2.5px 0 #ffffff) drop-shadow(0 16px 28px rgba(2, 48, 71, 0.55))',
              }}
            >
              {/* Badan Jas & Kemeja Mahasiswa/ASN Pejuang CPNS */}
              <path
                d="M30 240 C35 195 55 170 85 160 L100 175 L115 160 C145 170 165 195 170 240 Z"
                fill="#022133"
              />
              {/* Kerah Jas Navy Modern */}
              <path
                d="M50 240 L85 160 L100 190 L115 160 L150 240 Z"
                fill="#023047"
              />
              {/* Kemeja Putih Berdasi */}
              <path
                d="M85 160 L100 185 L115 160 L108 140 L92 140 Z"
                fill="#F8FAFC"
              />
              {/* Dasi Teal #219EBC */}
              <path
                d="M96 155 L104 155 L106 210 L100 220 L94 210 Z"
                fill="#219EBC"
              />
              {/* Leher */}
              <path
                d="M88 120 L112 120 L110 148 L90 148 Z"
                fill="#F6D5B8"
              />
              {/* Kepala / Wajah */}
              <path
                d="M75 85 C75 55 125 55 125 85 C125 115 118 135 100 135 C82 135 75 115 75 85 Z"
                fill="#FBDBC3"
              />
              {/* Rambut Profesional Rapi */}
              <path
                d="M70 75 C70 45 85 30 105 30 C125 30 135 45 132 70 C130 55 115 45 95 48 C85 50 75 62 70 75 Z"
                fill="#1E293B"
              />
              {/* Kacamata Integritas Emas #FFB703 */}
              <rect x="80" y="78" width="16" height="12" rx="3" stroke="#FFB703" strokeWidth="2.5" fill="none" />
              <rect x="104" y="78" width="16" height="12" rx="3" stroke="#FFB703" strokeWidth="2.5" fill="none" />
              <line x1="96" y1="84" x2="104" y2="84" stroke="#FFB703" strokeWidth="2.5" />
              {/* Senyum Ramah Pelayanan */}
              <path d="M92 108 Q100 114 108 108" stroke="#D47A60" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Pin Lencana Korpri / Garuda Emas di Dada */}
              <circle cx="65" cy="195" r="4.5" fill="#FFB703" />
              <polygon points="65,192 66.5,196 63.5,196" fill="#FB8500" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
