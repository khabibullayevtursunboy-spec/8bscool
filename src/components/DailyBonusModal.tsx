import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { 
  X, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Coins, 
  Zap, 
  Calendar, 
  Flame, 
  Award,
  Clock,
  Star,
  ShieldCheck,
  Trophy
} from 'lucide-react';

interface DailyBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onClaimed: (updatedUser: User) => void;
}

const REWARDS_TRACK = [
  { day: 1, coins: 30, xp: 25, label: "1-kun", icon: Zap },
  { day: 2, coins: 50, xp: 45, label: "2-kun", icon: Coins },
  { day: 3, coins: 80, xp: 70, label: "3-kun", icon: Star },
  { day: 4, coins: 120, xp: 100, label: "4-kun", icon: ShieldCheck },
  { day: 5, coins: 160, xp: 140, label: "5-kun", icon: Award },
  { day: 6, coins: 200, xp: 180, label: "6-kun", icon: Trophy },
  { day: 7, coins: 300, xp: 250, label: "7-kun Super", icon: Gift }
];

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({
  isOpen,
  onClose,
  user,
  onClaimed
}) => {
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  if (!isOpen) return null;

  const canClaim = StorageService.canClaimDailyBonus(user);
  const currentDay = StorageService.getDailyBonusDay(user);
  const streak = user.dailyBonusStreak || 0;

  const handleClaim = () => {
    if (!canClaim || animating) return;

    setAnimating(true);
    const res = StorageService.claimDailyBonus(user.id);
    if (res.success) {
      setClaimedNotice(res.message);
      const updated = StorageService.getCurrentUser();
      if (updated) {
        onClaimed(updated);
      }
      setTimeout(() => {
        setAnimating(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-lg animate-fadeIn transition-all duration-300">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-amber-500/20 dark:border-amber-500/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col transition-all transform animate-scaleUp">
        
        {/* Orqa fon porlashi (Glow effect) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-yellow-500/25 blur-3xl pointer-events-none" />

        {/* Header qismi */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white overflow-hidden shadow-lg">
          {/* Geometrik bezaklar */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
          <div className="absolute -left-8 -top-8 w-24 h-24 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />

          <button
            onClick={onClose}
            aria-label="Yopish"
            className="absolute top-4 right-4 p-2.5 rounded-2xl text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer hover:rotate-90 duration-300 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white shrink-0 shadow-inner transform hover:scale-105 transition-transform">
              <Gift className="w-7 h-7 animate-bounce text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight drop-shadow-sm">
                  Kunlik Bonuslar
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/25 backdrop-blur-md text-white flex items-center gap-1.5 border border-white/30 shadow-sm animate-pulse">
                  <Flame className="w-4 h-4 text-yellow-200 fill-yellow-200" />
                  {streak} kunlik streak
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 mt-1 font-medium leading-relaxed">
                Har kuni kiring, sovg'alarni yig'ing va bilimingizni oshiring!
              </p>
            </div>
          </div>
        </div>

        {/* Xabarnoma */}
        {claimedNotice && (
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold flex items-center gap-3 animate-bounce">
            <div className="p-1.5 bg-emerald-500 text-white rounded-xl shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span>{claimedNotice}</span>
          </div>
        )}

        {/* 7-Kunlik Bonuslar Tarmoqi (Grid) */}
        <div className="p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
            {REWARDS_TRACK.map((rw) => {
              const isToday = rw.day === currentDay;
              const isPassed = rw.day < currentDay || (!canClaim && rw.day === currentDay);
              const IconComponent = rw.icon;

              return (
                <div
                  key={rw.day}
                  className={`relative p-3 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-between min-h-[120px] group ${
                    isToday && canClaim
                      ? 'bg-gradient-to-b from-amber-500/15 via-orange-500/10 to-amber-500/20 dark:from-amber-950/60 dark:to-orange-950/40 border-amber-500 ring-4 ring-amber-400/30 shadow-xl scale-105 z-10'
                      : isPassed
                      ? 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-amber-400/50 hover:shadow-md'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {rw.label}
                  </span>

                  <div className="my-2 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                    {isPassed ? (
                      <div className="p-2 bg-emerald-500/15 text-emerald-500 rounded-xl shadow-inner">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    ) : isToday ? (
                      <div className="p-2.5 bg-amber-500/20 text-amber-500 rounded-2xl shadow-md animate-pulse">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="p-2 bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-400 rounded-xl">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 w-full">
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 block tracking-tight">
                      +{rw.coins}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block bg-blue-500/10 py-0.5 rounded-lg">
                      +{rw.xp} XP
                    </span>
                  </div>

                  {isToday && canClaim && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-rose-500 rounded-full animate-ping shadow-lg" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Tugma va Holat */}
          <div className="pt-2">
            {canClaim ? (
              <button
                type="button"
                onClick={handleClaim}
                disabled={animating}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-base rounded-2xl shadow-xl shadow-orange-500/30 transition-all cursor-pointer flex items-center justify-center gap-2.5 transform active:scale-95 duration-200 group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Bugungi {currentDay}-kunlik bonusni olish!</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-1.5 shadow-sm">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-emerald-500 animate-spin" />
                  <span>Bugungi bonus muvaffaqiyatli olindi!</span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Ertaga yana tashrif buyuring va navbatdagi mukofotga ega bo'ling!
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};