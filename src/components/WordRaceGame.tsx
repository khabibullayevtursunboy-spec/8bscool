/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import {
  Flag,
  Trophy,
  Timer,
  Volume2,
  VolumeX,
  X,
  Zap,
  Coins,
  Play,
  RotateCcw,
  Gauge,
  Check,
  Medal,
  Crown,
  Flame,
  Eye,
  Wrench
} from 'lucide-react';
import { CarArt, flameCss, lightColor } from './CarArt';
import { CarGarage, ClassBadge } from './CarGarage';
import { CarRating } from './CarRating';
import {
  Garage, Look, makeLook, loadGarage, saveGarage, recordRace, perksOf, perfSum, ratingOf, PERF_BY_KEY
} from '../services/garage';

/* ===================== SO'ZLAR BAZASI (inglizcha → o'zbekcha) ===================== */

const WORDS: Array<[string, string]> = [
  ['apple', 'olma'], ['book', 'kitob'], ['water', 'suv'], ['house', 'uy'], ['school', 'maktab'],
  ['teacher', "o'qituvchi"], ['student', "o'quvchi"], ['friend', "do'st"], ['family', 'oila'],
  ['mother', 'ona'], ['father', 'ota'], ['cat', 'mushuk'], ['dog', 'it'], ['bird', 'qush'],
  ['fish', 'baliq'], ['horse', 'ot'], ['cow', 'sigir'], ['sheep', "qo'y"], ['chicken', 'tovuq'],
  ['bread', 'non'], ['milk', 'sut'], ['tea', 'choy'], ['rice', 'guruch'], ['meat', "go'sht"],
  ['egg', 'tuxum'], ['salt', 'tuz'], ['sugar', 'shakar'], ['red', 'qizil'], ['blue', "ko'k"],
  ['green', 'yashil'], ['yellow', 'sariq'], ['black', 'qora'], ['white', 'oq'], ['big', 'katta'],
  ['small', 'kichik'], ['fast', 'tez'], ['slow', 'sekin'], ['hot', 'issiq'], ['cold', 'sovuq'],
  ['good', 'yaxshi'], ['bad', 'yomon'], ['new', 'yangi'], ['old', 'eski'], ['happy', 'xursand'],
  ['sad', 'xafa'], ['city', 'shahar'], ['village', 'qishloq'], ['street', "ko'cha"], ['road', "yo'l"],
  ['car', 'mashina'], ['bus', 'avtobus'], ['train', 'poyezd'], ['plane', 'samolyot'],
  ['bicycle', 'velosiped'], ['sun', 'quyosh'], ['moon', 'oy'], ['star', 'yulduz'], ['sky', 'osmon'],
  ['rain', "yomg'ir"], ['snow', 'qor'], ['wind', 'shamol'], ['tree', 'daraxt'], ['flower', 'gul'],
  ['river', 'daryo'], ['mountain', "tog'"], ['sea', 'dengiz'], ['forest', "o'rmon"], ['day', 'kun'],
  ['night', 'tun'], ['morning', 'ertalab'], ['evening', 'kechqurun'], ['week', 'hafta'],
  ['year', 'yil'], ['hand', "qo'l"], ['head', 'bosh'], ['eye', "ko'z"], ['ear', 'quloq'],
  ['nose', 'burun'], ['mouth', "og'iz"], ['leg', 'oyoq'], ['heart', 'yurak'], ['door', 'eshik'],
  ['window', 'deraza'], ['table', 'stol'], ['chair', 'stul'], ['pen', 'ruchka'], ['pencil', 'qalam'],
  ['bag', 'sumka'], ['phone', 'telefon'], ['computer', 'kompyuter'], ['lesson', 'dars'],
  ['homework', 'uy vazifasi'], ['question', 'savol'], ['answer', 'javob'], ['language', 'til'],
  ['country', 'davlat'], ['money', 'pul'], ['shop', "do'kon"], ['market', 'bozor'],
  ['doctor', 'shifokor'], ['hospital', 'kasalxona'], ['work', 'ish'], ['play', "o'ynamoq"],
  ['read', "o'qimoq"], ['write', 'yozmoq'], ['eat', 'yemoq'], ['drink', 'ichmoq'],
  ['sleep', 'uxlamoq'], ['run', 'yugurmoq'], ['walk', 'yurmoq'], ['speak', 'gapirmoq'],
  ['listen', 'tinglamoq'], ['open', 'ochmoq'], ['close', 'yopmoq'], ['love', 'sevmoq'],
  ['help', 'yordam'], ['winter', 'qish'], ['summer', 'yoz'], ['spring', 'bahor'],
  ['autumn', 'kuz'], ['Monday', 'dushanba'], ['Friday', 'juma'], ['one', 'bir'], ['two', 'ikki'],
  ['three', 'uch'], ['ten', "o'n"], ['hundred', 'yuz'], ['thousand', 'ming']
];

interface Pair { id: number; en: string; uz: string }
interface WordItem { pid: number; text: string }
interface Board { left: WordItem[]; right: WordItem[] }

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildDeck = (): Pair[] => shuffle(WORDS.map(([en, uz], i) => ({ id: i, en, uz })));

/* ===================== SOZLAMALAR ===================== */

const STEPS = 12;            // Marraga yetish uchun nechta juftlik topish kerak
const PAIRS_PER_BOARD = 2;   // Bir ekranda nechta juftlik (2 ta inglizcha + 2 ta o'zbekcha)
const DAILY_CAP = 250;       // Bu o'yindan bir kunda olinadigan maksimal tanga
const PLACE_COINS = [30, 18, 10, 4];
const PLAYER_COLOR = '#3b82f6';

type DiffKey = 'easy' | 'medium' | 'hard';

interface DiffConfig {
  label: string;
  desc: string;
  botTimes: number[]; // botlar marraga necha soniyada yetadi (o'rtacha)
  mult: number;       // mukofot koeffitsienti
  color: string;
}

const DIFFS: Record<DiffKey, DiffConfig> = {
  easy: { label: 'Oson', desc: 'Botlar sekin haydaydi', botTimes: [100, 112, 124], mult: 1, color: '#22c55e' },
  medium: { label: "O'rta", desc: 'Botlar tez va aniq', botTimes: [64, 72, 80], mult: 1.5, color: '#f59e0b' },
  hard: { label: 'Qiyin', desc: 'Faqat eng tezlar yutadi', botTimes: [44, 50, 56], mult: 2, color: '#ef4444' }
};

const BOT_STYLES: Array<{ name: string; color: string; look: Look }> = [
  {
    name: 'Shamol', color: '#ef4444',
    look: makeLook({ body: 'muscle', paint: 'red', finish: 'metal', livery: 'center', rims: 'black', spoiler: 'gt', hood: 'scoop', neon: 'red', tint: 'dark' })
  },
  {
    name: 'Chaqmoq', color: '#f59e0b',
    look: makeLook({ body: 'sport', paint: 'orange', accent: 'black', livery: 'side', rims: 'gold', spoiler: 'duck', hood: 'vents', lights: 'yellow', neon: 'gold' })
  },
  {
    name: 'Turbo', color: '#22c55e',
    look: makeLook({ body: 'hyper', paint: 'green', finish: 'carbon', accent: 'lime', livery: 'arrow', rims: 'neon', spoiler: 'big', lights: 'green', neon: 'green', flame: 'green' })
  }
];

