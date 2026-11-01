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
  Wrench,
  ChevronRight,
  Flame
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn transition-all select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-4 border-slate-800 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col max-h-[92vh] transition-all">
        
        {/* Orqa fon porlashi (3D Glow) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-r from-blue-500/15 via-indigo-500/25 to-purple-500/15 blur-3xl pointer-events-none" />

        {/* 3D Header */}
        <div className="relative p-5 sm:p-6 border-b-2 border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white flex items-center justify-center shadow-[0_6px_15px_rgba(59,130,246,0.4)] border border-blue-400/40">
              <Settings className="w-6 h-6 animate-spin-slow text-blue-100" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-white leading-tight tracking-tight">
                Sozlamalar & Promokod
              </h3>
              <p className="text-xs text-blue-400 font-bold">
                8-Sinf Texnologiya fani portali
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Yopish"
            className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer hover:rotate-90 duration-200 shadow-inner border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar">

          {/* Theme Mode Switcher 3D Card */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border-2 border-slate-700/80 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner border border-amber-500/30">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
              </div>
              <div>
                <h4 className="text-xs font-black text-white">
                  Sayt Rejimi (Mavzu)
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  {theme === 'dark' ? 'Kechgi rejim (qorong\'i)' : 'Kunduzgi rejim (yorug\')'}
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-b from-slate-700 to-slate-800 active:translate-y-0.5 border-b-2 border-slate-950 text-white hover:brightness-110 transition-all cursor-pointer shadow-[0_4px_0_#020617]"
            >
              {theme === 'dark' ? 'Kunduzgiga' : 'Kechgiga'}
            </button>
          </div>

          {/* Promocode Activation Box 3D */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900 border-2 border-indigo-500/40 shadow-[0_8px_20px_rgba(99,102,241,0.15)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
                <Gift className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-white">
                Promokodni Faollashtirish
              </h4>
            </div>
            <p className="text-xs text-slate-300 mb-3.5 leading-relaxed font-medium">
              Ustoz tomonidan berilgan maxsus promokodni kiriting va bepul <strong className="text-amber-400">Coin & XP</strong> ballariga ega bo'ling!
            </p>

            <form onSubmit={handleClaimPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="MASALAN: TEXNO2026"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                className="flex-1 px-3.5 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-xs font-mono font-bold tracking-wider uppercase text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]"
              />
              <button
                type="submit"
                className="px-4.5 py-3 bg-gradient-to-b from-indigo-500 to-purple-700 active:translate-y-0.5 border-b-4 border-indigo-950 hover:brightness-110 text-white rounded-xl text-xs font-black shadow-[0_4px_0_#312e81] transition-all cursor-pointer whitespace-nowrap"
              >
                Faollashtirish
              </button>
            </form>

            {promoMsg && (
              <div className={`mt-3 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn border-2 ${
                promoMsg.type === 'success' 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_4px_12px_rgba(16,185,129,0.2)]' 
                  : 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-[0_4px_12px_rgba(244,63,94,0.2)]'
              }`}>
                {promoMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{promoMsg.text}</span>
              </div>
            )}
          </div>

          {/* Student Status Summary 3D */}
          {currentUser && (
            <div className="p-4 rounded-2xl bg-slate-800/80 border-2 border-slate-700/80 shadow-[0_4px_12px_rgba(0,0,0,0.3)] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400">O'quvchi:</span>
                <span className="font-black text-white">{currentUser.fullName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400">Sinf & Fan:</span>
                <span className="font-black text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 rounded-lg">8-B Sinf • Texnologiya</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400">Balans:</span>
                <span className="font-mono font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">{currentUser.coins} Coin | {currentUser.xp} XP</span>
              </div>
            </div>
          )}

          {/* School & Subject Info 3D Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border-2 border-blue-500/30 text-xs text-slate-300 space-y-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <p className="font-black text-blue-400 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-blue-400" />
              29-Maktab 8-Sinf Texnologiya Fani
            </p>
            <p className="leading-relaxed text-[11px] text-slate-400 font-medium">
              Tokarlik stanoklari, duradgorlik, chilangarlik, elektrotexnika va texnologik xaritalar bo'yicha interaktiv darslik va savol-javob maydoni.
            </p>
          </div>
        </div>

        {/* Footer: Contains "Made in Tursunboy" */}
        <div className="p-4 border-t-2 border-slate-800 bg-slate-950/80 flex flex-col items-center justify-center gap-1">
          <div
            onClick={handleTursunboyClick}
            className="text-xs font-black text-slate-400 hover:text-blue-400 transition-colors select-none cursor-pointer text-center py-1.5 px-4 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700"
            title="Texnologiya portali"
          >
            Made in Tursunboy
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            29-sonli umumiy o'rta ta'lim maktabi
          </span>
        </div>
      </div>

      {/* Admin Password Prompt Modal 3D */}
      {showAdminPrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-[2.5rem] border-4 border-rose-500/40 p-6 max-w-sm w-full shadow-[0_25px_50px_rgba(0,0,0,0.8)] relative">
            <button
              onClick={() => setShowAdminPrompt(false)}
              aria-label="Yopish"
              className="absolute top-4 right-4 p-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer hover:rotate-90 duration-200 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 text-white flex items-center justify-center shadow-[0_6px_15px_rgba(244,63,94,0.4)] border border-rose-400/40">
                <ShieldAlert className="w-6 h-6 text-rose-100" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-white">
                  Admin Panelga Kirish
                </h3>
                <p className="text-xs text-rose-400 font-bold">Boshqaruv parolini kiriting</p>
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
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border-2 border-slate-700 rounded-2xl text-sm font-bold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                </div>
                
                <p className="text-[11px] text-slate-400 mt-1.5 italic font-medium">
                  *(Maxsus admin parolini kiriting)*
                </p>

                {adminError && (
                  <p className="text-xs text-rose-300 mt-2 font-bold flex items-center gap-2 bg-rose-950/80 p-3 rounded-xl border-2 border-rose-600 shadow-[0_4px_12px_rgba(244,63,94,0.3)] animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    Noto'g'ri parol kiritildi!
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminPrompt(false)}
                  className="flex-1 py-3 text-xs font-black text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all cursor-pointer border border-slate-700 shadow-inner"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-black text-white bg-gradient-to-b from-rose-600 to-red-700 active:translate-y-0.5 border-b-4 border-rose-950 hover:brightness-110 rounded-2xl shadow-[0_4px_0_#881337] transition-all cursor-pointer"
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