import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  LineChart,
  FileCheck,
  Settings,
  LogOut,
  ShieldCheck,
  Code2,
  Menu,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onLogout: () => void;
  onOpenExportModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  onLogout,
  onOpenExportModal,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Jadwal Belajar', icon: CalendarDays },
    { id: 'progress', label: 'Progress', icon: LineChart },
    { id: 'tryout', label: 'Tryout CAT', icon: FileCheck },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const handleSelectTab = (tabId: string) => {
    onSelectTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* 1. Backdrop Overlay for Mobile & Tablet */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* 2. Responsive Sidebar (Permanent on Desktop, Slide-over Drawer on Mobile/Tablet) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 lg:z-30 bg-[#023047] text-white flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-[#023047]/40 shadow-2xl lg:shadow-xl ${
          mobileOpen
            ? 'translate-x-0 w-[280px] max-w-[85vw]'
            : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-[75px]' : 'lg:w-[270px]'}`}
      >
        {/* Top Section: Logo & Brand */}
        <div>
          {collapsed ? (
            /* Desktop Collapsed Header: Hidden on mobile when drawer is active */
            <div className="h-18 px-3 hidden lg:flex items-center justify-center border-b border-white/10">
              <button
                onClick={onToggleCollapse}
                className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#219EBC] to-[#8ECAE6] flex items-center justify-center text-[#023047] shadow-md shadow-[#219EBC]/20 hover:scale-105 transition-all cursor-pointer group"
                title="Buka / Perluas Sidebar"
              >
                <ShieldCheck className="w-6 h-6 stroke-[2.2] group-hover:hidden" />
                <Menu className="w-5 h-5 hidden group-hover:block text-[#023047]" />
              </button>
            </div>
          ) : (
            /* Expanded Header (and Mobile Header) */
            <div className="h-18 px-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 min-w-10 rounded-xl bg-gradient-to-tr from-[#219EBC] to-[#8ECAE6] flex items-center justify-center text-[#023047] shadow-md shadow-[#219EBC]/20">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-bold tracking-wider text-white font-['Poppins',sans-serif] leading-tight">
                    PORTAL MANDIRI
                  </span>
                  <span className="text-xs font-semibold text-[#8ECAE6] tracking-wide">
                    SKD CPNS
                  </span>
                </div>
              </div>

              {/* Desktop toggle button */}
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Tutup / Ciutkan Sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>

              {/* Mobile close button */}
              <button
                onClick={onCloseMobile}
                className="lg:hidden w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Tutup Menu Navigasi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Mini Profile */}
          <div className={`p-4 border-b border-white/10 transition-all ${collapsed ? 'lg:items-center lg:justify-center' : ''}`}>
            <div className={`flex items-center gap-3 ${collapsed ? 'lg:justify-center' : ''}`}>
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-11 h-11 min-w-11 rounded-full object-cover border-2 border-[#219EBC] shadow-sm"
                />
              ) : (
                <div className="w-11 h-11 min-w-11 rounded-full bg-[#219EBC]/30 border-2 border-[#8ECAE6] text-[#8ECAE6] flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name.charAt(0) : 'R'}
                </div>
              )}

              <div className={`overflow-hidden ${collapsed ? 'lg:hidden' : 'block'}`}>
                <h4 className="text-xs sm:text-sm font-semibold text-white truncate leading-snug">
                  {user.displayName || 'Rahmat Gunawan, S.Psi'}
                </h4>
                <p className="text-[11px] font-medium text-[#FFB703] truncate">
                  {user.status || 'Pejuang CPNS'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menus */}
          <nav className="p-3 space-y-1.5 mt-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                    isActive
                      ? 'bg-[#219EBC] text-white shadow-md shadow-[#219EBC]/30 font-semibold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#8ECAE6]'}`} />
                  <span className={collapsed ? 'lg:hidden' : 'inline'}>{item.label}</span>

                  {/* Collapsed Tooltip for Desktop */}
                  {collapsed && (
                    <span className="hidden lg:block absolute left-full ml-3 px-2.5 py-1 bg-[#023047] text-white text-xs rounded-md shadow-lg border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Export Code & Logout */}
        <div className="p-3 border-t border-white/10 space-y-1.5">
          {/* Google Apps Script Export Code Button */}
          <button
            onClick={() => {
              onOpenExportModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#FFB703]/15 text-[#FFB703] border border-[#FFB703]/30 hover:bg-[#FFB703]/25 transition-all group cursor-pointer ${
              collapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
            title="Lihat & Salin Kode Apps Script"
          >
            <Code2 className="w-4 h-4 text-[#FFB703]" />
            <span className={collapsed ? 'lg:hidden' : 'inline'}>Kode Apps Script</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              onLogout();
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-all cursor-pointer ${
              collapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
            title="Keluar / Akhiri Sesi"
          >
            <LogOut className="w-5 h-5 text-rose-400" />
            <span className={collapsed ? 'lg:hidden' : 'inline'}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
