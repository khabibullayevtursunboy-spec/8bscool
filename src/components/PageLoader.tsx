/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';

interface PageLoaderProps {
  /** Qaysi sahifaga o'tilayotgani (masalan: "Tarix Puzzle") */
  title: string;
  /** Ekran necha millisekund ko'rinib turishi */
  duration?: number;
}

const TIPS = [
  "💡 Har kuni kirib, kunlik bonusni olishni unutmang!",
  "🔁 Xato yechilgan savollar keyinroq yana chiqadi.",
  "🏆 Reytingda yuqoriga ko‘tarilish uchun testlarni ishlang.",
  "🧩 Tarix Puzzle'da bilmasangiz, Yordam tugmasini bosing.",
  "⚡ Ketma-ket to‘g‘ri javoblar kombo bonus beradi.",
  "🎁 Promokodlar bepul Coin va XP beradi."
];

const RADIUS = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STREAK_COLORS = ['#67e8f9', '#a5b4fc', '#f0abfc', '#fde68a'];

const LOADER_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;800;900&display=swap');

@property --pl-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

.pl-root {
  position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; overflow: hidden;
  background: #040714; color: #fff;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  animation: pl-overlay var(--pl-dur) cubic-bezier(.4, 0, .2, 1) both;
}
@keyframes pl-overlay {
  0% { opacity: 0; transform: scale(1); }
  7% { opacity: 1; }
  90% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.03); }
}

