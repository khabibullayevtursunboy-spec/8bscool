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
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-amber-500/20 shadow-2xl shadow-amber-500/5 transition-all duration-300">
      {/* Dynamic Background Glow Effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-purple-600/10 pointer-events-none" 
        aria-hidden="true" 
      />
      <div className="absolute -top-12 left-1/4 w-96 h-24 bg-amber-500/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand / Logo */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-3 cursor-pointer group shrink-0 select-none"
          >
            {/* Logo Mark */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center font-black text-slate-950 shadow-lg shadow-orange-500/20 group-hover:shadow-amber-500/40 group-hover:scale-105 transition-all duration-300 overflow-hidden border border-amber-200/40">
              <span className="text-xl font-black font-display tracking-tighter">8</span>
              <span className="text-sm font-black font-display text-amber-950">B</span>
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Logo Text */}
            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-2 leading-none">
                <span className="font-display font-black text-lg sm:text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-sm">
                  8-SINF
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 flex items-center gap-1 shadow-md shadow-amber-500/20 uppercase tracking-widest animate-pulse">
                  <Sparkles className="w-3 h-3 fill-slate-950 text-slate-950" />
                  GAMING
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-bold mt-1">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                <span className="truncate tracking-widest uppercase text-slate-400 group-hover:text-amber-300 transition-colors">
                  INTELLEKTUAL ARENA
                </span>
              </div>
            </div>
          </div>

          {/* Actions / Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Tangalar tugmasi (Coin Counter) */}
            {currentUser && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-amber-500/15 border border-amber-500/30 hover:border-amber-500/50 text-amber-400 font-bold text-xs sm:text-sm transition-all duration-300 active:scale-95 cursor-pointer shadow-md group"
                title="Sizning tangalaringiz"
                aria-label={`Profilingiz. Tangalar: ${currentUser.coins}`}
              >
                <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-inner">
                  <Coins className="w-4 h-4" />
                </span>
                <span className="font-mono font-black tracking-tight tabular-nums text-white group-hover:text-amber-300">
                  {currentUser.coins}
                </span>
                <ChevronRight className="hidden sm:block w-3.5 h-3.5 text-amber-400/60 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* Tema almashtirish tugmasi */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Mavzuni o'zgartirish"
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-amber-400 transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-slate-300" />
              )}
            </button>

            {/* Sozlamalar tugmasi */}
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Sozlamalar va Promokod"
              title="Sozlamalar va Promokod"
              className="flex items-center gap-2 p-2.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white font-semibold text-xs transition-all duration-200 active:scale-95 cursor-pointer shadow-md group"
            >
              <Settings className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform duration-300 text-slate-400 group-hover:text-white" />
              <span className="hidden lg:inline text-xs tracking-wide">Sozlamalar</span>
            </button>

            {/* Profil & Logout */}
            {currentUser && (
              <>
                {/* Profil tugmasi */}
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="flex items-center gap-2.5 p-1.5 sm:pr-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 text-white transition-all duration-200 active:scale-95 cursor-pointer group shadow-md"
                  title="Mening profilim"
                >
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center overflow-hidden shrink-0 text-amber-400 group-hover:scale-105 transition-transform">
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
                    <span className="text-[9px] font-black text-amber-400 leading-none uppercase tracking-widest">
                      O‘YINCHI
                    </span>
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[90px] leading-tight mt-0.5 group-hover:text-white">
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
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 hover:text-rose-300 transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};