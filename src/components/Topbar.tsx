import React from 'react';
import { Menu, Bell, Calendar as CalendarIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface TopbarProps {
  currentTab: string;
  onToggleSidebar: () => void;
  user: UserProfile;
  onNavigateProfile: () => void;
  sidebarCollapsed: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  onToggleSidebar,
  user,
  onNavigateProfile,
  sidebarCollapsed,
}) => {
  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'schedule':
        return 'Jadwal Belajar';
      case 'progress':
        return 'Progress & Riwayat Nilai';
      case 'tryout':
        return 'Tryout CAT SKD CPNS';
      case 'settings':
        return 'Pengaturan Akun & Sistem';
      default:
        return 'Portal Mandiri';
    }
  };

  // Tanggal Hari Ini (Format: 20 September 2026)
  const todayDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className={`h-18 px-4 sm:px-6 md:px-8 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between transition-all ${
      sidebarCollapsed ? 'lg:pl-[95px]' : 'lg:pl-[290px]'
    }`}>
      {/* Kiri: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#023047] transition-colors cursor-pointer"
          title="Toggle Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">Portal Mandiri</span>
          <span className="text-xs text-slate-300 hidden sm:inline">/</span>
          <h2 className="text-base sm:text-lg font-bold text-[#023047] font-['Poppins',sans-serif]">
            {getBreadcrumbTitle()}
          </h2>
        </div>
      </div>

      {/* Kanan: Notification, Tanggal, Mini Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Tanggal Aktif */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
          <CalendarIcon className="w-3.5 h-3.5 text-[#219EBC]" />
          <span>{todayDateFormatted}</span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-[#023047] transition-colors cursor-pointer"
          title="Notifikasi Jadwal Belajar"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FB8500] rounded-full ring-2 ring-white" />
        </button>

        {/* Small Circle Profile Photo */}
        <button
          onClick={onNavigateProfile}
          className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-[#219EBC]/40 transition-all cursor-pointer"
          title="Buka Pengaturan Profil"
        >
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.displayName}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#219EBC]"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#023047] text-[#FFB703] border-2 border-[#219EBC] flex items-center justify-center font-bold text-xs">
              {user.name ? user.name.charAt(0) : 'R'}
            </div>
          )}
          <span className="text-xs font-semibold text-[#023047] hidden md:inline truncate max-w-[130px]">
            {user.name || 'Rahmat Gunawan'}
          </span>
        </button>
      </div>
    </header>
  );
};
