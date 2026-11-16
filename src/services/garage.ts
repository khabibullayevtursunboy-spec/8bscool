/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * GARAJ: har bir foydalanuvchining o'z mashinasi, tuning qismlari, reyting.
 * Hozircha hammasi brauzerda (localStorage) saqlanadi. Keyinchalik Django'ga
 * o'tkazish uchun faqat shu fayldagi load/save funksiyalarini almashtirish kifoya.
 */

import { StorageService } from './storage';

/* ===================== TURLAR ===================== */

export type CatKey =
  | 'body' | 'paint' | 'finish' | 'accent' | 'livery' | 'rims'
  | 'spoiler' | 'hood' | 'roof' | 'lights' | 'neon' | 'tint' | 'flame';

export type PerfKey = 'engine' | 'turbo' | 'nitro' | 'tires' | 'aero' | 'radar';

export interface Item {
  id: string;
  name: string;
  price: number;
  pts: number;      // reytingga qo'shadigan ball
  v?: string;       // rang yoki boshqa qiymat
  tag?: string;     // "Yangi", "Noyob" kabi belgi
}

export interface Category {
  key: CatKey;
  title: string;
  emoji: string;
  desc: string;
  items: Item[];
}

export type Look = Record<CatKey, string>;

const I = (id: string, name: string, price: number, pts: number, v?: string, tag?: string): Item =>
  ({ id, name, price, pts, v, tag });

/* ===================== KATALOG ===================== */

