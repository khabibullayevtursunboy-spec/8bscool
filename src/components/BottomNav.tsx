/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NEXUS ARENA — pastki dok va butun ekranli "Arena" launcheri.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Home,
  Swords,
  Trophy,
  BookOpen,
  Star,
  ShoppingBag,
  Brain,
  Timer,
  ClipboardList,
  Flame,
  X,
  Crown,
  Gamepad2,
  History,
  Car,
  Search,
  Box,
  ArrowUpRight,
  type LucideIcon
} from 'lucide-react';

export type TabKey =
  | 'home'
  | 'multiplayer'
  | 'boardgames'
  | 'millionaire'
  | 'memorygame'
  | 'pomodoro'
  | 'tests'
  | 'tugofwar'
  | 'library'
  | 'teachers'
  | 'leaderboard'
  | 'quests'
  | 'historypuzzle'
  | 'wordrace'
  | 'maze';

interface BottomNavProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

/* ---------- Dokdagi 4 ta doimiy tugma (o'rtada Arena tugmasi bor) ---------- */
const DOCK_LEFT: Array<{ key: TabKey; label: string; icon: LucideIcon }> = [
  { key: 'home', label: 'Asosiy', icon: Home },
  { key: 'tests', label: 'Testlar', icon: ClipboardList }
];
const DOCK_RIGHT: Array<{ key: TabKey; label: string; icon: LucideIcon }> = [
  { key: 'leaderboard', label: 'Reyting', icon: Trophy },
  { key: 'quests', label: "Do'kon", icon: ShoppingBag }
];
const DOCK_KEYS: TabKey[] = [...DOCK_LEFT, ...DOCK_RIGHT].map((i) => i.key);

/* ---------- Launcherdagi barcha bo'limlar ---------- */
interface Tile {
  key: TabKey;
  label: string;
  desc: string;
  icon: LucideIcon;
  g: [string, string]; // gradient ranglari
  tag?: 'YANGI' | 'HOT';
}

const CATEGORIES: Array<{ title: string; items: Tile[] }> = [
  {
    title: 'O‘YINLAR VA BELLASHUVLAR',
    items: [
      { key: 'wordrace', label: "So'z Poygasi", desc: 'Poyga, tuning va mashina reytingi', icon: Car, g: ['#ef4444', '#f97316'], tag: 'YANGI' },
      { key: 'maze', label: 'Sky Maze 3D', desc: 'Osmondagi 3D labirint', icon: Box, g: ['#0ea5e9', '#6366f1'], tag: 'YANGI' },
      { key: 'historypuzzle', label: 'Tarix puzzle', desc: 'Voqealarni to‘g‘ri yilga joylang', icon: History, g: ['#7c3aed', '#6366f1'], tag: 'HOT' },
      { key: 'multiplayer', label: '1v1 Duel', desc: 'Do‘stlar bilan bilim jangi', icon: Swords, g: ['#6366f1', '#06b6d4'] },
      { key: 'tugofwar', label: 'Arqon tortish', desc: 'Jamoaviy bellashuv', icon: Flame, g: ['#f43f5e', '#fb923c'], tag: 'HOT' },
      { key: 'millionaire', label: 'Kim millioner?', desc: 'Savollar va bosqichlar', icon: Trophy, g: ['#f59e0b', '#eab308'] },
      { key: 'boardgames', label: 'Shaxmat & shashka', desc: 'Strategik o‘yinlar', icon: Crown, g: ['#d97706', '#facc15'] },
      { key: 'memorygame', label: 'Xotira o‘yini', desc: 'Xotirani sinab ko‘ring', icon: Brain, g: ['#ec4899', '#a855f7'] }
    ]
  },
  {
    title: 'TA’LIM VA RIVOJLANISH',
    items: [
      { key: 'tests', label: 'Fan testlari', desc: 'Barcha fanlardan testlar', icon: ClipboardList, g: ['#2563eb', '#06b6d4'] },
      { key: 'library', label: 'Raqamli kutubxona', desc: 'Kitoblar va qo‘llanmalar', icon: BookOpen, g: ['#059669', '#2dd4bf'] },
      { key: 'pomodoro', label: 'Pomodoro timer', desc: 'Vaqtni samarali boshqaring', icon: Timer, g: ['#e11d48', '#f472b6'] },
      { key: 'teachers', label: 'Ustozlar', desc: 'Ustozlarni baholash', icon: Star, g: ['#9333ea', '#d946ef'] },
      { key: 'leaderboard', label: 'Reyting', desc: 'Eng kuchlilar ro‘yxati', icon: Trophy, g: ['#0891b2', '#6366f1'] },
      { key: 'quests', label: 'Do‘kon & missiyalar', desc: 'Mukofot va topshiriqlar', icon: ShoppingBag, g: ['#0ea5e9', '#22d3ee'] }
    ]
  }
];

