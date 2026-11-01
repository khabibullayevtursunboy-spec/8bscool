import React, { useEffect, useState } from 'react';
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
  Grid2X2,
  X,
  ChevronRight,
  Crown,
  Gamepad2,
  History,
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
  | 'historypuzzle';

interface BottomNavProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

const mainNavItems = [
  { key: 'home' as TabKey, label: 'Bosh sahifa', short: 'Asosiy', icon: Home },
  { key: 'tests' as TabKey, label: 'Testlar', short: 'Testlar', icon: ClipboardList },
  { key: 'multiplayer' as TabKey, label: '1v1 Duel', short: 'Duel', icon: Swords },
  { key: 'leaderboard' as TabKey, label: 'Reyting', short: 'Reyting', icon: Trophy },
];

const menuCategories = [
  {
    title: 'O‘YINLAR VA BELLASHUVLAR',
    items: [
      { key: 'multiplayer' as TabKey, label: '1v1 Duel', desc: 'Do‘stlar bilan bilim jangi', icon: Swords, color: 'violet' },
      { key: 'tugofwar' as TabKey, label: 'Arqon tortish', desc: 'Jamoaviy bellashuv', icon: Flame, color: 'orange' },
      { key: 'millionaire' as TabKey, label: 'Kim millioner?', desc: 'Savollar va bosqichlar', icon: Trophy, color: 'amber' },
      { key: 'boardgames' as TabKey, label: 'Shaxmat & shashka', desc: 'Strategik o‘yinlar', icon: Crown, color: 'yellow' },
      { key: 'memorygame' as TabKey, label: 'Xotira o‘yini', desc: 'Xotirani sinab ko‘ring', icon: Brain, color: 'pink' },
      { key: 'historypuzzle' as TabKey, label: 'Tarix puzzle', desc: 'Tarixiy voqealarni toping', icon: History, color: 'indigo' },
    ],
  },
  {
    title: 'TA’LIM VA RIVOJLANISH',
    items: [
      { key: 'tests' as TabKey, label: 'Fan testlari', desc: 'Barcha fanlardan testlar', icon: ClipboardList, color: 'blue' },
      { key: 'library' as TabKey, label: 'Raqamli kutubxona', desc: 'Kitoblar va qo‘llanmalar', icon: BookOpen, color: 'emerald' },
      { key: 'pomodoro' as TabKey, label: 'Pomodoro timer', desc: 'Vaqtni samarali boshqaring', icon: Timer, color: 'rose' },
      { key: 'teachers' as TabKey, label: 'Ustozlar', desc: 'Ustozlarni baholash', icon: Star, color: 'purple' },
      { key: 'quests' as TabKey, label: 'Do‘kon & missiyalar', desc: 'Mukofot va topshiriqlar', icon: ShoppingBag, color: 'cyan' },
    ],
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCustomTabActive = !['home', 'tests', 'multiplayer', 'leaderboard'].includes(activeTab);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  const selectTab = (tab: TabKey) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {isMenuOpen && (
        <button
          type="button"
          aria-label="Menyuni yopish"
          onClick={() => setIsMenuOpen(false)}
          className="nexus-menu-backdrop"
        />
      )}

      <section
        id="nexus-navigation-sheet"
        aria-hidden={!isMenuOpen}
        className={`nexus-menu-sheet ${isMenuOpen ? 'is-open' : ''}`}
      >
        <div className="nexus-sheet-handle" />
        <div className="nexus-sheet-heading">
          <div className="flex min-w-0 items-center gap-3">
            <span className="nexus-sheet-logo"><Gamepad2 className="h-5 w-5" /></span>
            <div className="min-w-0">
              <h2>Barcha bo‘limlar</h2>
              <p>O‘zingizga kerakli arenani tanlang</p>
            </div>
          </div>
          <button type="button" className="nexus-sheet-close" onClick={() => setIsMenuOpen(false)} aria-label="Yopish">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="nexus-sheet-content">
          {menuCategories.map((category) => (
            <div className="nexus-menu-category" key={category.title}>
              <div className="nexus-category-label">{category.title}</div>
              <div className="nexus-menu-grid">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.key;
                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => selectTab(item.key)}
                      className={`nexus-menu-item ${active ? 'active' : ''}`}
                    >
                      <span className={`nexus-menu-icon ${item.color}`}><Icon className="h-5 w-5" /></span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-[13px] font-extrabold">{item.label}</span>
                        <span className="mt-0.5 block truncate text-[10px] font-medium opacity-60">{item.desc}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <nav className="nexus-bottom-nav" aria-label="Asosiy navigatsiya">
        <div className="nexus-bottom-inner">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.key && !isMenuOpen;
            return (
              <button
                type="button"
                key={item.key}
                onClick={() => selectTab(item.key)}
                className={`nexus-nav-item ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="nexus-nav-icon"><Icon className="h-[19px] w-[19px]" /></span>
                <span>{item.short}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className={`nexus-nav-item ${isMenuOpen || isCustomTabActive ? 'active menu-active' : ''}`}
            aria-expanded={isMenuOpen}
            aria-controls="nexus-navigation-sheet"
          >
            <span className="nexus-nav-icon">{isMenuOpen ? <X className="h-5 w-5" /> : <Grid2X2 className="h-5 w-5" />}</span>
            <span>Menyu</span>
            {isCustomTabActive && !isMenuOpen && <i className="nexus-nav-indicator" />}
          </button>
        </div>
      </nav>
    </>
  );
};