export const CATEGORIES: Category[] = [
  {
    key: 'body', title: 'Korpus', emoji: '🚗', desc: 'Mashina modeli — eng katta ball beradi',
    items: [
      I('city', 'Shahar', 0, 0),
      I('sport', 'Sport kupe', 900, 40),
      I('muscle', 'Mushak', 2200, 70, undefined, 'Mashhur'),
      I('hyper', 'Giper', 4500, 110),
      I('formula', 'Formula-X', 9000, 160, undefined, 'Noyob')
    ]
  },
  {
    key: 'paint', title: "Bo'yoq", emoji: '🎨', desc: 'Mashina rangi',
    items: [
      I('blue', "Ko'k", 0, 0, '#2563eb'),
      I('red', 'Qizil', 0, 0, '#dc2626'),
      I('white', 'Oq', 0, 0, '#f3f4f6'),
      I('black', 'Qora', 120, 2, '#1b1b22'),
      I('silver', 'Kumush', 120, 2, '#9ca3af'),
      I('green', 'Yashil', 120, 2, '#16a34a'),
      I('yellow', 'Sariq', 120, 2, '#facc15'),
      I('orange', "To'q sariq", 250, 4, '#f97316'),
      I('violet', 'Binafsha', 250, 4, '#7c3aed'),
      I('pink', 'Pushti', 250, 4, '#ec4899'),
      I('cyan', 'Turkuaz', 250, 4, '#06b6d4'),
      I('gold', 'Oltin', 700, 8, '#d4a017', 'Noyob')
    ]
  },
  {
    key: 'finish', title: 'Qoplama', emoji: '✨', desc: "Bo'yoq qoplamasi: yaltiroq, mat, metall...",
    items: [
      I('gloss', 'Yaltiroq', 0, 0),
      I('matte', 'Mat', 200, 3),
      I('metal', 'Metallik', 500, 6),
      I('carbon', 'Karbon', 900, 10),
      I('pearl', "Kamalak (jonli)", 2000, 18, undefined, 'Noyob')
    ]
  },
  {
    key: 'accent', title: 'Aksent rangi', emoji: '🖍️', desc: "Poloska, spoyler va bezaklar rangi",
    items: [
      I('white', 'Oq', 0, 0, '#ffffff'),
      I('black', 'Qora', 60, 1, '#0b0b0f'),
      I('red', 'Qizil', 60, 1, '#ef4444'),
      I('gold', 'Oltin', 150, 2, '#fbbf24'),
      I('cyan', 'Havorang', 150, 2, '#22d3ee'),
      I('lime', 'Limon', 150, 2, '#a3e635'),
      I('magenta', 'Magenta', 150, 2, '#e879f9'),
      I('orange', "To'q sariq", 150, 2, '#fb923c')
    ]
  },
  {
    key: 'livery', title: 'Poloska', emoji: '🏁', desc: "Mashina ustidagi chizma va naqshlar",
    items: [
      I('none', "Yo'q", 0, 0),
      I('center', 'Ikki chiziq', 150, 2),
      I('wide', 'Keng chiziq', 150, 2),
      I('side', 'Yon chiziqlar', 200, 3),
      I('hood', 'Kapot bloki', 200, 3),
      I('roundel', 'Poyga raqami', 350, 5),
      I('checker', 'Shaxmat', 400, 6),
      I('arrow', "O'qlar", 450, 6),
      I('split', 'Ikki rangli', 600, 8, undefined, 'Yangi')
    ]
  },
  {
    key: 'rims', title: 'Disklar', emoji: '🛞', desc: "G'ildirak disklari rangi",
    items: [
      I('silver', 'Kumush', 0, 0, '#cbd5e1'),
      I('black', 'Qora', 80, 1, '#111827'),
      I('red', 'Qizil', 150, 2, '#ef4444'),
      I('blue', "Ko'k", 150, 2, '#3b82f6'),
      I('gold', 'Oltin', 300, 4, '#fbbf24'),
      I('neon', 'Neon yashil', 250, 3, '#22ff88'),
      I('purple', 'Binafsha', 250, 3, '#a855f7'),
      I('chrome', 'Krom', 400, 5, '#f8fafc')
    ]
  },
  {
    key: 'spoiler', title: 'Spoyler', emoji: '🪽', desc: "Orqa qanot — mashinani sport ko'rinishga keltiradi",
    items: [
      I('none', "Yo'q", 0, 0),
      I('lip', 'Past lab', 300, 4),
      I('duck', 'Ordak dumi', 600, 8),
      I('gt', 'GT qanot', 1400, 14),
      I('big', 'Katta karbon', 2800, 22, undefined, 'Noyob')
    ]
  },
  {
    key: 'hood', title: 'Kapot', emoji: '🔥', desc: "Havo olgich va shamollatgichlar",
    items: [
      I('none', 'Oddiy', 0, 0),
      I('scoop', 'Havo olgich', 350, 5),
      I('vents', 'Shamollatgich', 500, 7),
      I('carbon', 'Karbon kapot', 800, 9)
    ]
  },
  {
    key: 'roof', title: 'Tom', emoji: '📡', desc: 'Tom aksessuarlari',
    items: [
      I('none', "Yo'q", 0, 0),
      I('antenna', 'Antenna', 80, 1),
      I('sunroof', 'Panorama oyna', 300, 4),
      I('scoop', 'Tom havo olgichi', 450, 6),
      I('lightbar', 'Chiroqlar paneli', 900, 10, undefined, 'Yangi')
    ]
  },
  {
    key: 'lights', title: 'Faralar', emoji: '💡', desc: 'Old chiroq rangi',
    items: [
      I('white', 'Oq', 0, 0, '#fffbe0'),
      I('ice', "Muz ko'k", 100, 1, '#bfe9ff'),
      I('yellow', 'Sariq', 100, 1, '#ffe066'),
      I('green', 'Yashil', 200, 2, '#7cffb2'),
      I('purple', 'Binafsha', 250, 3, '#d8a8ff'),
      I('red', 'Qizil', 250, 3, '#ff6b6b')
    ]
  },
  {
    key: 'neon', title: 'Neon', emoji: '🌈', desc: 'Mashina tagidagi yoritgich',
    items: [
      I('none', "Yo'q", 0, 0, ''),
      I('cyan', 'Havorang', 400, 4, '#22d3ee'),
      I('pink', 'Pushti', 400, 4, '#ff2ea6'),
      I('green', 'Yashil', 450, 5, '#39ff14'),
      I('purple', 'Binafsha', 450, 5, '#a855f7'),
      I('red', 'Qizil', 500, 6, '#ff2a2a'),
      I('gold', 'Oltin', 700, 9, '#ffc800', 'Noyob')
    ]
  },
  {
    key: 'tint', title: 'Oyna', emoji: '🕶️', desc: 'Oyna tonirovkasi',
    items: [
      I('clear', 'Shaffof', 0, 0, '#cfe9ff,#1b2a41'),
      I('light', 'Engil', 100, 1, '#e8f4ff,#6b86a8'),
      I('dark', "To'q", 200, 3, '#5a6b82,#05070b'),
      I('blue', "Ko'k", 300, 4, '#7cc4ff,#0a2a6b'),
      I('amber', 'Qahrabo', 300, 4, '#ffd9a0,#5b3410'),
      I('mirror', "Ko'zgu", 600, 7, '#e5e7eb,#374151')
    ]
  },
  {
    key: 'flame', title: 'Alanga', emoji: '🚀', desc: 'Nitro va tutun quvuri alangasi',
    items: [
      I('orange', 'Klassik', 0, 0, '#fff7c2,#ffb020,#ff4d00'),
      I('blue', "Ko'k", 300, 4, '#e0f2ff,#38bdf8,#1d4ed8'),
      I('purple', 'Binafsha', 400, 5, '#f5e1ff,#c084fc,#7e22ce'),
      I('green', 'Yashil', 400, 5, '#eaffd6,#84cc16,#15803d'),
      I('pink', 'Pushti', 500, 6, '#ffe0f1,#f472b6,#be185d'),
      I('white', "Oq-issiq", 700, 8, '#ffffff,#e5e7eb,#9ca3af', 'Noyob')
    ]
  }
];

