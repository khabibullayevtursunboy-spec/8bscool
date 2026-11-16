/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { Crown, Trophy, Flag, Bot } from 'lucide-react';
import { CarArt } from './CarArt';
import { ClassBadge } from './CarGarage';
import { Garage, loadRanking, ratingOf, RankRow } from '../services/garage';

interface CarRatingProps {
  userId: string;
  garage: Garage;       // o'zgarganda qayta hisoblash uchun
  onOpenGarage: () => void;
}

export function CarRating({ userId, garage, onOpenGarage }: CarRatingProps) {
  // garage o'zgarsa reyting qayta o'qiladi
  const rows: RankRow[] = useMemo(() => loadRanking(), [garage]);
  const myRank = rows.findIndex((r) => r.id === String(userId)) + 1;
  const myRating = ratingOf(garage);
  const above = myRank > 1 ? rows[myRank - 2] : null;

  const top = rows.slice(0, 3);
  const rest = rows.slice(3, 30);
  // podium tartibi: 2-chi, 1-chi, 3-chi
  const podium = [top[1], top[0], top[2]].filter(Boolean) as RankRow[];

  return (
    <div className="cr-root">
      <style>{CSS}</style>

      <div className="cr-me">
        <div className="cr-me-rank"><Trophy size={20} /> <b>#{myRank || '-'}</b></div>
        <div className="cr-me-txt">
          <strong>Sizning mashinangiz reytingi: {myRating} PR</strong>
          <span>
            {above
              ? `Keyingi o'ringacha yana ${Math.max(1, above.rating - myRating + 1)} ball kerak`
              : "Siz birinchi o'rindasiz! Uni saqlab qoling"}
          </span>
        </div>
        <button type="button" onClick={onOpenGarage}>Garajga</button>
      </div>

      {/* Podium */}
      <div className="cr-podium">
        {podium.map((r) => {
          const place = rows.indexOf(r) + 1;
          return (
            <div key={r.id} className={`cr-pod p${place} ${r.id === String(userId) ? 'me' : ''}`}>
              {place === 1 && <Crown className="cr-crown" size={30} />}
              <div className="cr-pod-car"><CarArt look={r.look} uid={`pod-${r.id}`} plate={r.plate} /></div>
              <div className="cr-pod-name">{r.owner}{r.bot && <Bot size={12} />}</div>
              <div className="cr-pod-car-name">{r.car}</div>
              <div className="cr-pod-stat"><ClassBadge rating={r.rating} size={26} /> <b>{r.rating}</b> PR</div>
              <div className="cr-pod-block"><span>{place}</span></div>
            </div>
          );
        })}
      </div>

      {/* Qolganlar */}
      <div className="cr-list">
        {rest.map((r, i) => (
          <div key={r.id} className={`cr-row ${r.id === String(userId) ? 'me' : ''}`}>
            <b className="cr-pos">{i + 4}</b>
            <div className="cr-mini"><CarArt look={r.look} uid={`row-${r.id}`} plate={r.plate} glow={false} /></div>
            <div className="cr-who">
              <strong>{r.owner}{r.bot && <em><Bot size={11} /> BOT</em>}</strong>
              <span>{r.car}</span>
            </div>
            <div className="cr-wins"><Flag size={12} /> {r.wins}</div>
            <ClassBadge rating={r.rating} size={30} />
            <div className="cr-pr"><b>{r.rating}</b><span>PR</span></div>
          </div>
        ))}
        {rows.length <= 3 && <p className="cr-empty">Boshqa o'quvchilar ham mashinasini tuning qilsa, ular shu yerda ko'rinadi.</p>}
      </div>

      <p className="cr-foot">
        PR (Power Rating) — mashinaning umumiy kuchi: model, kuchaytirish, bo'yoq va aksessuarlar hamda poygadagi g'alabalar yig'indisi.
        Reyting hozircha shu brauzerdagi o'yinchilar o'rtasida hisoblanadi.
      </p>
    </div>
  );
}

