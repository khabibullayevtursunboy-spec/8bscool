/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Mashina rasmi (tepadan ko'rinish). Garajda ham, poygada ham, reytingda ham
 * aynan shu komponent ishlatiladi — tanlangan tuning qismlari rasmda ko'rinadi.
 */

import React from 'react';
import { Look, itemOf } from '../services/garage';

/* ===================== YORDAMCHILAR ===================== */

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(f, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const mix = (a: string, b: string, t: number): string => {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
};

/** Alanga gradienti (CSS) — poyga va garajda ishlatiladi */
export const flameCss = (look: Look): string => {
  const [a, b, c] = (itemOf('flame', look.flame).v || '#fff7c2,#ffb020,#ff4d00').split(',');
  return `linear-gradient(to bottom,${a},${b} 38%,${c} 72%,transparent)`;
};

export const lightColor = (look: Look): string => itemOf('lights', look.lights).v || '#fffbe0';

/* ===================== KORPUS SHAKLLARI ===================== */

type Rect = [number, number, number, number];

interface BodySpec {
  d: string;
  wheels: [Rect, Rect, Rect, Rect];
  glass: string;
  roof: [number, number, number, number, number];
  rear: string;
  lights: [number, number, number, number][];
  tails: Rect[];
  mirrors: [number, number][];
  hood: { y1: number; y2: number; w: number };
  spoilerY: number;
  spoilerW: number;
  plate: [number, number];
  formula?: boolean;
}

const SPECS: Record<string, BodySpec> = {
  city: {
    d: 'M30 3 C42 3 50 13 50 30 L52 52 L50 100 C50 111 42 116 30 116 C18 116 10 111 10 100 L8 52 L10 30 C10 13 18 3 30 3 Z',
    wheels: [[2, 20, 9, 22], [49, 20, 9, 22], [1, 78, 10, 24], [49, 78, 10, 24]],
    glass: 'M17 42 L43 42 L46 58 L14 58 Z',
    roof: [15, 58, 30, 24, 4],
    rear: 'M17 82 L43 82 L41 92 L19 92 Z',
    lights: [[16, 9, 4.5, 2.6], [44, 9, 4.5, 2.6]],
    tails: [[12, 108, 10, 3.5], [38, 108, 10, 3.5]],
    mirrors: [[7, 48], [53, 48]],
    hood: { y1: 12, y2: 38, w: 14 },
    spoilerY: 111, spoilerW: 46, plate: [23, 97]
  },
  sport: {
    d: 'M30 2 C40 2 47 10 48 26 L53 54 L52 96 C51 110 42 117 30 117 C18 117 9 110 8 96 L7 54 L12 26 C13 10 20 2 30 2 Z',
    wheels: [[3, 18, 9, 22], [48, 18, 9, 22], [0, 76, 11, 26], [49, 76, 11, 26]],
    glass: 'M19 40 L41 40 L44 56 L16 56 Z',
    roof: [16, 56, 28, 22, 6],
    rear: 'M18 78 L42 78 L40 90 L20 90 Z',
    lights: [[17, 8, 5, 2], [43, 8, 5, 2]],
    tails: [[11, 110, 12, 3], [37, 110, 12, 3]],
    mirrors: [[8, 46], [52, 46]],
    hood: { y1: 10, y2: 36, w: 12 },
    spoilerY: 112, spoilerW: 48, plate: [23, 97]
  },
  muscle: {
    d: 'M30 4 C44 4 52 8 52 22 L54 56 L53 102 C53 112 44 116 30 116 C16 116 7 112 7 102 L6 56 L8 22 C8 8 16 4 30 4 Z',
    wheels: [[1, 20, 10, 22], [49, 20, 10, 22], [0, 78, 11, 24], [49, 78, 11, 24]],
    glass: 'M15 40 L45 40 L47 56 L13 56 Z',
    roof: [13, 56, 34, 24, 3],
    rear: 'M15 80 L45 80 L44 92 L16 92 Z',
    lights: [[14, 10, 4, 4], [46, 10, 4, 4]],
    tails: [[10, 108, 12, 4], [38, 108, 12, 4]],
    mirrors: [[6, 46], [54, 46]],
    hood: { y1: 10, y2: 38, w: 18 },
    spoilerY: 111, spoilerW: 50, plate: [23, 98]
  },
  hyper: {
    d: 'M30 0 C36 0 40 8 44 22 L55 52 L54 98 C53 110 42 118 30 118 C18 118 7 110 6 98 L5 52 L16 22 C20 8 24 0 30 0 Z',
    wheels: [[1, 22, 10, 22], [49, 22, 10, 22], [0, 78, 12, 26], [48, 78, 12, 26]],
    glass: 'M20 38 L40 38 L46 54 L14 54 Z',
    roof: [18, 54, 24, 20, 8],
    rear: 'M18 74 L42 74 L40 90 L20 90 Z',
    lights: [[19, 12, 5, 1.8], [41, 12, 5, 1.8]],
    tails: [[10, 108, 14, 2.8], [36, 108, 14, 2.8]],
    mirrors: [[8, 44], [52, 44]],
    hood: { y1: 8, y2: 34, w: 10 },
    spoilerY: 113, spoilerW: 52, plate: [23, 98]
  },
  formula: {
    d: 'M30 2 C34 2 36 12 37 30 L40 56 L38 100 C37 110 34 114 30 114 C26 114 23 110 22 100 L20 56 L23 30 C24 12 26 2 30 2 Z',
    wheels: [[0, 14, 13, 26], [47, 14, 13, 26], [0, 78, 14, 28], [46, 78, 14, 28]],
    glass: 'M26 38 L34 38 L36 52 L24 52 Z',
    roof: [25, 52, 10, 14, 5],
    rear: 'M26 72 L34 72 L34 84 L26 84 Z',
    lights: [[27, 7, 2, 1.2], [33, 7, 2, 1.2]],
    tails: [[24, 108, 5, 3], [31, 108, 5, 3]],
    mirrors: [[19, 46], [41, 46]],
    hood: { y1: 8, y2: 34, w: 6 },
    spoilerY: 110, spoilerW: 52, plate: [26, 98],
    formula: true
  }
};

const ART_CSS = `
@keyframes ca-pearl{to{filter:hue-rotate(360deg)}}
@keyframes ca-neon{0%,100%{opacity:.55}50%{opacity:.95}}
@keyframes ca-bar{0%,45%{opacity:1}50%,95%{opacity:.25}100%{opacity:1}}
`;

/* ===================== KOMPONENT ===================== */

interface CarArtProps {
  look: Look;
  uid: string;
  plate?: string;
  glow?: boolean;   // neon yoritgichni ko'rsatish
}

export const CarArt: React.FC<CarArtProps> = ({ look, uid, plate = '29-B', glow = true }) => {
  const spec = SPECS[look.body] ?? SPECS.city;
  const paint = itemOf('paint', look.paint).v || '#2563eb';
  const accent = itemOf('accent', look.accent).v || '#ffffff';
  const rim = itemOf('rims', look.rims).v || '#cbd5e1';
  const lightHex = itemOf('lights', look.lights).v || '#fffbe0';
  const neon = itemOf('neon', look.neon).v || '';
  const [glassTop, glassBot] = (itemOf('tint', look.tint).v || '#cfe9ff,#1b2a41').split(',');
  const dark = mix(paint, '#000000', 0.5);
  const lightP = mix(paint, '#ffffff', 0.28);
  const carbon = '#14161c';
  const id = (s: string) => `${s}-${uid}`;
  const [cx0] = [30];

  const finish = look.finish;
  const bodyStyle: React.CSSProperties =
    finish === 'matte' ? { filter: 'saturate(.7) brightness(.92)' }
      : finish === 'pearl' ? { animation: 'ca-pearl 6s linear infinite' }
        : {};

  /* ----- Poloska (livery) ----- */
  const livery = (() => {
    switch (look.livery) {
      case 'center':
        return (<><rect x="25.5" y="0" width="3.4" height="120" fill={accent} /><rect x="31.1" y="0" width="3.4" height="120" fill={accent} /></>);
      case 'wide':
        return <rect x="22" y="0" width="16" height="120" fill={accent} opacity="0.92" />;
      case 'side':
        return (<><rect x="9" y="0" width="4.5" height="120" fill={accent} /><rect x="46.5" y="0" width="4.5" height="120" fill={accent} /></>);
      case 'hood':
        return (<><rect x="17" y="0" width="26" height="38" fill={accent} opacity="0.92" /><rect x="17" y="41" width="26" height="2.5" fill={accent} /></>);
      case 'checker':
        return <rect x="23" y="0" width="14" height="120" fill={`url(#${id('chk')})`} />;
      case 'arrow':
        return (
          <g fill="none" stroke={accent} strokeWidth="3.4" strokeLinejoin="miter">
            {[16, 36, 56, 76, 96].map((y) => (<polyline key={y} points={`12,${y + 14} 30,${y} 48,${y + 14}`} />))}
          </g>
        );
      case 'roundel':
        return (
          <g>
            <circle cx="30" cy="25" r="8.5" fill={accent} />
            <circle cx="30" cy="25" r="6.6" fill="none" stroke={dark} strokeWidth="0.8" />
            <text x="30" y="28.4" textAnchor="middle" fontSize="9" fontWeight="900" fill={dark} fontFamily="Arial,sans-serif">29</text>
          </g>
        );
      case 'split':
        return <rect x="0" y="0" width="30" height="120" fill={accent} opacity="0.88" />;
      default:
        return null;
    }
  })();

  /* ----- Kapot detallari ----- */
  const { y1, y2, w: hw } = spec.hood;
  const hood = (() => {
    switch (look.hood) {
      case 'scoop':
        return (
          <g>
            <path d={`M${cx0 - hw * 0.55},${y1 + 20} L${cx0 - hw * 0.34},${y1 + 6} L${cx0 + hw * 0.34},${y1 + 6} L${cx0 + hw * 0.55},${y1 + 20} Z`} fill="#0b0b10" />
            <path d={`M${cx0 - hw * 0.38},${y1 + 18} L${cx0 - hw * 0.24},${y1 + 8} L${cx0 + hw * 0.24},${y1 + 8} L${cx0 + hw * 0.38},${y1 + 18} Z`} fill="#1d2230" />
            <rect x={cx0 - hw * 0.3} y={y1 + 12} width={hw * 0.6} height="1" fill="rgba(255,255,255,.25)" />
          </g>
        );
      case 'vents':
        return (
          <g>
            {[0, 1, 2].map((i) => (
              <rect key={i} x={cx0 - hw / 2 + i * (hw / 3) + 0.8} y={y1 + 7} width={hw / 3 - 1.6} height={16} rx="1" fill="#0b0b10" opacity="0.9" />
            ))}
          </g>
        );
      case 'carbon':
        return <rect x={cx0 - hw / 2} y={y1 + 2} width={hw} height={y2 - y1 - 8} rx="3" fill={`url(#${id('cb')})`} stroke="rgba(0,0,0,.5)" strokeWidth="0.5" />;
      default:
        return null;
    }
  })();

  /* ----- Tom aksessuarlari ----- */
  const [rx, ry, rw, rh] = spec.roof;
  const roof = (() => {
    switch (look.roof) {
      case 'antenna':
        return (<g><circle cx={rx + rw - 5} cy={ry + rh - 4} r="1.6" fill="#0b0b10" /><circle cx={rx + rw - 5} cy={ry + rh - 4} r="0.7" fill={accent} /></g>);
      case 'sunroof':
        return <rect x={rx + 4} y={ry + 4} width={rw - 8} height={rh - 9} rx="3" fill={`url(#${id('gl')})`} stroke="rgba(0,0,0,.5)" strokeWidth="0.5" />;
      case 'scoop':
        return (<g><path d={`M${rx + rw * 0.28},${ry + 6} L${rx + rw * 0.38},${ry + 2.5} L${rx + rw * 0.62},${ry + 2.5} L${rx + rw * 0.72},${ry + 6} Z`} fill="#0b0b10" /></g>);
      case 'lightbar':
        return (
          <g>
            <rect x={rx + 2} y={ry + rh / 2 - 2} width={rw - 4} height="4.4" rx="1.4" fill="#0b0b10" />
            <rect x={rx + 3} y={ry + rh / 2 - 1.2} width={(rw - 6) / 2 - 0.5} height="2.8" rx="1" fill="#ff2a2a" style={{ animation: 'ca-bar .8s linear infinite' }} />
            <rect x={rx + 3 + (rw - 6) / 2 + 0.5} y={ry + rh / 2 - 1.2} width={(rw - 6) / 2 - 0.5} height="2.8" rx="1" fill="#2a6bff" style={{ animation: 'ca-bar .8s linear infinite', animationDelay: '.4s' }} />
          </g>
        );
      default:
        return null;
    }
  })();

  /* ----- Spoyler ----- */
  const sy = spec.spoilerY;
  const sw = spec.spoilerW;
  const sx = (60 - sw) / 2;
  const spoiler = (() => {
    const base = spec.formula && look.spoiler === 'none'
      ? (<g><rect x={sx} y={sy} width={sw} height="5" rx="1.5" fill={carbon} /><rect x={sx} y={sy} width={sw} height="1.4" fill={accent} opacity=".9" /><rect x={sx - 1} y={sy - 3} width="2.4" height="11" rx="1" fill={carbon} /><rect x={sx + sw - 1.4} y={sy - 3} width="2.4" height="11" rx="1" fill={carbon} /></g>)
      : null;
    switch (look.spoiler) {
      case 'lip':
        return (<g><rect x={sx + 4} y={sy + 2} width={sw - 8} height="2.6" rx="1.2" fill={carbon} /><rect x={sx + 4} y={sy + 2} width={sw - 8} height="0.8" fill={accent} opacity=".8" /></g>);
      case 'duck':
        return (<g><path d={`M${sx + 2},${sy + 5} Q30,${sy - 3} ${sx + sw - 2},${sy + 5} L${sx + sw - 4},${sy + 6.6} Q30,${sy - 0.6} ${sx + 4},${sy + 6.6} Z`} fill={carbon} /><path d={`M${sx + 2},${sy + 5} Q30,${sy - 3} ${sx + sw - 2},${sy + 5}`} fill="none" stroke={accent} strokeWidth="1" /></g>);
      case 'gt':
        return (
          <g>
            <rect x="21" y={sy + 3} width="3" height="8" fill="#0b0b10" />
            <rect x="36" y={sy + 3} width="3" height="8" fill="#0b0b10" />
            <rect x={sx} y={sy - 1} width={sw} height="5.4" rx="1.6" fill={carbon} />
            <rect x={sx} y={sy - 1} width={sw} height="1.4" rx="0.7" fill={accent} />
            <rect x={sx - 1} y={sy - 3} width="2.6" height="11" rx="1" fill={accent} />
            <rect x={sx + sw - 1.6} y={sy - 3} width="2.6" height="11" rx="1" fill={accent} />
          </g>
        );
      case 'big':
        return (
          <g>
            <rect x="20" y={sy + 2} width="3.4" height="9" fill="#0b0b10" />
            <rect x="36.6" y={sy + 2} width="3.4" height="9" fill="#0b0b10" />
            <rect x={sx - 2} y={sy - 4} width={sw + 4} height="4" rx="1.4" fill={carbon} />
            <rect x={sx - 2} y={sy + 1.4} width={sw + 4} height="4.4" rx="1.6" fill={carbon} />
            <rect x={sx - 2} y={sy + 1.4} width={sw + 4} height="1.2" fill={accent} />
            <rect x={sx - 3} y={sy - 5} width="3" height="14" rx="1.2" fill={accent} />
            <rect x={sx + sw} y={sy - 5} width="3" height="14" rx="1.2" fill={accent} />
          </g>
        );
      default:
        return base;
    }
  })();

  /* ----- Finish (qoplama) ----- */
  const finishOverlay = (() => {
    if (finish === 'gloss' || finish === 'pearl') {
      return <path d={`M${30 - hw - 4},${y1 + 2} C${30 - hw},${y1 - 4} ${30 + hw},${y1 - 4} ${30 + hw + 4},${y1 + 2} L${30 + hw},${y2} L${30 - hw},${y2} Z`} fill="rgba(255,255,255,0.17)" />;
    }
    if (finish === 'metal') return <rect x="0" y="0" width="60" height="120" fill={`url(#${id('mt')})`} />;
    if (finish === 'carbon') return <rect x="0" y="0" width="60" height="120" fill={`url(#${id('cbn')})`} opacity="0.55" />;
    return null;
  })();

  return (
    <svg viewBox="0 0 60 120" width="100%" height="100%" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <style>{ART_CSS}</style>
        <linearGradient id={id('b')} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={dark} />
          <stop offset="0.3" stopColor={paint} />
          <stop offset="0.5" stopColor={lightP} />
          <stop offset="0.7" stopColor={paint} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={id('gl')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={glassTop} />
          <stop offset="1" stopColor={glassBot} />
        </linearGradient>
        <linearGradient id={id('mt')} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.1" />
        </linearGradient>
        <pattern id={id('chk')} width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill={accent} />
          <rect width="3.5" height="3.5" fill="#0b0b0f" />
          <rect x="3.5" y="3.5" width="3.5" height="3.5" fill="#0b0b0f" />
        </pattern>
        <pattern id={id('cbn')} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#0f1116" />
          <rect width="2" height="2" fill="#262a33" />
          <rect x="2" y="2" width="2" height="2" fill="#262a33" />
        </pattern>
        <pattern id={id('cb')} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="#0f1116" />
          <rect width="1.5" height="1.5" fill="#2b303b" />
          <rect x="1.5" y="1.5" width="1.5" height="1.5" fill="#2b303b" />
        </pattern>
        <clipPath id={id('cp')}><path d={spec.d} /></clipPath>
        <filter id={id('nf')} x="-60%" y="-30%" width="220%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={id('lf')} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      {/* Neon yoritgich (mashina tagida) */}
      {glow && neon && (
        <rect x="2" y="6" width="56" height="108" rx="24" fill={neon} filter={`url(#${id('nf')})`} style={{ animation: 'ca-neon 2.2s ease-in-out infinite' }} />
      )}

      {/* Soya */}
      <ellipse cx="33" cy="66" rx="28" ry="57" fill="rgba(0,0,0,0.32)" />

      {/* G'ildiraklar va disklar */}
      {spec.wheels.map(([x, y, w, h], i) => {
        const left = x < 30;
        const rw2 = w * 0.42;
        const rxp = left ? x - 0.4 : x + w - rw2 + 0.4;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx={Math.min(3.5, w / 2.4)} fill="#0a0a0d" />
            {[0.25, 0.5, 0.75].map((t) => (<rect key={t} x={x + 1} y={y + h * t} width={w - 2} height="0.5" fill="rgba(255,255,255,.1)" />))}
            <rect x={rxp} y={y + h * 0.2} width={rw2} height={h * 0.6} rx="1.4" fill={rim} />
            <rect x={rxp} y={y + h * 0.2} width={rw2} height={h * 0.18} rx="1" fill="rgba(255,255,255,.45)" />
            <rect x={rxp + (left ? rw2 * 0.55 : 0)} y={y + h * 0.44} width={rw2 * 0.45} height={h * 0.12} fill="#e11d2e" />
          </g>
        );
      })}

      {/* Formula: old qanot */}
      {spec.formula && (
        <g>
          <rect x="5" y="1" width="50" height="5.4" rx="1.8" fill={carbon} />
          <rect x="5" y="1" width="50" height="1.5" rx="0.8" fill={accent} />
          <rect x="3" y="-1" width="2.6" height="10" rx="1" fill={paint} />
          <rect x="54.4" y="-1" width="2.6" height="10" rx="1" fill={paint} />
        </g>
      )}

      {/* Korpus + livery + qoplama (bir guruhda, filtr uchun) */}
      <g style={bodyStyle}>
        <path d={spec.d} fill={`url(#${id('b')})`} stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" />
        <g clipPath={`url(#${id('cp')})`}>
          {livery}
          {finishOverlay}
        </g>
      </g>

      {/* Kapot detallari */}
      {hood}

      {/* Old oyna */}
      {spec.formula ? (
        <g>
          <ellipse cx="30" cy="52" rx="6.5" ry="9" fill="#0b0b10" />
          <circle cx="30" cy="51" r="4.4" fill={accent} />
          <rect x="26" y="49.5" width="8" height="2.6" rx="1.2" fill={`url(#${id('gl')})`} />
        </g>
      ) : (
        <path d={spec.glass} fill={`url(#${id('gl')})`} stroke="rgba(0,0,0,0.55)" strokeWidth="0.6" />
      )}

      {/* Tom */}
      {spec.formula ? (
        <rect x={rx} y={ry + 8} width={rw} height={rh} rx={rw / 2} fill={paint} stroke="rgba(0,0,0,.4)" strokeWidth="0.6" />
      ) : (
        <>
          <rect x={rx} y={ry} width={rw} height={rh} rx={spec.roof[4]} fill={dark} stroke="rgba(0,0,0,.35)" strokeWidth="0.5" />
          <rect x={rx + 3} y={ry + 3} width={rw - 6} height={Math.min(8, rh / 3)} rx="2.5" fill="rgba(255,255,255,0.12)" />
        </>
      )}
      {roof}

      {/* Orqa oyna */}
      <path d={spec.rear} fill={glassBot} opacity="0.95" />

      {/* Ko'zgular */}
      {spec.mirrors.map(([mx, my], i) => (<ellipse key={i} cx={mx} cy={my} rx="3.4" ry="2.4" fill={mix(paint, '#000000', 0.35)} stroke="rgba(0,0,0,.4)" strokeWidth="0.4" />))}

      {/* Faralar */}
      {spec.lights.map(([lx, ly, lrx, lry], i) => (
        <g key={i}>
          <ellipse cx={lx} cy={ly} rx={lrx + 2} ry={lry + 2} fill={lightHex} opacity="0.45" filter={`url(#${id('lf')})`} />
          <ellipse cx={lx} cy={ly} rx={lrx} ry={lry} fill={lightHex} />
        </g>
      ))}

      {/* Orqa chiroqlar */}
      {spec.tails.map(([tx, ty, tw, th], i) => (<rect key={i} x={tx} y={ty} width={tw} height={th} rx="1.4" fill="#ff2a2a" />))}

      {/* Raqam */}
      {!spec.formula && (
        <g>
          <rect x={spec.plate[0]} y={spec.plate[1]} width="14" height="6" rx="1" fill="#f8fafc" stroke="#111827" strokeWidth="0.4" />
          <text x={spec.plate[0] + 7} y={spec.plate[1] + 4.4} textAnchor="middle" fontSize="3.8" fontWeight="800" fill="#111827" fontFamily="Arial,sans-serif">{plate}</text>
        </g>
      )}

      {/* Spoyler (eng ustida) */}
      {spoiler}
    </svg>
  );
};