export const CAT_BY_KEY = Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<CatKey, Category>;
export const CAT_KEYS = CATEGORIES.map((c) => c.key);

export const itemOf = (cat: CatKey, id: string): Item =>
  CAT_BY_KEY[cat].items.find((i) => i.id === id) ?? CAT_BY_KEY[cat].items[0];

export const DEFAULT_LOOK: Look = {
  body: 'city', paint: 'blue', finish: 'gloss', accent: 'white', livery: 'none', rims: 'silver',
  spoiler: 'none', hood: 'none', roof: 'none', lights: 'white', neon: 'none', tint: 'clear', flame: 'orange'
};

export const makeLook = (p: Partial<Look>): Look => ({ ...DEFAULT_LOOK, ...p });

/* ===================== TUNING (kuchaytirish) ===================== */

export interface PerfPart {
  key: PerfKey;
  title: string;
  emoji: string;
  desc: string;
  max: number;
  costs: number[];    // har bir daraja narxi
  pts: number;        // har daraja uchun reyting balli
  effect: (lvl: number) => string;
}

export const NITRO_CHARGES = [0, 1, 1, 2, 2, 3];

export const PERF: PerfPart[] = [
  {
    key: 'engine', title: 'Dvigatel', emoji: '⚙️', max: 5, pts: 12, costs: [150, 350, 700, 1300, 2400],
    desc: "Har bir to'g'ri javobda mashina ko'proq oldinga siljiydi",
    effect: (l) => (l ? `+${l * 4}% har bir to'g'ri javobda` : 'Standart')
  },
  {
    key: 'turbo', title: 'Turbo', emoji: '🌀', max: 5, pts: 10, costs: [150, 350, 700, 1300, 2400],
    desc: "Har 3 ta ketma-ket to'g'ri javobga qo'shimcha bonus",
    effect: (l) => (l ? `Kombo: +${(l * 0.15).toFixed(2)} qadam` : "Yo'q")
  },
  {
    key: 'nitro', title: 'Nitro', emoji: '💨', max: 5, pts: 10, costs: [250, 500, 1000, 1800, 3200],
    desc: 'Poygada tugma bosib, oldinga otilib ketasiz',
    effect: (l) => (l ? `${NITRO_CHARGES[l]} ta · har biri +${(0.8 + 0.1 * l).toFixed(1)} qadam` : "Yo'q")
  },
  {
    key: 'tires', title: 'Shinalar', emoji: '🛞', max: 5, pts: 8, costs: [120, 300, 600, 1100, 2000],
    desc: "Xato qilganda kamroq orqaga sirpanasiz",
    effect: (l) => `Xato jarimasi: ${Math.max(0.15, 0.5 - 0.07 * l).toFixed(2)} qadam`
  },
  {
    key: 'aero', title: 'Aerodinamika', emoji: '🌪️', max: 5, pts: 8, costs: [200, 450, 900, 1600, 2800],
    desc: "Mashina o'zi ham sekin-asta oldinga siljiydi",
    effect: (l) => (l ? `Har 10 soniyada +${(l * 0.072).toFixed(2)} qadam` : "Yo'q")
  },
  {
    key: 'radar', title: 'Radar', emoji: '📡', max: 3, pts: 12, costs: [300, 800, 1800],
    desc: "Poygada to'g'ri juftlikni yoritib ko'rsatadi",
    effect: (l) => (l ? `${l} ta maslahat` : "Yo'q")
  }
];