const ownerNameOf = (u: User): string => {
  const x = u as unknown as Record<string, unknown>;
  for (const k of ['name', 'fullName', 'full_name', 'firstName', 'username', 'login']) {
    const v = x[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return "O'quvchi";
};

// Chiziqlar (yo'laklar) tartibi: 0,1,3 — botlar, 2 — o'yinchi
const BOT_LANES = [0, 1, 3];
const PLAYER_LANE = 2;

/* ===================== SAQLASH (localStorage) ===================== */

interface RaceStats {
  races: number;
  wins: number;
  best: Partial<Record<DiffKey, number>>; // eng yaxshi vaqt (ms)
}

const statsKey = (uid: unknown) => `wordrace_stats_${String(uid)}`;
const dailyKey = (uid: unknown) => `wordrace_daily_${String(uid)}`;
const SOUND_KEY = 'wordrace_sound';

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const loadStats = (uid: unknown): RaceStats => {
  try {
    const raw = localStorage.getItem(statsKey(uid));
    if (raw) {
      const p = JSON.parse(raw);
      return { races: p.races || 0, wins: p.wins || 0, best: p.best || {} };
    }
  } catch { /* ignore */ }
  return { races: 0, wins: 0, best: {} };
};

const saveStats = (uid: unknown, s: RaceStats) => {
  try { localStorage.setItem(statsKey(uid), JSON.stringify(s)); } catch { /* ignore */ }
};

const loadDaily = (uid: unknown): number => {
  try {
    const raw = localStorage.getItem(dailyKey(uid));
    if (raw) {
      const p = JSON.parse(raw);
      if (p.date === todayStr()) return Number(p.coins) || 0;
    }
  } catch { /* ignore */ }
  return 0;
};

const saveDaily = (uid: unknown, coins: number) => {
  try { localStorage.setItem(dailyKey(uid), JSON.stringify({ date: todayStr(), coins })); } catch { /* ignore */ }
};

/* ===================== OVOZ (WebAudio, fayl kerak emas) ===================== */

let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
};

const tone = (freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.06, delay = 0) => {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
};

interface EngineNodes { osc: OscillatorNode; osc2: OscillatorNode; gain: GainNode; filter: BiquadFilterNode }

/* ===================== YORDAMCHI TIPLAR ===================== */

type Phase = 'intro' | 'countdown' | 'racing' | 'finishing' | 'finished';

interface BotState {
  id: string;
  name: string;
  color: string;
  look: Look;
  lane: number;
  base: number;       // sekundiga qancha progress
  mult: number;       // tasodifiy tezlik o'zgarishi
  progress: number;   // 0..1
  finishedAt: number | null;
}

interface StandingRow {
  id: string;
  name: string;
  color: string;
  you: boolean;
  time: number | null;
  progress: number;
}

interface FinalResult {
  rows: StandingRow[];
  place: number;
  time: number;
  coins: number;
  rawCoins: number;
  xp: number;
  mistakes: number;
  capped: boolean;
  newBest: boolean;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const fmtTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
const ORDINAL = ['1-o\'rin', '2-o\'rin', '3-o\'rin', '4-o\'rin'];

/* Yo'l chetidagi daraxtlar (bir marta tasodifiy yaratiladi) */
const makeTrees = () => {
  const out: Array<{ side: 'l' | 'r'; top: number; x: number; size: number; hue: number }> = [];
  for (let i = 0; i < 7; i++) {
    out.push({ side: 'l', top: (i / 7) * 100 + Math.random() * 8, x: 2 + Math.random() * 14, size: 26 + Math.random() * 26, hue: Math.random() });
    out.push({ side: 'r', top: (i / 7) * 100 + Math.random() * 8, x: 2 + Math.random() * 14, size: 26 + Math.random() * 26, hue: Math.random() });
  }
  return out;
};

/* ===================== KOMPONENT ===================== */

interface WordRaceGameProps {
  currentUser: User;
  onUserStatsUpdated: () => void;
}

type View = 'race' | 'garage' | 'rating';

export function WordRaceGame({ currentUser, onUserStatsUpdated }: WordRaceGameProps) {
  const uid = String(currentUser.id);
  const owner = ownerNameOf(currentUser);
  const [view, setView] = useState<View>('race');
  const [garage, setGarageState] = useState<Garage>(() => loadGarage(currentUser.id));
  const garageRef = useRef<Garage>(garage);
  const setGarage = (g: Garage) => { garageRef.current = g; setGarageState(g); };

  const [combo, setCombo] = useState(0);
  const [nitroLeft, setNitroLeft] = useState(0);
  const [radarLeft, setRadarLeft] = useState(0);
  const [hintPid, setHintPid] = useState<number | null>(null);
  const [nitroFx, setNitroFx] = useState(false);
  const [playerFin, setPlayerFin] = useState<number | null>(null);

  const [phase, setPhase] = useState<Phase>('intro');
  const [diff, setDiff] = useState<DiffKey>('medium');
  const [count, setCount] = useState(3);               // 3,2,1,0(GO)
  const [steps, setSteps] = useState(0);
  const [bots, setBots] = useState<BotState[]>([]);
  const [board, setBoard] = useState<Board>({ left: [], right: [] });
  const [matched, setMatched] = useState<number[]>([]);
  const [selEn, setSelEn] = useState<number | null>(null);
  const [selUz, setSelUz] = useState<number | null>(null);
  const [wrong, setWrong] = useState<{ en: number; uz: number } | null>(null);
  const [boost, setBoost] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);
  const [final, setFinal] = useState<FinalResult | null>(null);
  const [sound, setSound] = useState<boolean>(() => {
    try { return localStorage.getItem(SOUND_KEY) !== 'off'; } catch { return true; }
  });
  const [stats, setStats] = useState<RaceStats>(() => loadStats(currentUser.id));
  const [dailyUsed, setDailyUsed] = useState<number>(() => loadDaily(currentUser.id));

  const trees = useMemo(makeTrees, []);

  // Ref'lar: interval/timeout ichida eskirgan (stale) qiymat bo'lmasligi uchun
  const phaseRef = useRef<Phase>('intro');
  const diffRef = useRef<DiffKey>('medium');
  const stepsRef = useRef(0);
  const botsRef = useRef<BotState[]>([]);
  const deckRef = useRef<Pair[]>([]);
  const deckIdxRef = useRef(0);
  const boardRef = useRef<Board>({ left: [], right: [] });
  const matchedRef = useRef<number[]>([]);
  const selRef = useRef<{ en: number | null; uz: number | null }>({ en: null, uz: null });
  const lockRef = useRef(false);
  const mistakesRef = useRef(0);
  const startRef = useRef(0);
  const lastTickRef = useRef(0);
  const soundRef = useRef(sound);
  const timersRef = useRef<number[]>([]);
  const engineRef = useRef<EngineNodes | null>(null);
  const boostTimerRef = useRef<number | null>(null);
  const comboRef = useRef(0);
  const nitroLeftRef = useRef(0);
  const radarLeftRef = useRef(0);
  const nitroTimerRef = useRef<number | null>(null);

  useEffect(() => { soundRef.current = sound; }, [sound]);

  // Foydalanuvchi reytingda ko'rinishi uchun garajni bir marta saqlab qo'yamiz
  useEffect(() => {
    saveGarage(uid, garageRef.current, owner);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  const clearAllTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    if (boostTimerRef.current) window.clearTimeout(boostTimerRef.current);
    boostTimerRef.current = null;
    if (nitroTimerRef.current) window.clearTimeout(nitroTimerRef.current);
    nitroTimerRef.current = null;
  };

  const sfx = (kind: 'click' | 'ok' | 'bad' | 'beep' | 'go' | 'win' | 'lose' | 'nitro' | 'radar') => {
    if (!soundRef.current) return;
    switch (kind) {
      case 'click': tone(520, 0.06, 'triangle', 0.04); break;
      case 'ok': tone(660, 0.09, 'triangle', 0.07); tone(990, 0.14, 'triangle', 0.06, 0.08); break;
      case 'bad': tone(180, 0.22, 'sawtooth', 0.06); tone(130, 0.25, 'sawtooth', 0.05, 0.1); break;
      case 'beep': tone(440, 0.18, 'square', 0.05); break;
      case 'go': tone(880, 0.5, 'square', 0.06); break;
      case 'win': [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.25, 'triangle', 0.07, i * 0.13)); break;
      case 'lose': [392, 330, 262].forEach((f, i) => tone(f, 0.28, 'sine', 0.06, i * 0.16)); break;
      case 'nitro': tone(220, 0.5, 'sawtooth', 0.06); tone(440, 0.45, 'sawtooth', 0.05, 0.05); tone(880, 0.4, 'triangle', 0.05, 0.12); break;
      case 'radar': tone(1200, 0.1, 'sine', 0.06); tone(1600, 0.14, 'sine', 0.06, 0.12); break;
    }
  };

  /* ---- Motor ovozi ---- */
  const startEngine = () => {
    if (!soundRef.current || engineRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc2.type = 'square';
    osc.frequency.value = 62;
    osc2.frequency.value = 31;
    filter.type = 'lowpass';
    filter.frequency.value = 380;
    gain.gain.value = 0.0001;
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(ctx.destination);
    osc.start();
    osc2.start();
    gain.gain.setTargetAtTime(0.018, ctx.currentTime, 0.2);
    engineRef.current = { osc, osc2, gain, filter };
  };

  const setEngineSpeed = (k: number) => {
    const e = engineRef.current;
    const ctx = audioCtx;
    if (!e || !ctx) return;
    e.osc.frequency.setTargetAtTime(58 + k * 70, ctx.currentTime, 0.12);
    e.osc2.frequency.setTargetAtTime(29 + k * 35, ctx.currentTime, 0.12);
    e.filter.frequency.setTargetAtTime(320 + k * 500, ctx.currentTime, 0.12);
  };

  const stopEngine = () => {
    const e = engineRef.current;
    const ctx = audioCtx;
    engineRef.current = null;
    if (!e || !ctx) return;
    try {
      e.gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
      e.osc.stop(ctx.currentTime + 0.4);
      e.osc2.stop(ctx.currentTime + 0.4);
    } catch { /* ignore */ }
  };

  // Ovoz o'chirilsa motorni ham o'chiramiz
  useEffect(() => {
    if (!sound) stopEngine();
    else if (phaseRef.current === 'racing') startEngine();
    try { localStorage.setItem(SOUND_KEY, sound ? 'on' : 'off'); } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sound]);

  // Komponent yopilganda hammasini tozalash
  useEffect(() => {
    return () => {
      clearAllTimers();
      stopEngine();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Yangi so'zlar taxtasi ---- */
  const loadBoard = () => {
    if (deckIdxRef.current + PAIRS_PER_BOARD > deckRef.current.length) {
      deckRef.current = buildDeck();
      deckIdxRef.current = 0;
    }
    const pairs = deckRef.current.slice(deckIdxRef.current, deckIdxRef.current + PAIRS_PER_BOARD);
    deckIdxRef.current += PAIRS_PER_BOARD;
    const next: Board = {
      left: shuffle(pairs.map((p) => ({ pid: p.id, text: p.en }))),
      right: shuffle(pairs.map((p) => ({ pid: p.id, text: p.uz })))
    };
    boardRef.current = next;
    matchedRef.current = [];
    selRef.current = { en: null, uz: null };
    setBoard(next);
    setMatched([]);
    setSelEn(null);
    setSelUz(null);
    setWrong(null);
  };

  /* ---- Poygani boshlash ---- */
  const startRace = (d: DiffKey) => {
    clearAllTimers();
    stopEngine();
    diffRef.current = d;
    setDiff(d);
    const cfg = DIFFS[d];

    // O'yinchi mashinasi qancha kuchli bo'lsa, botlar ham shuncha kuchayadi (adolatli bo'lishi uchun)
    const perks = perksOf(garageRef.current.levels);
    const botScale = 1 + 0.008 * perfSum(garageRef.current.levels);
    const initialBots: BotState[] = BOT_STYLES.map((s, i) => ({
      id: `bot-${i}`,
      name: s.name,
      color: s.color,
      look: s.look,
      lane: BOT_LANES[i],
      base: (botScale / cfg.botTimes[i]) * (1 / (0.95 + Math.random() * 0.1)),
      mult: 1,
      progress: 0,
      finishedAt: null
    }));
    botsRef.current = initialBots;
    setBots(initialBots);

    deckRef.current = buildDeck();
    deckIdxRef.current = 0;
    stepsRef.current = 0;
    mistakesRef.current = 0;
    comboRef.current = 0;
    nitroLeftRef.current = perks.nitroCharges;
    radarLeftRef.current = perks.radar;
    setCombo(0);
    setNitroLeft(perks.nitroCharges);
    setRadarLeft(perks.radar);
    setHintPid(null);
    setNitroFx(false);
    setPlayerFin(null);
    lockRef.current = true;
    setSteps(0);
    setElapsed(0);
    setBoost(false);
    setBanner(null);
    setFinal(null);
    setDailyUsed(loadDaily(currentUser.id));
    loadBoard();

    phaseRef.current = 'countdown';
    setPhase('countdown');
    setCount(3);
    sfx('beep');

    later(() => { setCount(2); sfx('beep'); }, 900);
    later(() => { setCount(1); sfx('beep'); }, 1800);
    later(() => {
      setCount(0);
      sfx('go');
      startRef.current = performance.now();
      lastTickRef.current = performance.now();
      lockRef.current = false;
      phaseRef.current = 'racing';
      setPhase('racing');
      startEngine();
    }, 2700);
  };

  /* ---- Poyga davomida: botlar harakati va vaqt ---- */
  useEffect(() => {
    if (phase !== 'racing' && phase !== 'finishing') return;
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min((now - lastTickRef.current) / 1000, 0.25);
      lastTickRef.current = now;
      const t = now - startRef.current;

      let changed = false;
      const next = botsRef.current.map((b) => {
        if (b.finishedAt !== null) return b;
        const mult = Math.max(0.55, Math.min(1.45, b.mult + (1 - b.mult) * 0.08 + (Math.random() - 0.5) * 0.18));
        const progress = Math.min(1, b.progress + b.base * mult * dt);
        changed = true;
        if (progress >= 1) {
          if (phaseRef.current === 'racing') {
            setBanner(`${b.name} marraga yetdi!`);
            later(() => setBanner(null), 1800);
          }
          return { ...b, mult, progress: 1, finishedAt: t };
        }
        return { ...b, mult, progress };
      });
      if (changed) {
        botsRef.current = next;
        setBots(next);
      }
      if (phaseRef.current === 'racing') {
        setElapsed(t);
        setEngineSpeed(nitroTimerRef.current ? 1.6 : boostTimerRef.current ? 1 : 0.55);
        // Aerodinamika: mashina o'zi ham sekin oldinga siljiydi (marraga faqat to'g'ri javob bilan yetiladi)
        const drift = perksOf(garageRef.current.levels).drift;
        if (drift > 0 && stepsRef.current < STEPS - 0.6) {
          stepsRef.current = Math.min(STEPS - 0.6, stepsRef.current + drift * dt);
          setSteps(stepsRef.current);
        }
      }
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ---- Marraga yetish ---- */
  const finishRace = () => {
    const t = performance.now() - startRef.current;
    phaseRef.current = 'finishing';
    setPhase('finishing');
    setElapsed(t);
    setPlayerFin(t);
    lockRef.current = true;
    stopEngine();

    const rows: StandingRow[] = [
      ...botsRef.current.map((b) => ({
        id: b.id, name: b.name, color: b.color, you: false, time: b.finishedAt, progress: b.progress
      })),
      { id: 'you', name: 'Siz', color: PLAYER_COLOR, you: true, time: t, progress: 1 }
    ];
    rows.sort((a, b) => {
      if (a.time !== null && b.time !== null) return a.time - b.time;
      if (a.time !== null) return -1;
      if (b.time !== null) return 1;
      return b.progress - a.progress;
    });
    const place = rows.findIndex((r) => r.you) + 1;

    // Mukofot
    const cfg = DIFFS[diffRef.current];
    const mistakes = mistakesRef.current;
    const rawCoins = Math.round((PLACE_COINS[place - 1] + (mistakes === 0 ? 10 : 0)) * cfg.mult);
    const used = loadDaily(currentUser.id);
    const left = Math.max(0, DAILY_CAP - used);
    const coins = Math.min(rawCoins, left);
    const xp = Math.round(coins * 1.2);
    if (coins > 0) {
      StorageService.addCoinsAndXp(currentUser.id, coins, xp);
      saveDaily(currentUser.id, used + coins);
      setDailyUsed(used + coins);
      onUserStatsUpdated();
    }

    // Statistika
    const prev = loadStats(currentUser.id);
    const bestPrev = prev.best[diffRef.current];
    const newBest = place === 1 && (bestPrev === undefined || t < bestPrev);
    const updated: RaceStats = {
      races: prev.races + 1,
      wins: prev.wins + (place === 1 ? 1 : 0),
      best: newBest ? { ...prev.best, [diffRef.current]: t } : prev.best
    };
    saveStats(currentUser.id, updated);
    setStats(updated);

    // Garaj statistikasi (g'alaba reytingga ball qo'shadi)
    setGarage(recordRace(uid, owner, garageRef.current, place));

    setFinal({ rows, place, time: t, coins, rawCoins, xp, mistakes, capped: coins < rawCoins, newBest });
    sfx(place <= 2 ? 'win' : 'lose');

    later(() => {
      phaseRef.current = 'finished';
      setPhase('finished');
    }, 2600);
  };

  /* ---- Tezlashish effekti ---- */
  const triggerBoost = () => {
    setBoost(true);
    if (boostTimerRef.current) window.clearTimeout(boostTimerRef.current);
    boostTimerRef.current = window.setTimeout(() => {
      setBoost(false);
      boostTimerRef.current = null;
    }, 900);
  };

  /* ---- Juftlikni tekshirish ---- */
  const evaluate = (enId: number, uzId: number) => {
    lockRef.current = true;
    if (enId === uzId) {
      matchedRef.current = [...matchedRef.current, enId];
      setMatched(matchedRef.current);
      selRef.current = { en: null, uz: null };
      setSelEn(null);
      setSelUz(null);
      setHintPid(null);

      // Mashina kuchi: dvigatel har bir qadamni kattalashtiradi, turbo esa har 3 ta ketma-ket javobga bonus beradi
      const perks = perksOf(garageRef.current.levels);
      let gain = perks.stepGain;
      comboRef.current += 1;
      setCombo(comboRef.current);
      if (comboRef.current % 3 === 0 && perks.comboBonus > 0) {
        gain += perks.comboBonus;
        setBanner(`TURBO! +${perks.comboBonus.toFixed(2)}`);
        later(() => setBanner(null), 1400);
      }
      stepsRef.current += gain;
      setSteps(stepsRef.current);
      triggerBoost();
      sfx('ok');

      if (stepsRef.current >= STEPS - 1e-6) {
        finishRace();
        return;
      }
      if (matchedRef.current.length >= PAIRS_PER_BOARD) {
        later(() => {
          if (phaseRef.current !== 'racing') return;
          loadBoard();
          lockRef.current = false;
        }, 450);
      } else {
        lockRef.current = false;
      }
    } else {
      mistakesRef.current += 1;
      setWrong({ en: enId, uz: uzId });
      // Shinalar xato jarimasini kamaytiradi
      stepsRef.current = Math.max(0, stepsRef.current - perksOf(garageRef.current.levels).penalty);
      setSteps(stepsRef.current);
      comboRef.current = 0;
      setCombo(0);
      sfx('bad');
      later(() => {
        selRef.current = { en: null, uz: null };
        setSelEn(null);
        setSelUz(null);
        setWrong(null);
        lockRef.current = false;
      }, 550);
    }
  };

  /* ---- Nitro: bir zumda oldinga otilib ketish ---- */
  const fireNitro = () => {
    if (phaseRef.current !== 'racing' || nitroLeftRef.current <= 0) return;
    const perks = perksOf(garageRef.current.levels);
    nitroLeftRef.current -= 1;
    setNitroLeft(nitroLeftRef.current);
    stepsRef.current += perks.nitroBonus;
    setSteps(stepsRef.current);
    triggerBoost();
    setNitroFx(true);
    if (nitroTimerRef.current) window.clearTimeout(nitroTimerRef.current);
    nitroTimerRef.current = window.setTimeout(() => {
      setNitroFx(false);
      nitroTimerRef.current = null;
    }, 1500);
    setBanner('NITRO!');
    later(() => setBanner(null), 1100);
    sfx('nitro');
    if (stepsRef.current >= STEPS - 1e-6) finishRace();
  };

  /* ---- Radar: to'g'ri juftlikni yoritadi ---- */
  const fireRadar = () => {
    if (phaseRef.current !== 'racing' || radarLeftRef.current <= 0) return;
    const left = boardRef.current.left.filter((w) => !matchedRef.current.includes(w.pid));
    if (left.length === 0) return;
    const target = left[Math.floor(Math.random() * left.length)];
    radarLeftRef.current -= 1;
    setRadarLeft(radarLeftRef.current);
    setHintPid(target.pid);
    sfx('radar');
    later(() => setHintPid(null), 3000);
  };

  const pick = (side: 'en' | 'uz', pid: number) => {
    if (phaseRef.current !== 'racing' || lockRef.current) return;
    if (matchedRef.current.includes(pid)) return;
    const sel = selRef.current;
    if (side === 'en') sel.en = sel.en === pid ? null : pid;
    else sel.uz = sel.uz === pid ? null : pid;
    setSelEn(sel.en);
    setSelUz(sel.uz);
    sfx('click');
    if (sel.en !== null && sel.uz !== null) evaluate(sel.en, sel.uz);
  };

  // Klaviatura: 1,2 — inglizcha; 3,4 — o'zbekcha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'racing') return;
      const b = boardRef.current;
      if (e.key === '1' && b.left[0]) pick('en', b.left[0].pid);
      else if (e.key === '2' && b.left[1]) pick('en', b.left[1].pid);
      else if (e.key === '3' && b.right[0]) pick('uz', b.right[0].pid);
      else if (e.key === '4' && b.right[1]) pick('uz', b.right[1].pid);
      else if (e.key === 'n' || e.key === 'N') fireNitro();
      else if (e.key === 'h' || e.key === 'H') fireRadar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quitRace = () => {
    clearAllTimers();
    stopEngine();
    phaseRef.current = 'intro';
    setPhase('intro');
    setBanner(null);
  };

  /* ---- Hisoblangan qiymatlar ---- */
  const playerP = clamp01(steps / STEPS);
  const running = phase === 'racing' || phase === 'finishing';
  const inRace = phase === 'countdown' || running;

  const carStyle = (p: number, lane: number): React.CSSProperties => ({
    bottom: `calc(4% + ${p} * 69%)`,
    left: `calc(3% + 23.5% * ${lane + 0.5})`
  });

  interface RaceCar {
    key: string; lane: number; p: number; color: string; look: Look; name: string; you: boolean; fin: number | null;
  }
  const myLook = garage.equipped;
  const laneCars: RaceCar[] = [
    ...bots.map((b) => ({ key: b.id, lane: b.lane, p: b.progress, color: b.color, look: b.look, name: b.name, you: false, fin: b.finishedAt })),
    { key: 'you', lane: PLAYER_LANE, p: playerP, color: PLAYER_COLOR, look: myLook, name: 'Siz', you: true, fin: playerFin }
  ];
  // Bosh ekranda mashinalar start chizig'ida turadi
  const previewCars: RaceCar[] = [
    ...BOT_STYLES.map((s, i) => ({ key: `p-${i}`, lane: BOT_LANES[i], p: 0, color: s.color, look: s.look, name: s.name, you: false, fin: null })),
    { key: 'you', lane: PLAYER_LANE, p: 0, color: PLAYER_COLOR, look: myLook, name: 'Siz', you: true, fin: null }
  ];
  const carsToShow = phase === 'intro' ? previewCars : laneCars;

  // Jonli o'rinlar: marraga yetganlar vaqt bo'yicha, qolganlar bosib o'tgan masofa bo'yicha
  const rankKey = (c: RaceCar) => (c.fin !== null ? 10 - c.fin / 1e6 : c.p);
  const sorted = [...laneCars].sort((a, b) => rankKey(b) - rankKey(a));
  const rankOf = (key: string) => sorted.findIndex((c) => c.key === key) + 1;
  const livePlace = rankOf('you');

  const myRating = ratingOf(garage);
  const myPerks = perksOf(garage.levels);
  const hasPerks = myPerks.nitroCharges > 0 || myPerks.radar > 0;
  const showNav = view !== 'race' || phase === 'intro' || phase === 'finished';

  const dailyLeft = Math.max(0, DAILY_CAP - dailyUsed);

  /* ===================== RENDER ===================== */

  return (
    <div className="rc-root">
      <style>{CSS}</style>

      {/* ---------- YUQORI MENYU ---------- */}
      {showNav && (
        <div className="rc-nav">
          <button type="button" className={view === 'race' ? 'on' : ''} onClick={() => setView('race')}>
            <Flag size={15} /> Poyga
          </button>
          <button type="button" className={view === 'garage' ? 'on' : ''} onClick={() => setView('garage')}>
            <Wrench size={15} /> Garaj
          </button>
          <button type="button" className={view === 'rating' ? 'on' : ''} onClick={() => setView('rating')}>
            <Trophy size={15} /> Reyting
          </button>
        </div>
      )}

      {view === 'garage' && (
        <CarGarage
          currentUser={currentUser}
          ownerName={owner}
          garage={garage}
          onGarageChange={setGarage}
          onUserStatsUpdated={onUserStatsUpdated}
          onGoRace={() => setView('race')}
        />
      )}

      {view === 'rating' && (
        <CarRating userId={uid} garage={garage} onOpenGarage={() => setView('garage')} />
      )}

      {view === 'race' && (<>
      {/* ---------- BOSHLANG'ICH EKRAN ---------- */}
      {phase === 'intro' && (
        <div className="rc-intro">
          <div className="rc-hero">
            <div className="rc-hero-badge"><Flag size={14} /> YANGI O'YIN</div>
            <h2 className="rc-hero-title">So'z <span>Poygasi</span></h2>
            <p className="rc-hero-sub">
              Inglizcha va o'zbekcha so'zlarni to'g'ri juftlang — mashinangiz oldinga uchadi.
              Botlardan oldin marraga yeting!
            </p>
          </div>

          <div className="rc-mycar">
            <div className="rc-mycar-art"><CarArt look={garage.equipped} uid="intro-me" plate={garage.plate} /></div>
            <div className="rc-mycar-info">
              <small>Mening mashinam</small>
              <strong>{garage.name}</strong>
              <div className="rc-mycar-pr"><ClassBadge rating={myRating} size={28} /> <b>{myRating}</b> PR</div>
              <div className="rc-mycar-chips">
                {(['engine', 'turbo', 'nitro', 'tires', 'aero', 'radar'] as const).map((k) => (
                  <span key={k} className={garage.levels[k] ? 'on' : ''}>{PERF_BY_KEY[k].emoji} {garage.levels[k]}</span>
                ))}
              </div>
              <button type="button" onClick={() => setView('garage')}><Wrench size={14} /> Tuning qilish</button>
            </div>
          </div>

          <div className="rc-steps">
            <div><b>1</b><span>2 ta inglizcha va 2 ta o'zbekcha so'z chiqadi</span></div>
            <div><b>2</b><span>Har birini bosib, mosini toping</span></div>
            <div><b>3</b><span>To'g'ri bo'lsa — mashina oldinga, xato bo'lsa — orqaga sirpanadi</span></div>
          </div>

          <h3 className="rc-h3">Qiyinlikni tanlang</h3>
          <div className="rc-diffs">
            {(Object.keys(DIFFS) as DiffKey[]).map((k) => {
              const d = DIFFS[k];
              const best = stats.best[k];
              return (
                <button
                  key={k}
                  type="button"
                  className={`rc-diff ${diff === k ? 'on' : ''}`}
                  style={{ ['--c' as string]: d.color } as React.CSSProperties}
                  onClick={() => setDiff(k)}
                >
                  <span className="rc-diff-name"><Gauge size={16} /> {d.label}</span>
                  <span className="rc-diff-desc">{d.desc}</span>
                  <span className="rc-diff-meta">
                    <Coins size={12} /> x{d.mult} mukofot
                    {best !== undefined && <em> · Rekord {fmtTime(best)}</em>}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rc-stats">
            <div><b>{stats.races}</b><span>poyga</span></div>
            <div><b>{stats.wins}</b><span>g'alaba</span></div>
            <div><b>{dailyLeft}</b><span>bugungi limit (tanga)</span></div>
          </div>

          <button type="button" className="rc-start" onClick={() => startRace(diff)}>
            <Play size={20} fill="currentColor" /> Poygani boshlash
          </button>
          <p className="rc-hint">Klaviatura: 1-2 — inglizcha, 3-4 — o'zbekcha so'zlar, N — nitro, H — radar</p>
        </div>
      )}

      {/* ---------- POYGA ---------- */}
      {phase !== 'intro' && (
        <div className="rc-game">
          {/* Yuqori panel */}
          <div className="rc-hud">
            <div className="rc-hud-l">
              <div className="rc-chip rc-chip-pos" data-p={livePlace}>
                <Medal size={14} /> {livePlace}/4
              </div>
              <div className="rc-chip"><Timer size={14} /> {fmtTime(elapsed)}</div>
              <div className="rc-chip" style={{ color: DIFFS[diff].color }}><Gauge size={14} /> {DIFFS[diff].label}</div>
            </div>
            <div className="rc-hud-r">
              <button type="button" className="rc-icon" onClick={() => setSound((s) => !s)} aria-label="Ovoz">
                {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              {inRace && (
                <button type="button" className="rc-icon" onClick={quitRace} aria-label="Chiqish">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="rc-prog">
            {Array.from({ length: STEPS }).map((_, i) => (
              <i key={i} className={steps >= i + 1 ? 'on' : steps > i ? 'half' : ''} />
            ))}
          </div>

          {/* So'zlar paneli */}
          <div className={`rc-words ${phase === 'countdown' ? 'dim' : ''}`}>
            <div className="rc-col">
              <div className="rc-col-h">ENGLISH</div>
              {board.left.map((w, i) => {
                const isM = matched.includes(w.pid);
                const isSel = selEn === w.pid;
                const isWrong = wrong?.en === w.pid;
                return (
                  <button
                    key={`l-${w.pid}`}
                    type="button"
                    disabled={isM || phase !== 'racing'}
                    onClick={() => pick('en', w.pid)}
                    className={`rc-word ${isM ? 'ok' : ''} ${isSel ? 'sel' : ''} ${isWrong ? 'bad' : ''} ${hintPid === w.pid ? 'hint' : ''}`}
                  >
                    <kbd>{i + 1}</kbd>
                    <span>{w.text}</span>
                    {isM && <Check size={18} />}
                  </button>
                );
              })}
            </div>

            <div className="rc-mid"><Zap size={18} /></div>

            <div className="rc-col">
              <div className="rc-col-h">O'ZBEKCHA</div>
              {board.right.map((w, i) => {
                const isM = matched.includes(w.pid);
                const isSel = selUz === w.pid;
                const isWrong = wrong?.uz === w.pid;
                return (
                  <button
                    key={`r-${w.pid}`}
                    type="button"
                    disabled={isM || phase !== 'racing'}
                    onClick={() => pick('uz', w.pid)}
                    className={`rc-word ${isM ? 'ok' : ''} ${isSel ? 'sel' : ''} ${isWrong ? 'bad' : ''} ${hintPid === w.pid ? 'hint' : ''}`}
                  >
                    <kbd>{i + 3}</kbd>
                    <span>{w.text}</span>
                    {isM && <Check size={18} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mashina imkoniyatlari: nitro, radar, kombo */}
          <div className="rc-perks">
            <button
              type="button"
              className="rc-perk nitro"
              disabled={phase !== 'racing' || nitroLeft <= 0}
              onClick={fireNitro}
            >
              <Flame size={17} /> NITRO <em>{nitroLeft}</em>
            </button>
            <button
              type="button"
              className="rc-perk radar"
              disabled={phase !== 'racing' || radarLeft <= 0}
              onClick={fireRadar}
            >
              <Eye size={17} /> RADAR <em>{radarLeft}</em>
            </button>
            <div className={`rc-combo ${combo >= 3 ? 'hot' : ''}`}>
              <span>SERIYA</span>
              <b>{combo}</b>
              {myPerks.comboBonus > 0 && (
                <div className="rc-combo-pips">
                  {[0, 1, 2].map((i) => (<i key={i} className={combo % 3 > i ? 'on' : ''} />))}
                </div>
              )}
            </div>
          </div>
          {!hasPerks && (
            <p className="rc-hint">Garajda nitro va radarni oching — poygada katta ustunlik beradi.</p>
          )}
        </div>
      )}

      {/* ---------- TREK ---------- */}
      {phase !== 'finished' && (
        <div className={`rc-stage ${running ? 'run' : ''} ${boost ? 'boost' : ''} ${nitroFx ? 'nitro' : ''} ${phase === 'intro' ? 'preview' : ''}`}>
          {/* O't-o'lan */}
          <div className="rc-layer"><div className="rc-grass" /></div>

          {/* Daraxtlar */}
          <div className="rc-layer rc-trees">
            <div className="rc-trees-in">
              {[0, 1].map((half) => (
                <div className="rc-half" key={half}>
                  {trees.map((tr, i) => (
                    <span
                      key={`${half}-${i}`}
                      className="rc-tree"
                      style={{
                        top: `${tr.top / 2}%`,
                        [tr.side === 'l' ? 'left' : 'right']: `${tr.x}%`,
                        width: tr.size,
                        height: tr.size,
                        filter: `hue-rotate(${tr.hue * 30 - 10}deg)`
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Yo'l */}
          <div className="rc-road">
            <div className="rc-asphalt" />
            <div className="rc-curb l"><div className="rc-curb-in" /></div>
            <div className="rc-curb r"><div className="rc-curb-in" /></div>
            <div className="rc-lines">
              <div className="rc-lines-in">
                <i style={{ left: '26.5%' }} />
                <i style={{ left: '50%' }} />
                <i style={{ left: '73.5%' }} />
              </div>
            </div>

            {/* Marra chizig'i */}
            <div className="rc-finish"><span>FINISH</span></div>

            {/* Start chizig'i va kataklar */}
            <div className="rc-startline" />
            {[0, 1, 2, 3].map((l) => (
              <span key={l} className="rc-slot" style={{ left: `calc(3% + 23.5% * ${l + 0.5})` }} />
            ))}

            {/* Mashinalar */}
            {carsToShow.map((c) => {
              const rk = rankOf(c.key);
              return (
                <div
                  key={c.key}
                  className={`rc-car ${c.you ? 'you' : 'bot'} ${running ? 'go' : ''} ${c.you && boost ? 'boost' : ''} ${c.you && nitroFx ? 'nitro' : ''}`}
                  style={{
                    ...carStyle(c.p, c.lane),
                    ['--flame' as string]: flameCss(c.look),
                    ['--beam' as string]: lightColor(c.look)
                  } as React.CSSProperties}
                >
                  {inRace && rk === 1 && <Crown className="rc-crown" size={15} />}
                  <div className="rc-car-tag" style={c.you ? undefined : { color: c.color }}>
                    {inRace && <span className={`rc-rk r${rk}`}>{rk}</span>}
                    {c.you ? 'SIZ' : c.name}
                  </div>
                  <div className="rc-car-body">
                    <div className="rc-beam" />
                    <CarArt look={c.look} uid={`race-${c.key}`} plate={c.you ? garage.plate : '29-B'} glow />
                    <div className="rc-flame" />
                  </div>
                </div>
              );
            })}

            {/* Nitro: tezlik chiziqlari */}
            {nitroFx && <div className="rc-streaks" />}

            {/* Jonli o'rinlar jadvali: 1-o'rin, 2-o'rin... */}
            {inRace && (
              <div className="rc-tower" aria-label="O'rinlar">
                {laneCars.map((c) => {
                  const rk = rankOf(c.key);
                  return (
                    <div
                      key={c.key}
                      className={`rc-trow ${c.you ? 'you' : ''} r${rk}`}
                      style={{ transform: `translateY(${(rk - 1) * 30}px)` }}
                    >
                      <b>{rk}</b>
                      <i style={{ background: c.color }} />
                      <span>{c.you ? 'SIZ' : c.name}</span>
                      {c.fin !== null && <Flag size={11} />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Start oldi sanoq */}
            {phase === 'countdown' && (
              <div className="rc-count">
                <div className="rc-lights">
                  {[3, 2, 1].map((n) => (
                    <i key={n} className={count <= n ? 'on' : ''} />
                  ))}
                </div>
                <div className="rc-count-n" key={count}>{count > 0 ? count : 'GO!'}</div>
              </div>
            )}
            {phase === 'racing' && count === 0 && elapsed < 900 && (
              <div className="rc-count"><div className="rc-count-n go" key="go">GO!</div></div>
            )}

            {/* Boshqa bot marraga yetdi */}
            {banner && <div className="rc-banner">{banner}</div>}

            {/* Siz marraga yetdingiz */}
            {phase === 'finishing' && final && (
              <div className="rc-finish-overlay">
                <div className="rc-finish-flag"><Flag size={34} /></div>
                <div className="rc-finish-text">{ORDINAL[final.place - 1]}!</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- NATIJA ---------- */}
      {phase === 'finished' && final && (
        <div className="rc-result">
          {final.place === 1 && (
            <div className="rc-confetti" aria-hidden>
              {Array.from({ length: 36 }).map((_, i) => (
                <i
                  key={i}
                  style={{
                    left: `${(i * 37) % 100}%`,
                    animationDelay: `${(i % 12) * 0.12}s`,
                    background: ['#f59e0b', '#3b82f6', '#ef4444', '#22c55e', '#a855f7'][i % 5]
                  }}
                />
              ))}
            </div>
          )}

          <div className={`rc-place p${final.place}`}>
            <Trophy size={40} />
            <div>
              <small>Sizning natijangiz</small>
              <strong>{ORDINAL[final.place - 1]}</strong>
            </div>
          </div>

          {final.newBest && <div className="rc-newbest">🏆 Yangi rekord: {fmtTime(final.time)}</div>}

          <div className="rc-podium">
            {final.rows.map((r, i) => (
              <div key={r.id} className={`rc-row ${r.you ? 'you' : ''}`}>
                <b>{i + 1}</b>
                <i style={{ background: r.color }} />
                <span>{r.name}</span>
                <em>{r.time !== null ? fmtTime(r.time) : 'yo\'lda'}</em>
              </div>
            ))}
          </div>

          <div className="rc-reward">
            <div><Coins size={18} /> <b>+{final.coins}</b> tanga</div>
            <div><Zap size={18} /> <b>+{final.xp}</b> XP</div>
            <div><X size={18} /> <b>{final.mistakes}</b> xato</div>
          </div>
          {final.capped && (
            <p className="rc-cap">
              Bugungi tanga limiti ({DAILY_CAP}) to'ldi. {final.rawCoins - final.coins} tanga hisobga qo'shilmadi — ertaga yana davom eting!
            </p>
          )}

          <div className="rc-actions">
            <button type="button" className="rc-start" onClick={() => startRace(diff)}>
              <RotateCcw size={18} /> Yana poyga
            </button>
            <button type="button" className="rc-ghost" onClick={() => setView('garage')}>
              <Wrench size={15} /> Garajda tuning qilish (tanga sarflash)
            </button>
            <button type="button" className="rc-ghost" onClick={() => setPhase('intro')}>
              Qiyinlikni o'zgartirish
            </button>
          </div>
        </div>
      )}
      </>)}
    </div>
  );
}

/* ===================== USLUBLAR ===================== */

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")";

const CSS = `
.rc-root{max-width:720px;margin:0 auto;padding:12px 12px 40px;color:#e8edf7;font-family:inherit;position:relative}
.rc-root *{box-sizing:border-box}

/* ---------- Intro ---------- */
.rc-intro{display:flex;flex-direction:column;gap:16px;margin-bottom:16px}
.rc-hero{border-radius:24px;padding:26px 22px;background:
  radial-gradient(120% 140% at 0% 0%,rgba(59,130,246,.35),transparent 55%),
  radial-gradient(100% 120% at 100% 100%,rgba(239,68,68,.35),transparent 55%),
  linear-gradient(135deg,#0d1220,#151a2e);
  border:1px solid rgba(255,255,255,.08);box-shadow:0 20px 50px -20px rgba(0,0,0,.7);position:relative;overflow:hidden}
.rc-hero::after{content:"";position:absolute;inset:0;background:repeating-conic-gradient(rgba(255,255,255,.05) 0 25%,transparent 0 50%) 0 0/22px 22px;
  -webkit-mask-image:linear-gradient(90deg,transparent 55%,#000);mask-image:linear-gradient(90deg,transparent 55%,#000);pointer-events:none}
.rc-hero-badge{display:inline-flex;gap:6px;align-items:center;font-size:11px;font-weight:800;letter-spacing:.14em;padding:5px 10px;border-radius:999px;background:rgba(239,68,68,.18);color:#fca5a5;border:1px solid rgba(239,68,68,.35)}
.rc-hero-title{font-size:clamp(30px,7vw,44px);font-weight:900;margin:10px 0 6px;line-height:1.05;letter-spacing:-.02em;font-style:italic}
.rc-hero-title span{background:linear-gradient(90deg,#60a5fa,#f472b6,#fbbf24);-webkit-background-clip:text;background-clip:text;color:transparent}
.rc-hero-sub{font-size:14px;line-height:1.55;color:#aab4cc;max-width:460px;margin:0}
.rc-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.rc-steps div{background:#10152a;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:6px;font-size:12px;color:#aab4cc;line-height:1.4}
.rc-steps b{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;font-size:13px}
@media(max-width:520px){.rc-steps{grid-template-columns:1fr}.rc-steps div{flex-direction:row;align-items:center}}
.rc-h3{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#8a95b0;margin:4px 0 -6px;font-weight:800}
.rc-diffs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media(max-width:520px){.rc-diffs{grid-template-columns:1fr}}
.rc-diff{text-align:left;padding:14px;border-radius:16px;background:#10152a;border:2px solid rgba(255,255,255,.07);color:inherit;cursor:pointer;display:flex;flex-direction:column;gap:5px;transition:.2s}
.rc-diff:hover{transform:translateY(-2px)}
.rc-diff.on{border-color:var(--c);background:linear-gradient(160deg,color-mix(in srgb,var(--c) 22%,#10152a),#10152a);box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 18%,transparent)}
.rc-diff-name{display:flex;align-items:center;gap:6px;font-weight:800;color:var(--c);font-size:15px}
.rc-diff-desc{font-size:12px;color:#aab4cc}
.rc-diff-meta{font-size:11px;color:#8a95b0;display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.rc-diff-meta em{font-style:normal;color:#fbbf24}
.rc-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.rc-stats div{background:#10152a;border-radius:14px;padding:10px;text-align:center;border:1px solid rgba(255,255,255,.06)}
.rc-stats b{display:block;font-size:20px;font-weight:900}
.rc-stats span{font-size:11px;color:#8a95b0}
.rc-start{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 26px;border-radius:16px;border:0;cursor:pointer;color:#fff;font-weight:900;font-size:16px;letter-spacing:.02em;
  background:linear-gradient(135deg,#ef4444,#f97316);box-shadow:0 10px 28px -8px rgba(239,68,68,.7),inset 0 1px 0 rgba(255,255,255,.35);transition:.2s;width:100%}
.rc-start:hover{transform:translateY(-2px) scale(1.01)}
.rc-start:active{transform:scale(.98)}
.rc-ghost{padding:13px 20px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#cbd5ee;font-weight:700;cursor:pointer;width:100%}
.rc-ghost:hover{background:rgba(255,255,255,.06)}
.rc-hint{text-align:center;font-size:11px;color:#6b7690;margin:0}

/* ---------- O'yin paneli ---------- */
.rc-game{display:flex;flex-direction:column;gap:10px;margin-bottom:12px}
.rc-hud{display:flex;justify-content:space-between;align-items:center;gap:8px}
.rc-hud-l,.rc-hud-r{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.rc-chip{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border-radius:12px;background:#10152a;border:1px solid rgba(255,255,255,.08);font-weight:800;font-size:13px;font-variant-numeric:tabular-nums}
.rc-chip-pos[data-p="1"]{color:#fbbf24;border-color:rgba(251,191,36,.5);box-shadow:0 0 18px -4px rgba(251,191,36,.6)}
.rc-chip-pos[data-p="2"]{color:#cbd5e1}
.rc-chip-pos[data-p="3"]{color:#fb923c}
.rc-chip-pos[data-p="4"]{color:#f87171}
.rc-icon{width:34px;height:34px;border-radius:11px;background:#10152a;border:1px solid rgba(255,255,255,.1);color:#cbd5ee;display:grid;place-items:center;cursor:pointer}
.rc-icon:hover{background:#1a2140}
.rc-prog{display:grid;grid-template-columns:repeat(${STEPS},1fr);gap:3px}
.rc-prog i{height:6px;border-radius:4px;background:rgba(255,255,255,.1);transition:.3s}
.rc-prog i.on{background:linear-gradient(90deg,#3b82f6,#22d3ee);box-shadow:0 0 10px rgba(59,130,246,.7)}
.rc-prog i.half{background:linear-gradient(90deg,#3b82f6 50%,rgba(255,255,255,.1) 50%)}

/* ---------- So'zlar ---------- */
.rc-words{display:grid;grid-template-columns:1fr 34px 1fr;gap:8px;align-items:start;padding:12px;border-radius:20px;
  background:linear-gradient(160deg,#10152a,#0b0f1e);border:1px solid rgba(255,255,255,.08);box-shadow:0 14px 40px -20px rgba(0,0,0,.8);transition:opacity .3s}
.rc-words.dim{opacity:.55}
.rc-col{display:flex;flex-direction:column;gap:8px}
.rc-col-h{font-size:10px;letter-spacing:.2em;font-weight:900;color:#6b7690;text-align:center;margin-bottom:2px}
.rc-mid{align-self:center;height:100%;display:grid;place-items:center;color:#3b82f6;opacity:.7;margin-top:26px}
.rc-word{position:relative;display:flex;align-items:center;justify-content:center;gap:8px;min-height:54px;padding:10px 12px;border-radius:14px;cursor:pointer;
  background:linear-gradient(180deg,#1a2140,#141a33);border:2px solid rgba(255,255,255,.08);color:#f1f5ff;font-weight:800;font-size:clamp(15px,3.8vw,19px);transition:transform .15s,border-color .15s,background .15s}
.rc-word:hover:not(:disabled){transform:translateY(-2px);border-color:rgba(96,165,250,.6)}
.rc-word:active:not(:disabled){transform:scale(.97)}
.rc-word kbd{position:absolute;left:8px;top:6px;font-size:9px;font-family:inherit;opacity:.35;font-weight:700}
@media(hover:none){.rc-word kbd{display:none}}
.rc-word.sel{border-color:#22d3ee;background:linear-gradient(180deg,#0e3a4d,#0b2a3a);box-shadow:0 0 0 4px rgba(34,211,238,.18),0 0 24px -4px rgba(34,211,238,.6);transform:translateY(-2px)}
.rc-word.ok{border-color:#22c55e;background:linear-gradient(180deg,#0f3d24,#0a2c1a);color:#86efac;cursor:default;animation:rc-pop .4s ease}
.rc-word.bad{border-color:#ef4444;background:linear-gradient(180deg,#4a1414,#331010);animation:rc-shake .4s ease}
@keyframes rc-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
@keyframes rc-pop{0%{transform:scale(1)}50%{transform:scale(1.07)}100%{transform:scale(1)}}

/* ---------- Trek ---------- */
.rc-stage{--k:1;position:relative;width:100%;aspect-ratio:1/1.2;max-height:540px;margin:0 auto;border-radius:22px;overflow:hidden;
  border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 60px -24px rgba(0,0,0,.9),inset 0 0 80px rgba(0,0,0,.45);display:flex;justify-content:center;background:#1c5b2b}
.rc-stage.boost{--k:2.1}
.rc-layer{position:absolute;inset:0;overflow:hidden}
.rc-grass{position:absolute;inset:-80px 0 0 0;background:repeating-linear-gradient(180deg,#2f7d3a 0 40px,#378a43 40px 80px)}
.rc-stage.run .rc-grass{animation:rc-mv80 calc(.9s / var(--k)) linear infinite}
.rc-trees-in{position:absolute;left:0;right:0;top:-100%;height:200%}
.rc-stage.run .rc-trees-in{animation:rc-trees calc(2.4s / var(--k)) linear infinite}
.rc-half{position:absolute;left:0;right:0;height:50%}
.rc-half:nth-child(1){top:0}.rc-half:nth-child(2){top:50%}
.rc-tree{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 30%,#4fb55f,#1f6b2d 55%,#14471d);box-shadow:4px 6px 10px rgba(0,0,0,.45)}
@keyframes rc-trees{from{transform:translateY(0)}to{transform:translateY(50%)}}
@keyframes rc-mv80{from{transform:translateY(0)}to{transform:translateY(80px)}}
@keyframes rc-mv64{from{transform:translateY(0)}to{transform:translateY(64px)}}

.rc-road{position:relative;width:min(100%,440px);height:100%;overflow:hidden;box-shadow:0 0 0 2px rgba(0,0,0,.5),0 0 40px rgba(0,0,0,.6)}
.rc-asphalt{position:absolute;inset:0;background:
  ${NOISE},
  linear-gradient(90deg,rgba(0,0,0,.35),transparent 12%,transparent 88%,rgba(0,0,0,.35)),
  linear-gradient(180deg,#2c3038,#23262d);background-blend-mode:soft-light,normal,normal}
.rc-asphalt::after{content:"";position:absolute;inset:0;background:
  linear-gradient(90deg,transparent 12%,rgba(0,0,0,.16) 13%,transparent 17%,transparent 36%,rgba(0,0,0,.14) 37%,transparent 41%,transparent 60%,rgba(0,0,0,.14) 61%,transparent 65%,transparent 84%,rgba(0,0,0,.16) 85%,transparent 89%)}
.rc-curb{position:absolute;top:0;bottom:0;width:3%;overflow:hidden;z-index:2}
.rc-curb.l{left:0}.rc-curb.r{right:0}
.rc-curb-in{position:absolute;inset:-64px 0 0 0;background:repeating-linear-gradient(180deg,#e11d2e 0 32px,#f5f5f5 32px 64px)}
.rc-stage.run .rc-curb-in{animation:rc-mv64 calc(.5s / var(--k)) linear infinite}
.rc-lines{position:absolute;inset:0;overflow:hidden}
.rc-lines-in{position:absolute;inset:-64px 0 0 0}
.rc-lines-in i{position:absolute;top:0;bottom:0;width:3px;margin-left:-1.5px;background:repeating-linear-gradient(180deg,rgba(255,255,255,.85) 0 30px,transparent 30px 64px)}
.rc-stage.run .rc-lines-in{animation:rc-mv64 calc(.5s / var(--k)) linear infinite}

.rc-finish{position:absolute;left:3%;right:3%;bottom:91%;height:5%;z-index:1;
  background:repeating-conic-gradient(#fff 0 25%,#111 0 50%) 0 0/20px 20px;box-shadow:0 0 18px rgba(255,255,255,.35)}
.rc-finish span{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:10px;font-weight:900;letter-spacing:.3em;color:#fff;background:rgba(0,0,0,.65);padding:1px 8px;border-radius:4px}
.rc-startline{position:absolute;left:3%;right:3%;bottom:29%;height:2.4%;background:repeating-linear-gradient(90deg,#fff 0 12px,transparent 12px 24px);opacity:.75}
.rc-slot{position:absolute;bottom:3%;width:15%;height:25%;transform:translateX(-50%);border:2px solid rgba(255,255,255,.28);border-top:0;border-radius:0 0 6px 6px}

/* ---------- Mashinalar ---------- */
.rc-car{position:absolute;width:13.5%;aspect-ratio:1/2;transform:translateX(-50%);z-index:5;transition:bottom .15s linear}
.rc-car.you{z-index:6;transition:bottom .75s cubic-bezier(.2,.85,.25,1)}
.rc-car-body{position:absolute;inset:0;transform-origin:50% 60%}
.rc-car.go .rc-car-body{animation:rc-rumble .12s linear infinite alternate}
.rc-car.you.boost .rc-car-body{animation:rc-rumble .06s linear infinite alternate}
@keyframes rc-rumble{from{transform:translate(-.5px,0)}to{transform:translate(.5px,-1px)}}
.rc-car-tag{position:absolute;left:50%;bottom:calc(100% + 3px);transform:translateX(-50%);font-size:9px;font-weight:900;letter-spacing:.08em;padding:1px 6px;border-radius:6px;background:rgba(0,0,0,.6);white-space:nowrap}
.rc-car.you .rc-car-tag{background:#3b82f6;color:#fff;box-shadow:0 0 12px rgba(59,130,246,.8)}
.rc-beam{position:absolute;left:-30%;right:-30%;bottom:92%;height:70%;pointer-events:none;opacity:0;transition:opacity .4s;
  background:linear-gradient(to top,color-mix(in srgb,var(--beam,#fff4be) 38%,transparent),transparent);clip-path:polygon(32% 100%,68% 100%,100% 0,0 0)}
.rc-car.go .rc-beam{opacity:1}
.rc-flame{position:absolute;left:30%;right:30%;top:97%;height:0;opacity:0;pointer-events:none;border-radius:0 0 50% 50%;
  background:var(--flame,linear-gradient(to bottom,#fff7c2,#ffb020 35%,#ff4d00 70%,transparent));filter:blur(1px);transition:height .15s,opacity .15s}
.rc-car.you.boost .rc-flame{height:34%;opacity:1;animation:rc-flick .08s linear infinite alternate}
@keyframes rc-flick{from{transform:scaleX(.85) scaleY(.9)}to{transform:scaleX(1.1) scaleY(1.15)}}
.rc-stage.preview .rc-car-body{animation:rc-idle 1.6s ease-in-out infinite alternate}
@keyframes rc-idle{from{transform:translateY(0)}to{transform:translateY(-2px)}}

/* ---------- Sanoq va xabarlar ---------- */
.rc-count{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(circle,rgba(0,0,0,.25),rgba(0,0,0,.55))}
.rc-lights{display:flex;gap:12px;padding:10px 16px;background:#0a0a0f;border-radius:16px;border:2px solid #2a2f3d;box-shadow:0 10px 30px rgba(0,0,0,.7)}
.rc-lights i{width:30px;height:30px;border-radius:50%;background:#3a1212;box-shadow:inset 0 0 8px #000;transition:.2s}
.rc-lights i.on{background:radial-gradient(circle at 35% 30%,#ff9a9a,#ff1f1f 55%,#a00);box-shadow:0 0 22px 4px rgba(255,40,40,.85)}
.rc-count-n{font-size:clamp(64px,18vw,110px);font-weight:900;font-style:italic;color:#fff;text-shadow:0 0 30px rgba(255,255,255,.5),0 6px 0 rgba(0,0,0,.4);animation:rc-zoom .9s ease-out}
.rc-count-n.go{color:#4ade80;text-shadow:0 0 40px rgba(74,222,128,.9);animation:rc-zoom .9s ease-out forwards}
@keyframes rc-zoom{0%{transform:scale(2.2);opacity:0}25%{opacity:1}100%{transform:scale(1);opacity:1}}
.rc-banner{position:absolute;left:50%;top:12%;transform:translateX(-50%);z-index:15;padding:8px 16px;border-radius:999px;background:rgba(0,0,0,.75);border:1px solid rgba(255,255,255,.2);font-weight:800;font-size:13px;white-space:nowrap;animation:rc-slidedown .3s ease}
@keyframes rc-slidedown{from{opacity:0;transform:translate(-50%,-10px)}to{opacity:1;transform:translate(-50%,0)}}
.rc-finish-overlay{position:absolute;inset:0;z-index:25;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);animation:rc-fade .3s ease}
.rc-finish-flag{width:70px;height:70px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#fbbf24,#f97316);color:#fff;box-shadow:0 0 40px rgba(251,191,36,.7);animation:rc-pop .6s ease}
.rc-finish-text{font-size:clamp(34px,9vw,52px);font-weight:900;font-style:italic;color:#fff;text-shadow:0 4px 0 rgba(0,0,0,.4)}
@keyframes rc-fade{from{opacity:0}to{opacity:1}}

/* ---------- Natija ---------- */
.rc-result{position:relative;display:flex;flex-direction:column;gap:14px;padding:6px 0;overflow:hidden}
.rc-place{display:flex;align-items:center;gap:16px;padding:20px;border-radius:22px;color:#fff;border:1px solid rgba(255,255,255,.1)}
.rc-place small{display:block;font-size:12px;opacity:.8}
.rc-place strong{font-size:34px;font-weight:900;font-style:italic;line-height:1}
.rc-place.p1{background:linear-gradient(135deg,#b45309,#f59e0b);box-shadow:0 0 50px -10px rgba(245,158,11,.7)}
.rc-place.p2{background:linear-gradient(135deg,#475569,#94a3b8)}
.rc-place.p3{background:linear-gradient(135deg,#7c2d12,#ea580c)}
.rc-place.p4{background:linear-gradient(135deg,#3b1220,#7f1d1d)}
.rc-newbest{text-align:center;padding:10px;border-radius:14px;background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.4);color:#fde68a;font-weight:800}
.rc-podium{display:flex;flex-direction:column;gap:8px}
.rc-row{display:grid;grid-template-columns:28px 14px 1fr auto;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:#10152a;border:1px solid rgba(255,255,255,.07);font-weight:700}
.rc-row b{color:#8a95b0}
.rc-row i{width:14px;height:14px;border-radius:5px}
.rc-row em{font-style:normal;font-variant-numeric:tabular-nums;color:#aab4cc;font-size:13px}
.rc-row.you{border-color:#3b82f6;background:linear-gradient(90deg,rgba(59,130,246,.22),#10152a)}
.rc-reward{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.rc-reward div{display:flex;align-items:center;justify-content:center;gap:6px;padding:12px 6px;border-radius:14px;background:#10152a;border:1px solid rgba(255,255,255,.07);font-size:13px;color:#aab4cc}
.rc-reward b{color:#fff;font-size:17px}
.rc-reward div:nth-child(1) svg{color:#fbbf24}.rc-reward div:nth-child(2) svg{color:#a78bfa}.rc-reward div:nth-child(3) svg{color:#f87171}
.rc-cap{font-size:12px;color:#fca5a5;text-align:center;margin:0}
.rc-actions{display:flex;flex-direction:column;gap:10px}
.rc-confetti{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.rc-confetti i{position:absolute;top:-12px;width:8px;height:14px;border-radius:2px;animation:rc-fall 2.6s linear infinite}
@keyframes rc-fall{to{transform:translateY(620px) rotate(540deg);opacity:.2}}


/* ---------- Menyu ---------- */
.rc-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:5px;margin-bottom:14px;border-radius:18px;background:#0d1226;border:1px solid rgba(255,255,255,.08)}
.rc-nav button{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 8px;border-radius:13px;border:0;background:transparent;color:#8a95b0;font-weight:800;font-size:14px;cursor:pointer;transition:.2s}
.rc-nav button:hover{color:#fff;background:rgba(255,255,255,.06)}
.rc-nav button.on{color:#fff;background:linear-gradient(135deg,#3b82f6,#8b5cf6);box-shadow:0 8px 22px -8px rgba(99,102,241,.9)}

/* ---------- Mening mashinam (intro) ---------- */
.rc-mycar{display:grid;grid-template-columns:96px 1fr;gap:16px;align-items:center;padding:16px;border-radius:22px;background:
  radial-gradient(90% 120% at 0% 50%,rgba(59,130,246,.22),transparent 60%),#10152a;border:1px solid rgba(255,255,255,.09)}
.rc-mycar-art{width:80px;height:160px;margin:auto;filter:drop-shadow(0 12px 16px rgba(0,0,0,.6));animation:rc-idle 2.2s ease-in-out infinite alternate}
.rc-mycar-info{display:flex;flex-direction:column;gap:6px;align-items:flex-start;min-width:0}
.rc-mycar-info small{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#6b7690;font-weight:800}
.rc-mycar-info strong{font-size:20px;font-weight:900;font-style:italic}
.rc-mycar-pr{display:flex;align-items:center;gap:8px;color:#aab4cc;font-size:13px}
.rc-mycar-pr b{color:#fff;font-size:18px}
.rc-mycar-chips{display:flex;flex-wrap:wrap;gap:5px}
.rc-mycar-chips span{font-size:11px;font-weight:800;padding:3px 8px;border-radius:8px;background:rgba(255,255,255,.05);color:#6b7690}
.rc-mycar-chips span.on{background:rgba(249,115,22,.16);color:#fdba74}
.rc-mycar-info button{display:inline-flex;align-items:center;gap:6px;margin-top:2px;padding:9px 14px;border-radius:12px;border:0;font-weight:800;font-size:13px;color:#fff;cursor:pointer;background:linear-gradient(135deg,#3b82f6,#8b5cf6)}

/* ---------- Mashina imkoniyatlari ---------- */
.rc-perks{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.rc-perk{display:flex;align-items:center;justify-content:center;gap:7px;padding:12px 8px;border-radius:14px;border:2px solid transparent;font-weight:900;font-size:13px;letter-spacing:.05em;color:#fff;cursor:pointer;transition:.15s}
.rc-perk em{font-style:normal;min-width:22px;height:22px;border-radius:7px;display:grid;place-items:center;background:rgba(0,0,0,.35);font-size:12px}
.rc-perk.nitro{background:linear-gradient(135deg,#ef4444,#f97316);box-shadow:0 8px 22px -8px rgba(239,68,68,.8)}
.rc-perk.radar{background:linear-gradient(135deg,#0ea5e9,#6366f1);box-shadow:0 8px 22px -8px rgba(14,165,233,.8)}
.rc-perk:hover:not(:disabled){transform:translateY(-2px)}
.rc-perk:active:not(:disabled){transform:scale(.96)}
.rc-perk:disabled{opacity:.35;cursor:not-allowed;filter:grayscale(.6);box-shadow:none}
.rc-combo{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:6px;border-radius:14px;background:#10152a;border:1px solid rgba(255,255,255,.08)}
.rc-combo span{font-size:9px;letter-spacing:.18em;color:#6b7690;font-weight:900}
.rc-combo b{font-size:20px;line-height:1;font-variant-numeric:tabular-nums}
.rc-combo.hot b{color:#fbbf24;text-shadow:0 0 14px rgba(251,191,36,.8)}
.rc-combo-pips{display:flex;gap:3px;margin-top:2px}
.rc-combo-pips i{width:14px;height:4px;border-radius:3px;background:rgba(255,255,255,.12)}
.rc-combo-pips i.on{background:#fbbf24}
.rc-word.hint{border-color:#a78bfa;background:linear-gradient(180deg,#2b1f55,#1b1438);box-shadow:0 0 0 4px rgba(167,139,250,.25),0 0 28px -2px rgba(167,139,250,.9);animation:rc-hint 0.7s ease-in-out infinite alternate}
@keyframes rc-hint{from{transform:translateY(0)}to{transform:translateY(-3px)}}

/* ---------- Jonli o'rinlar ---------- */
.rc-tower{position:absolute;left:4%;top:3%;width:118px;height:120px;z-index:18;pointer-events:none}
.rc-trow{position:absolute;left:0;top:0;width:100%;height:27px;display:flex;align-items:center;gap:6px;padding:0 8px 0 4px;border-radius:9px;
  background:rgba(8,11,24,.78);backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,.12);font-size:11px;font-weight:900;letter-spacing:.04em;
  transition:transform .6s cubic-bezier(.3,1.3,.4,1)}
.rc-trow b{width:19px;height:19px;border-radius:6px;display:grid;place-items:center;font-size:11px;background:rgba(255,255,255,.14)}
.rc-trow i{width:8px;height:8px;border-radius:3px;flex:none}
.rc-trow span{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rc-trow svg{color:#fbbf24;flex:none}
.rc-trow.r1 b{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#451a03}
.rc-trow.r2 b{background:linear-gradient(135deg,#e2e8f0,#94a3b8);color:#0f172a}
.rc-trow.r3 b{background:linear-gradient(135deg,#fb923c,#c2410c);color:#fff}
.rc-trow.you{border-color:#3b82f6;background:rgba(30,58,138,.85);box-shadow:0 0 16px -2px rgba(59,130,246,.8)}
@media(max-width:420px){.rc-tower{width:100px}.rc-trow{font-size:10px}}
.rc-crown{position:absolute;left:50%;bottom:calc(100% + 17px);transform:translateX(-50%);color:#fbbf24;filter:drop-shadow(0 0 6px rgba(251,191,36,.9));animation:rc-bob 1.2s ease-in-out infinite;z-index:3}
@keyframes rc-bob{50%{transform:translateX(-50%) translateY(-3px)}}
.rc-rk{display:inline-grid;place-items:center;width:14px;height:14px;margin-right:4px;border-radius:5px;font-size:9px;background:rgba(255,255,255,.2);color:#fff;vertical-align:middle}
.rc-rk.r1{background:#f59e0b;color:#451a03}.rc-rk.r2{background:#cbd5e1;color:#0f172a}.rc-rk.r3{background:#ea580c}

/* ---------- Nitro effekti ---------- */
.rc-stage.nitro{--k:3.4;animation:rc-shake-s .08s linear infinite alternate}
@keyframes rc-shake-s{from{transform:translate(0,0)}to{transform:translate(1.5px,-1px)}}
.rc-car.you.nitro .rc-flame{height:62%;opacity:1;left:22%;right:22%}
.rc-car.you.nitro .rc-car-body{animation:rc-rumble .04s linear infinite alternate}
.rc-streaks{position:absolute;inset:0;z-index:12;pointer-events:none;opacity:.55;
  background:repeating-linear-gradient(90deg,transparent 0 22px,rgba(255,255,255,.35) 22px 23px,transparent 23px 47px);
  -webkit-mask-image:linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent);mask-image:linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent);
  animation:rc-streak .25s linear infinite}
@keyframes rc-streak{from{background-position:0 0}to{background-position:7px 120px}}

@media (prefers-reduced-motion:reduce){
  .rc-stage.run .rc-grass,.rc-stage.run .rc-trees-in,.rc-stage.run .rc-curb-in,.rc-stage.run .rc-lines-in,
  .rc-car.go .rc-car-body,.rc-confetti i{animation:none!important}
}
`;