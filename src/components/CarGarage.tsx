/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { User } from '../types';
import { Coins, Check, Lock, RotateCw, ArrowUp, Sparkles, Pencil, Flag } from 'lucide-react';
import { CarArt } from './CarArt';
import {
  CATEGORIES, CAT_BY_KEY, PERF, Garage, Look, CatKey, PerfKey, Item,
  buyItem, equipItem, upgradePart, renameCar, ratingOf, classOf, getCoins, itemOf
} from '../services/garage';

/* ---------- kichik ovoz (poyga bilan bir xil sozlama) ---------- */
let ctx: AudioContext | null = null;
const chime = (notes: number[], type: OscillatorType = 'triangle') => {
  try {
    if (localStorage.getItem('wordrace_sound') === 'off') return;
    if (!ctx) {
      const AC = window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    notes.forEach((f, i) => {
      const t0 = ctx!.currentTime + i * 0.09;
      const o = ctx!.createOscillator();
      const g = ctx!.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.07, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      o.connect(g).connect(ctx!.destination);
      o.start(t0);
      o.stop(t0 + 0.26);
    });
  } catch { /* ignore */ }
};

/* ---------- Sinf belgisi ---------- */
export const ClassBadge: React.FC<{ rating: number; size?: number }> = ({ rating, size = 34 }) => {
  const c = classOf(rating);
  return (
    <span
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        flex: 'none',
        width: size,
        height: size,
        fontSize: size * 0.46,
        fontWeight: 900,
        fontStyle: 'italic',
        lineHeight: 1,
        color: c.color,
        borderRadius: Math.round(size * 0.3),
        border: `2px solid ${c.color}`,
        background: `linear-gradient(160deg, color-mix(in srgb, ${c.color} 25%, #0b1020), #0b1020)`,
        boxShadow: `0 0 18px -2px ${c.color}`
      }}
    >
      {c.label}
    </span>
  );
};

const MAX_STYLE = CATEGORIES.reduce((s, c) => s + Math.max(...c.items.map((i) => i.pts)), 0);

/* ===================== KOMPONENT ===================== */

interface CarGarageProps {
  currentUser: User;
  ownerName: string;
  garage: Garage;
  onGarageChange: (g: Garage) => void;
  onUserStatsUpdated: () => void;
  onGoRace: () => void;
}

type Tab = 'perf' | CatKey;

