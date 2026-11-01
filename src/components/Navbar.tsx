import React from 'react';
import type { User, SiteSettings } from '../types';
import {
  Coins,
  Settings,
  UserRound,
  LogOut,
  Sparkles,
  Gamepad2,
  Moon,
  Sun,
  ChevronDown,
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
  onOpenProfile,
  onOpenSettings,
  onLogout,
  theme,
  toggleTheme,
}) => {
  // Turli User model nomlari bilan ham ishlashi uchun xavfsiz fallback.
  const user = currentUser as unknown as Record<string, unknown> | null;
  const displayName = String(
    user?.name ?? user?.full_name ?? user?.username ?? user?.firstName ?? 'O‘quvchi'
  );
  const coins = Number(user?.coins ?? user?.coin ?? user?.balance ?? 0);
  const initials = displayName.trim().slice(0, 1).toUpperCase() || 'O';

  return (
    <header className="nexus-navbar sticky top-0 z-40 w-full">
      <div className="nexus-navbar-inner mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-8">
        <button
          type="button"
          onClick={onOpenProfile}
          className="nexus-brand group flex min-w-0 items-center gap-3 text-left"
          aria-label="Profilni ochish"
        >
          <span className="nexus-brand-icon relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl">
            <Gamepad2 className="h-6 w-6" strokeWidth={2.3} />
            <span className="nexus-brand-spark"><Sparkles className="h-3.5 w-3.5" /></span>
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <span className="nexus-brand-title truncate">NEXUS</span>
              <span className="nexus-brand-version hidden sm:inline-flex">8B / ARENA</span>
            </span>
            <span className="nexus-brand-subtitle hidden xs:block">INTELLEKTUAL GAMING PLATFORM</span>
          </span>
        </button>

        <div className="nexus-actions flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="nexus-coin-pill" title={`${coins} coin`}>
            <span className="nexus-coin-icon"><Coins className="h-4 w-4" /></span>
            <span className="nexus-coin-value">{coins.toLocaleString('uz-UZ')}</span>
            <span className="nexus-coin-label hidden sm:inline">COIN</span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="nexus-icon-button"
            aria-label={theme === 'dark' ? 'Yorug‘ rejim' : 'Tungi rejim'}
            title={theme === 'dark' ? 'Yorug‘ rejim' : 'Tungi rejim'}
          >
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="nexus-icon-button hidden sm:grid"
            aria-label="Sozlamalar"
            title="Sozlamalar"
          >
            <Settings className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            className="nexus-profile-button"
            aria-label="Profil"
          >
            <span className="nexus-avatar">{initials}</span>
            <span className="hidden min-w-0 text-left md:block">
              <span className="block max-w-28 truncate text-[12px] font-extrabold">{displayName}</span>
              <span className="nexus-profile-caption">O‘QUVCHI PROFILI</span>
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 opacity-60 md:block" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="nexus-icon-button nexus-logout-button"
            aria-label="Tizimdan chiqish"
            title="Chiqish"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
      <div className="nexus-navbar-line" />
    </header>
  );
};
