import React, { useState, useEffect } from 'react';
import { ShieldCheck, Delete, Check, Lock, Sparkles, BookOpen } from 'lucide-react';

interface LoginPanelProps {
  onSuccess: () => void;
  onValidate: (code: string) => Promise<{ valid: boolean; message: string }>;
}

export const LoginPanel: React.FC<LoginPanelProps> = ({ onSuccess, onValidate }) => {
  const [passcode, setPasscode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleKeyPress = (num: string) => {
    if (passcode.length < 6) {
      const next = passcode + num;
      setPasscode(next);
      setErrorMsg('');
      if (next.length === 6) {
        verify(next);
      }
    }
  };

  const handleDelete = () => {
    if (passcode.length > 0) {
      setPasscode(prev => prev.slice(0, -1));
      setErrorMsg('');
    }
  };

  const handleClear = () => {
    setPasscode('');
    setErrorMsg('');
  };

  const verify = async (code: string) => {
    setIsLoading(true);
    try {
      const res = await onValidate(code);
      if (res.valid) {
        onSuccess();
      } else {
        setIsShaking(true);
        setErrorMsg('Passcode salah. Coba lagi.');
        setTimeout(() => {
          setIsShaking(false);
          setPasscode('');
        }, 600);
      }
    } catch (e) {
      setErrorMsg('Gagal memverifikasi passcode.');
    } finally {
      setIsLoading(false);
    }
  };

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        if (passcode.length === 6) {
          verify(passcode);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passcode]);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F7FAFC] font-['Inter',sans-serif]">
      {/* BRAND PANEL (50% Kiri pada Desktop) */}
      <div className="w-full md:w-1/2 bg-[#023047] text-white p-8 md:p-14 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        {/* Dekorasi Aksen Halus */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#219EBC]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#FB8500]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-[#FFB703]/10 blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-6 text-sm text-[#8ECAE6]">
            <ShieldCheck className="w-5 h-5 text-[#FFB703]" />
            <span className="font-medium tracking-wide">Portal Belajar Mandiri & CAT Exam</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white font-['Poppins',sans-serif]">
            PORTAL MANDIRI<br />
            <span className="text-[#8ECAE6]">SKD CPNS</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal max-w-md leading-relaxed">
            “Track Your Progress, Achieve Your Goal”
          </p>
        </div>

        {/* Brand Features List */}
        <div className="my-8 md:my-12 space-y-4 relative z-10">
          <div className="flex items-center gap-3.5 text-sm sm:text-base text-slate-200">
            <div className="w-8 h-8 rounded-lg bg-[#219EBC]/20 border border-[#219EBC]/40 flex items-center justify-center text-[#8ECAE6]">
              <Sparkles className="w-4 h-4 text-[#FFB703]" />
            </div>
            <span>Jadwal Belajar Terarah dengan Pola 2 Mingguan</span>
          </div>
          <div className="flex items-center gap-3.5 text-sm sm:text-base text-slate-200">
            <div className="w-8 h-8 rounded-lg bg-[#219EBC]/20 border border-[#219EBC]/40 flex items-center justify-center text-[#8ECAE6]">
              <BookOpen className="w-4 h-4 text-[#219EBC]" />
            </div>
            <span>Tryout CAT 110 Soal Original dengan Timer Real-Time</span>
          </div>
          <div className="flex items-center gap-3.5 text-sm sm:text-base text-slate-200">
            <div className="w-8 h-8 rounded-lg bg-[#219EBC]/20 border border-[#219EBC]/40 flex items-center justify-center text-[#8ECAE6]">
              <Lock className="w-4 h-4 text-[#FB8500]" />
            </div>
            <span>Passcode Aman & Integrasi Data Google Apps Script</span>
          </div>
        </div>

        {/* Footer Brand Info */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Official Study Companion</span>
          <span className="font-mono text-[#8ECAE6]">Default: 123456</span>
        </div>
      </div>

      {/* LOGIN PANEL (50% Kanan pada Desktop) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#023047] text-[#FFB703] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#023047]/20">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#023047] font-['Poppins',sans-serif]">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Masukkan 6 digit passcode Anda untuk melanjutkan
            </p>
          </div>

          {/* Passcode Indicator Dots (○ ○ ○ ○ ○ ○ -> ● ● ● ○ ○ ○) */}
          <div className={`flex items-center justify-center gap-3.5 mb-6 py-3 transition-transform ${isShaking ? 'animate-shake' : ''}`}>
            {[0, 1, 2, 3, 4, 5].map(idx => {
              const filled = idx < passcode.length;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    filled
                      ? 'bg-[#219EBC] scale-110 shadow-sm shadow-[#219EBC]/50 ring-4 ring-[#8ECAE6]/40'
                      : 'border-2 border-slate-300 bg-white'
                  }`}
                />
              );
            })}
          </div>

          {/* Pesan Error / Status */}
          <div className="h-6 mb-4 text-center">
            {errorMsg ? (
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 animate-pulse">
                {errorMsg}
              </span>
            ) : isLoading ? (
              <span className="text-xs text-[#219EBC] font-medium flex items-center justify-center gap-1.5">
                <span className="w-3 h-3 border-2 border-[#219EBC] border-t-transparent rounded-full animate-spin" />
                Memverifikasi...
              </span>
            ) : (
              <span className="text-xs text-slate-400">Tekan angka atau gunakan keyboard</span>
            )}
          </div>

          {/* Numeric Keypad: 1-9, ⌫, 0, ✓ */}
          <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-[280px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                id={`keypad-num-${num}`}
                onClick={() => handleKeyPress(num)}
                disabled={isLoading}
                className="h-14 sm:h-16 rounded-2xl bg-white border border-slate-200/80 text-xl font-semibold text-[#023047] shadow-sm hover:bg-slate-50 active:scale-95 active:bg-[#8ECAE6]/20 transition-all flex items-center justify-center select-none cursor-pointer"
              >
                {num}
              </button>
            ))}

            {/* Tombol Backspace ⌫ */}
            <button
              type="button"
              id="keypad-backspace"
              onClick={handleDelete}
              disabled={isLoading || passcode.length === 0}
              className="h-14 sm:h-16 rounded-2xl bg-white border border-slate-200/80 text-slate-600 shadow-sm hover:bg-rose-50 hover:text-rose-600 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600"
              title="Hapus Digit"
            >
              <Delete className="w-5 h-5" />
            </button>

            {/* Tombol 0 */}
            <button
              type="button"
              id="keypad-num-0"
              onClick={() => handleKeyPress('0')}
              disabled={isLoading}
              className="h-14 sm:h-16 rounded-2xl bg-white border border-slate-200/80 text-xl font-semibold text-[#023047] shadow-sm hover:bg-slate-50 active:scale-95 active:bg-[#8ECAE6]/20 transition-all flex items-center justify-center select-none cursor-pointer"
            >
              0
            </button>

            {/* Tombol Submit ✓ */}
            <button
              type="button"
              id="keypad-submit"
              onClick={() => passcode.length === 6 && verify(passcode)}
              disabled={isLoading || passcode.length !== 6}
              className="h-14 sm:h-16 rounded-2xl bg-[#219EBC] text-white shadow-md shadow-[#219EBC]/30 hover:bg-[#1a859e] active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:hover:bg-[#219EBC]"
              title="Masuk"
            >
              <Check className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="mt-6 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Bersihkan Input
          </button>
        </div>
      </div>
    </div>
  );
};
