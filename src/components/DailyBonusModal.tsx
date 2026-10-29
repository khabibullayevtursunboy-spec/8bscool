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
  Clock
} from 'lucide-react';

interface DailyBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onClaimed: (updatedUser: User) => void;
}

const REWARDS_TRACK = [
  { day: 1, coins: 30, xp: 25, label: "1-kun" },
  { day: 2, coins: 50, xp: 45, label: "2-kun" },
  { day: 3, coins: 80, xp: 70, label: "3-kun" },
  { day: 4, coins: 120, xp: 100, label: "4-kun" },
  { day: 5, coins: 160, xp: 140, label: "5-kun" },
  { day: 6, coins: 200, xp: 180, label: "6-kun" },
  { day: 7, coins: 300, xp: 250, label: "7-kun Super" }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white overflow-hidden shadow-md">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <button
            onClick={onClose}
            aria-label="Yopish"
            className="absolute top-4 right-4 p-2 rounded-2xl text-white/80 hover:text-white hover:bg-white/15 transition-all cursor-pointer hover:rotate-90 duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Gift className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-tight">
                  O'quvchilar Kunlik Bonusi
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-white/25 backdrop-blur-sm text-white flex items-center gap-1 border border-white/20 shadow-xs">
                  <Flame className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200 animate-pulse" />
                  {streak} kunlik streak
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-1 font-medium">
                Har kuni platformaga kiring va bepul Coin hamda XP to'plang!
              </p>
            </div>
          </div>
        </div>

        {/* Claim notice */}
        {claimedNotice && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fadeIn">
            <div className="p-1 bg-emerald-500 text-white rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>{claimedNotice}</span>
          </div>
        )}

        {/* 7-Day Ladder Track */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {REWARDS_TRACK.map((rw) => {
              const isToday = rw.day === currentDay;
              const isPassed = rw.day < currentDay || (!canClaim && rw.day === currentDay);

              return (
                <div
                  key={rw.day}
                  className={`relative p-2.5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-between min-h-[105px] ${
                    isToday && canClaim
                      ? 'bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-amber-500/15 dark:from-amber-950/40 dark:to-orange-950/30 border-amber-500 ring-2 ring-amber-400/50 shadow-md scale-105'
                      : isPassed
                      ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 opacity-70 grayscale-[0.2]'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {rw.label}
                  </span>

                  <div className="my-1.5 flex items-center justify-center">
                    {isPassed ? (
                      <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : isToday ? (
                      <div className="p-2 bg-amber-500/15 text-amber-500 rounded-xl shadow-xs">
                        <Gift className="w-5 h-5 animate-pulse" />
                      </div>
                    ) : (
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-700/50 text-slate-400 rounded-xl">
                        <Coins className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 block">
                      +{rw.coins}
                    </span>
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 block bg-blue-500/10 px-1 py-0.5 rounded">
                      +{rw.xp} XP
                    </span>
                  </div>

                  {isToday && canClaim && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <div className="pt-1">
            {canClaim ? (
              <button
                type="button"
                onClick={handleClaim}
                disabled={animating}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bugungi {currentDay}-kunlik bonusni olish!</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-1 shadow-xs">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>Bugungi bonus muvaffaqiyatli qabul qilingan!</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Ertaga yana kiring va keyingi kattaroq bonusni oching!
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};