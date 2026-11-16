/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  ArrowRight,
  Sparkles,
  Brain,
  Trophy,
  Swords,
  Crown,
  Puzzle,
  Zap,
  Timer,
  ClipboardList,
  Rocket,
  CheckCircle2,
  type LucideIcon
} from 'lucide-react';

/* ===================== MA'LUMOTLAR ===================== */

interface GameChip {
  label: string;
  icon: LucideIcon;
  gradient: string;
}

const GAMES: GameChip[] = [
  { label: 'Fan Testlari', icon: ClipboardList, gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
  { label: '1v1 Duel', icon: Swords, gradient: 'linear-gradient(135deg,#f43f5e,#f97316)' },
  { label: 'Shaxmat', icon: Crown, gradient: 'linear-gradient(135deg,#f59e0b,#eab308)' },
  { label: 'Kim Millioner?', icon: Trophy, gradient: 'linear-gradient(135deg,#facc15,#d97706)' },
  { label: 'Xotira', icon: Brain, gradient: 'linear-gradient(135deg,#14b8a6,#10b981)' },
  { label: 'Tarix Puzzle', icon: Puzzle, gradient: 'linear-gradient(135deg,#8b5cf6,#4f46e5)' },
  { label: 'Pomodoro', icon: Timer, gradient: 'linear-gradient(135deg,#d946ef,#ec4899)' },
  { label: 'Arqon tortish', icon: Zap, gradient: 'linear-gradient(135deg,#fb7185,#f43f5e)' }
];

// Katta ekranda suzib yuradigan kartalar (indeks GAMES ro'yxatiga mos)
const CHIP_POS: {
  idx: number;
  style: React.CSSProperties;
  depth: number;
  floatDelay: string;
  enterDelay: string;
}[] = [
  { idx: 0, style: { top: '15%', left: '6%' }, depth: 34, floatDelay: '0s', enterDelay: '1700ms' },
  { idx: 1, style: { top: '22%', right: '7%' }, depth: 46, floatDelay: '-2s', enterDelay: '1900ms' },
  { idx: 2, style: { top: '50%', left: '3%' }, depth: 26, floatDelay: '-4s', enterDelay: '2100ms' },
  { idx: 3, style: { top: '58%', right: '4%' }, depth: 38, floatDelay: '-1s', enterDelay: '2300ms' },
  { idx: 4, style: { bottom: '24%', left: '13%' }, depth: 52, floatDelay: '-3s', enterDelay: '2500ms' },
  { idx: 5, style: { bottom: '28%', right: '13%' }, depth: 30, floatDelay: '-5s', enterDelay: '2700ms' }
];

// "Bu yerda sen ..." gapining davomi: shu matnlar navbat bilan almashadi
const PHRASES = [
  'bilimingni sinaysan',
  "do'stlaring bilan bellashasan",
  'reytingda yuqoriga ko‘tarilasan',
  "coin va XP yig'asan",
  'yangi o‘yinlarni kashf etasan'
];

const STATS = [
  { to: 500, suffix: '+', label: "O'quvchi bellashuvi", icon: Rocket },
  { to: 10, suffix: ' ta', label: 'Fan olimpiadasi', icon: Zap },
  { to: 100, suffix: '%', label: 'Ochiq baholash', icon: CheckCircle2 }
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================== CSS ===================== */

const WELCOME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;800;900&family=Playfair+Display:ital,wght@1,600;1,800&display=swap');

@property --wl-shift { syntax: '<length>'; inherits: true; initial-value: 0px; }
@property --wl-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

.wl-root {
  --sx: 50vw; --sy: 40vh; --mx: 0; --my: 0;
  background: #040714;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}
.wl-display { font-family: 'Unbounded', 'Outfit', system-ui, sans-serif; }
.wl-serif { font-family: 'Playfair Display', Georgia, serif; }

/* ---------- Fon qatlamlari ---------- */
.wl-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(1200px 700px at 50% 0%, #1b1f5e66, transparent 60%),
    radial-gradient(900px 600px at 100% 100%, #5b21b650, transparent 60%),
    radial-gradient(900px 600px at 0% 100%, #0e749050, transparent 60%),
    #040714;
}
.wl-blob {
  position: absolute; border-radius: 999px; filter: blur(90px); opacity: .45;
  animation: wl-blob 22s ease-in-out infinite;
}
.wl-blob.b1 { width: 46vmax; height: 46vmax; top: -18vmax; left: -12vmax; background: #06b6d4; }
.wl-blob.b2 { width: 42vmax; height: 42vmax; top: 20vh; right: -16vmax; background: #7c3aed; animation-delay: -7s; animation-duration: 28s; }
.wl-blob.b3 { width: 40vmax; height: 40vmax; bottom: -20vmax; left: 25vw; background: #4f46e5; animation-delay: -13s; animation-duration: 32s; }
@keyframes wl-blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(5vmax, -4vmax) scale(1.12); }
  66% { transform: translate(-4vmax, 5vmax) scale(.92); }
}

.wl-sweep {
  position: absolute; left: 50%; top: 46%;
  width: 140vmax; height: 140vmax; margin: -70vmax 0 0 -70vmax;
  background: conic-gradient(from var(--wl-angle),
    transparent 0deg, rgb(99 102 241 / 24%) 40deg, transparent 95deg,
    rgb(34 211 238 / 18%) 200deg, transparent 265deg);
  filter: blur(30px);
  -webkit-mask-image: radial-gradient(circle, #000 0%, transparent 62%);
  mask-image: radial-gradient(circle, #000 0%, transparent 62%);
  animation: wl-spin 30s linear infinite;
}
@keyframes wl-spin { to { --wl-angle: 360deg; } }

.wl-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgb(148 163 184 / 7%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(148 163 184 / 7%) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse at center, #000 15%, transparent 70%);
  mask-image: radial-gradient(ellipse at center, #000 15%, transparent 70%);
  animation: wl-grid 16s linear infinite;
}
@keyframes wl-grid { to { background-position: 0 56px, 56px 0; } }

.wl-vignette {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 45%, rgb(2 4 14 / 78%) 100%);
}
.wl-grain {
  position: absolute; inset: 0; pointer-events: none; opacity: .08; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E");
}
.wl-spot {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(520px circle at var(--sx) var(--sy), rgb(129 140 248 / 17%), transparent 65%);
}

/* ---------- Aylanuvchi halqalar ---------- */
.wl-rings {
  position: absolute; left: 50%; top: 44%;
  width: min(135vw, 1000px); aspect-ratio: 1;
  transform: translate(-50%, -50%); pointer-events: none; opacity: .9;
}
.wl-rings svg { width: 100%; height: 100%; overflow: visible; }
.wl-rings g { transform-box: view-box; transform-origin: 50% 50%; }
.wl-rot-a { animation: wl-rotate 60s linear infinite; }
.wl-rot-b { animation: wl-rotate 42s linear infinite reverse; }
.wl-rot-c { animation: wl-rotate 28s linear infinite; }
@keyframes wl-rotate { to { transform: rotate(360deg); } }

/* ---------- Suzuvchi kartalar ---------- */
.wl-chip-pos {
  position: absolute; z-index: 5;
  transform: translate3d(calc(var(--mx) * var(--k) * -1px), calc(var(--my) * var(--k) * -1px), 0);
  transition: transform .35s ease-out;
  animation: wl-chip-in 900ms cubic-bezier(.16, 1, .3, 1) both;
  animation-delay: var(--d);
}
@keyframes wl-chip-in { from { opacity: 0; scale: .6; } to { opacity: 1; scale: 1; } }
.wl-chip {
  display: flex; align-items: center; gap: .65rem;
  padding: .55rem 1rem .55rem .55rem; border-radius: 18px;
  border: 1px solid rgb(255 255 255 / 12%);
  background: linear-gradient(135deg, rgb(255 255 255 / 10%), rgb(255 255 255 / 3%));
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  box-shadow: 0 14px 40px -14px rgb(0 0 0 / 65%), inset 0 1px 0 rgb(255 255 255 / 15%);
  font-size: .78rem; font-weight: 800; color: #e2e8f0; white-space: nowrap;
  animation: wl-float 7s ease-in-out infinite; animation-delay: var(--fd);
}
.wl-chip-icon {
  display: grid; place-items: center; width: 34px; height: 34px; border-radius: 12px; color: #fff;
  box-shadow: 0 6px 16px -4px rgb(0 0 0 / 50%);
}
@keyframes wl-float {
  0%, 100% { translate: 0 0; rotate: -1deg; }
  50% { translate: 0 -16px; rotate: 1.2deg; }
}

/* ---------- Matn animatsiyalari ---------- */
.wl-fade-up { animation: wl-fade-up 900ms cubic-bezier(.16, 1, .3, 1) both; animation-delay: var(--delay, 0ms); }
@keyframes wl-fade-up {
  from { opacity: 0; transform: translateY(26px); filter: blur(8px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.wl-pill {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: .6rem;
  padding: .55rem 1.15rem; border-radius: 999px;
  border: 1px solid rgb(103 232 249 / 30%);
  background: linear-gradient(135deg, rgb(34 211 238 / 12%), rgb(168 85 247 / 10%));
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  font-size: .68rem; font-weight: 800; letter-spacing: .2em; color: #a5f3fc;
  box-shadow: 0 0 34px rgb(34 211 238 / 20%);
}
.wl-pill::after, .wl-start-inner::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: -60%; width: 40%;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 30%), transparent);
  transform: skewX(-22deg); animation: wl-shine 4.5s ease-in-out infinite; pointer-events: none;
}
@keyframes wl-shine { 0%, 70%, 100% { left: -60%; } 85% { left: 130%; } }

.wl-over {
  font-size: clamp(.72rem, 1.5vw, 1rem); font-weight: 700; letter-spacing: .55em;
  text-transform: uppercase; color: rgb(203 213 225 / 80%); padding-left: .55em;
}

.wl-title {
  animation: wl-shift 10s linear infinite;
  filter: drop-shadow(0 0 26px rgb(129 140 248 / 40%));
}
@keyframes wl-shift { to { --wl-shift: 1200px; } }
.wl-line { display: block; perspective: 800px; }
.wl-letter {
  display: inline-block; transform-origin: 50% 100%;
  font-family: 'Unbounded', 'Outfit', sans-serif; font-weight: 900;
  font-size: clamp(2.6rem, 11.5vw, 8.5rem); line-height: .98; letter-spacing: -.02em;
  background-image: linear-gradient(100deg, #67e8f9, #818cf8, #e879f9, #fbbf24, #67e8f9);
  background-size: 1200px 100%;
  background-position: calc(var(--wl-shift) * -1 - var(--i) * .75em) 50%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation:
    wl-letter-in 1000ms cubic-bezier(.16, 1, .3, 1) both,
    wl-wave 3.8s ease-in-out infinite;
  animation-delay:
    calc(var(--d) + var(--i) * 60ms),
    calc(var(--d) + 1500ms + var(--i) * 140ms);
}
@keyframes wl-letter-in {
  from { opacity: 0; transform: translateY(70%) rotateX(-80deg) scale(.8); filter: blur(14px); }
  to { opacity: 1; transform: none; filter: blur(0); }
}
@keyframes wl-wave { 0%, 100% { translate: 0 0; } 50% { translate: 0 -.045em; } }

.wl-sub {
  font-size: clamp(1.25rem, 3.2vw, 2.1rem); line-height: 1.35; color: rgb(226 232 240 / 92%);
  min-height: 2.8em; display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.wl-phrase {
  display: inline-block; font-weight: 800;
  background: linear-gradient(90deg, #67e8f9, #a5b4fc, #f0abfc);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: wl-phrase 2800ms both;
}
@keyframes wl-phrase {
  0% { opacity: 0; transform: translateY(18px); filter: blur(10px); }
  12%, 86% { opacity: 1; transform: translateY(0); filter: blur(0); }
  100% { opacity: 0; transform: translateY(-14px); filter: blur(8px); }
}

/* ---------- Boshlash tugmasi ---------- */
.wl-pulse {
  position: absolute; inset: 0; border-radius: 999px; pointer-events: none;
  border: 2px solid rgb(129 140 248 / 55%); animation: wl-pulse 3s ease-out infinite;
}
.wl-pulse.p2 { animation-delay: 1s; }
.wl-pulse.p3 { animation-delay: 2s; }
@keyframes wl-pulse {
  0% { transform: scale(1); opacity: .7; }
  100% { transform: scale(1.9, 2.5); opacity: 0; }
}
.wl-start {
  position: relative; z-index: 2; padding: 3px; border: 0; border-radius: 999px; cursor: pointer;
  background: conic-gradient(from var(--wl-angle), #22d3ee, #818cf8, #e879f9, #fbbf24, #22d3ee);
  animation: wl-spin 3.5s linear infinite;
  box-shadow: 0 18px 50px -12px rgb(129 140 248 / 70%);
  transition: transform .25s ease, box-shadow .25s ease;
}
.wl-start::before {
  content: ""; position: absolute; inset: -6px; border-radius: inherit; z-index: -1;
  background: conic-gradient(from var(--wl-angle), #22d3ee, #818cf8, #e879f9, #fbbf24, #22d3ee);
  filter: blur(22px); opacity: .55; animation: wl-spin 3.5s linear infinite; transition: opacity .3s;
}
.wl-start:hover { transform: scale(1.06); box-shadow: 0 22px 64px -10px rgb(232 121 249 / 75%); }
.wl-start:hover::before { opacity: .85; }
.wl-start:active { transform: scale(.97); }
.wl-start:focus-visible { outline: 3px solid rgb(103 232 249 / 80%); outline-offset: 6px; }
.wl-start-inner {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: .95rem;
  padding: 1.15rem 2.9rem; border-radius: 999px;
  background: linear-gradient(135deg, #0a0f2e, #151a52); color: #fff;
  font-family: 'Unbounded', sans-serif; font-weight: 800;
  font-size: clamp(.95rem, 1.8vw, 1.2rem); letter-spacing: .16em; text-transform: uppercase;
  transition: background .3s ease;
}
.wl-start:hover .wl-start-inner { background: linear-gradient(135deg, #312e81, #6d28d9); }
.wl-arrow { transition: transform .3s ease; }
.wl-start:hover .wl-arrow { transform: translateX(7px); }
.wl-magnet { transition: transform .2s ease-out; }

.wl-kbd {
  display: inline-block; padding: .15rem .55rem; border-radius: 8px; margin: 0 .2rem;
  border: 1px solid rgb(255 255 255 / 18%); background: rgb(255 255 255 / 7%);
  font-size: .68rem; font-weight: 800; color: #e2e8f0; box-shadow: 0 2px 0 rgb(255 255 255 / 10%);
}

/* ---------- Statistika ---------- */
.wl-stat {
  padding: .95rem 1.2rem; border-radius: 20px; min-width: 120px; text-align: center;
  border: 1px solid rgb(255 255 255 / 10%);
  background: linear-gradient(135deg, rgb(255 255 255 / 8%), rgb(255 255 255 / 2%));
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  box-shadow: 0 14px 40px -16px rgb(0 0 0 / 60%), inset 0 1px 0 rgb(255 255 255 / 12%);
}
.wl-stat-num {
  font-family: 'Unbounded', sans-serif; font-weight: 800; font-size: clamp(1.25rem, 2.6vw, 1.8rem);
  background: linear-gradient(110deg, #67e8f9, #a5b4fc, #f0abfc);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

/* ---------- Pastki yo'l (marquee) ---------- */
.wl-marquee {
  position: relative; overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.wl-track { display: flex; width: max-content; animation: wl-marquee 40s linear infinite; }
.wl-track:hover { animation-play-state: paused; }
@keyframes wl-marquee { to { transform: translateX(-50%); } }
.wl-mq-item {
  display: inline-flex; align-items: center; gap: .7rem; padding: 0 1.7rem; white-space: nowrap;
  font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: .7rem; letter-spacing: .18em;
  text-transform: uppercase; color: rgb(203 213 225 / 72%);
}
.wl-mq-dot { width: 6px; height: 6px; border-radius: 999px; background: linear-gradient(135deg, #22d3ee, #e879f9); box-shadow: 0 0 10px #818cf8; }

/* ---------- Chiqish animatsiyasi (portal ochilishi) ---------- */
.wl-leaving {
  transform: scale(1.1); opacity: 0; filter: blur(8px);
  transition: transform .8s cubic-bezier(.65, 0, .25, 1), opacity .6s ease, filter .6s ease;
  pointer-events: none;
}
.wl-wipe-a, .wl-wipe-b { position: fixed; inset: 0; z-index: 70; clip-path: circle(0px at var(--wx) var(--wy)); }
.wl-wipe-a {
  background: radial-gradient(circle at var(--wx) var(--wy), #67e8f9, #6366f1 35%, #a855f7 70%, #e879f9);
  animation: wl-wipe 700ms cubic-bezier(.65, 0, .25, 1) forwards;
}
.wl-wipe-b { background: var(--wl-end); animation: wl-wipe 700ms cubic-bezier(.65, 0, .25, 1) 220ms forwards; }
@keyframes wl-wipe {
  from { clip-path: circle(0px at var(--wx) var(--wy)); }
  to { clip-path: circle(150vmax at var(--wx) var(--wy)); }
}

.wl-scroll { position: absolute; inset: 0; z-index: 10; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; }

@media (max-width: 640px) {
  .wl-start-inner { padding: 1rem 2.2rem; }
  .wl-stat { min-width: 0; padding: .75rem .55rem; }
  .wl-over { letter-spacing: .35em; }
}

/* ---------- Harakatni kamaytirish ---------- */
@media (prefers-reduced-motion: reduce) {
  .wl-blob, .wl-sweep, .wl-grid, .wl-rot-a, .wl-rot-b, .wl-rot-c, .wl-chip, .wl-chip-pos,
  .wl-title, .wl-letter, .wl-phrase, .wl-pulse, .wl-start, .wl-start::before, .wl-track,
  .wl-pill::after, .wl-start-inner::after, .wl-fade-up { animation: none !important; }
  .wl-pulse { display: none; }
  .wl-wipe-a, .wl-wipe-b { animation-duration: 1ms !important; animation-delay: 0ms !important; }
}
`;

/* ===================== YORDAMCHI KOMPONENTLAR ===================== */

/** Sarlavhani harflarga bo'lib, har birini ketma-ket paydo qiladi. */
const SplitText: React.FC<{ text: string; baseDelay: number; startIndex?: number }> = ({
  text,
  baseDelay,
  startIndex = 0
}) => (
  <>
    {Array.from(text).map((ch, i) => (
      <span
        key={i}
        className="wl-letter"
        aria-hidden="true"
        style={{ '--i': startIndex + i, '--d': `${baseDelay}ms` } as React.CSSProperties}
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ))}
  </>
);

/** Almashinib turuvchi matn. */
const RotatingPhrase: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % PHRASES.length), 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <span key={index} className="wl-phrase wl-serif italic">
      {PHRASES[index]}
    </span>
  );
};

/** 0 dan boshlab sanaydigan raqam. */
const CountUp: React.FC<{ to: number; delay?: number; duration?: number }> = ({
  to,
  delay = 1900,
  duration = 1800
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(to);
      return;
    }
    let raf = 0;
    let startTime = 0;
    const timer = setTimeout(() => {
      const tick = (t: number) => {
        if (!startTime) startTime = t;
        const p = Math.min(1, (t - startTime) / duration);
        setValue(Math.round(to * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, delay, duration]);

  return <>{value}</>;
};

interface MouseState {
  x: number;
  y: number;
  active: boolean;
}

/** Sichqonchaga javob beradigan yulduz-zarrachalar tarmog'i. */
const ParticleField: React.FC<{ mouseRef: React.MutableRefObject<MouseState> }> = ({ mouseRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const HUES = [190, 235, 290];
    let w = 0;
    let h = 0;
    let raf = 0;
    let particles: { x: number; y: number; vx: number; vy: number; r: number; hue: number }[] = [];

    const init = () => {
      const count = Math.min(110, Math.max(30, Math.floor((w * h) / 14000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4,
        hue: HUES[Math.floor(Math.random() * HUES.length)]
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const m = mouseRef.current;

      for (const p of particles) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          if (m.active) {
            const dx = p.x - m.x;
            const dy = p.y - m.y;
            const d = Math.hypot(dx, dy);
            if (d < 140 && d > 0.1) {
              const f = (140 - d) / 140;
              p.x += (dx / d) * f * 2.2;
              p.y += (dy / d) * f * 2.2;
            }
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 72%, .85)`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            const alpha = (1 - Math.sqrt(d2) / 120) * 0.22;
            ctx.strokeStyle = `hsla(${particles[i].hue}, 90%, 70%, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      if (m.active && !reduce) {
        for (const p of particles) {
          const d = Math.hypot(p.x - m.x, p.y - m.y);
          if (d < 170) {
            ctx.strokeStyle = `hsla(${p.hue}, 95%, 75%, ${(1 - d / 170) * 0.45})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
      if (reduce) draw();
    };

    resize();
    if (!reduce) raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [mouseRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

/* ===================== ASOSIY KOMPONENT ===================== */

interface WelcomeScreenProps {
  onStart: () => void;
  theme?: 'dark' | 'light';
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, theme = 'light' }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const magnetAreaRef = useRef<HTMLDivElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<MouseState>({ x: 0, y: 0, active: false });
  const startedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const [leaving, setLeaving] = useState<{ x: number; y: number } | null>(null);

  // Portal yopilgach ko'rinadigan kirish sahifasining fon rangi bilan bir xil bo'lishi uchun
  const endColor = theme === 'dark' ? '#020617' : '#f1f5f9';

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty('--sx', `${e.clientX}px`);
    root.style.setProperty('--sy', `${e.clientY}px`);
    root.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
    root.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
  };

  // Tugma sichqonchaga tomon "tortiladi"
  const handleMagnetMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const area = magnetAreaRef.current;
    const inner = magnetRef.current;
    if (!area || !inner) return;
    const r = area.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    inner.style.transform = `translate(${(dx * 0.18).toFixed(1)}px, ${(dy * 0.28).toFixed(1)}px)`;
  };

  const handleMagnetLeave = () => {
    if (magnetRef.current) magnetRef.current.style.transform = 'translate(0, 0)';
  };

  const handleStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    const rect = btnRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    setLeaving({ x, y });

    timerRef.current = window.setTimeout(onStart, prefersReducedMotion() ? 60 : 950);
  };

  // Enter bosilganda ham boshlansin
  const startRef = useRef(handleStart);
  startRef.current = handleStart;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') startRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const marqueeItems = [...GAMES, ...GAMES];

  return (
    <div
      ref={rootRef}
      className="wl-root fixed inset-0 z-40 overflow-hidden text-white"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <style>{WELCOME_CSS}</style>

      {/* ===== Fon ===== */}
      <div className="wl-bg" />
      <div className="wl-blob b1" />
      <div className="wl-blob b2" />
      <div className="wl-blob b3" />
      <div className="wl-sweep" />
      <div className="wl-grid" />
      <ParticleField mouseRef={mouseRef} />

      {/* Aylanuvchi halqalar */}
      <div className="wl-rings" aria-hidden="true">
        <svg viewBox="0 0 800 800">
          <g className="wl-rot-a">
            <circle cx="400" cy="400" r="380" fill="none" stroke="rgba(129,140,248,.2)" strokeWidth="1.5" strokeDasharray="2 10" />
            <circle cx="400" cy="20" r="6" fill="#22d3ee" />
            <circle cx="780" cy="400" r="4" fill="#e879f9" />
          </g>
          <g className="wl-rot-b">
            <circle cx="400" cy="400" r="300" fill="none" stroke="rgba(34,211,238,.18)" strokeWidth="1.5" strokeDasharray="40 16" />
            <circle cx="400" cy="100" r="5" fill="#fbbf24" />
          </g>
          <g className="wl-rot-c">
            <circle cx="400" cy="400" r="220" fill="none" stroke="rgba(232,121,249,.16)" strokeWidth="1.5" />
            <circle cx="620" cy="400" r="5" fill="#818cf8" />
            <circle cx="180" cy="400" r="3" fill="#22d3ee" />
          </g>
        </svg>
      </div>

      {/* Suzuvchi o'yin kartalari (faqat katta ekranda) */}
      {CHIP_POS.map((c) => {
        const game = GAMES[c.idx];
        const Icon = game.icon;
        return (
          <div
            key={game.label}
            className="wl-chip-pos hidden lg:block"
            aria-hidden="true"
            style={{ ...c.style, '--k': c.depth, '--d': c.enterDelay } as React.CSSProperties}
          >
            <div className="wl-chip" style={{ '--fd': c.floatDelay } as React.CSSProperties}>
              <span className="wl-chip-icon" style={{ background: game.gradient }}>
                <Icon className="w-4 h-4" />
              </span>
              <span>{game.label}</span>
            </div>
          </div>
        );
      })}

      <div className="wl-vignette" />
      <div className="wl-grain" />
      <div className="wl-spot" />

      {/* ===== Asosiy kontent ===== */}
      <div className={`wl-scroll ${leaving ? 'wl-leaving' : ''}`}>
        <main className="flex-1 flex flex-col items-center justify-center text-center px-5 pt-10 pb-6">
          {/* Yuqori yozuv */}
          <div className="wl-fade-up" style={{ '--delay': '100ms' } as React.CSSProperties}>
            <span className="wl-pill">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
              29-MAKTAB • 8-SINF TEXNOLOGIYA PORTALI
            </span>
          </div>

          {/* Sarlavha */}
          <div className="wl-over wl-display mt-8 wl-fade-up" style={{ '--delay': '250ms' } as React.CSSProperties}>
            8-sinf uchun
          </div>

          <h1 className="wl-title mt-3" aria-label="Gaming Portal">
            <span className="wl-line">
              <SplitText text="GAMING" baseDelay={450} />
            </span>
            <span className="wl-line">
              <SplitText text="PORTAL" baseDelay={850} startIndex={6} />
            </span>
          </h1>

          {/* Almashinib turuvchi gap */}
          <div
            className="wl-sub wl-serif italic mt-7 wl-fade-up"
            style={{ '--delay': '1500ms' } as React.CSSProperties}
          >
            <span>Bu yerda sen</span>
            <RotatingPhrase />
          </div>

          <p
            className="mt-5 max-w-xl text-sm sm:text-base font-medium leading-relaxed text-slate-300/80 wl-fade-up"
            style={{ '--delay': '1700ms' } as React.CSSProperties}
          >
            Testlar, viktorinalar, shaxmat, tarix puzzle va yana ko‘plab o‘yinlar hammasi bitta joyda.
            Tayyor bo‘lsang, boshlaymiz!
          </p>

          {/* Boshlash tugmasi */}
          <div
            ref={magnetAreaRef}
            onPointerMove={handleMagnetMove}
            onPointerLeave={handleMagnetLeave}
            className="mt-10 p-8 wl-fade-up"
            style={{ '--delay': '1900ms' } as React.CSSProperties}
          >
            <div ref={magnetRef} className="wl-magnet relative inline-flex items-center justify-center">
              <span className="wl-pulse" />
              <span className="wl-pulse p2" />
              <span className="wl-pulse p3" />
              <button
                ref={btnRef}
                type="button"
                onClick={handleStart}
                className="wl-start"
                aria-label="Boshlash va kirish sahifasiga o'tish"
              >
                <span className="wl-start-inner">
                  <Play className="w-5 h-5 fill-white" />
                  Boshlash
                  <ArrowRight className="wl-arrow w-5 h-5" />
                </span>
              </button>
            </div>
          </div>

          <p
            className="-mt-4 text-[11px] font-semibold text-slate-400/80 wl-fade-up"
            style={{ '--delay': '2200ms' } as React.CSSProperties}
          >
            Davom etish uchun bosing yoki <span className="wl-kbd">Enter</span> ni bosing
          </p>

          {/* Statistika */}
          <div
            className="mt-9 grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg wl-fade-up"
            style={{ '--delay': '2400ms' } as React.CSSProperties}
          >
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="wl-stat">
                  <Icon className="w-4 h-4 mx-auto mb-1.5 text-indigo-300" />
                  <div className="wl-stat-num">
                    <CountUp to={s.to} />
                    {s.suffix}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1 leading-tight">
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Pastki yo'l */}
        <div className="shrink-0 pb-5 wl-fade-up" style={{ '--delay': '2600ms' } as React.CSSProperties}>
          <div className="wl-marquee" aria-hidden="true">
            <div className="wl-track">
              {marqueeItems.map((g, i) => {
                const Icon = g.icon;
                return (
                  <span key={i} className="wl-mq-item">
                    <Icon className="w-4 h-4 text-indigo-300" />
                    {g.label}
                    <span className="wl-mq-dot" />
                  </span>
                );
              })}
            </div>
          </div>
          <p className="text-center text-[10px] font-semibold tracking-wider text-slate-500 mt-4">
            © 2026 29-sonli maktab • 8-sinf texnologiya ta'limi
          </p>
        </div>
      </div>

      {/* ===== Portal ochilishi ===== */}
      {leaving && (
        <>
          <div
            className="wl-wipe-a"
            aria-hidden="true"
            style={{ '--wx': `${leaving.x}px`, '--wy': `${leaving.y}px` } as React.CSSProperties}
          />
          <div
            className="wl-wipe-b"
            aria-hidden="true"
            style={
              {
                '--wx': `${leaving.x}px`,
                '--wy': `${leaving.y}px`,
                '--wl-end': endColor
              } as React.CSSProperties
            }
          />
        </>
      )}
    </div>
  );
};