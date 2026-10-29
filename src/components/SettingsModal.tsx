import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { 
  X, 
  Settings, 
  Sun, 
  Moon, 
  Gift, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  KeyRound, 
  Sparkles,
  User as UserIcon,
  Wrench
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserUpdated?: (user: User) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenAdmin: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  theme,
  toggleTheme,
  onOpenAdmin
}) => {
  // Promocode state
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Hidden admin click counter on "Made in Tursunboy"
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState(false);

  if (!isOpen) return null;

  // Handle promo claim
  const handleClaimPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    if (!currentUser) {
      setPromoMsg({ type: 'error', text: 'Avval akkauntingizga kiring!' });
      return;
    }

    const res = StorageService.claimPromo(promoInput.trim(), currentUser.id);
    if (res.success) {
      setPromoMsg({ type: 'success', text: res.message });
      setPromoInput('');
      const updated = StorageService.getCurrentUser();
      if (updated && onUserUpdated) {
        onUserUpdated(updated);
      }
    } else {
      setPromoMsg({ type: 'error', text: res.message });
    }
  };

  // 4 rapid clicks on "Made in Tursunboy" triggers admin prompt!
  const handleTursunboyClick = () => {
    const now = Date.now();
    if (now - lastClickTime > 2500) {
      setClickCount(1);
      setLastClickTime(now);
    } else {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      setLastClickTime(now);

      if (newCount >= 4) {
        setClickCount(0);
        setShowAdminPrompt(true);
        setAdminPassword('');
        setAdminError(false);
      }
    }
  };

  // Submit admin password
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '29maktab') {
      setShowAdminPrompt(false);
      setAdminPassword('');
      setAdminError(false);
      onClose();
      onOpenAdmin();
    } else {
      setAdminError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-r from-blue-500/10 via-indigo-500/20 to-purple-500/10 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="relative p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-850 dark:to-slate-900">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight tracking-tight">
                Sozlamalar & Promokod
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                8-Sinf Texnologiya fani portali
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Yopish"
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer hover:rotate-90 duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar">

          {/* Theme Mode Switcher */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-xs">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Sayt Rejimi (Mavzu)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {theme === 'dark' ? 'Kechgi rejim (qorong\'i)' : 'Kunduzgi rejim (yorug\')'}
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {theme === 'dark' ? 'Kunduzgiga' : 'Kechgiga'}
            </button>
          </div>

          {/* Promocode Activation Box */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/80 dark:border-indigo-900/40 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Gift className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Promokodni Faollashtirish
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3.5 leading-relaxed font-medium">
              Ustoz tomonidan berilgan maxsus promokodni kiriting va bepul **Coin & XP** ballariga ega bo'ling!
            </p>

            <form onSubmit={handleClaimPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="MASALAN: TEXNO2026"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold tracking-wider uppercase text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-xs"
              />
              <button
                type="submit"
                className="px-4.5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                Faollashtirish
              </button>
            </form>

            {promoMsg && (
              <div className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
                promoMsg.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}>
                {promoMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{promoMsg.text}</span>
              </div>
            )}
          </div>

          {/* Student Status Summary */}
          {currentUser && (
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">O'quvchi:</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentUser.fullName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Sinf & Fan:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">8-B Sinf • Texnologiya</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Balans:</span>
                <span className="font-mono font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">{currentUser.coins} Coin | {currentUser.xp} XP</span>
              </div>
            </div>
          )}

          {/* School & Subject Info */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 shadow-xs">
            <p className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Wrench className="w-4 h-4" />
              29-Maktab 8-Sinf Texnologiya Fani
            </p>
            <p className="leading-relaxed text-[11px] opacity-90">
              Tokarlik stanoklari, duradgorlik, chilangarlik, elektrotexnika va texnologik xaritalar bo'yicha interaktiv darslik va savol-javob maydoni.
            </p>
          </div>
        </div>

        {/* Footer: Contains "Made in Tursunboy" (Click 4 times to unlock Admin!) */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 flex flex-col items-center justify-center gap-1">
          <div
            onClick={handleTursunboyClick}
            className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none cursor-pointer text-center py-1.5 px-3 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            title="Texnologiya portali"
          >
            Made in Tursunboy
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            29-sonli umumiy o'rta ta'lim maktabi
          </span>
        </div>
      </div>

      {/* Admin Password Prompt Modal (Activated by 4 clicks on "Made in Tursunboy") */}
      {showAdminPrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowAdminPrompt(false)}
              aria-label="Yopish"
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer hover:rotate-90 duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shadow-xs">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
                  Admin Panelga Kirish
                </h3>
                <p className="text-xs text-slate-500 font-medium">Boshqaruv parolini kiriting</p>
              </div>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    placeholder="Parolni kiriting..."
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError(false);
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all shadow-xs"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                
                <p className="text-[11px] text-slate-400 mt-1.5 italic font-medium">
                  *(Maxsus admin parolini kiriting)*
                </p>

                {adminError && (
                  <p className="text-xs text-rose-500 mt-2 font-bold flex items-center gap-1.5 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Noto'g'ri parol kiritildi!
                  </p>
                )}
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminPrompt(false)}
                  className="flex-1 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  Kirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};