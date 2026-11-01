/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { API_URL, apiGet } from '../services/api';
import {
  Puzzle,
  Lightbulb,
  Heart,
  RotateCcw,
  Clock,
  Play,
  Landmark,
  Globe,
  Trophy,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
  Flame,
  Zap,
  Coins
} from 'lucide-react';

/* ===================== MA'LUMOTLAR ===================== */

type Category = 'uz' | 'world';
type Mode = 'all' | Category;
type Phase = 'intro' | 'playing' | 'finished';

interface HistoryItem {
  id: string;
  year: number;
  event: string;   // kartada ko'rinadigan qisqa nom
  hint: string;    // "Yordam" bosilganda tepada chiqadigan izoh
  cat: Category;
}

const RAW_BANK: Omit<HistoryItem, 'id'>[] = [
  // ---------- O'zbekiston va Markaziy Osiyo tarixi ----------
  {
    year: 751,
    event: 'Talas jangi',
    hint: "Arab va Tang (Xitoy) qo'shinlari Talas daryosi vodiysida to'qnashgan, Markaziy Osiyoda arablar ta'siri mustahkamlangan.",
    cat: 'uz'
  },
  {
    year: 973,
    event: 'Abu Rayhon Beruniy tug‘ildi',
    hint: "Xorazmning Kot shahrida buyuk qomusiy olim dunyoga kelgan.",
    cat: 'uz'
  },
  {
    year: 1037,
    event: 'Ibn Sino vafot etdi',
    hint: "Hamadon shahrida «Tib qonunlari» muallifi, buyuk tabib va faylasuf hayotdan ko'z yumgan.",
    cat: 'uz'
  },
  {
    year: 1206,
    event: 'Chingizxon buyuk xon deb e’lon qilindi',
    hint: "Mo'g'ul qabilalari quriltoyida Temuchin Chingizxon unvonini olgan.",
    cat: 'uz'
  },
  {
    year: 1220,
    event: 'Chingizxon Buxoro va Samarqandni egalladi',
    hint: "Mo'g'ullar Xorazmshohlar davlatiga qarshi yurishda Movarounnahrning yirik shaharlarini bosib olgan.",
    cat: 'uz'
  },
  {
    year: 1370,
    event: 'Amir Temur hokimiyat tepasiga keldi',
    hint: "Balxdagi qurultoyda Amir Temur Movarounnahr hukmdori deb e'lon qilingan.",
    cat: 'uz'
  },
  {
    year: 1402,
    event: 'Ankara jangi',
    hint: "Amir Temur Usmonli sultoni Boyazid I ni mag'lub etgan.",
    cat: 'uz'
  },
  {
    year: 1405,
    event: 'Amir Temur vafot etdi',
    hint: "Xitoyga yurish arafasida Otror shahrida sohibqiron hayotdan ko'z yumgan.",
    cat: 'uz'
  },
  {
    year: 1441,
    event: 'Alisher Navoiy tug‘ildi',
    hint: "Hirot shahrida o'zbek adabiy tilining buyuk asoschisi dunyoga kelgan.",
    cat: 'uz'
  },
  {
    year: 1449,
    event: 'Mirzo Ulug‘bek vafot etdi',
    hint: "Buyuk astronom va hukmdor o'g'li Abdullatif ko'rsatmasi bilan o'ldirilgan.",
    cat: 'uz'
  },
  {
    year: 1494,
    event: 'Bobur Farg‘ona taxtiga o‘tirdi',
    hint: "O'smir shahzoda Andijonda otasidan keyin hokimiyatni qabul qilgan.",
    cat: 'uz'
  },
  {
    year: 1501,
    event: 'Alisher Navoiy vafot etdi',
    hint: "Hirotda «Xamsa» muallifi hayotdan ko'z yumgan.",
    cat: 'uz'
  },
  {
    year: 1526,
    event: 'Panipat jangi',
    hint: "Bobur Hindistonda Ibrohim Lodiyni mag'lub etib, Boburiylar saltanatiga asos solgan.",
    cat: 'uz'
  },
  {
    year: 1740,
    event: 'Nodirshoh Buxoro va Xivani bosib oldi',
    hint: "Eron hukmdori Markaziy Osiyoga yurish qilib, ikki xonlikni o'ziga bo'ysundirgan.",
    cat: 'uz'
  },
  {
    year: 1865,
    event: 'Toshkent bosib olindi',
    hint: "Chor Rossiyasi generali Chernyayev boshchiligidagi qo'shin shaharni egallagan.",
    cat: 'uz'
  },
  {
    year: 1876,
    event: 'Qo‘qon xonligi tugatildi',
    hint: "Chor Rossiyasi xonlikni bekor qilib, uning o'rniga Farg'ona viloyatini tuzgan.",
    cat: 'uz'
  },
  {
    year: 1924,
    event: 'O‘zbekiston SSR tashkil topdi',
    hint: "Markaziy Osiyoda milliy-hududiy chegaralanish natijasida respublika tuzilgan.",
    cat: 'uz'
  },
  {
    year: 1966,
    event: 'Toshkent zilzilasi',
    hint: "Poytaxtning katta qismi vayron bo'lgan, shahar keyin qaytadan qurilgan.",
    cat: 'uz'
  },
  {
    year: 1989,
    event: 'O‘zbek tiliga davlat tili maqomi berildi',
    hint: "Til haqidagi qonun qabul qilinib, o'zbek tili davlat tili deb e'lon qilingan.",
    cat: 'uz'
  },
  {
    year: 1991,
    event: 'O‘zbekiston mustaqillikka erishdi',
    hint: "Mustaqillik e'lon qilingan va har yili sentabr oyida bayram qilinadi.",
    cat: 'uz'
  },
  {
    year: 1992,
    event: 'O‘zbekiston Konstitutsiyasi qabul qilindi',
    hint: "Respublikaning Asosiy qonuni 8-dekabrda qabul qilingan.",
    cat: 'uz'
  },
  {
    year: 1994,
    event: 'So‘m muomalaga kiritildi',
    hint: "Milliy valyuta 1-iyulda to'liq muomalaga chiqarilgan.",
    cat: 'uz'
  },

  // ---------- Jahon tarixi ----------
  {
    year: 1453,
    event: 'Konstantinopol egallandi',
    hint: "Sulton Mehmed II Vizantiya poytaxtini bosib olib, Vizantiya imperiyasiga barham bergan.",
    cat: 'world'
  },
  {
    year: 1492,
    event: 'Kolumb Amerikaga yetib keldi',
    hint: "Genuyalik dengizchi Hindistonga yo'l izlab, yangi quruqlikni kashf etgan.",
    cat: 'world'
  },
  {
    year: 1776,
    event: 'AQSh Mustaqillik deklaratsiyasi',
    hint: "13 ta Britaniya mustamlakasi o'zini mustaqil deb e'lon qilgan.",
    cat: 'world'
  },
  {
    year: 1789,
    event: 'Buyuk Fransuz inqilobi boshlandi',
    hint: "Parijliklar Bastiliya qamoqxonasini egallagan.",
    cat: 'world'
  },
  {
    year: 1812,
    event: 'Napoleon Rossiyaga yurish qildi',
    hint: "Fransuz qo'shini Moskvaga kirgan, ammo keyin og'ir chekinishga majbur bo'lgan.",
    cat: 'world'
  },
  {
    year: 1815,
    event: 'Vaterloo jangi',
    hint: "Napoleon so'nggi marta mag'lubiyatga uchragan.",
    cat: 'world'
  },
  {
    year: 1903,
    event: 'Rayt aka-ukalarning birinchi samolyot parvozi',
    hint: "Motorli apparatda inson birinchi marta havoga ko'tarilgan.",
    cat: 'world'
  },
  {
    year: 1912,
    event: 'Titanik cho‘kdi',
    hint: "Atlantika okeanida ulkan layner birinchi reysidayoq halokatga uchragan.",
    cat: 'world'
  },
  {
    year: 1914,
    event: 'Birinchi jahon urushi boshlandi',
    hint: "Sarayevoda Avstriya taxt vorisining o'ldirilishi urushga sabab bo'lgan.",
    cat: 'world'
  },
  {
    year: 1939,
    event: 'Ikkinchi jahon urushi boshlandi',
    hint: "Germaniyaning Polshaga hujumi bilan urush boshlangan.",
    cat: 'world'
  },
  {
    year: 1941,
    event: 'Germaniya SSSRga hujum qildi',
    hint: "22-iyun kuni Ulug' Vatan urushi boshlangan.",
    cat: 'world'
  },
  {
    year: 1945,
    event: 'Ikkinchi jahon urushi tugadi',
    hint: "Germaniya va Yaponiya taslim bo'lgan, shu yili BMT ham tuzilgan.",
    cat: 'world'
  },
  {
    year: 1957,
    event: 'Birinchi sun’iy yo‘ldosh uchirildi',
    hint: "SSSR «Sputnik-1» ni Yer orbitasiga chiqargan.",
    cat: 'world'
  },
  {
    year: 1961,
    event: 'Yuriy Gagarin kosmosga uchdi',
    hint: "Inson birinchi marta koinotga chiqib, Yerni aylanib chiqqan.",
    cat: 'world'
  },
  {
    year: 1969,
    event: 'Inson Oyga qadam qo‘ydi',
    hint: "Apollo 11 ekipaji Oy yuzasiga tushgan.",
    cat: 'world'
  }
];