export const PERF_BY_KEY = Object.fromEntries(PERF.map((p) => [p.key, p])) as Record<PerfKey, PerfPart>;

export type Levels = Record<PerfKey, number>;
export const ZERO_LEVELS: Levels = { engine: 0, turbo: 0, nitro: 0, tires: 0, aero: 0, radar: 0 };

export interface Perks {
  stepGain: number;     // bitta to'g'ri javob necha qadam
  comboBonus: number;   // har 3 ta ketma-ket javobga qo'shimcha qadam
  nitroCharges: number;
  nitroBonus: number;
  penalty: number;      // xato jarimasi (qadam)
  drift: number;        // sekundiga qadam
  radar: number;
}

export const perksOf = (lv: Levels): Perks => ({
  stepGain: 1 + 0.04 * lv.engine,
  comboBonus: 0.15 * lv.turbo,
  nitroCharges: NITRO_CHARGES[lv.nitro] ?? 0,
  nitroBonus: lv.nitro ? 0.8 + 0.1 * lv.nitro : 0,
  penalty: Math.max(0.15, 0.5 - 0.07 * lv.tires),
  drift: lv.aero * 0.0072,
  radar: lv.radar
});

export const perfSum = (lv: Levels) => PERF.reduce((s, p) => s + lv[p.key], 0);

/* ===================== GARAJ ===================== */

export interface Garage {
  name: string;
  plate: string;
  owned: Record<CatKey, string[]>;
  equipped: Look;
  levels: Levels;
  wins: number;
  races: number;
  podiums: number;
}

const GKEY = (uid: unknown) => `garage_v1_${String(uid)}`;
const IKEY = 'garage_index_v1';

export const newGarage = (): Garage => {
  const owned = {} as Record<CatKey, string[]>;
  CATEGORIES.forEach((c) => {
    owned[c.key] = c.items.filter((i) => i.price === 0).map((i) => i.id);
  });
  return {
    name: 'Mening mashinam',
    plate: '29-B',
    owned,
    equipped: { ...DEFAULT_LOOK },
    levels: { ...ZERO_LEVELS },
    wins: 0,
    races: 0,
    podiums: 0
  };
};

export const loadGarage = (uid: unknown): Garage => {
  const base = newGarage();
  try {
    const raw = localStorage.getItem(GKEY(uid));
    if (!raw) return base;
    const p = JSON.parse(raw) as Partial<Garage>;
    const owned = { ...base.owned };
    CAT_KEYS.forEach((k) => {
      const saved = p.owned?.[k];
      if (Array.isArray(saved)) owned[k] = Array.from(new Set([...base.owned[k], ...saved]));
    });
    const equipped = { ...base.equipped, ...(p.equipped || {}) };
    CAT_KEYS.forEach((k) => {
      if (!owned[k].includes(equipped[k])) equipped[k] = base.equipped[k];
    });
    return {
      name: typeof p.name === 'string' && p.name ? p.name : base.name,
      plate: typeof p.plate === 'string' && p.plate ? p.plate : base.plate,
      owned,
      equipped,
      levels: { ...base.levels, ...(p.levels || {}) },
      wins: Number(p.wins) || 0,
      races: Number(p.races) || 0,
      podiums: Number(p.podiums) || 0
    };
  } catch {
    return base;
  }
};

/* ---------- Reyting ---------- */

export const ratingOf = (g: { equipped: Look; levels: Levels; wins: number }): number => {
  let r = 100;
  CAT_KEYS.forEach((k) => { r += itemOf(k, g.equipped[k]).pts; });
  PERF.forEach((p) => { r += g.levels[p.key] * p.pts; });
  r += Math.min(g.wins * 3, 150);
  return r;
};

export interface CarClass { label: string; color: string }

export const classOf = (r: number): CarClass => {
  if (r >= 700) return { label: 'SS', color: '#f472b6' };
  if (r >= 520) return { label: 'S', color: '#fbbf24' };
  if (r >= 380) return { label: 'A', color: '#f87171' };
  if (r >= 260) return { label: 'B', color: '#a78bfa' };
  if (r >= 160) return { label: 'C', color: '#38bdf8' };
  return { label: 'D', color: '#94a3b8' };
};

/* ---------- Umumiy reyting indeksi ---------- */

