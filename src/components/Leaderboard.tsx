import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { Trophy, Coins, Award, Crown, Flame, Sparkles, User as UserIcon } from 'lucide-react';

interface LeaderboardProps {
  currentUser: User | null;
  onOpenProfile: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser, onOpenProfile }) => {
  const [metric, setMetric] = useState<'xp' | 'coins'>('xp');
  const users = StorageService.getUsers();

  const sortedUsers = [...users].sort((a, b) => {
    if (metric === 'xp') return b.xp - a.xp;
    return b.coins - a.coins;
  });

  const renderAvatar = (user: User) => {
    if (user.avatar) {
      return <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />;
    }
    return <span>{user.fullName.slice(0, 2).toUpperCase()}</span>;
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20 select-none">
      {/* Top Banner (Gaming Cyber Hero Banner) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-950 rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl shadow-amber-500/10">
        {/* Background Decorative Glow Effects */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Intellektual Arena Reytingi
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 tracking-tight mb-3">
            29-MAKTAB PESHQADAMLARI
          </h2>
          <p className="text-xs sm:text-sm text-slate-300/90 font-medium leading-relaxed">
            Viktorinalar, 1v1 multiplayer janglar va o'qituvchilarni xolis baholash orqali to'plangan umumiy natijalar bo'yicha maktabimizning eng kuchli o'quvchilari!
          </p>
        </div>
      </div>

      {/* Metric Selector Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-lg w-full sm:w-auto">
          <button
            onClick={() => setMetric('xp')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
              metric === 'xp'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-4 h-4" />
            ENG YUQORI XP & DARAJA
          </button>
          <button
            onClick={() => setMetric('coins')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
              metric === 'coins'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Coins className="w-4 h-4" />
            ENG KO'P COINLAR
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
          <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
          <span>Jami faol o'quvchilar: <strong className="text-amber-400 font-mono">{users.length}</strong> nafar</span>
        </div>
      </div>

      {/* Podium Top 3 */}
      {sortedUsers.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 md:gap-6 pt-8 pb-4 items-end">
          {/* Rank 2 - Silver */}
          <div className="relative group p-4 md:p-6 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-slate-700/60 hover:border-slate-400/50 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center">
            <div className="absolute -top-4 w-8 h-8 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-lg shadow-slate-500/30 border border-white/40">
              2
            </div>
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 text-slate-200 overflow-hidden flex items-center justify-center font-bold text-base mb-3 mt-2 border-2 border-slate-400/60 shadow-lg group-hover:scale-105 transition-transform">
              {renderAvatar(sortedUsers[1])}
            </div>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-100 truncate max-w-[120px]">
              {sortedUsers[1].fullName}
            </h4>
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold mb-3">{sortedUsers[1].grade}</span>
            <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 font-mono font-black text-xs text-slate-300 shadow-inner">
              {metric === 'xp' ? `${sortedUsers[1].xp} XP` : `${sortedUsers[1].coins} Coin`}
            </div>
          </div>

          {/* Rank 1 - Champion Gold */}
          <div className="relative group p-5 md:p-8 bg-gradient-to-b from-amber-500/10 via-slate-900/90 to-slate-950 backdrop-blur-xl rounded-3xl border-2 border-amber-400/80 text-center shadow-2xl shadow-amber-500/20 -translate-y-3 transition-all duration-300 hover:-translate-y-4 flex flex-col items-center">
            {/* Glow effect behind rank 1 */}
            <div className="absolute inset-0 bg-amber-500/10 rounded-3xl blur-xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
            
            <div className="relative -top-7 w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/40 border border-amber-200 animate-pulse">
              <Crown className="w-6 h-6 fill-slate-950" />
            </div>

            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/20 text-amber-300 overflow-hidden flex items-center justify-center font-bold text-xl mb-3 border-2 border-amber-400 shadow-xl group-hover:scale-105 transition-transform">
              {renderAvatar(sortedUsers[0])}
            </div>
            <h4 className="font-black text-sm sm:text-base text-white truncate max-w-[140px] drop-shadow-sm">
              {sortedUsers[0].fullName}
            </h4>
            <span className="text-xs text-amber-400/90 font-bold mb-3">{sortedUsers[0].grade}</span>
            <div className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-mono font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20">
              {metric === 'xp' ? `${sortedUsers[0].xp} XP` : `${sortedUsers[0].coins} Coin`}
            </div>
          </div>

          {/* Rank 3 - Bronze */}
          <div className="relative group p-4 md:p-6 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-amber-900/50 hover:border-amber-700/50 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center">
            <div className="absolute -top-4 w-8 h-8 rounded-xl bg-gradient-to-br from-amber-700 to-orange-900 text-amber-100 flex items-center justify-center font-black text-xs shadow-lg shadow-orange-900/40 border border-amber-600/40">
              3
            </div>
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 text-amber-200 overflow-hidden flex items-center justify-center font-bold text-base mb-3 mt-2 border-2 border-amber-700/60 shadow-lg group-hover:scale-105 transition-transform">
              {renderAvatar(sortedUsers[2])}
            </div>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-100 truncate max-w-[120px]">
              {sortedUsers[2].fullName}
            </h4>
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold mb-3">{sortedUsers[2].grade}</span>
            <div className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 font-mono font-black text-xs text-amber-400 shadow-inner">
              {metric === 'xp' ? `${sortedUsers[2].xp} XP` : `${sortedUsers[2].coins} Coin`}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div className="divide-y divide-slate-800/60">
          {sortedUsers.map((user, index) => {
            const isMe = currentUser?.id === user.id;

            return (
              <div
                key={user.id}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-300 ${
                  isMe
                    ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-l-4 border-l-amber-500'
                    : 'hover:bg-slate-850/60'
                }`}
              >
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <span className={`font-mono font-black text-sm w-7 text-center shrink-0 ${
                    index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    #{index + 1}
                  </span>

                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700/80 overflow-hidden flex items-center justify-center text-xs font-bold shrink-0 shadow-md">
                    {renderAvatar(user)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-slate-100 truncate">
                        {user.fullName}
                      </span>
                      {isMe && (
                        <span className="text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                          Siz
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mt-1">
                      <span className="text-slate-300">{user.grade}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-amber-400/90">{user.badges.length} ta nishon</span>
                      {user.stats?.duelsWon > 0 && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-emerald-400">{user.stats.duelsWon} ta g'alaba</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-black text-sm sm:text-base text-white">
                    {metric === 'xp' ? `${user.xp} XP` : `${user.coins} Coin`}
                  </div>
                  <div className="text-[11px] font-bold text-amber-500/80 mt-0.5">
                    {metric === 'xp' ? `Daraja ${user.level}` : `${user.xp} XP`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};