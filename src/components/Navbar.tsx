import React from 'react';
import { User, SiteSettings } from '../types';
import {
  Coins,
  Settings,
  User as UserIcon,
  LogOut,
  Sparkles,
  Gamepad2,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  settings: SiteSettings;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  settings,
  onOpenProfile,
  onOpenSettings,
  onLogout,
  theme,
  toggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-amber-500/20 shadow-xl transition-all duration-300">
      {/* Orqa fon porlashi (Gaming Glow Effect) */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-purple-500/10 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand / Logo */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group shrink-0 select-none"
          >
            {/* Logo Mark */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300 overflow-hidden border border-amber-300/30">
              <span className="text-lg sm:text-xl font-display tracking-tighter">8</span>
              <span className="text-xs sm:text-sm font-display text-amber-200">B</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </div>

            {/* Logo Text */}
            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-black text-base sm:text-xl text-white tracking-wider drop-shadow-sm">
                  8-SINF
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center gap-0.5 shadow-xs uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  GAMING
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 font-semibold mt-1">
                <Gamepad2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                <span className="truncate tracking-wide uppercase">INTELLEKTUAL ARENA</span>
              </div>
            </div>
          </div>

          {/* Actions / Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Tangalar tugmasi (Coin Counter) */}
            {currentUser && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer shadow-sm group"
                title="Sizning tangalaringiz"
                aria-label={`Profilingiz. Tangalar: ${currentUser.coins}`}
              >
                <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                  <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <span className="font-mono font-black tracking-tight tabular-nums text-white">
                  {currentUser.coins}
                </span>
                <ChevronRight className="hidden sm:block w-3.5 h-3.5 text-amber-400/60 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Tema almashtirish tugmasi */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Mavzuni o'zgartirish"
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-300" />
              )}
            </button>

            {/* Sozlamalar tugmasi */}
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Sozlamalar va Promokod"
              title="Sozlamalar va Promokod"
              className="flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 hover:text-white font-bold text-xs transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden lg:inline text-xs">Sozlamalar</span>
            </button>

            {/* Profil & Logout */}
            {currentUser && (
              <>
                {/* Profil tugmasi */}
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 p-1 sm:p-1.5 sm:pr-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-white transition-all duration-200 active:scale-95 cursor-pointer group"
                  title="Mening profilim"
                >
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center overflow-hidden shrink-0 text-amber-400">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                  </span>
                  <span className="hidden sm:flex flex-col items-start min-w-0 text-left">
                    <span className="text-[9px] font-black text-amber-400 leading-none uppercase tracking-wider">
                      O‘YINCHI
                    </span>
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[90px] leading-tight mt-0.5">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                  </span>
                </button>

                {/* Chiqish tugmasi */}
                <button
                  type="button"
                  onClick={onLogout}
                  title="Hisobdan chiqish"
                  aria-label="Hisobdan chiqish"
                  className="p-2 sm:p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};