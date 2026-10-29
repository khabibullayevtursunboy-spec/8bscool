import React, { useState, useRef } from 'react';
import { SiteSettings } from '../types';
import { Shield, KeyRound, X } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onAdminUnlocked: () => void;
  setActiveTab: (tab: 'home' | 'multiplayer' | 'teachers' | 'leaderboard') => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onAdminUnlocked, setActiveTab }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const clickTimerRef = useRef<any>(null);

  // 4 rapid clicks on "8B" triggers password prompt
  const handleSecretClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      
      if (newCount >= 4) {
        setShowPasswordModal(true);
        setPasswordInput('');
        setPasswordError(false);
        return 0;
      }

      // Reset if not clicked 4 times within 2.5s
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2500);

      return newCount;
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '29maktab') {
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError(false);
      onAdminUnlocked();
    } else {
      setPasswordError(true);
    }
  };

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand & Motto */}
          <div className="text-center md:text-left">
            <div className="font-display font-bold text-base text-slate-900 dark:text-white">
              {settings.schoolName}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
              {settings.motto}
            </p>
          </div>

          {/* Center: Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <button 
              onClick={() => setActiveTab('home')} 
              className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              Bosh sahifa
            </button>
            <button 
              onClick={() => setActiveTab('multiplayer')} 
              className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              Multiplayer Viktorina
            </button>
            <button 
              onClick={() => setActiveTab('teachers')} 
              className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              Ustozlarni Baholash
            </button>
            <button 
              onClick={() => setActiveTab('leaderboard')} 
              className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              Reyting
            </button>
          </div>

          {/* Right: Copyright info */}
          <div className="text-xs text-slate-500 text-center md:text-right">
            {settings.footerText}
          </div>
        </div>

        {/* Bottom Bar with inconspicuous "8B" plain text (No buttons, plain gray text) */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 select-none">
          <span>O'zbekiston Respublikasi Xalq Ta'limi Vazirligi tasarrufidagi 29-sonli maktab</span>
          
          {/* Secret Made in Tursunboy / 8B trigger */}
          <div className="flex items-center gap-2">
            <span
              onClick={handleSecretClick}
              className="text-slate-400 dark:text-slate-500 font-medium cursor-pointer select-none text-xs hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title=""
            >
              Made in Tursunboy
            </span>
            <span
              onClick={handleSecretClick}
              className="text-slate-300 dark:text-slate-700 font-mono tracking-wider cursor-pointer select-none text-[10px]"
            >
              (8B)
            </span>
          </div>
        </div>
      </div>

      {/* Secret Password Modal (Triggered ONLY after 4 clicks on "8B") */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Admin Panel Paroli
                </h4>
                <p className="text-[11px] text-slate-500">
                  Davom etish uchun maxsus parolni kiriting
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="masalan: Khabibullayev"
                  autoFocus
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  *(masalan: Khabibullayev bu misol tariqasida yozilgan, parol emas)*
                </p>
                {passwordError && (
                  <p className="text-xs text-red-500 mt-1">
                    Parol noto'g'ri!
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Kirish
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
};
