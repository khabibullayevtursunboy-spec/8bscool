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
}) => {
  return (
    <header className="gaming-navbar sticky top-0 z-40">
      <div className="gaming-navbar-glow" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[68px] sm:min-h-[78px] gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="gaming-brand-mark" aria-hidden="true">
              <span>8</span>
              <span className="gaming-brand-mark-small">B</span>
              <div className="gaming-brand-mark-shine" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 leading-none">
                <span className="gaming-brand-name">8-SINF</span>
                <span className="gaming-brand-pill">
                  <Sparkles className="w-3 h-3" />
                  GAMING
                </span>
              </div>
              <div className="gaming-brand-caption mt-1.5">
                <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">INTELLEKTUAL ARENA</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {currentUser && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="gaming-coins-button"
                title="Sizning tangalaringiz"
                aria-label={`Profilingiz. Tangalar: ${currentUser.coins}`}
              >
                <span className="gaming-coins-icon"><Coins className="w-4 h-4" /></span>
                <span className="font-mono tabular-nums">{currentUser.coins}</span>
                <ChevronRight className="gaming-coins-chevron hidden sm:block w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Sozlamalar va Promokod"
              title="Sozlamalar va Promokod"
              className="gaming-icon-button"
            >
              <Settings className="w-[18px] h-[18px]" />
              <span className="hidden lg:inline">Sozlamalar</span>
            </button>

            {currentUser && (
              <>
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="gaming-profile-button"
                  title="Mening profilim"
                >
                  <span className="gaming-avatar">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-[18px] h-[18px]" />
                    )}
                  </span>
                  <span className="hidden sm:flex flex-col items-start min-w-0">
                    <span className="gaming-profile-label">O‘YINCHI</span>
                    <span className="gaming-profile-name truncate max-w-[100px]">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  title="Hisobdan chiqish"
                  aria-label="Hisobdan chiqish"
                  className="gaming-logout-button"
                >
                  <LogOut className="w-[17px] h-[17px]" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