const HISTORY_BANK: HistoryItem[] = RAW_BANK.map((item, i) => ({ ...item, id: `b-${i}` }));

// Django admin panelidan keladigan voqea
interface RemoteHistoryEvent {
  id: number;
  year: number;
  event: string;
  hint: string;
  cat: Category;
}

const ROUND_SIZE = 6;
const MAX_LIVES = 5;
const MAX_HINTS = 3;

const PIECE_COLORS = [
  'from-cyan-500 to-blue-500',
  'from-fuchsia-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-indigo-500 to-purple-500',
  'from-rose-500 to-red-500'
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

/* ===================== KOMPONENT ===================== */

interface HistoryPuzzleGameProps {
  currentUser: User;
  onUserStatsUpdated: () => void;
}

export function HistoryPuzzleGame({ currentUser, onUserStatsUpdated }: HistoryPuzzleGameProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [mode, setMode] = useState<Mode>('all');

  // O'yin bazasi: o'zimizdagi ro'yxat + admin paneldan qo'shilgan voqealar
  const [bank, setBank] = useState<HistoryItem[]>(HISTORY_BANK);

  useEffect(() => {
    if (!API_URL) return;
    let cancelled = false;
    apiGet<RemoteHistoryEvent[]>('/api/content/history/')
      .then((rows) => {
        if (cancelled || !Array.isArray(rows)) return;
        const remote: HistoryItem[] = rows.map((r) => ({
          id: `d-${r.id}`,
          year: r.year,
          event: r.event,
          hint: r.hint,
          cat: r.cat
        }));
        setBank([...remote, ...HISTORY_BANK]);
      })
      .catch(() => {
        /* Server uxlayotgan bo'lishi mumkin: o'z ro'yxatimiz bilan davom etamiz */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [round, setRound] = useState<HistoryItem[]>([]);   // yil bo'yicha tartiblangan
  const [tray, setTray] = useState<string[]>([]);           // aralash voqea bo'laklari
  const [matched, setMatched] = useState<string[]>([]);

  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const [selSlot, setSelSlot] = useState<string | null>(null);
  const [selPiece, setSelPiece] = useState<string | null>(null);
  const [wrong, setWrong] = useState<{ slot: string; piece: string } | null>(null);
  const [hintId, setHintId] = useState<string | null>(null);

  const [result, setResult] = useState<{
    won: boolean;
    coins: number;
    xp: number;
    correct: number;
  } | null>(null);

  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Vaqt hisoblagich
  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    return () => {
      if (wrongTimer.current) clearTimeout(wrongTimer.current);
    };
  }, []);

  // G'alaba konfettisi
  const confetti = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        dur: 2.6 + Math.random() * 2.2,
        emoji: ['🎉', '✨', '⭐', '🪙', '🧩'][i % 5]
      })),
    []
  );

  const startRound = (m: Mode = mode) => {
    const pool = m === 'all' ? bank : bank.filter((h) => h.cat === m);

    // Bir o'yinda yillar takrorlanmasligi kerak
    const usedYears = new Set<number>();
    const picked: HistoryItem[] = [];
    for (const item of shuffle(pool)) {
      if (usedYears.has(item.year)) continue;
      usedYears.add(item.year);
      picked.push(item);
      if (picked.length === ROUND_SIZE) break;
    }
    setRound([...picked].sort((a, b) => a.year - b.year));
    setTray(shuffle(picked.map((p) => p.id)));
    setMatched([]);
    setLives(MAX_LIVES);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setMistakes(0);
    setHintsUsed(0);
    setElapsed(0);
    setSelSlot(null);
    setSelPiece(null);
    setWrong(null);
    setHintId(null);
    setResult(null);
    setPhase('playing');
  };

  const finishRound = (won: boolean, correctCount: number, finalMistakes: number, finalHints: number) => {
    const timeBonus = won ? (elapsed <= 60 ? 10 : elapsed <= 120 ? 5 : 0) : 0;
    const perfectBonus = won && finalMistakes === 0 ? 15 : 0;
    const raw =
      correctCount * 10 + (won ? 20 : 0) + perfectBonus + timeBonus - finalHints * 3 - finalMistakes * 2;
    const coins = Math.max(correctCount > 0 ? 5 : 0, raw);
    const xp = Math.round(coins * 1.2);

    if (coins > 0 && currentUser) {
      StorageService.addCoinsAndXp(currentUser.id, coins, xp);
      onUserStatsUpdated();
    }

    setResult({ won, coins, xp, correct: correctCount });
    setPhase('finished');
  };

  const evaluate = (slotId: string, pieceId: string) => {
    if (slotId === pieceId) {
      // ✅ To'g'ri
      const newMatched = [...matched, slotId];
      const gained = 100 + Math.min(combo, 5) * 10;
      setMatched(newMatched);
      setTray((prev) => prev.filter((id) => id !== pieceId));
      setScore((s) => s + gained);
      setCombo(combo + 1);
      setBestCombo((b) => Math.max(b, combo + 1));
      setSelSlot(null);
      setSelPiece(null);
      if (hintId === slotId) setHintId(null);

      if (newMatched.length === round.length) {
        finishRound(true, newMatched.length, mistakes, hintsUsed);
      }
    } else {
      // ❌ Xato
      const newLives = lives - 1;
      const newMistakes = mistakes + 1;
      setLives(newLives);
      setMistakes(newMistakes);
      setCombo(0);
      setScore((s) => Math.max(0, s - 20));
      setWrong({ slot: slotId, piece: pieceId });
      setSelSlot(null);
      setSelPiece(null);

      if (wrongTimer.current) clearTimeout(wrongTimer.current);
      wrongTimer.current = setTimeout(() => setWrong(null), 600);

      if (newLives <= 0) {
        finishRound(false, matched.length, newMistakes, hintsUsed);
      }
    }
  };

  const onSlotClick = (id: string) => {
    if (phase !== 'playing' || wrong || matched.includes(id)) return;
    if (selPiece !== null) {
      evaluate(id, selPiece);
      return;
    }
    setSelSlot((prev) => (prev === id ? null : id));
  };

  const onPieceClick = (id: string) => {
    if (phase !== 'playing' || wrong) return;
    if (selSlot !== null) {
      evaluate(selSlot, id);
      return;
    }
    setSelPiece((prev) => (prev === id ? null : id));
  };

  const handleHint = () => {
    if (hintsUsed >= MAX_HINTS || phase !== 'playing') return;
    const unmatched = round.filter((r) => !matched.includes(r.id));
    if (unmatched.length === 0) return;
    const target =
      (selSlot !== null ? unmatched.find((r) => r.id === selSlot) : undefined) ??
      unmatched[Math.floor(Math.random() * unmatched.length)];
    setHintId(target.id);
    setHintsUsed((h) => h + 1);
    setScore((s) => Math.max(0, s - 30));
  };

  const hintItem = hintId !== null ? round.find((r) => r.id === hintId) : null;
  const progress = round.length ? (matched.length / round.length) * 100 : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <style>{`
        @keyframes hp-fall {
          0%   { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(540deg); opacity: 0; }
        }
        .hp-confetti { position: absolute; top: 0; font-size: 22px; animation: hp-fall linear forwards; }
        @keyframes hp-hint-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgb(251 191 36 / 55%); }
          50%      { box-shadow: 0 0 0 10px rgb(251 191 36 / 0%); }
        }
        .hp-hint-glow { animation: hp-hint-glow 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hp-confetti { display: none; }
          .hp-hint-glow { animation: none; }
        }
      `}</style>

      {/* ================= INTRO ================= */}
      {phase === 'intro' && (
        <div className="neon-card p-6 sm:p-10 text-center max-w-3xl mx-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white grid place-items-center shadow-xl shadow-indigo-500/40 animate-float mb-5">
            <Puzzle className="w-10 h-10" />
          </div>

          <span className="badge-glow">
            <Sparkles className="w-3 h-3" /> TARIX PUZZLE
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white mt-3">
            Voqeani <span className="text-gradient">to‘g‘ri yilga</span> joyla!
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-3 max-w-xl mx-auto leading-relaxed">
            Yillar xronologik tartibda turadi. Pastdagi voqea bo‘lagini tanlab, mos yilga bosing.
            Bilmasangiz — <b>Yordam</b> tugmasini bosing, tepada «Bu yilda ... bo‘lgan» yozuvi chiqadi.
          </p>

          {/* Qanday o'ynaladi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7 text-left">
            {[
              { n: '1', t: 'Voqeani tanla', d: "Pastdagi puzzle bo'lagiga bos" },
              { n: '2', t: 'Yilni tanla', d: "Mos keladigan yil kartasiga bos" },
              { n: '3', t: 'Yordam ol', d: "Bilmasang 💡 tugmasini bos" }
            ].map((s) => (
              <div key={s.n} className="game-card p-4 flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-display font-black grid place-items-center shrink-0 shadow-md">
                  {s.n}
                </span>
                <div>
                  <div className="font-display font-extrabold text-sm text-slate-900 dark:text-white">{s.t}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Rejim tanlash */}
          <div className="mt-7">
            <div className="text-[11px] font-black tracking-widest text-slate-500 dark:text-slate-400 mb-3">
              MAVZUNI TANLANG
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {([
                { key: 'all', label: 'Aralash', icon: Layers },
                { key: 'uz', label: "O'zbekiston tarixi", icon: Landmark },
                { key: 'world', label: 'Jahon tarixi', icon: Globe }
              ] as { key: Mode; label: string; icon: typeof Layers }[]).map((m) => {
                const Icon = m.icon;
                const active = mode === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMode(m.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 text-xs sm:text-sm font-extrabold transition-all cursor-pointer active:scale-95 ${
                      active
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 shadow-lg shadow-indigo-500/20 -translate-y-0.5'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 mt-6">
            <span className="inline-flex items-center gap-1.5"><Puzzle className="w-4 h-4 text-indigo-500" /> {ROUND_SIZE} ta voqea</span>
            <span className="inline-flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> {MAX_LIVES} ta jon</span>
            <span className="inline-flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-amber-500" /> {MAX_HINTS} ta yordam</span>
          </div>

          <button type="button" onClick={() => startRound()} className="btn-gradient mt-7 !px-10 !py-4 !text-base">
            <Play className="w-5 h-5 fill-white" />
            O‘yinni boshlash
          </button>
        </div>
      )}

      {/* ================= PLAYING ================= */}
      {phase === 'playing' && (
        <>
          {/* Yuqori panel */}
          <div className="game-card p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white grid place-items-center shadow-lg shadow-indigo-500/30">
                  <Puzzle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-black text-base text-slate-900 dark:text-white leading-tight">
                    Tarix Puzzle
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {matched.length} / {round.length} joylandi
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Jonlar */}
                <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  {Array.from({ length: MAX_LIVES }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-4 h-4 transition-all ${
                        i < lives
                          ? 'text-rose-500 fill-rose-500'
                          : 'text-slate-300 dark:text-slate-700 scale-75'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-500/10 border border-slate-400/20 text-xs font-mono font-black text-slate-700 dark:text-slate-200">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  {formatTime(elapsed)}
                </div>

                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs font-mono font-black text-amber-700 dark:text-amber-300">
                  <Trophy className="w-4 h-4" />
                  {score}
                </div>

                {combo >= 2 && (
                  <div className="animate-pop flex items-center gap-1 px-3 py-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-xs font-black text-orange-600 dark:text-orange-300">
                    <Flame className="w-4 h-4" />
                    x{combo} kombo
                  </div>
                )}
              </div>
            </div>

            <div className="xp-bar mt-4">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* YORDAM yozuvi (tepada) */}
          {hintItem && (
            <div className="animate-pop relative overflow-hidden rounded-3xl border-2 border-amber-400/70 bg-gradient-to-r from-amber-400/15 via-orange-400/15 to-amber-400/15 p-4 sm:p-5 shadow-lg shadow-amber-500/10">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white grid place-items-center shrink-0 shadow-lg shadow-amber-500/30 animate-float">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black tracking-widest text-amber-700 dark:text-amber-300 mb-1">
                    YORDAM
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                    <span className="font-display font-black text-amber-600 dark:text-amber-300">
                      {hintItem.year}-yilda
                    </span>{' '}
                    {hintItem.hint}
                  </p>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1.5">
                    Shu yilni tanlab, mos voqeani toping 👇
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setHintId(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
                  aria-label="Yordamni yopish"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ---- Xronologik jadval (yillar) ---- */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-black tracking-widest text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5" /> XRONOLOGIK JADVAL
              </div>

              {round.map((item) => {
                const isMatched = matched.includes(item.id);
                const isSelected = selSlot === item.id;
                const isHinted = hintId === item.id && !isMatched;
                const isWrong = wrong?.slot === item.id;

                let stateCls =
                  'border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:border-indigo-400 hover:-translate-y-0.5';
                if (isMatched) stateCls = 'border-solid border-emerald-400/70 bg-emerald-500/10 animate-pop cursor-default';
                else if (isWrong) stateCls = 'border-solid border-rose-500 bg-rose-500/10 animate-shake';
                else if (isSelected)
                  stateCls =
                    'border-solid border-indigo-500 bg-indigo-500/10 ring-4 ring-indigo-500/20 -translate-y-0.5';
                else if (isHinted) stateCls = 'border-solid border-amber-400 bg-amber-400/10 hp-hint-glow';

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => onSlotClick(item.id)}
                    className={`w-full flex items-center gap-3 sm:gap-4 p-3 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer active:scale-[.99] ${stateCls}`}
                  >
                    <span
                      className={`min-w-[84px] text-center font-display font-black text-lg sm:text-xl px-3 py-2.5 rounded-xl text-white shadow-md ${
                        isMatched
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                      }`}
                    >
                      {item.year}
                    </span>

                    {isMatched ? (
                      <span className="flex-1 flex items-center justify-between gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                        <span>{item.event}</span>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      </span>
                    ) : (
                      <span className="flex-1 flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                        <Puzzle className="w-4 h-4" />
                        {isSelected ? 'Endi pastdan voqeani tanlang' : "Voqeani shu yerga qo'ying"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ---- Puzzle bo'laklari (voqealar) ---- */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-black tracking-widest text-slate-500 dark:text-slate-400">
                <Puzzle className="w-3.5 h-3.5" /> VOQEA BO‘LAKLARI
              </div>

              <div className="space-y-3">
                {tray.map((id, i) => {
                  const item = round.find((r) => r.id === id);
                  if (!item) return null;
                  const isSel = selPiece === id;
                  const isWrong = wrong?.piece === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onPieceClick(id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-[.98] shadow-md animate-fadeIn ${
                        isWrong
                          ? 'border-rose-500 bg-rose-500/10 animate-shake'
                          : isSel
                          ? 'border-indigo-500 bg-indigo-500/10 ring-4 ring-indigo-500/25 -translate-y-1 shadow-xl shadow-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-400'
                      }`}
                    >
                      <span
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                          PIECE_COLORS[i % PIECE_COLORS.length]
                        } text-white grid place-items-center shrink-0 shadow-md`}
                      >
                        <Puzzle className="w-5 h-5" />
                      </span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                        {item.event}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Boshqaruv tugmalari */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleHint}
              disabled={hintsUsed >= MAX_HINTS}
              className="btn-gradient btn-gold !py-3 !px-5 !text-sm"
            >
              <Lightbulb className="w-4 h-4" />
              Yordam ({MAX_HINTS - hintsUsed} ta qoldi)
              <span className="text-[10px] font-black opacity-90">−30 ball</span>
            </button>

            <button
              type="button"
              onClick={() => startRound()}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Qayta boshlash
            </button>
          </div>
        </>
      )}

      {/* ================= FINISHED ================= */}
      {phase === 'finished' && result && (
        <>
          {result.won && (
            <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" aria-hidden="true">
              {confetti.map((c, i) => (
                <span
                  key={i}
                  className="hp-confetti"
                  style={{ left: `${c.left}%`, animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s` }}
                >
                  {c.emoji}
                </span>
              ))}
            </div>
          )}

          <div className="neon-card p-6 sm:p-10 text-center max-w-2xl mx-auto">
            <div
              className={`w-24 h-24 mx-auto rounded-[28px] text-white grid place-items-center shadow-2xl animate-pop mb-5 ${
                result.won
                  ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-orange-500/40'
                  : 'bg-gradient-to-br from-slate-500 to-slate-700 shadow-slate-500/30'
              }`}
            >
              {result.won ? <Trophy className="w-12 h-12" /> : <Heart className="w-12 h-12" />}
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">
              {result.won
                ? mistakes === 0
                  ? 'Mukammal! Tarix bilimdoni 🏆'
                  : 'Ajoyib natija! 🎉'
                : 'Jonlar tugadi 💔'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
              {result.won
                ? "Barcha voqealarni to'g'ri joyladingiz."
                : "Hechqisi yo'q — har bir urinish bilimni mustahkamlaydi!"}
            </p>

            {/* Statistika */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
              {[
                { label: "To'g'ri", value: `${result.correct}/${round.length}`, color: 'text-emerald-500' },
                { label: 'Xato', value: mistakes, color: 'text-rose-500' },
                { label: 'Yordam', value: hintsUsed, color: 'text-amber-500' },
                { label: 'Vaqt', value: formatTime(elapsed), color: 'text-cyan-500' }
              ].map((s) => (
                <div key={s.label} className="game-card p-3.5">
                  <div className={`font-display font-black text-2xl ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                    {s.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <span className="badge-glow">
                <Trophy className="w-3 h-3" /> {score} ball
              </span>
              {bestCombo >= 2 && (
                <span className="badge-glow">
                  <Flame className="w-3 h-3" /> eng yaxshi kombo x{bestCombo}
                </span>
              )}
            </div>

            {/* Mukofot */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="animate-pop inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400/20 to-orange-400/20 border border-amber-400/40 font-display font-black text-amber-700 dark:text-amber-300">
                <Coins className="w-5 h-5" /> +{result.coins} Coin
              </span>
              <span
                className="animate-pop inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-400/20 to-fuchsia-400/20 border border-indigo-400/40 font-display font-black text-indigo-700 dark:text-indigo-300"
                style={{ animationDelay: '120ms' }}
              >
                <Zap className="w-5 h-5 fill-current" /> +{result.xp} XP
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <button type="button" onClick={() => startRound()} className="btn-gradient">
                <RotateCcw className="w-4 h-4" />
                Yana o‘ynash
              </button>
              <button
                type="button"
                onClick={() => setPhase('intro')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95"
              >
                <Layers className="w-4 h-4" />
                Mavzuni o‘zgartirish
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}