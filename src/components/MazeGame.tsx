/**
 * NEXUS ARENA — SKY MAZE 3D
 * MazeGame component.
 *
 * App.tsx dagi import bilan mos:
 * import { MazeGame } from './components/MazeGame';
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from '../types';
import { StorageService } from '../services/storage';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Flag,
  Gem,
  RotateCcw,
  Trophy,
  Zap,
} from 'lucide-react';

interface MazeGameProps {
  currentUser: User | null;
  onUserStatsUpdated: () => void;
}

const LEVELS = [
  [
    '###########',
    '#S..#.....#',
    '#.#.#.###.#',
    '#.#...#...#',
    '#.#####.#.#',
    '#.....#.#.#',
    '#####.#.#.#',
    '#...#...#.#',
    '#.#.#####.#',
    '#........G#',
    '###########',
  ],
  [
    '###########',
    '#S#.......#',
    '#.#.#####.#',
    '#...#...#.#',
    '###.#.#.#.#',
    '#...#.#...#',
    '#.###.###.#',
    '#.....#...#',
    '#.#####.###',
    '#........G#',
    '###########',
  ],
  [
    '###########',
    '#S....#...#',
    '#####.#.#.#',
    '#.....#.#.#',
    '#.#####.#.#',
    '#.......#.#',
    '#.#######.#',
    '#.........#',
    '#########.#',
    '#........G#',
    '###########',
  ],
];

type Position = { x: number; y: number };

function findCell(map: string[], cell: string): Position {
  for (let y = 0; y < map.length; y += 1) {
    const x = map[y].indexOf(cell);
    if (x !== -1) return { x, y };
  }
  return { x: 1, y: 1 };
}

export const MazeGame: React.FC<MazeGameProps> = ({
  currentUser,
  onUserStatsUpdated,
}) => {
  const [level, setLevel] = useState(0);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('Chiqish yo‘lini toping!');
  const map = LEVELS[level];
  const start = useMemo(() => findCell(map, 'S'), [map]);
  const goal = useMemo(() => findCell(map, 'G'), [map]);
  const [player, setPlayer] = useState<Position>(start);

  const resetLevel = useCallback(() => {
    setPlayer(start);
    setMoves(0);
    setCompleted(false);
    setMessage('Chiqish yo‘lini toping!');
  }, [start]);

  useEffect(() => {
    setPlayer(start);
    setMoves(0);
    setCompleted(false);
    setMessage('Chiqish yo‘lini toping!');
  }, [start]);

  const move = useCallback((dx: number, dy: number) => {
    if (completed) return;

    const next = { x: player.x + dx, y: player.y + dy };
    const row = map[next.y];
    if (!row || row[next.x] === '#' || row[next.x] === undefined) {
      setMessage('Bu yo‘l berk. Boshqa tomonga harakat qiling.');
      return;
    }

    const nextMoves = moves + 1;
    setPlayer(next);
    setMoves(nextMoves);

    if (next.x === goal.x && next.y === goal.y) {
      setCompleted(true);
      setMessage('Ajoyib! Labirintdan muvaffaqiyatli chiqdingiz!');
      if (currentUser) {
        StorageService.addCoinsAndXp(currentUser.id, 50, 60);
        onUserStatsUpdated();
      }
    } else {
      setMessage('Yaxshi! Davom eting.');
    }
  }, [completed, currentUser, goal.x, goal.y, map, moves, onUserStatsUpdated, player.x, player.y]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keys: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        w: [0, -1],
        W: [0, -1],
        ArrowDown: [0, 1],
        s: [0, 1],
        S: [0, 1],
        ArrowLeft: [-1, 0],
        a: [-1, 0],
        A: [-1, 0],
        ArrowRight: [1, 0],
        d: [1, 0],
        D: [1, 0],
      };
      const direction = keys[event.key];
      if (direction) {
        event.preventDefault();
        move(direction[0], direction[1]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move]);

  const nextLevel = () => {
    if (level < LEVELS.length - 1) {
      setLevel((value) => value + 1);
    } else {
      setLevel(0);
    }
  };

  return (
    <section className="w-full my-8">
      <div className="relative overflow-hidden rounded-[28px] border border-indigo-400/25 bg-slate-950 text-white shadow-2xl shadow-indigo-950/30">
        <div className="pointer-events-none absolute -top-28 -right-20 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-7">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-cyan-300">
              <Zap size={15} /> NEXUS MINI GAME
            </div>
            <h2 className="text-2xl font-black sm:text-3xl">SKY MAZE</h2>
            <p className="mt-1 text-sm text-slate-400">
              Labirintdan yo‘l toping va barcha bosqichlarni yakunlang.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <div className="text-[10px] font-bold uppercase text-slate-400">Bosqich</div>
              <div className="text-xl font-black text-cyan-300">{level + 1}/{LEVELS.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <div className="text-[10px] font-bold uppercase text-slate-400">Qadam</div>
              <div className="text-xl font-black text-amber-300">{moves}</div>
            </div>
          </div>
        </div>

        <div className="relative grid gap-6 p-4 sm:p-7 lg:grid-cols-[1fr_230px]">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 sm:p-5">
            <div
              className="mx-auto grid w-full max-w-[440px] gap-1"
              style={{ gridTemplateColumns: `repeat(${map[0].length}, minmax(0, 1fr))` }}
              role="grid"
              aria-label="Labirint maydoni"
            >
              {map.map((row, y) =>
                row.split('').map((cell, x) => {
                  const isPlayer = player.x === x && player.y === y;
                  const isGoal = cell === 'G';
                  const isStart = cell === 'S';
                  return (
                    <div
                      key={`${level}-${x}-${y}`}
                      className={[
                        'aspect-square flex items-center justify-center rounded-[5px] sm:rounded-lg',
                        cell === '#' ? 'bg-gradient-to-br from-indigo-500 to-violet-800 shadow-inner shadow-black/30' : 'border border-white/[.06] bg-slate-800/80',
                        isPlayer ? 'relative z-10 bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/50 ring-2 ring-white' : '',
                        isGoal ? 'bg-emerald-500/25 text-emerald-300' : '',
                        isStart && !isPlayer ? 'text-cyan-300' : '',
                      ].join(' ')}
                    >
                      {isPlayer ? <span className="text-[clamp(10px,2.5vw,20px)]">🧑‍🚀</span> :
                        isGoal ? <Flag className="h-3/5 w-3/5" /> :
                        isStart ? <span className="text-[clamp(8px,1.8vw,13px)]">S</span> : null}
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-indigo-600" /> Devor</span>
              <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-cyan-400" /> Siz</span>
              <span className="flex items-center gap-1.5"><Flag size={12} className="text-emerald-300" /> Chiqish</span>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-extrabold">
                <Gem size={16} className="text-cyan-300" /> Vazifa
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Devorlarga tegmasdan yashil bayroqqacha yetib boring. Klaviaturadagi strelkalar yoki ekrandagi tugmalardan foydalaning.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 text-sm font-extrabold">Boshqaruv</div>
              <div className="mx-auto grid w-36 grid-cols-3 gap-2">
                <span />
                <button type="button" onClick={() => move(0, -1)} className="grid h-11 place-items-center rounded-xl bg-indigo-500 text-white transition hover:bg-indigo-400 active:scale-95" aria-label="Yuqoriga"><ArrowUp /></button>
                <span />
                <button type="button" onClick={() => move(-1, 0)} className="grid h-11 place-items-center rounded-xl bg-indigo-500 text-white transition hover:bg-indigo-400 active:scale-95" aria-label="Chapga"><ArrowLeft /></button>
                <button type="button" onClick={() => move(0, 1)} className="grid h-11 place-items-center rounded-xl bg-indigo-500 text-white transition hover:bg-indigo-400 active:scale-95" aria-label="Pastga"><ArrowDown /></button>
                <button type="button" onClick={() => move(1, 0)} className="grid h-11 place-items-center rounded-xl bg-indigo-500 text-white transition hover:bg-indigo-400 active:scale-95" aria-label="O‘ngga"><ArrowRight /></button>
              </div>
            </div>

            <div className={`rounded-2xl border p-4 text-xs font-semibold leading-relaxed ${completed ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' : 'border-cyan-400/20 bg-cyan-400/5 text-cyan-100'}`}>
              {completed ? (
                <div className="flex items-start gap-2">
                  <Trophy className="mt-0.5 shrink-0 text-amber-300" size={18} />
                  <span>{message}<br />Mukofot: +50 Coin va +60 XP</span>
                </div>
              ) : message}
            </div>

            <button type="button" onClick={resetLevel} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-extrabold transition hover:bg-white/10">
              <RotateCcw size={15} /> Qayta boshlash
            </button>

            {completed && (
              <button type="button" onClick={nextLevel} className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-xs font-black text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 active:scale-[.98]">
                {level === LEVELS.length - 1 ? 'Boshidan o‘ynash' : 'Keyingi bosqich'}
              </button>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default MazeGame;
