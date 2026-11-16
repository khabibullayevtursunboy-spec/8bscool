/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NEXUS ARENA — suzuvchi shisha navbar.
 * O'quvchining darajasi (XP halqasi), tangalari va tezkor tugmalar shu yerda.
 */

import React, { useEffect, useRef, useState } from 'react';
import type { User, SiteSettings } from '../types';
import { Coins, Settings, LogOut, Sparkles, Gamepad2, Moon, Sun, Plus } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  settings: SiteSettings;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

/* Raqam silliq o'sib boradigan hook */
function useCountUp(target: number, ms = 700): number {
  const [shown, setShown] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      fromRef.current = target;
    };
  }, [target, ms]);
  return shown;
}

const RING_R = 19;
const RING_C = 2 * Math.PI * RING_R;

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenProfile,
  onOpenSettings,
  onLogout,
  theme,
  toggleTheme
}) => {
  // Turli User model nomlari bilan ham ishlashi uchun xavfsiz o'qish
  const user = currentUser as unknown as Record<string, unknown> | null;
  const displayName = String(user?.name ?? user?.full_name ?? user?.fullName ?? user?.username ?? user?.firstName ?? 'O‘quvchi');
  const coins = Number(user?.coins ?? user?.coin ?? user?.balance ?? 0) || 0;
  const xp = Number(user?.xp ?? user?.exp ?? 0) || 0;
  const level = Number(user?.level) || Math.floor(xp / 100) + 1;
  const levelXp = xp % 100;
  const initials = displayName.trim().slice(0, 1).toUpperCase() || 'O';

  const [scrolled, setScrolled] = useState(false);
  const [gain, setGain] = useState<{ n: number; k: number } | null>(null);
  const prevCoins = useRef(coins);
  const shownCoins = useCountUp(coins);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tanga o'zgarganda "+N" yozuvi uchib chiqadi
  useEffect(() => {
    const diff = coins - prevCoins.current;
    prevCoins.current = coins;
    if (diff === 0) return;
    setGain({ n: diff, k: Date.now() });
    const t = window.setTimeout(() => setGain(null), 1600);
    return () => window.clearTimeout(t);
  }, [coins]);

  return (
    <header className={`nx-nav nx-t ${scrolled ? 'scrolled' : ''}`}>
      <style>{CSS}</style>

      <div className="nx-nav-in">
        {/* ---- Logo ---- */}
        <button type="button" onClick={onOpenProfile} className="nx-brand" aria-label="Profilni ochish">
          <span className="nx-orb">
            <span className="nx-orb-ring" />
            <Gamepad2 size={20} strokeWidth={2.4} />
            <i className="nx-orb-spark"><Sparkles size={10} /></i>
          </span>
          <span className="nx-brand-txt">
            <b>NEXUS</b>
            <small>8-B · ARENA</small>
          </span>
        </button>

        {/* ---- Daraja paneli (katta ekranda) ---- */}
        <div className="nx-level" title={`${levelXp} / 100 XP`}>
          <span className="nx-level-badge">LVL {level}</span>
          <div className="nx-level-bar"><i style={{ width: `${Math.max(4, levelXp)}%` }} /></div>
          <span className="nx-level-xp">{levelXp}<em>/100 XP</em></span>
        </div>

        {/* ---- O'ng tomon ---- */}
        <div className="nx-actions">
          <div className="nx-coins" title={`${coins} coin`}>
            <span className="nx-coin"><Coins size={15} /></span>
            <b>{shownCoins.toLocaleString('uz-UZ')}</b>
            <span className="nx-coin-plus"><Plus size={11} /></span>
            {gain && (
              <span key={gain.k} className={`nx-gain ${gain.n < 0 ? 'neg' : ''}`}>
                {gain.n > 0 ? '+' : ''}{gain.n}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="nx-icon"
            aria-label={theme === 'dark' ? 'Yorug‘ rejim' : 'Tungi rejim'}
            title={theme === 'dark' ? 'Yorug‘ rejim' : 'Tungi rejim'}
          >
            <span className={`nx-swap ${theme === 'dark' ? 'is-dark' : ''}`}>
              <Sun size={17} className="s" />
              <Moon size={17} className="m" />
            </span>
          </button>

          <button type="button" onClick={onOpenSettings} className="nx-icon nx-hide-sm" aria-label="Sozlamalar" title="Sozlamalar">
            <Settings size={17} />
          </button>

          <button type="button" onClick={onOpenProfile} className="nx-profile" aria-label="Profil">
            <span className="nx-avatar">
              <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden>
                <defs>
                  <linearGradient id="nx-ring-g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#6366f1" />
                    <stop offset="0.5" stopColor="#22d3ee" />
                    <stop offset="1" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
                <circle cx="22" cy="22" r={RING_R} fill="none" stroke="var(--nx-line)" strokeWidth="3" />
                <circle
                  cx="22" cy="22" r={RING_R} fill="none" stroke="url(#nx-ring-g)" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C * (1 - Math.max(0.04, levelXp / 100))}
                  transform="rotate(-90 22 22)"
                  style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }}
                />
              </svg>
              <span className="nx-avatar-in">{initials}</span>
              <span className="nx-avatar-lvl">{level}</span>
            </span>
            <span className="nx-profile-txt">
              <b>{displayName}</b>
              <small>O‘QUVCHI PROFILI</small>
            </span>
          </button>

          <button type="button" onClick={onLogout} className="nx-icon nx-logout" aria-label="Tizimdan chiqish" title="Chiqish">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&display=swap');
@property --nx-a{syntax:'<angle>';initial-value:0deg;inherits:false}

.nx-t{--nx-glass:rgba(255,255,255,.8);--nx-glass2:rgba(255,255,255,.6);--nx-line:rgba(15,23,42,.1);--nx-text:#0f172a;--nx-mute:#5b6584;--nx-chip:rgba(15,23,42,.05);--nx-accent:#6366f1;--nx-shadow:0 20px 50px -22px rgba(30,41,90,.4)}
html.dark .nx-t{--nx-glass:rgba(12,16,34,.76);--nx-glass2:rgba(255,255,255,.05);--nx-line:rgba(255,255,255,.12);--nx-text:#eef2ff;--nx-mute:#8f9bbd;--nx-chip:rgba(255,255,255,.07);--nx-shadow:0 24px 60px -24px rgba(0,0,0,.85)}

.nx-nav{position:sticky;top:8px;z-index:40;padding:0 10px;margin-top:8px;pointer-events:none;color:var(--nx-text)}
.nx-nav *{box-sizing:border-box}
.nx-nav-in{pointer-events:auto;position:relative;max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px 8px 12px;border-radius:24px;
  background:var(--nx-glass);-webkit-backdrop-filter:blur(20px) saturate(1.5);backdrop-filter:blur(20px) saturate(1.5);border:1px solid var(--nx-line);box-shadow:var(--nx-shadow);transition:padding .3s,box-shadow .3s,transform .3s}
.nx-nav-in::before{content:"";position:absolute;inset:-1px;border-radius:25px;padding:1.5px;pointer-events:none;opacity:.9;
  background:conic-gradient(from var(--nx-a),transparent 0 55%,#6366f1 68%,#22d3ee 80%,#f472b6 92%,transparent 100%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);animation:nx-spin 7s linear infinite}
@keyframes nx-spin{to{--nx-a:360deg}}
.nx-nav.scrolled .nx-nav-in{padding:5px 8px 5px 10px}

/* Logo */
.nx-brand{display:flex;align-items:center;gap:11px;background:none;border:0;cursor:pointer;color:inherit;text-align:left;min-width:0;padding:0}
.nx-orb{position:relative;width:42px;height:42px;border-radius:15px;display:grid;place-items:center;color:#fff;flex:none;
  background:linear-gradient(135deg,#6366f1,#8b5cf6 50%,#ec4899);box-shadow:0 10px 24px -8px rgba(99,102,241,.8),inset 0 1px 0 rgba(255,255,255,.4);transition:transform .3s}
.nx-brand:hover .nx-orb{transform:rotate(-8deg) scale(1.06)}
.nx-orb-ring{position:absolute;inset:-4px;border-radius:19px;border:1.5px dashed rgba(99,102,241,.55);animation:nx-rot 14s linear infinite}
@keyframes nx-rot{to{transform:rotate(360deg)}}
.nx-orb-spark{position:absolute;top:-5px;right:-5px;width:17px;height:17px;border-radius:50%;display:grid;place-items:center;background:#fbbf24;color:#78350f;animation:nx-pop 2.4s ease-in-out infinite}
@keyframes nx-pop{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(1.18) rotate(20deg)}}
.nx-brand-txt{display:flex;flex-direction:column;min-width:0;line-height:1.05}
.nx-brand-txt b{font-family:'Unbounded',system-ui,sans-serif;font-size:17px;font-weight:900;letter-spacing:.04em;background:linear-gradient(90deg,var(--nx-text),#6366f1 60%,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent}
.nx-brand-txt small{font-size:9px;font-weight:800;letter-spacing:.22em;color:var(--nx-mute);margin-top:4px}
@media(max-width:380px){.nx-brand-txt{display:none}}

/* Daraja */
.nx-level{display:none;align-items:center;gap:10px;padding:7px 12px;border-radius:16px;background:var(--nx-chip);border:1px solid var(--nx-line);min-width:230px}
@media(min-width:860px){.nx-level{display:flex}}
.nx-level-badge{font-family:'Unbounded',system-ui,sans-serif;font-size:10px;font-weight:900;padding:4px 8px;border-radius:9px;color:#fff;background:linear-gradient(135deg,#6366f1,#ec4899);letter-spacing:.04em;white-space:nowrap}
.nx-level-bar{flex:1;height:7px;border-radius:6px;background:var(--nx-line);overflow:hidden}
.nx-level-bar i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#6366f1,#22d3ee,#f472b6);background-size:200% 100%;animation:nx-flow 3s linear infinite;transition:width .8s cubic-bezier(.2,.8,.2,1)}
@keyframes nx-flow{to{background-position:200% 0}}
.nx-level-xp{font-size:12px;font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap}
.nx-level-xp em{font-style:normal;color:var(--nx-mute);font-weight:600;margin-left:2px}

/* O'ng tomon */
.nx-actions{display:flex;align-items:center;gap:6px;flex:none}
.nx-coins{position:relative;display:flex;align-items:center;gap:8px;padding:6px 10px 6px 6px;border-radius:16px;background:linear-gradient(135deg,rgba(251,191,36,.2),rgba(249,115,22,.14));border:1px solid rgba(251,191,36,.42)}
.nx-coin{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;color:#78350f;background:radial-gradient(circle at 30% 25%,#fde68a,#f59e0b 70%);box-shadow:0 0 14px rgba(251,191,36,.6);animation:nx-coin 5s ease-in-out infinite}
@keyframes nx-coin{0%,80%,100%{transform:rotateY(0)}90%{transform:rotateY(360deg)}}
.nx-coins b{font-size:14px;font-weight:900;font-variant-numeric:tabular-nums;color:var(--nx-text);min-width:1ch}
.nx-coin-plus{width:18px;height:18px;border-radius:7px;display:none;place-items:center;background:rgba(251,191,36,.3);color:#b45309}
@media(min-width:520px){.nx-coin-plus{display:grid}}
html.dark .nx-coin-plus{color:#fde68a}
.nx-gain{position:absolute;right:6px;top:-6px;font-weight:900;font-size:14px;color:#22c55e;text-shadow:0 0 12px rgba(34,197,94,.7);animation:nx-up 1.6s ease-out forwards;pointer-events:none}
.nx-gain.neg{color:#f87171;text-shadow:0 0 12px rgba(248,113,113,.7)}
@keyframes nx-up{0%{opacity:0;transform:translateY(6px) scale(.8)}20%{opacity:1;transform:translateY(-6px) scale(1.15)}100%{opacity:0;transform:translateY(-30px) scale(1)}}

.nx-icon{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;cursor:pointer;color:var(--nx-text);background:var(--nx-chip);border:1px solid var(--nx-line);transition:.2s}
.nx-icon:hover{transform:translateY(-2px);background:rgba(99,102,241,.16);border-color:rgba(99,102,241,.5)}
.nx-icon:active{transform:scale(.92)}
.nx-logout:hover{background:rgba(244,63,94,.16);border-color:rgba(244,63,94,.5);color:#f43f5e}
@media(max-width:560px){.nx-hide-sm{display:none}}
.nx-swap{position:relative;width:17px;height:17px;display:block}
.nx-swap svg{position:absolute;inset:0;transition:transform .5s cubic-bezier(.3,1.4,.5,1),opacity .3s}
.nx-swap .s{transform:rotate(0) scale(1);opacity:1;color:#f59e0b}
.nx-swap .m{transform:rotate(-90deg) scale(0);opacity:0;color:#a5b4fc}
.nx-swap.is-dark .s{transform:rotate(90deg) scale(0);opacity:0}
.nx-swap.is-dark .m{transform:rotate(0) scale(1);opacity:1}

/* Profil */
.nx-profile{display:flex;align-items:center;gap:8px;padding:0 6px 0 0;border:0;background:none;color:inherit;cursor:pointer}
.nx-avatar{position:relative;width:44px;height:44px;display:grid;place-items:center;flex:none;transition:transform .25s}
.nx-profile:hover .nx-avatar{transform:scale(1.07)}
.nx-avatar svg{position:absolute;inset:0}
.nx-avatar-in{position:relative;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-weight:900;font-size:14px;color:#fff;background:linear-gradient(135deg,#6366f1,#ec4899)}
.nx-avatar-lvl{position:absolute;right:-3px;bottom:-3px;min-width:18px;height:18px;padding:0 4px;border-radius:9px;display:grid;place-items:center;font-size:10px;font-weight:900;color:#fff;background:#0f172a;border:2px solid var(--nx-glass2,#fff);box-shadow:0 2px 6px rgba(0,0,0,.3)}
.nx-profile-txt{display:none;flex-direction:column;text-align:left;line-height:1.1}
@media(min-width:1000px){.nx-profile-txt{display:flex}}
.nx-profile-txt b{font-size:13px;font-weight:800;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nx-profile-txt small{font-size:9px;letter-spacing:.14em;font-weight:800;color:var(--nx-mute);margin-top:3px}

@media (prefers-reduced-motion:reduce){.nx-nav-in::before,.nx-orb-ring,.nx-coin,.nx-orb-spark,.nx-level-bar i{animation:none!important}}
`;