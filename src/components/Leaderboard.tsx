import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { Trophy, Coins, Award, Crown, Medal, User as UserIcon } from 'lucide-react';

interface LeaderboardProps {
  currentUser: User | null;
  onOpenProfile: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
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
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">
            Intellektual Reyting
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1 mb-2">
            29-Maktab Peshqadamlari
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            Viktorinalar, 1v1 multiplayer janglar va o'qituvchilarni xolis baholash orqali to'plangan umumiy natijalar bo'yicha maktabimizning eng faol o'quvchilari!
          </p>
        </div>
      </div>

      {/* Metric Selector Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setMetric('xp')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              metric === 'xp'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Eng Yuqori XP & Daraja
          </button>
          <button
            onClick={() => setMetric('coins')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              metric === 'coins'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            Eng Ko'p Coinlar
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Jami faol o'quvchilar: {users.length} nafar
        </span>
      </div>

      {/* Podium Top 3 */}
      {sortedUsers.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 md:gap-6 pt-4 pb-2 items-end">
          {/* Rank 2 */}
          <div className="p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 mb-2">
              2
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white overflow-hidden flex items-center justify-center font-bold text-sm mb-2">
              {renderAvatar(sortedUsers[1])}
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[120px]">
              {sortedUsers[1].fullName}
            </h4>
            <span className="text-xs text-slate-500 mb-2">{sortedUsers[1].grade}</span>
            <div className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
              {metric === 'xp' ? `${sortedUsers[1].xp} XP` : `${sortedUsers[1].coins} Coin`}
            </div>
          </div>

          {/* Rank 1 */}
          <div className="p-5 md:p-8 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 rounded-3xl border-2 border-amber-400 dark:border-amber-600/60 text-center shadow-md flex flex-col items-center -translate-y-2">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-extrabold text-sm mb-2 shadow-sm">
              <Crown className="w-5 h-5 fill-amber-950" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white overflow-hidden flex items-center justify-center font-bold text-base mb-2 shadow-sm">
              {renderAvatar(sortedUsers[0])}
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-[140px]">
              {sortedUsers[0].fullName}
            </h4>
            <span className="text-xs text-slate-500 mb-2 font-medium">{sortedUsers[0].grade}</span>
            <div className="font-mono font-extrabold text-sm sm:text-base text-amber-600 dark:text-amber-400">
              {metric === 'xp' ? `${sortedUsers[0].xp} XP` : `${sortedUsers[0].coins} Coin`}
            </div>
          </div>

          {/* Rank 3 */}
          <div className="p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold text-xs mb-2">
              3
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white overflow-hidden flex items-center justify-center font-bold text-sm mb-2">
              {renderAvatar(sortedUsers[2])}
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[120px]">
              {sortedUsers[2].fullName}
            </h4>
            <span className="text-xs text-slate-500 mb-2">{sortedUsers[2].grade}</span>
            <div className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
              {metric === 'xp' ? `${sortedUsers[2].xp} XP` : `${sortedUsers[2].coins} Coin`}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {sortedUsers.map((user, index) => {
            const isMe = currentUser?.id === user.id;

            return (
              <div
                key={user.id}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  isMe ? 'bg-blue-50/70 dark:bg-blue-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="font-mono font-bold text-sm text-slate-400 w-6 text-center shrink-0">
                    #{index + 1}
                  </span>

                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white overflow-hidden flex items-center justify-center text-xs font-bold shrink-0">
                    {renderAvatar(user)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {user.fullName}
                      </span>
                      {isMe && (
                        <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                          Siz
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{user.grade}</span>
                      <span>•</span>
                      <span>{user.badges.length} ta nishon</span>
                      {user.stats?.duelsWon > 0 && (
                        <>
                          <span>•</span>
                          <span>{user.stats.duelsWon} ta g'alaba</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    {metric === 'xp' ? `${user.xp} XP` : `${user.coins} Coin`}
                  </div>
                  <div className="text-[11px] text-slate-400">
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