const CSS = `
.cr-root{max-width:760px;margin:0 auto;color:#e8edf7;display:flex;flex-direction:column;gap:16px}
.cr-root *{box-sizing:border-box}
.cr-me{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:20px;background:linear-gradient(135deg,rgba(59,130,246,.25),rgba(139,92,246,.25));border:1px solid rgba(255,255,255,.12)}
.cr-me-rank{display:flex;align-items:center;gap:6px;font-size:22px;color:#fbbf24}
.cr-me-rank b{font-size:26px;font-weight:900;color:#fff}
.cr-me-txt{flex:1;min-width:0;display:flex;flex-direction:column}
.cr-me-txt strong{font-size:14px}
.cr-me-txt span{font-size:12px;color:#aab4cc}
.cr-me button{padding:9px 14px;border-radius:12px;border:0;background:#fff;color:#1e1b4b;font-weight:800;cursor:pointer}

.cr-podium{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:10px;align-items:end;padding:22px 8px 0;border-radius:26px;
  background:radial-gradient(100% 90% at 50% 0%,rgba(251,191,36,.16),transparent 60%),linear-gradient(180deg,#10152a,#0b0f1e);border:1px solid rgba(255,255,255,.08);overflow:hidden}
.cr-pod{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:3px}
.cr-crown{color:#fbbf24;filter:drop-shadow(0 0 12px rgba(251,191,36,.9));animation:cr-bob 2s ease-in-out infinite}
@keyframes cr-bob{50%{transform:translateY(-5px)}}
.cr-pod-car{width:62px;height:124px}
.cr-pod.p1 .cr-pod-car{width:78px;height:156px;filter:drop-shadow(0 0 22px rgba(251,191,36,.5))}
.cr-pod-name{display:flex;align-items:center;gap:4px;font-weight:900;font-size:14px;margin-top:6px}
.cr-pod-car-name{font-size:11px;color:#8a95b0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cr-pod-stat{display:flex;align-items:center;gap:5px;font-size:12px;color:#aab4cc;margin:4px 0 8px}
.cr-pod-stat b{color:#fff;font-size:15px}
.cr-pod-block{width:100%;display:grid;place-items:center;border-radius:14px 14px 0 0;font-size:34px;font-weight:900;font-style:italic;color:rgba(255,255,255,.9)}
.cr-pod.p1 .cr-pod-block{height:86px;background:linear-gradient(180deg,#f59e0b,#b45309)}
.cr-pod.p2 .cr-pod-block{height:62px;background:linear-gradient(180deg,#94a3b8,#475569)}
.cr-pod.p3 .cr-pod-block{height:46px;background:linear-gradient(180deg,#ea580c,#7c2d12)}
.cr-pod.me .cr-pod-name{color:#60a5fa}
@media(max-width:480px){.cr-pod-car{width:48px;height:96px}.cr-pod.p1 .cr-pod-car{width:62px;height:124px}.cr-pod-name{font-size:12px}}

.cr-list{display:flex;flex-direction:column;gap:8px}
.cr-row{display:grid;grid-template-columns:30px 30px 1fr auto auto auto;gap:10px;align-items:center;padding:10px 14px;border-radius:16px;background:#10152a;border:1px solid rgba(255,255,255,.07)}
@media(max-width:480px){.cr-row{grid-template-columns:24px 26px 1fr auto auto;gap:8px}.cr-wins{display:none}}
.cr-row.me{border-color:#3b82f6;background:linear-gradient(90deg,rgba(59,130,246,.22),#10152a)}
.cr-pos{color:#8a95b0;font-size:15px;text-align:center}
.cr-mini{width:22px;height:44px}
.cr-who{min-width:0;display:flex;flex-direction:column}
.cr-who strong{display:flex;align-items:center;gap:6px;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cr-who em{display:inline-flex;align-items:center;gap:3px;font-style:normal;font-size:9px;font-weight:900;letter-spacing:.08em;padding:1px 5px;border-radius:5px;background:rgba(255,255,255,.1);color:#aab4cc}
.cr-who span{font-size:11px;color:#8a95b0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cr-wins{display:flex;align-items:center;gap:4px;font-size:12px;color:#aab4cc}
.cr-pr{text-align:right}
.cr-pr b{font-size:17px;font-weight:900;font-variant-numeric:tabular-nums}
.cr-pr span{display:block;font-size:9px;color:#8a95b0;letter-spacing:.1em}
.cr-empty,.cr-foot{font-size:12px;color:#6b7690;line-height:1.55;text-align:center;margin:0}
`;