/* ---------- Fon ---------- */
.pl-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(900px 600px at 50% 40%, #1b1f5e66, transparent 65%),
    radial-gradient(800px 500px at 100% 100%, #5b21b644, transparent 60%),
    radial-gradient(800px 500px at 0% 100%, #0e749044, transparent 60%),
    #040714;
}
.pl-blob { position: absolute; border-radius: 999px; filter: blur(90px); opacity: .4; animation: pl-blob 14s ease-in-out infinite; }
.pl-blob.b1 { width: 42vmax; height: 42vmax; top: -14vmax; left: -10vmax; background: #06b6d4; }
.pl-blob.b2 { width: 38vmax; height: 38vmax; bottom: -16vmax; right: -10vmax; background: #7c3aed; animation-delay: -6s; }
@keyframes pl-blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(4vmax, -3vmax) scale(1.15); }
}
.pl-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgb(148 163 184 / 6%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(148 163 184 / 6%) 1px, transparent 1px);
  background-size: 54px 54px;
  -webkit-mask-image: radial-gradient(ellipse at center, #000 10%, transparent 68%);
  mask-image: radial-gradient(ellipse at center, #000 10%, transparent 68%);
  animation: pl-grid 14s linear infinite;
}
@keyframes pl-grid { to { background-position: 0 54px, 54px 0; } }
.pl-vignette { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at center, transparent 40%, rgb(2 4 14 / 80%) 100%); }

/* ---------- Giper-tezlik chiziqlari ---------- */
.pl-streak {
  position: absolute; left: 50%; top: 50%; height: 2px; width: var(--l); border-radius: 2px;
  transform-origin: 0 50%; opacity: 0;
  background: linear-gradient(90deg, transparent, var(--c));
  animation: pl-warp var(--t) cubic-bezier(.4, 0, 1, 1) infinite; animation-delay: var(--dl);
}
@keyframes pl-warp {
  0% { transform: rotate(var(--a)) translateX(150px) scaleX(.3); opacity: 0; }
  12% { opacity: .9; }
  100% { transform: rotate(var(--a)) translateX(75vmax) scaleX(1.2); opacity: 0; }
}

/* ---------- Markaz ---------- */
.pl-content {
  position: relative; z-index: 5; display: flex; flex-direction: column; align-items: center;
  gap: 1.7rem; padding: 1.5rem; text-align: center;
}
.pl-core { position: relative; width: 220px; height: 220px; }
@media (max-width: 420px) { .pl-core { transform: scale(.78); margin: -14px 0; } }

.pl-aura {
  position: absolute; inset: -30px; border-radius: 999px; filter: blur(38px); opacity: .38;
  background: conic-gradient(from var(--pl-angle), #22d3ee, #818cf8, #e879f9, #fbbf24, #22d3ee);
  animation: pl-spin 4s linear infinite;
}
@keyframes pl-spin { to { --pl-angle: 360deg; } }

.pl-wave { position: absolute; inset: 20px; border-radius: 999px; border: 2px solid rgb(129 140 248 / 55%); animation: pl-wave 2.6s ease-out infinite; }
.pl-wave.w2 { animation-delay: 1.3s; }
@keyframes pl-wave { 0% { transform: scale(.7); opacity: .8; } 100% { transform: scale(2.1); opacity: 0; } }

.pl-orbit { position: absolute; border-radius: 999px; border: 1px dashed rgb(129 140 248 / 28%); animation: pl-rotate var(--s) linear infinite; }
.pl-orbit::before {
  content: ""; position: absolute; top: -5px; left: 50%; width: 10px; height: 10px; margin-left: -5px;
  border-radius: 999px; background: var(--c); box-shadow: 0 0 14px var(--c), 0 0 30px var(--c);
}
.pl-orbit.o1 { inset: -22px; --s: 9s; --c: #22d3ee; }
.pl-orbit.o2 { inset: -44px; --s: 14s; --c: #e879f9; animation-direction: reverse; }
.pl-orbit.o3 { inset: -66px; --s: 20s; --c: #fbbf24; }
@keyframes pl-rotate { to { transform: rotate(360deg); } }

.pl-ring { position: absolute; inset: 0; transform: rotate(-90deg); }
.pl-ring circle { fill: none; stroke-linecap: round; }
.pl-ring-bg { stroke: rgb(148 163 184 / 14%); stroke-width: 6; }
.pl-ring-fg { stroke: url(#pl-grad); stroke-width: 6; filter: drop-shadow(0 0 8px rgb(129 140 248 / 80%)); }

.pl-logo {
  position: absolute; inset: 62px; border-radius: 28px; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(145deg, #06b6d4 0%, #6366f1 54%, #a855f7 100%);
  border: 1px solid rgb(255 255 255 / 25%);
  box-shadow: 0 0 60px rgb(99 102 241 / 65%), inset 0 1px 0 rgb(255 255 255 / 30%);
  font-family: 'Outfit', 'Unbounded', sans-serif; font-weight: 900; color: #fff;
  animation: pl-breathe 2.4s ease-in-out infinite;
}
.pl-logo-8 { font-size: 64px; letter-spacing: -.08em; line-height: 1; }
.pl-logo-b { align-self: flex-end; margin: 0 0 14px 2px; font-size: 24px; letter-spacing: -.03em; }
.pl-logo::after {
  content: ""; position: absolute; top: -50%; bottom: -50%; left: -70%; width: 45%;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 48%), transparent);
  transform: rotate(25deg); animation: pl-shine 2.8s ease-in-out infinite;
}
@keyframes pl-shine { 0%, 60%, 100% { left: -70%; } 85% { left: 140%; } }
@keyframes pl-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
.pl-done .pl-logo { animation: pl-pop .6s cubic-bezier(.34, 1.56, .64, 1); }
@keyframes pl-pop { 0% { transform: scale(1); } 45% { transform: scale(1.22); } 100% { transform: scale(1); } }

/* ---------- Matnlar ---------- */
.pl-label {
  font-size: .72rem; font-weight: 800; letter-spacing: .32em; text-transform: uppercase; color: #a5f3fc;
  padding-left: .32em; display: inline-flex; align-items: center; gap: .1em;
}
.pl-dots span { display: inline-block; animation: pl-dot 1.2s ease-in-out infinite; }
.pl-dots span:nth-child(2) { animation-delay: .15s; }
.pl-dots span:nth-child(3) { animation-delay: .3s; }
@keyframes pl-dot { 0%, 80%, 100% { opacity: .2; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }

.pl-title {
  margin-top: .35rem; font-family: 'Unbounded', 'Outfit', sans-serif; font-weight: 800; line-height: 1.15;
  font-size: clamp(1.5rem, 5vw, 2.6rem);
  background: linear-gradient(100deg, #67e8f9, #a5b4fc, #f0abfc, #fbbf24, #67e8f9);
  background-size: 250% auto; -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 0 22px rgb(129 140 248 / 40%));
  animation: pl-flow 4s linear infinite, pl-title-in .9s cubic-bezier(.16, 1, .3, 1) both;
}
@keyframes pl-flow { to { background-position: 250% center; } }
@keyframes pl-title-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.pl-bar-wrap { display: flex; align-items: center; gap: .9rem; width: min(380px, 82vw); }
.pl-bar { position: relative; flex: 1; height: 8px; border-radius: 999px; overflow: hidden; background: rgb(148 163 184 / 16%); }
.pl-bar-fill {
  position: relative; height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, #22d3ee, #818cf8, #e879f9);
  box-shadow: 0 0 16px rgb(129 140 248 / 80%);
}
.pl-bar-fill::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 55%), transparent);
  background-size: 50% 100%; background-repeat: no-repeat; animation: pl-bar-shine 1.6s linear infinite;
}
@keyframes pl-bar-shine { from { background-position: -100% 0; } to { background-position: 250% 0; } }
.pl-percent { min-width: 3.2rem; text-align: right; font-family: 'Unbounded', monospace; font-weight: 800; font-size: .85rem; color: #e2e8f0; }

.pl-tip {
  max-width: min(440px, 86vw); padding: .75rem 1.2rem; border-radius: 16px;
  border: 1px solid rgb(255 255 255 / 12%);
  background: linear-gradient(135deg, rgb(255 255 255 / 9%), rgb(255 255 255 / 3%));
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  font-size: .8rem; font-weight: 600; line-height: 1.5; color: rgb(226 232 240 / 92%);
  animation: pl-tip 1s ease both;
}
@keyframes pl-tip { from { opacity: 0; transform: translateY(10px); filter: blur(6px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }

.pl-brand { position: absolute; left: 0; right: 0; bottom: 1.4rem; z-index: 5; text-align: center; font-size: 10px; font-weight: 700; letter-spacing: .22em; color: rgb(148 163 184 / 55%); text-transform: uppercase; }

@media (prefers-reduced-motion: reduce) {
  .pl-streak, .pl-orbit, .pl-aura, .pl-wave, .pl-blob, .pl-grid, .pl-logo, .pl-logo::after,
  .pl-title, .pl-dots span, .pl-bar-fill::after { animation: none !important; }
  .pl-streak, .pl-wave { display: none; }
}
`;

export const PageLoader: React.FC<PageLoaderProps> = ({ title, duration = 4000 }) => {
  const [percent, setPercent] = useState(0);
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));

  // Maslahat har ~1/3 vaqtda almashadi
  const tipInterval = Math.max(1200, Math.round(duration / 3));

  const streaks = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        angle: i * 10 + Math.random() * 8,
        length: 80 + Math.random() * 180,
        dur: 1.4 + Math.random() * 1.8,
        delay: -Math.random() * 3,
        color: STREAK_COLORS[i % STREAK_COLORS.length]
      })),
    []
  );

  // Foiz hisoblagich: sekin boshlanadi, o'rtada tezlashadi, oxirida yana sekinlashadi
  useEffect(() => {
    const start = performance.now();
    const fillMs = duration * 0.86;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / fillMs);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setPercent(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  useEffect(() => {
    const timer = setInterval(() => setTipIndex((p) => (p + 1) % TIPS.length), tipInterval);
    return () => clearInterval(timer);
  }, [tipInterval]);

  // Yuklanish paytida orqadagi sahifa aylantirilmasin
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const done = percent >= 100;

  return (
    <div
      className={`pl-root ${done ? 'pl-done' : ''}`}
      style={{ '--pl-dur': `${duration}ms` } as React.CSSProperties}
      role="status"
      aria-live="polite"
      aria-label={`${title} yuklanmoqda`}
    >
      <style>{LOADER_CSS}</style>

      <div className="pl-bg" />
      <div className="pl-blob b1" />
      <div className="pl-blob b2" />
      <div className="pl-grid" />

      {streaks.map((s, i) => (
        <span
          key={i}
          className="pl-streak"
          aria-hidden="true"
          style={
            {
              '--a': `${s.angle}deg`,
              '--l': `${s.length}px`,
              '--t': `${s.dur}s`,
              '--dl': `${s.delay}s`,
              '--c': s.color
            } as React.CSSProperties
          }
        />
      ))}

      <div className="pl-vignette" />

      <div className="pl-content">
        {/* Logotip + aylanuvchi halqalar */}
        <div className="pl-core" aria-hidden="true">
          <div className="pl-aura" />
          <div className="pl-wave" />
          <div className="pl-wave w2" />
          <div className="pl-orbit o1" />
          <div className="pl-orbit o2" />
          <div className="pl-orbit o3" />

          <svg className="pl-ring" viewBox="0 0 220 220">
            <defs>
              <linearGradient id="pl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="55%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#e879f9" />
              </linearGradient>
            </defs>
            <circle className="pl-ring-bg" cx="110" cy="110" r={RADIUS} />
            <circle
              className="pl-ring-fg"
              cx="110"
              cy="110"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
            />
          </svg>

          <div className="pl-logo">
            <span className="pl-logo-8">8</span>
            <span className="pl-logo-b">B</span>
          </div>
        </div>

        {/* Sahifa nomi */}
        <div>
          <div className="pl-label">
            {done ? 'Tayyor!' : 'Yuklanmoqda'}
            {!done && (
              <span className="pl-dots" aria-hidden="true">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            )}
          </div>
          <div key={title} className="pl-title">
            {title}
          </div>
        </div>

        {/* Yuklanish chizig'i */}
        <div className="pl-bar-wrap">
          <div className="pl-bar">
            <div className="pl-bar-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="pl-percent">{percent}%</span>
        </div>

        {/* Maslahat */}
        <div key={tipIndex} className="pl-tip">
          {TIPS[tipIndex]}
        </div>
      </div>

      <div className="pl-brand">29-maktab • 8-sinf gaming portal</div>
    </div>
  );
};