interface IndexEntry {
  owner: string;
  car: string;
  plate: string;
  rating: number;
  wins: number;
  look: Look;
  updated: number;
}

const loadIndex = (): Record<string, IndexEntry> => {
  try {
    const raw = localStorage.getItem(IKEY);
    if (raw) return JSON.parse(raw) as Record<string, IndexEntry>;
  } catch { /* ignore */ }
  return {};
};

export const saveGarage = (uid: unknown, g: Garage, owner: string): void => {
  try {
    localStorage.setItem(GKEY(uid), JSON.stringify(g));
    const idx = loadIndex();
    idx[String(uid)] = {
      owner,
      car: g.name,
      plate: g.plate,
      rating: ratingOf(g),
      wins: g.wins,
      look: g.equipped,
      updated: Date.now()
    };
    localStorage.setItem(IKEY, JSON.stringify(idx));
  } catch { /* ignore */ }
};

export interface RankRow {
  id: string;
  owner: string;
  car: string;
  plate: string;
  rating: number;
  wins: number;
  look: Look;
  bot: boolean;
}

// Poyga botlari ham reytingda ishtirok etadi (sayt bo'sh ko'rinmasligi uchun)
const BOT_GARAGES: Array<{ id: string; owner: string; car: string; plate: string; wins: number; look: Look; levels: Levels }> = [
  {
    id: 'bot-shamol', owner: 'Shamol', car: "Qizil bo'ron", plate: '01-S', wins: 34,
    look: makeLook({ body: 'muscle', paint: 'red', finish: 'metal', accent: 'white', livery: 'center', rims: 'black', spoiler: 'gt', hood: 'scoop', lights: 'white', neon: 'red', tint: 'dark', flame: 'orange' }),
    levels: { engine: 4, turbo: 3, nitro: 3, tires: 3, aero: 2, radar: 1 }
  },
  {
    id: 'bot-chaqmoq', owner: 'Chaqmoq', car: 'Oltin chaqmoq', plate: '77-C', wins: 21,
    look: makeLook({ body: 'sport', paint: 'orange', finish: 'gloss', accent: 'black', livery: 'side', rims: 'gold', spoiler: 'duck', hood: 'vents', lights: 'yellow', neon: 'gold', tint: 'light', flame: 'orange' }),
    levels: { engine: 3, turbo: 3, nitro: 2, tires: 2, aero: 2, radar: 1 }
  },
  {
    id: 'bot-turbo', owner: 'Turbo', car: 'Yashil ajdar', plate: '10-T', wins: 12,
    look: makeLook({ body: 'hyper', paint: 'green', finish: 'carbon', accent: 'lime', livery: 'arrow', rims: 'neon', spoiler: 'big', hood: 'carbon', lights: 'green', neon: 'green', tint: 'mirror', flame: 'green' }),
    levels: { engine: 5, turbo: 4, nitro: 4, tires: 4, aero: 3, radar: 2 }
  },
  {
    id: 'bot-yulduz', owner: 'Yulduz', car: 'Binafsha tush', plate: '88-Y', wins: 7,
    look: makeLook({ body: 'sport', paint: 'violet', finish: 'pearl', accent: 'magenta', livery: 'roundel', rims: 'purple', spoiler: 'lip', lights: 'purple', neon: 'purple', flame: 'purple' }),
    levels: { engine: 2, turbo: 2, nitro: 1, tires: 2, aero: 1, radar: 0 }
  },
  {
    id: 'bot-kometa', owner: 'Kometa', car: 'Muz qirol', plate: '55-K', wins: 3,
    look: makeLook({ body: 'city', paint: 'cyan', finish: 'matte', accent: 'white', livery: 'wide', rims: 'chrome', lights: 'ice', neon: 'cyan', flame: 'blue' }),
    levels: { engine: 1, turbo: 1, nitro: 1, tires: 1, aero: 0, radar: 0 }
  }
];

export const loadRanking = (): RankRow[] => {
  const idx = loadIndex();
  const users: RankRow[] = Object.entries(idx).map(([id, e]) => ({
    id, owner: e.owner, car: e.car, plate: e.plate, rating: e.rating, wins: e.wins,
    look: { ...DEFAULT_LOOK, ...e.look }, bot: false
  }));
  const bots: RankRow[] = BOT_GARAGES.map((b) => ({
    id: b.id, owner: b.owner, car: b.car, plate: b.plate,
    rating: ratingOf({ equipped: b.look, levels: b.levels, wins: b.wins }),
    wins: b.wins, look: b.look, bot: true
  }));
  return [...users, ...bots].sort((a, b) => b.rating - a.rating);
};

