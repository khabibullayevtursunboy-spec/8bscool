import React, { useMemo, useState } from 'react';
import type { User } from '../types';
import { StorageService } from '../services/storage';
import {
  Trophy,
  Coins,
  Award,
  Crown,
  Flame,
  Sparkles,
  Medal,
  Star,
  TrendingUp,
  Users,
  Zap,
  ChevronUp,
  Target,
  ShieldCheck,
} from 'lucide-react';

interface LeaderboardProps {
  currentUser: User | null;
  onOpenProfile: () => void;
}

type Metric = 'xp' | 'coins';

const formatNumber = (value: number) =>
  new Intl.NumberFormat('uz-UZ').format(Number(value) || 0);

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentUser,
  onOpenProfile,
}) => {
  const [metric, setMetric] = useState<Metric>('xp');
  const users = StorageService.getUsers();

  const sortedUsers = useMemo(
    () =>
      [...users].sort((a, b) => {
        const difference =
          metric === 'xp' ? (b.xp || 0) - (a.xp || 0) : (b.coins || 0) - (a.coins || 0);
        return difference || a.fullName.localeCompare(b.fullName);
      }),
    [users, metric]
  );

  const topThree = sortedUsers.slice(0, 3);
  const currentIndex = sortedUsers.findIndex((user) => user.id === currentUser?.id);
  const currentRank = currentIndex >= 0 ? currentIndex + 1 : null;
  const totalXp = users.reduce((sum, user) => sum + (user.xp || 0), 0);
  const totalCoins = users.reduce((sum, user) => sum + (user.coins || 0), 0);

  const renderAvatar = (user: User, size: 'small' | 'large' = 'small') => {
    const dimension = size === 'large' ? 'h-full w-full' : 'h-full w-full';
    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={`${user.fullName} avatari`}
          className={`${dimension} object-cover`}
        />
      );
    }
    return (
      <span className="flex h-full w-full items-center justify-center">
        {(user.fullName || '?').trim().slice(0, 2).toUpperCase()}
      </span>
    );
  };

  const scoreOf = (user: User) =>
    metric === 'xp' ? `${formatNumber(user.xp)} XP` : `${formatNumber(user.coins)} COIN`;

  const podiumStyles = [
    {
      rank: 2,
      shell: 'leaderboard-second',
      avatar: 'border-slate-300/70 shadow-slate-400/10',
      medal: 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900',
      label: 'KUMUSH',
      icon: Medal,
    },
    {
      rank: 1,
      shell: 'leaderboard-first',
      avatar: 'border-amber-300 shadow-amber-400/20',
      medal: 'bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 text-amber-950',
      label: 'CHEMPION',
      icon: Crown,
    },
    {
      rank: 3,
      shell: 'leaderboard-third',
      avatar: 'border-orange-500/70 shadow-orange-500/10',
      medal: 'bg-gradient-to-br from-orange-500 to-amber-800 text-white',
      label: 'BRONZA',
      icon: Award,
    },
  ];

  const podiumUsers = [topThree[1], topThree[0], topThree[2]];

  return (
    <div className="leaderboard-page animate-fadeIn space-y-7 pb-24">
      {/* HERO */}
      <section className="leaderboard-hero relative isolate overflow-hidden rounded-[30px] sm:rounded-[36px]">
        <div className="leaderboard-orb leaderboard-orb-one" />
        <div className="leaderboard-orb leaderboard-orb-two" />
        <div className="leaderboard-grid-pattern" />
        <div className="leaderboard-hero-content relative z-10">
          <div className="leaderboard-kicker">
            <span className="leaderboard-kicker-icon"><Sparkles className="h-3.5 w-3.5" /></span>
            29-MAKTAB • NEXUS ARENA
          </div>
          <div className="max-w-3xl">
            <p className="leaderboard-overline">BILIM. MAHORAT. G‘ALABA.</p>
            <h1 className="leaderboard-title">
              PESHQADAMLAR
              <span> REYTINGI</span>
            </h1>
            <p className="leaderboard-description">
              Har bir to‘g‘ri javob, har bir duel va har bir yutuq seni yuqoriga olib chiqadi.
              O‘z natijangni kuzat va keyingi marrani zabt et!
            </p>
          </div>
          <div className="leaderboard-hero-bottom">
            <div className="leaderboard-live-tag"><span /> REYTING YANGILANIB BORADI</div>
            {currentUser && (
              <button type="button" onClick={onOpenProfile} className="leaderboard-my-profile">
                Profilimni ko‘rish <ChevronUp className="h-4 w-4 rotate-90" />
              </button>
            )}
          </div>
        </div>
        <div className="leaderboard-hero-emblem" aria-hidden="true">
          <div className="leaderboard-emblem-ring">
            <div className="leaderboard-emblem-core"><Trophy className="h-14 w-14 sm:h-20 sm:w-20" /></div>
          </div>
          <span className="leaderboard-emblem-star star-a"><Star /></span>
          <span className="leaderboard-emblem-star star-b"><Sparkles /></span>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="leaderboard-stats-grid">
        <div className="leaderboard-stat-card">
          <span className="leaderboard-stat-icon violet"><Users /></span>
          <div><p>Faol o‘quvchilar</p><strong>{formatNumber(users.length)}</strong></div>
          <span className="leaderboard-stat-note">ishtirokchi</span>
        </div>
        <div className="leaderboard-stat-card">
          <span className="leaderboard-stat-icon cyan"><Zap /></span>
          <div><p>Jami tajriba</p><strong>{formatNumber(totalXp)}</strong></div>
          <span className="leaderboard-stat-note">XP to‘plangan</span>
        </div>
        <div className="leaderboard-stat-card">
          <span className="leaderboard-stat-icon amber"><Coins /></span>
          <div><p>Jami mukofot</p><strong>{formatNumber(totalCoins)}</strong></div>
          <span className="leaderboard-stat-note">coin yig‘ilgan</span>
        </div>
      </section>

      {/* CURRENT USER CARD */}
      {currentUser && (
        <section className="leaderboard-you-card">
          <div className="leaderboard-you-symbol"><Target className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1">
            <p>SENING NATIJANG</p>
            <h3>{currentUser.fullName}</h3>
            <span>{currentUser.grade || 'O‘quvchi'} • {formatNumber(currentUser.xp)} XP</span>
          </div>
          <div className="leaderboard-you-rank">
            <span>O‘RIN</span>
            <strong>{currentRank ? `#${currentRank}` : '—'}</strong>
          </div>
          <button type="button" onClick={onOpenProfile} className="leaderboard-you-action">
            <ChevronUp className="h-4 w-4 rotate-90" />
          </button>
        </section>
      )}

      {/* SELECTOR */}
      <section className="leaderboard-section-heading">
        <div>
          <div className="leaderboard-section-eyebrow"><TrendingUp className="h-3.5 w-3.5" /> GLOBAL STANDINGS</div>
          <h2>Eng faol o‘yinchilar</h2>
          <p>Natijalarni XP yoki coin bo‘yicha saralang</p>
        </div>
        <div className="leaderboard-switch" role="group" aria-label="Reyting turini tanlash">
          <button
            type="button"
            onClick={() => setMetric('xp')}
            className={metric === 'xp' ? 'active' : ''}
            aria-pressed={metric === 'xp'}
          >
            <Award className="h-4 w-4" /> XP reyting
          </button>
          <button
            type="button"
            onClick={() => setMetric('coins')}
            className={metric === 'coins' ? 'active' : ''}
            aria-pressed={metric === 'coins'}
          >
            <Coins className="h-4 w-4" /> Coin reyting
          </button>
        </div>
      </section>

      {/* PODIUM */}
      {topThree.length > 0 && (
        <section className="leaderboard-podium-wrap">
          <div className="leaderboard-podium-heading">
            <span className="leaderboard-podium-heading-icon"><Crown className="h-4 w-4" /></span>
            TOP {Math.min(topThree.length, 3)} • SHOH SUPASI
          </div>
          <div className="leaderboard-podium">
            {podiumUsers.map((user, index) => {
              if (!user) return <div key={`empty-${index}`} className="leaderboard-podium-empty" />;
              const style = podiumStyles[index];
              const Icon = style.icon;
              const isMe = currentUser?.id === user.id;
              return (
                <article key={user.id} className={`leaderboard-podium-card ${style.shell} ${isMe ? 'is-me' : ''}`}>
                  <div className={`leaderboard-podium-medal ${style.medal}`}>
                    {index === 1 ? <Crown className="h-5 w-5 fill-current" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <div className={`leaderboard-podium-avatar ${style.avatar}`}>
                    {renderAvatar(user, 'large')}
                  </div>
                  <div className="leaderboard-podium-rank">0{style.rank}</div>
                  <h3 title={user.fullName}>{user.fullName}</h3>
                  <p>{user.grade || 'O‘quvchi'}</p>
                  <div className="leaderboard-podium-score">{scoreOf(user)}</div>
                  <span className="leaderboard-podium-label">{style.label}</span>
                  {isMe && <span className="leaderboard-me-chip">BU SIZ</span>}
                </article>
              );
            })}
          </div>
          <div className="leaderboard-podium-base"><span>THE NEXUS CHAMPIONS</span></div>
        </section>
      )}

      {/* FULL LIST */}
      <section className="leaderboard-list-panel">
        <div className="leaderboard-list-header">
          <div>
            <div className="leaderboard-section-eyebrow"><ShieldCheck className="h-3.5 w-3.5" /> TO‘LIQ JADVAL</div>
            <h2>Barcha ishtirokchilar</h2>
          </div>
          <span className="leaderboard-count">{sortedUsers.length} ta o‘quvchi</span>
        </div>

        {sortedUsers.length === 0 ? (
          <div className="leaderboard-empty">
            <span><Trophy className="h-8 w-8" /></span>
            <h3>Reyting hozircha bo‘sh</h3>
            <p>Birinchi bo‘lib o‘yin yoki testda qatnashing!</p>
          </div>
        ) : (
          <div className="leaderboard-table">
            <div className="leaderboard-table-labels">
              <span>O‘RIN</span><span>ISHTIROKCHI</span><span>{metric === 'xp' ? 'TAJRIBA' : 'COIN'}</span>
            </div>
            {sortedUsers.map((user, index) => {
              const isMe = currentUser?.id === user.id;
              const isTop = index < 3;
              return (
                <article key={user.id} className={`leaderboard-row ${isMe ? 'is-me' : ''}`}>
                  <div className={`leaderboard-row-rank rank-${index + 1}`}>
                    {index === 0 ? <Crown className="h-4 w-4" /> : `#${index + 1}`}
                  </div>
                  <div className="leaderboard-row-person">
                    <div className={`leaderboard-row-avatar ${isTop ? `top-${index + 1}` : ''}`}>
                      {renderAvatar(user)}
                    </div>
                    <div className="min-w-0">
                      <div className="leaderboard-row-name">
                        <strong title={user.fullName}>{user.fullName}</strong>
                        {isMe && <span className="leaderboard-you-tag">SIZ</span>}
                      </div>
                      <div className="leaderboard-row-meta">
                        <span>{user.grade || 'O‘quvchi'}</span>
                        <i />
                        <span>{user.badges?.length || 0} nishon</span>
                        {(user.stats?.duelsWon || 0) > 0 && <><i /><span className="leaderboard-wins"><Flame className="h-3 w-3" /> {user.stats.duelsWon} g‘alaba</span></>}
                      </div>
                    </div>
                  </div>
                  <div className="leaderboard-row-score">
                    <strong>{scoreOf(user)}</strong>
                    <span>{metric === 'xp' ? `Daraja ${user.level || 1}` : `${formatNumber(user.xp)} XP`}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <p className="leaderboard-footnote"><Sparkles className="h-3.5 w-3.5" /> Har bir kichik yutuq katta natijaning boshlanishidir.</p>
    </div>
  );
};