export function CarGarage({ currentUser, ownerName, garage, onGarageChange, onUserStatsUpdated, onGoRace }: CarGarageProps) {
  const uid = String(currentUser.id);
  const [tab, setTab] = useState<Tab>('perf');
  const [preview, setPreview] = useState<Partial<Look>>({});
  const [coins, setCoins] = useState<number>(() => getCoins());
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [spin, setSpin] = useState(false);
  const [flash, setFlash] = useState(0);
  const [gain, setGain] = useState<number | null>(null);
  const [nameDraft, setNameDraft] = useState(garage.name);
  const [plateDraft, setPlateDraft] = useState(garage.plate);
  const [editing, setEditing] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => { timers.current.forEach((t) => window.clearTimeout(t)); }, []);
  useEffect(() => { setCoins(getCoins()); }, [garage]);

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    later(() => setToast(null), 2600);
  };

  const stageLook: Look = useMemo(() => ({ ...garage.equipped, ...preview } as Look), [garage.equipped, preview]);
  const baseRating = ratingOf(garage);
  const stageRating = ratingOf({ equipped: stageLook, levels: garage.levels, wins: garage.wins });
  const delta = stageRating - baseRating;
  const neon = itemOf('neon', stageLook.neon).v || '#3b82f6';

  const previewEntry = Object.entries(preview)[0] as [CatKey, string] | undefined;
  const previewItem: Item | null = previewEntry ? itemOf(previewEntry[0], previewEntry[1]) : null;
  const previewCat = previewEntry ? CAT_BY_KEY[previewEntry[0]] : null;

  const afterAction = (g: Garage, msg: string, ok: boolean, prDiff: number) => {
    onGarageChange(g);
    setCoins(getCoins());
    onUserStatsUpdated();
    showToast(msg, ok);
    if (ok) {
      chime([660, 880, 1175]);
      setFlash((f) => f + 1);
      if (prDiff > 0) {
        setGain(prDiff);
        later(() => setGain(null), 1600);
      }
    } else {
      chime([200, 150], 'sawtooth');
    }
  };

  const onItemClick = (cat: CatKey, item: Item) => {
    const owned = garage.owned[cat].includes(item.id);
    if (owned) {
      if (garage.equipped[cat] !== item.id) {
        const g = equipItem(uid, ownerName, garage, cat, item.id);
        setPreview({});
        onGarageChange(g);
        chime([520, 700]);
      }
      return;
    }
    setPreview({ [cat]: item.id });
    chime([440]);
  };

  const onBuy = () => {
    if (!previewEntry) return;
    const [cat, id] = previewEntry;
    const before = ratingOf(garage);
    const res = buyItem(uid, ownerName, garage, cat, id);
    setPreview({});
    afterAction(res.garage, res.msg, res.ok, ratingOf(res.garage) - before);
  };

  const onUpgrade = (key: PerfKey) => {
    const before = ratingOf(garage);
    const res = upgradePart(uid, ownerName, garage, key);
    afterAction(res.garage, res.msg, res.ok, ratingOf(res.garage) - before);
  };

  const saveName = () => {
    const g = renameCar(uid, ownerName, garage, nameDraft, plateDraft);
    onGarageChange(g);
    setNameDraft(g.name);
    setPlateDraft(g.plate);
    setEditing(false);
    showToast('Saqlandi', true);
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setPreview({});
    chime([600]);
  };

  /* ---- Ko'rsatkichlar ---- */
  const lv = garage.levels;
  const styleSum = CATEGORIES.reduce((s, c) => s + itemOf(c.key, stageLook[c.key]).pts, 0);
  const bars = [
    { label: 'Tezlik', v: (lv.engine / 5) * 0.7 + (lv.aero / 5) * 0.3, c: '#f97316' },
    { label: 'Tezlanish', v: (lv.turbo / 5) * 0.5 + (lv.nitro / 5) * 0.5, c: '#ef4444' },
    { label: 'Boshqaruv', v: lv.tires / 5, c: '#22c55e' },
    { label: 'Texnologiya', v: lv.radar / 3, c: '#38bdf8' },
    { label: "Ko'rinish", v: Math.min(1, styleSum / MAX_STYLE), c: '#e879f9' }
  ];

  const cat = tab === 'perf' ? null : CAT_BY_KEY[tab];
  const canBuy = previewItem ? coins >= previewItem.price : false;

  return (
    <div className="cg-root">
      <style>{CSS}</style>

      {/* ---------- Yuqori qator ---------- */}
      <div className="cg-top">
        <div className="cg-pill cg-coins"><Coins size={16} /> <b>{coins.toLocaleString('uz-UZ')}</b> tanga</div>
        <button type="button" className="cg-pill cg-race" onClick={onGoRace}><Flag size={15} /> Poygaga chiqish</button>
      </div>

      <div className="cg-grid">
        {/* ---------- SHOUMRUM ---------- */}
        <section className={`cg-stage ${flash ? 'flash' : ''}`} key={`stage-${flash}`} style={{ ['--neon' as string]: neon } as React.CSSProperties}>
          <div className="cg-stage-head">
            <div>
              {editing ? (
                <div className="cg-edit">
                  <input value={nameDraft} maxLength={18} onChange={(e) => setNameDraft(e.target.value)} placeholder="Mashina nomi" />
                  <input value={plateDraft} maxLength={6} onChange={(e) => setPlateDraft(e.target.value)} placeholder="Raqam" className="plate" />
                  <button type="button" onClick={saveName}><Check size={14} /></button>
                </div>
              ) : (
                <button type="button" className="cg-name" onClick={() => { setNameDraft(garage.name); setPlateDraft(garage.plate); setEditing(true); }}>
                  {garage.name} <Pencil size={13} />
                </button>
              )}
              <div className="cg-sub">{ownerName} · raqam {garage.plate}</div>
            </div>
            <div className="cg-rating">
              <ClassBadge rating={stageRating} size={42} />
              <div>
                <b>{stageRating}</b>
                <span>PR{delta !== 0 && <em className={delta > 0 ? 'up' : 'down'}> {delta > 0 ? '+' : ''}{delta}</em>}</span>
              </div>
            </div>
          </div>

          <div className="cg-floor">
            <div className="cg-spot" />
            <div className="cg-ring r1" />
            <div className="cg-ring r2" />
            <div className="cg-ring r3" />
            <div className={`cg-turn ${spin ? 'spin' : 'sway'}`}>
              <div className="cg-car">
                <CarArt look={stageLook} uid="stage" plate={garage.plate} />
              </div>
            </div>
            {previewItem && <div className="cg-try"><Sparkles size={13} /> Sinab ko'ryapsiz</div>}
            {gain !== null && <div className="cg-gain"><ArrowUp size={16} /> +{gain} PR</div>}
            <button type="button" className={`cg-spin-btn ${spin ? 'on' : ''}`} onClick={() => setSpin((s) => !s)} aria-label="Aylantirish">
              <RotateCw size={16} />
            </button>
          </div>

          <div className="cg-bars">
            {bars.map((b) => (
              <div key={b.label} className="cg-bar">
                <span>{b.label}</span>
                <div><i style={{ width: `${Math.round(b.v * 100)}%`, background: `linear-gradient(90deg,${b.c},${b.c}aa)` }} /></div>
              </div>
            ))}
          </div>

          <div className="cg-record">
            <div><b>{garage.races}</b><span>poyga</span></div>
            <div><b>{garage.wins}</b><span>g'alaba</span></div>
            <div><b>{garage.podiums}</b><span>sovrinli o'rin</span></div>
          </div>
        </section>

        {/* ---------- DO'KON ---------- */}
        <section className="cg-shop">
          <div className="cg-tabs" role="tablist">
            <button type="button" role="tab" className={`cg-tab ${tab === 'perf' ? 'on' : ''}`} onClick={() => switchTab('perf')}>
              <span>⚡</span> Kuchaytirish
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.key} type="button" role="tab" className={`cg-tab ${tab === c.key ? 'on' : ''}`} onClick={() => switchTab(c.key)}>
                <span>{c.emoji}</span> {c.title}
              </button>
            ))}
          </div>

          {toast && <div className={`cg-toast ${toast.ok ? 'ok' : 'bad'}`}>{toast.msg}</div>}

          {/* Kuchaytirish */}
          {tab === 'perf' && (
            <div className="cg-list">
              <p className="cg-note">Kuchaytirilgan mashina poygada sezilarli ustunlik beradi. Botlar ham biroz kuchayadi, shuning uchun bilim muhim bo'lib qoladi.</p>
              {PERF.map((p) => {
                const l = garage.levels[p.key];
                const max = l >= p.max;
                const price = max ? 0 : p.costs[l];
                const can = coins >= price;
                return (
                  <div className="cg-perf" key={p.key}>
                    <div className="cg-perf-ic">{p.emoji}</div>
                    <div className="cg-perf-main">
                      <div className="cg-perf-title">{p.title} <small>{l}/{p.max}</small></div>
                      <div className="cg-perf-desc">{p.desc}</div>
                      <div className="cg-pips">
                        {Array.from({ length: p.max }).map((_, i) => (<i key={i} className={i < l ? 'on' : ''} />))}
                      </div>
                      <div className="cg-perf-fx">
                        <span>Hozir: <b>{p.effect(l)}</b></span>
                        {!max && <span className="next">Keyingi: <b>{p.effect(l + 1)}</b></span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`cg-buy ${max ? 'max' : ''}`}
                      disabled={max || !can}
                      onClick={() => onUpgrade(p.key)}
                    >
                      {max ? 'MAX' : (<><ArrowUp size={14} /> <Coins size={13} /> {price}</>)}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Ko'rinish qismlari */}
          {cat && (
            <div>
              <p className="cg-note">{cat.desc}. Sotib olishdan oldin bosib, mashinada sinab ko'ring.</p>
              <div className="cg-items">
                {cat.items.map((it) => {
                  const owned = garage.owned[cat.key].includes(it.id);
                  const equipped = garage.equipped[cat.key] === it.id;
                  const trying = preview[cat.key] === it.id;
                  const art: Look = { ...garage.equipped, [cat.key]: it.id } as Look;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      className={`cg-item ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''} ${trying ? 'trying' : ''}`}
                      onClick={() => onItemClick(cat.key, it)}
                    >
                      {it.tag && <span className="cg-tag">{it.tag}</span>}
                      <div className="cg-item-art"><CarArt look={art} uid={`i-${cat.key}-${it.id}`} plate={garage.plate} glow /></div>
                      <div className="cg-item-name">{it.name}</div>
                      <div className="cg-item-pts">{it.pts > 0 ? `+${it.pts} PR` : 'Standart'}</div>
                      <div className="cg-item-state">
                        {equipped ? (<span className="eq"><Check size={13} /> Kiyilgan</span>)
                          : owned ? (<span className="ow">Sizniki</span>)
                            : (<span className="pr"><Lock size={11} /> <Coins size={12} /> {it.price.toLocaleString('uz-UZ')}</span>)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sotib olish paneli */}
          {previewItem && previewCat && (
            <div className="cg-bar-buy">
              <div>
                <b>{previewCat.title}: {previewItem.name}</b>
                <span>{previewItem.pts > 0 ? `+${previewItem.pts} PR · ` : ''}{canBuy ? "Sotib olishga tayyor" : `Yana ${previewItem.price - coins} tanga kerak`}</span>
              </div>
              <div className="cg-bar-act">
                <button type="button" className="cg-cancel" onClick={() => setPreview({})}>Bekor</button>
                <button type="button" className="cg-buy big" disabled={!canBuy} onClick={onBuy}>
                  <Coins size={15} /> {previewItem.price.toLocaleString('uz-UZ')} · Sotib olish
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ===================== USLUBLAR ===================== */

const CSS = `
.cg-root{max-width:1040px;margin:0 auto;color:#e8edf7;position:relative}
.cg-root *{box-sizing:border-box}
.cg-top{display:flex;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap}
.cg-pill{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:14px;background:#10152a;border:1px solid rgba(255,255,255,.09);font-weight:700;font-size:14px;color:#e8edf7}
.cg-coins svg{color:#fbbf24}.cg-coins b{font-size:17px;font-variant-numeric:tabular-nums}
.cg-race{cursor:pointer;background:linear-gradient(135deg,#ef4444,#f97316);border:0;color:#fff;box-shadow:0 8px 22px -8px rgba(239,68,68,.7)}
.cg-race:hover{transform:translateY(-1px)}
.cg-grid{display:grid;grid-template-columns:minmax(0,420px) minmax(0,1fr);gap:16px;align-items:start}
@media(max-width:860px){.cg-grid{grid-template-columns:1fr}}

/* ----- Shourum ----- */
.cg-stage{position:sticky;top:12px;border-radius:26px;padding:16px;background:
  radial-gradient(120% 80% at 50% 0%,color-mix(in srgb,var(--neon) 22%,#0c1124),#0a0e1d 60%),#0a0e1d;
  border:1px solid rgba(255,255,255,.09);box-shadow:0 30px 70px -30px rgba(0,0,0,.9);overflow:hidden}
@media(max-width:860px){.cg-stage{position:relative;top:0}}
.cg-stage.flash::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.5),transparent 60%);animation:cg-flash .8s ease-out forwards}
@keyframes cg-flash{from{opacity:1}to{opacity:0}}
.cg-stage-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;position:relative;z-index:3}
.cg-name{display:inline-flex;align-items:center;gap:8px;background:none;border:0;color:#fff;font-size:20px;font-weight:900;font-style:italic;cursor:pointer;padding:0;letter-spacing:-.01em}
.cg-name svg{opacity:.5}
.cg-sub{font-size:12px;color:#8a95b0;margin-top:2px}
.cg-edit{display:flex;gap:6px}
.cg-edit input{width:140px;padding:6px 9px;border-radius:9px;background:#0b1020;border:1px solid rgba(255,255,255,.18);color:#fff;font-weight:700;font-size:14px}
.cg-edit input.plate{width:70px;text-transform:uppercase}
.cg-edit button{width:32px;border-radius:9px;border:0;background:#22c55e;color:#fff;display:grid;place-items:center;cursor:pointer}
.cg-rating{display:flex;align-items:center;gap:10px}
.cg-rating b{display:block;font-size:24px;line-height:1;font-weight:900;font-variant-numeric:tabular-nums}
.cg-rating span{font-size:11px;color:#8a95b0;letter-spacing:.1em}
.cg-rating em{font-style:normal;font-weight:800}
.cg-rating em.up{color:#4ade80}.cg-rating em.down{color:#f87171}
.cg-class{display:inline-grid;place-items:center;border-radius:12px;font-weight:900;font-style:italic;color:var(--cc);
  background:linear-gradient(160deg,color-mix(in srgb,var(--cc) 25%,#0b1020),#0b1020);border:2px solid var(--cc);box-shadow:0 0 18px -2px var(--cc);flex:none}

.cg-floor{position:relative;height:340px;margin:8px -6px 4px;display:grid;place-items:center;perspective:900px}
@media(max-width:520px){.cg-floor{height:290px}}
.cg-spot{position:absolute;top:-30px;left:50%;width:300px;height:380px;transform:translateX(-50%);
  background:linear-gradient(180deg,rgba(255,255,255,.18),transparent 85%);clip-path:polygon(38% 0,62% 0,100% 100%,0 100%);filter:blur(6px);pointer-events:none}
.cg-ring{position:absolute;left:50%;top:52%;border-radius:50%;transform:translate(-50%,-50%) rotateX(68deg);border:2px solid color-mix(in srgb,var(--neon) 60%,transparent);box-shadow:0 0 30px color-mix(in srgb,var(--neon) 45%,transparent),inset 0 0 30px color-mix(in srgb,var(--neon) 25%,transparent)}
.cg-ring.r1{width:300px;height:300px}
.cg-ring.r2{width:230px;height:230px;opacity:.6}
.cg-ring.r3{width:350px;height:350px;opacity:.25}
.cg-turn{position:relative;z-index:2}
.cg-turn.sway{animation:cg-sway 5s ease-in-out infinite alternate}
.cg-turn.spin{animation:cg-spin 9s linear infinite}
@keyframes cg-sway{from{transform:rotate(-7deg) translateY(0)}to{transform:rotate(7deg) translateY(-4px)}}
@keyframes cg-spin{to{transform:rotate(360deg)}}
.cg-car{width:128px;height:256px;filter:drop-shadow(0 18px 22px rgba(0,0,0,.6))}
@media(max-width:520px){.cg-car{width:108px;height:216px}}
.cg-try{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);z-index:4;display:inline-flex;gap:6px;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(251,191,36,.16);border:1px solid rgba(251,191,36,.5);color:#fde68a;font-size:12px;font-weight:800;white-space:nowrap}
.cg-gain{position:absolute;left:50%;top:30%;z-index:6;display:inline-flex;align-items:center;gap:4px;font-size:26px;font-weight:900;color:#4ade80;text-shadow:0 0 20px rgba(74,222,128,.8);animation:cg-float 1.6s ease-out forwards}
@keyframes cg-float{0%{opacity:0;transform:translate(-50%,10px) scale(.7)}20%{opacity:1;transform:translate(-50%,0) scale(1.15)}100%{opacity:0;transform:translate(-50%,-50px) scale(1)}}
.cg-spin-btn{position:absolute;right:10px;bottom:8px;z-index:5;width:36px;height:36px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);color:#cbd5ee;display:grid;place-items:center;cursor:pointer}
.cg-spin-btn.on{background:#3b82f6;color:#fff;border-color:#60a5fa}
.cg-bars{display:grid;gap:8px;margin-top:6px;position:relative;z-index:3}
.cg-bar{display:grid;grid-template-columns:92px 1fr;gap:10px;align-items:center;font-size:12px;color:#aab4cc}
.cg-bar div{height:8px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden}
.cg-bar i{display:block;height:100%;border-radius:6px;transition:width .6s cubic-bezier(.2,.8,.2,1)}
.cg-record{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px;position:relative;z-index:3}
.cg-record div{background:rgba(255,255,255,.05);border-radius:12px;padding:8px;text-align:center}
.cg-record b{display:block;font-size:18px;font-weight:900}
.cg-record span{font-size:10px;color:#8a95b0}

/* ----- Do'kon ----- */
.cg-shop{container-type:inline-size;border-radius:26px;padding:14px;background:linear-gradient(180deg,#10152a,#0b0f1e);border:1px solid rgba(255,255,255,.08);min-width:0;position:relative;padding-bottom:78px}
.cg-tabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;scrollbar-width:thin;-webkit-overflow-scrolling:touch}
.cg-tab{flex:none;display:inline-flex;align-items:center;gap:6px;padding:8px 13px;border-radius:12px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);color:#aab4cc;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;transition:.15s}
.cg-tab:hover{background:rgba(255,255,255,.09);color:#fff}
.cg-tab.on{background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;border-color:transparent;box-shadow:0 8px 20px -8px rgba(99,102,241,.8)}
.cg-note{font-size:12px;color:#8a95b0;margin:4px 2px 12px;line-height:1.5}
.cg-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:80;max-width:calc(100vw - 32px);padding:12px 18px;border-radius:14px;font-weight:800;font-size:14px;backdrop-filter:blur(10px);box-shadow:0 18px 40px -10px rgba(0,0,0,.8);animation:cg-toast .3s ease}
@keyframes cg-toast{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}
.cg-toast.ok{background:rgba(8,40,24,.95);border:1px solid rgba(34,197,94,.6);color:#86efac}
.cg-toast.bad{background:rgba(48,12,12,.95);border:1px solid rgba(239,68,68,.6);color:#fca5a5}
@keyframes cg-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}

.cg-list{display:flex;flex-direction:column;gap:10px}
.cg-perf{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}
@container (max-width:470px){.cg-perf{grid-template-columns:44px minmax(0,1fr)}.cg-perf .cg-buy{grid-column:1/-1}}
.cg-perf-ic{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;font-size:24px;background:linear-gradient(135deg,rgba(59,130,246,.3),rgba(139,92,246,.3));border:1px solid rgba(255,255,255,.1)}
.cg-perf-title{font-weight:900;font-size:15px}
.cg-perf-title small{color:#8a95b0;font-weight:700;margin-left:6px}
.cg-perf-desc{font-size:12px;color:#8a95b0;margin:2px 0 6px}
.cg-pips{display:flex;gap:4px;margin-bottom:6px}
.cg-pips i{width:22px;height:7px;border-radius:4px;background:rgba(255,255,255,.1)}
.cg-pips i.on{background:linear-gradient(90deg,#f59e0b,#f97316);box-shadow:0 0 10px rgba(249,115,22,.6)}
.cg-perf-fx{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:11px;color:#8a95b0}
.cg-perf-fx b{color:#e8edf7}
.cg-perf-fx .next b{color:#4ade80}

.cg-buy{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 14px;border-radius:12px;border:0;font-weight:900;font-size:13px;cursor:pointer;color:#fff;
  background:linear-gradient(135deg,#f59e0b,#f97316);box-shadow:0 8px 20px -8px rgba(249,115,22,.8);transition:.15s;white-space:nowrap}
.cg-buy:hover:not(:disabled){transform:translateY(-2px)}
.cg-buy:disabled{opacity:.4;cursor:not-allowed;filter:grayscale(.5);box-shadow:none}
.cg-buy.max{background:linear-gradient(135deg,#16a34a,#22c55e);opacity:1;filter:none}
.cg-buy.big{padding:12px 18px;font-size:14px}

.cg-items{display:grid;grid-template-columns:repeat(auto-fill,minmax(122px,1fr));gap:10px}
.cg-item{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 8px 10px;border-radius:18px;cursor:pointer;color:inherit;
  background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));border:2px solid rgba(255,255,255,.07);transition:.15s;text-align:center}
.cg-item:hover{transform:translateY(-3px);border-color:rgba(96,165,250,.55)}
.cg-item.equipped{border-color:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.16)}
.cg-item.trying{border-color:#fbbf24;box-shadow:0 0 0 3px rgba(251,191,36,.2);transform:translateY(-3px)}
.cg-item-art{width:46px;height:92px;margin:6px 0 2px}
.cg-item-name{font-weight:800;font-size:13px}
.cg-item-pts{font-size:10px;color:#8a95b0}
.cg-item-state{margin-top:2px;font-size:12px;font-weight:800}
.cg-item-state span{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:999px}
.cg-item-state .eq{background:rgba(34,197,94,.16);color:#86efac}
.cg-item-state .ow{background:rgba(255,255,255,.08);color:#cbd5ee}
.cg-item-state .pr{background:rgba(251,191,36,.14);color:#fde68a}
.cg-tag{position:absolute;top:6px;right:6px;font-size:9px;font-weight:900;letter-spacing:.08em;padding:2px 6px;border-radius:6px;background:linear-gradient(135deg,#ec4899,#8b5cf6);color:#fff;text-transform:uppercase}

.cg-bar-buy{position:sticky;bottom:8px;margin-top:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 14px;border-radius:18px;
  background:rgba(12,17,36,.92);backdrop-filter:blur(10px);border:1px solid rgba(251,191,36,.45);box-shadow:0 16px 40px -10px rgba(0,0,0,.8);z-index:8;animation:cg-in .25s ease}
.cg-bar-buy b{display:block;font-size:14px}
.cg-bar-buy span{font-size:12px;color:#8a95b0}
.cg-bar-act{display:flex;gap:8px;align-items:center;flex-wrap:wrap;max-width:100%}
.cg-bar-act .cg-buy.big{padding:11px 14px}
.cg-cancel{padding:11px 14px;border-radius:12px;background:transparent;border:1px solid rgba(255,255,255,.16);color:#cbd5ee;font-weight:700;cursor:pointer}

@media (prefers-reduced-motion:reduce){.cg-turn.sway,.cg-turn.spin,.cg-gain{animation:none!important}}
`;