/* ===================== TANGA SARFLASH ===================== */

export const getCoins = (): number => {
  try {
    const u = StorageService.getCurrentUser() as unknown as { coins?: number } | null;
    return Number(u?.coins) || 0;
  } catch {
    return 0;
  }
};

/**
 * Tangani ayiradi va haqiqatan ayirilganini tekshiradi.
 * (StorageService.addCoinsAndXp manfiy son bilan ishlashi kutiladi.)
 */
export const spendCoins = (uid: string, price: number): { ok: boolean; msg: string } => {
  if (price <= 0) return { ok: true, msg: '' };
  const before = getCoins();
  if (before < price) return { ok: false, msg: `Tanga yetmaydi: yana ${price - before} tanga kerak` };
  try {
    StorageService.addCoinsAndXp(uid, -price, 0);
    const after = getCoins();
    if (after !== before - price) {
      // Kutilgandek ayirilmadi: holatni qaytaramiz va sotib olishni bekor qilamiz
      const delta = after - before;
      if (delta !== 0) StorageService.addCoinsAndXp(uid, -delta, 0);
      return { ok: false, msg: "Tangani ayirib bo'lmadi (storage.ts da manfiy qiymat qo'llab-quvvatlanmaydi)" };
    }
    return { ok: true, msg: '' };
  } catch {
    return { ok: false, msg: "Tangani ayirishda xatolik" };
  }
};

/* ===================== AMALLAR ===================== */

export interface ActionResult { ok: boolean; msg: string; garage: Garage }

const clone = (g: Garage): Garage => ({
  ...g,
  owned: Object.fromEntries(CAT_KEYS.map((k) => [k, [...g.owned[k]]])) as Record<CatKey, string[]>,
  equipped: { ...g.equipped },
  levels: { ...g.levels }
});

export const equipItem = (uid: string, owner: string, g: Garage, cat: CatKey, id: string): Garage => {
  if (!g.owned[cat].includes(id)) return g;
  const n = clone(g);
  n.equipped[cat] = id;
  saveGarage(uid, n, owner);
  return n;
};

export const buyItem = (uid: string, owner: string, g: Garage, cat: CatKey, id: string): ActionResult => {
  const item = CAT_BY_KEY[cat].items.find((i) => i.id === id);
  if (!item) return { ok: false, msg: 'Qism topilmadi', garage: g };
  if (g.owned[cat].includes(id)) return { ok: true, msg: 'Allaqachon sizniki', garage: g };
  const pay = spendCoins(uid, item.price);
  if (!pay.ok) return { ok: false, msg: pay.msg, garage: g };
  const n = clone(g);
  n.owned[cat].push(id);
  n.equipped[cat] = id;
  saveGarage(uid, n, owner);
  return { ok: true, msg: `${item.name} o'rnatildi!`, garage: n };
};

export const upgradePart = (uid: string, owner: string, g: Garage, key: PerfKey): ActionResult => {
  const part = PERF_BY_KEY[key];
  const lvl = g.levels[key];
  if (lvl >= part.max) return { ok: false, msg: 'Eng yuqori daraja', garage: g };
  const pay = spendCoins(uid, part.costs[lvl]);
  if (!pay.ok) return { ok: false, msg: pay.msg, garage: g };
  const n = clone(g);
  n.levels[key] = lvl + 1;
  saveGarage(uid, n, owner);
  return { ok: true, msg: `${part.title} ${lvl + 1}-darajaga ko'tarildi!`, garage: n };
};

export const renameCar = (uid: string, owner: string, g: Garage, name: string, plate: string): Garage => {
  const n = clone(g);
  n.name = name.trim().slice(0, 18) || 'Mening mashinam';
  n.plate = plate.trim().toUpperCase().slice(0, 6) || '29-B';
  saveGarage(uid, n, owner);
  return n;
};

export const recordRace = (uid: string, owner: string, g: Garage, place: number): Garage => {
  const n = clone(g);
  n.races += 1;
  if (place === 1) n.wins += 1;
  if (place <= 3) n.podiums += 1;
  saveGarage(uid, n, owner);
  return n;
};