const buzz = () => {
  try { navigator.vibrate?.(8); } catch { /* ignore */ }
};

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const customActive = !DOCK_KEYS.includes(activeTab);

  // Launcher ochiq paytida: sahifa aylanmasin, Esc bilan yopilsin
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => { if (!open) setQuery(''); }, [open]);

  const select = (tab: TabKey) => {
    buzz();
    setActiveTab(tab);
    setOpen(false);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES
      .map((c) => ({ ...c, items: c.items.filter((i) => `${i.label} ${i.desc}`.toLowerCase().includes(q)) }))
      .filter((c) => c.items.length > 0);
  }, [query]);

  const dockItem = (item: { key: TabKey; label: string; icon: LucideIcon }) => {
    const Icon = item.icon;
    const active = activeTab === item.key && !open;
    return (
      <button
        key={item.key}
        type="button"
        onClick={() => select(item.key)}
        className={`nd-item ${active ? 'on' : ''}`}
        aria-current={active ? 'page' : undefined}
      >
        <span className="nd-ico"><Icon size={20} strokeWidth={active ? 2.5 : 2} /></span>
        <span className="nd-lbl">{item.label}</span>
        <i className="nd-dot" />
      </button>
    );
  };

  return (
    <div className="nd-t">
      <style>{CSS}</style>

      {/* ================= LAUNCHER ================= */}
      <div className={`nd-launch ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="nd-launch-bg" onClick={() => setOpen(false)} />
        <div className="nd-launch-panel" role="dialog" aria-label="Barcha bo'limlar">
          <div className="nd-head">
            <div>
              <div className="nd-kicker"><Gamepad2 size={13} /> NEXUS ARENA</div>
              <h2>Qayerga <span>boramiz?</span></h2>
            </div>
            <button type="button" className="nd-close" onClick={() => setOpen(false)} aria-label="Yopish">
              <X size={20} />
            </button>
          </div>

          <label className="nd-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="O‘yin yoki bo‘limni qidiring..."
              tabIndex={open ? 0 : -1}
            />
          </label>

          {filtered.length === 0 && <p className="nd-empty">Hech narsa topilmadi 🤔</p>}

          {filtered.map((cat) => (
            <section key={cat.title} className="nd-cat">
              <div className="nd-cat-title">{cat.title}</div>
              <div className="nd-grid">
                {cat.items.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      tabIndex={open ? 0 : -1}
                      className={`nd-tile ${activeTab === t.key ? 'cur' : ''}`}
                      style={{ ['--g1' as string]: t.g[0], ['--g2' as string]: t.g[1], animationDelay: `${open ? i * 45 : 0}ms` } as React.CSSProperties}
                      onClick={() => select(t.key)}
                      onMouseMove={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientX - r.left) / r.width - 0.5;
                        const y = (e.clientY - r.top) / r.height - 0.5;
                        e.currentTarget.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
                        e.currentTarget.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.setProperty('--rx', '0deg');
                        e.currentTarget.style.setProperty('--ry', '0deg');
                      }}
                    >
                      <span className="nd-tile-glow" />
                      <span className="nd-tile-ico"><Icon size={26} strokeWidth={2.2} /></span>
                      {t.tag && <span className={`nd-tag ${t.tag === 'HOT' ? 'hot' : ''}`}>{t.tag}</span>}
                      <span className="nd-tile-txt">
                        <b>{t.label}</b>
                        <small>{t.desc}</small>
                      </span>
                      <ArrowUpRight className="nd-arrow" size={18} />
                      <Icon className="nd-bg-ico" size={110} strokeWidth={1.2} />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ================= DOK ================= */}
      <nav className="nd-dock" aria-label="Asosiy navigatsiya">
        <div className="nd-dock-in">
          {DOCK_LEFT.map(dockItem)}

          <div className="nd-fab-wrap">
            <button
              type="button"
              className={`nd-fab ${open ? 'open' : ''} ${customActive && !open ? 'has' : ''}`}
              onClick={() => { buzz(); setOpen((v) => !v); }}
              aria-expanded={open}
              aria-label="Barcha bo'limlar"
            >
              <span className="nd-fab-ring" />
              <span className="nd-fab-core">
                <Gamepad2 size={26} className="g" />
                <X size={26} className="x" />
              </span>
            </button>
            <span className="nd-fab-lbl">ARENA</span>
          </div>

          {DOCK_RIGHT.map(dockItem)}
        </div>
      </nav>
    </div>
  );
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&display=swap');
@property --nd-a{syntax:'<angle>';initial-value:0deg;inherits:false}

.nd-t{--nd-glass:rgba(255,255,255,.84);--nd-line:rgba(15,23,42,.1);--nd-text:#0f172a;--nd-mute:#64708f;--nd-chip:rgba(15,23,42,.06);--nd-sheet:rgba(244,246,255,.9)}
html.dark .nd-t{--nd-glass:rgba(12,16,34,.8);--nd-line:rgba(255,255,255,.12);--nd-text:#eef2ff;--nd-mute:#93a0c4;--nd-chip:rgba(255,255,255,.07);--nd-sheet:rgba(7,10,24,.9)}
.nd-t *{box-sizing:border-box}

/* ---------- Dok ---------- */
.nd-dock{position:fixed;left:0;right:0;bottom:max(10px,env(safe-area-inset-bottom));z-index:60;display:flex;justify-content:center;padding:0 10px;pointer-events:none}
.nd-dock-in{pointer-events:auto;position:relative;width:min(100%,540px);display:grid;grid-template-columns:1fr 1fr 1.15fr 1fr 1fr;align-items:end;padding:8px 8px 8px;border-radius:30px;
  background:var(--nd-glass);-webkit-backdrop-filter:blur(22px) saturate(1.6);backdrop-filter:blur(22px) saturate(1.6);border:1px solid var(--nd-line);
  box-shadow:0 24px 60px -18px rgba(8,12,40,.55),0 0 0 1px rgba(255,255,255,.04) inset}
.nd-dock-in::before{content:"";position:absolute;inset:-1px;border-radius:31px;padding:1.5px;pointer-events:none;
  background:conic-gradient(from var(--nd-a),transparent 0 50%,#6366f1 66%,#22d3ee 80%,#f472b6 92%,transparent);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);animation:nd-spin 8s linear infinite}
@keyframes nd-spin{to{--nd-a:360deg}}

.nd-item{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;padding:4px 0 2px;background:none;border:0;cursor:pointer;color:var(--nd-mute);transition:color .2s}
.nd-ico{width:44px;height:36px;border-radius:14px;display:grid;place-items:center;transition:transform .35s cubic-bezier(.3,1.5,.5,1),background .25s,box-shadow .25s,color .2s}
.nd-lbl{font-size:10px;font-weight:800;letter-spacing:.02em;transition:.2s}
.nd-item:hover .nd-ico{transform:translateY(-3px);background:var(--nd-chip);color:var(--nd-text)}
.nd-item:active .nd-ico{transform:scale(.88)}
.nd-item.on{color:var(--nd-text)}
.nd-item.on .nd-ico{transform:translateY(-6px);color:#fff;background:linear-gradient(135deg,#6366f1,#8b5cf6 55%,#ec4899);box-shadow:0 12px 24px -8px rgba(99,102,241,.9),inset 0 1px 0 rgba(255,255,255,.35)}
.nd-item.on .nd-lbl{transform:translateY(-4px);color:#6366f1}
html.dark .nd-item.on .nd-lbl{color:#a5b4fc}
.nd-dot{position:absolute;bottom:-3px;width:16px;height:3px;border-radius:3px;background:linear-gradient(90deg,#6366f1,#ec4899);box-shadow:0 0 10px #8b5cf6;opacity:0;transform:scaleX(.2);transition:.3s}
.nd-item.on .nd-dot{opacity:1;transform:scaleX(1)}

/* Markazdagi Arena tugmasi */
.nd-fab-wrap{display:flex;flex-direction:column;align-items:center;gap:3px;margin-top:-34px}
.nd-fab{position:relative;width:68px;height:68px;border-radius:50%;border:0;padding:0;cursor:pointer;background:none;transition:transform .3s cubic-bezier(.3,1.5,.5,1)}
.nd-fab:hover{transform:translateY(-3px) scale(1.04)}
.nd-fab:active{transform:scale(.92)}
.nd-fab-ring{position:absolute;inset:-5px;border-radius:50%;background:conic-gradient(from var(--nd-a),#6366f1,#22d3ee,#f472b6,#fbbf24,#6366f1);animation:nd-spin 4s linear infinite;filter:blur(.3px)}
.nd-fab-core{position:relative;display:grid;place-items:center;width:100%;height:100%;border-radius:50%;color:#fff;
  background:radial-gradient(circle at 30% 25%,#8b5cf6,#4f46e5 55%,#312e81);box-shadow:0 14px 30px -6px rgba(79,70,229,.9),inset 0 2px 0 rgba(255,255,255,.35),inset 0 -6px 12px rgba(0,0,0,.25);border:3px solid var(--nd-glass)}
.nd-fab-core svg{position:absolute;transition:transform .5s cubic-bezier(.3,1.4,.5,1),opacity .25s}
.nd-fab-core .x{transform:rotate(-120deg) scale(0);opacity:0}
.nd-fab.open .g{transform:rotate(120deg) scale(0);opacity:0}
.nd-fab.open .x{transform:rotate(0) scale(1);opacity:1}
.nd-fab:not(.open)::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:2px solid rgba(99,102,241,.55);animation:nd-ping 2.6s ease-out infinite;pointer-events:none}
@keyframes nd-ping{0%{transform:scale(.9);opacity:.9}100%{transform:scale(1.55);opacity:0}}
.nd-fab.has::before{content:"";position:absolute;top:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:#22c55e;border:3px solid var(--nd-glass);z-index:3;box-shadow:0 0 10px #22c55e}
.nd-fab-lbl{font-family:'Unbounded',system-ui,sans-serif;font-size:8px;font-weight:900;letter-spacing:.18em;color:var(--nd-text)}

/* ---------- Launcher ---------- */
.nd-launch{position:fixed;inset:0;z-index:55;visibility:hidden;pointer-events:none}
.nd-launch.open{visibility:visible;pointer-events:auto}
.nd-launch-bg{position:absolute;inset:0;opacity:0;transition:opacity .35s;
  background:radial-gradient(90% 60% at 50% 0%,rgba(99,102,241,.35),transparent 70%),radial-gradient(70% 50% at 100% 100%,rgba(236,72,153,.28),transparent 70%),var(--nd-sheet);
  -webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px)}
.nd-launch.open .nd-launch-bg{opacity:1}
.nd-launch-panel{position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;padding:22px 16px 150px;max-width:1040px;margin:0 auto;color:var(--nd-text);
  transform:translateY(40px) scale(.98);opacity:0;transition:transform .45s cubic-bezier(.2,.9,.3,1.1),opacity .3s}
.nd-launch.open .nd-launch-panel{transform:none;opacity:1}
.nd-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px}
.nd-kicker{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:900;letter-spacing:.2em;color:#6366f1;padding:5px 11px;border-radius:999px;background:rgba(99,102,241,.14);border:1px solid rgba(99,102,241,.35)}
html.dark .nd-kicker{color:#a5b4fc}
.nd-head h2{font-family:'Unbounded',system-ui,sans-serif;font-size:clamp(26px,6vw,40px);font-weight:900;letter-spacing:-.02em;margin:10px 0 0;line-height:1.05}
.nd-head h2 span{background:linear-gradient(90deg,#6366f1,#ec4899,#f59e0b);-webkit-background-clip:text;background-clip:text;color:transparent}
.nd-close{width:44px;height:44px;border-radius:15px;display:grid;place-items:center;cursor:pointer;color:var(--nd-text);background:var(--nd-chip);border:1px solid var(--nd-line);transition:.2s;flex:none}
.nd-close:hover{transform:rotate(90deg);background:rgba(244,63,94,.18);color:#f43f5e}
.nd-search{display:flex;align-items:center;gap:10px;padding:0 14px;height:48px;border-radius:16px;background:var(--nd-chip);border:1px solid var(--nd-line);color:var(--nd-mute);margin-bottom:6px;transition:.2s}
.nd-search:focus-within{border-color:#6366f1;box-shadow:0 0 0 4px rgba(99,102,241,.18)}
.nd-search input{flex:1;background:none;border:0;outline:0;color:var(--nd-text);font-size:14px;font-weight:600;font-family:inherit}
.nd-empty{text-align:center;color:var(--nd-mute);padding:40px 0;font-weight:700}
.nd-cat{margin-top:22px}
.nd-cat-title{font-size:11px;font-weight:900;letter-spacing:.2em;color:var(--nd-mute);margin-bottom:12px}
.nd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
@media(max-width:520px){.nd-grid{grid-template-columns:1fr}}

.nd-tile{--rx:0deg;--ry:0deg;position:relative;overflow:hidden;display:flex;align-items:center;gap:14px;text-align:left;padding:16px;border-radius:22px;cursor:pointer;color:#fff;border:1px solid rgba(255,255,255,.2);
  background:linear-gradient(135deg,var(--g1),var(--g2));box-shadow:0 16px 34px -16px var(--g1);
  transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform .18s ease-out,box-shadow .25s,filter .25s;
  opacity:0;animation:nd-in .5s cubic-bezier(.2,.9,.3,1.2) forwards}
.nd-launch:not(.open) .nd-tile{animation:none;opacity:0}
@keyframes nd-in{from{opacity:0;transform:translateY(24px) scale(.92)}to{opacity:1;transform:perspective(800px) rotateX(0) rotateY(0)}}
.nd-tile:hover{box-shadow:0 22px 44px -14px var(--g1);filter:saturate(1.15)}
.nd-tile:active{transform:scale(.97)}
.nd-tile.cur{outline:3px solid rgba(255,255,255,.85);outline-offset:-3px}
.nd-tile-glow{position:absolute;inset:0;background:radial-gradient(circle at var(--mx,20%) 0%,rgba(255,255,255,.35),transparent 55%);opacity:.7;pointer-events:none}
.nd-tile-ico{position:relative;z-index:1;width:54px;height:54px;border-radius:17px;display:grid;place-items:center;flex:none;background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.4);box-shadow:inset 0 1px 0 rgba(255,255,255,.45);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);transition:transform .35s cubic-bezier(.3,1.5,.5,1)}
.nd-tile:hover .nd-tile-ico{transform:rotate(-8deg) scale(1.1)}
.nd-tile-txt{position:relative;z-index:1;display:flex;flex-direction:column;min-width:0;flex:1}
.nd-tile-txt b{font-family:'Unbounded',system-ui,sans-serif;font-size:13.5px;font-weight:700;line-height:1.2}
.nd-tile-txt small{font-size:11.5px;font-weight:600;opacity:.88;margin-top:4px;line-height:1.35}
.nd-arrow{position:relative;z-index:1;opacity:.7;flex:none;transition:transform .25s}
.nd-tile:hover .nd-arrow{transform:translate(3px,-3px);opacity:1}
.nd-bg-ico{position:absolute;right:-16px;bottom:-24px;opacity:.14;transform:rotate(-14deg);pointer-events:none;transition:transform .5s}
.nd-tile:hover .nd-bg-ico{transform:rotate(-4deg) scale(1.12)}
.nd-tag{position:absolute;top:10px;right:12px;z-index:2;font-size:9px;font-weight:900;letter-spacing:.12em;padding:3px 8px;border-radius:999px;background:#fff;color:#0f172a;box-shadow:0 4px 12px rgba(0,0,0,.25);animation:nd-tag 1.8s ease-in-out infinite}
.nd-tag.hot{background:#fff1f2;color:#e11d48}
@keyframes nd-tag{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}

@media (prefers-reduced-motion:reduce){
  .nd-dock-in::before,.nd-fab-ring,.nd-fab:not(.open)::after,.nd-tag{animation:none!important}
  .nd-tile{animation-duration:.01s!important}
}
`;