import React, { useState } from 'react';
import { 
  Home, 
  Swords, 
  Crown, 
  Trophy, 
  BookOpen, 
  Star, 
  ShoppingBag, 
  Brain, 
  Timer,
  ClipboardList,
  Flame,
  Menu,
  X
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
  | 'quests';

interface BottomNavProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Pastki doimiy ko'rinib turadigan asosiy 4 ta bo'lim + Menyu tugmasi
  const mainNavItems: { key: TabKey | 'menu'; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'Bosh sahifa', icon: <Home className="w-5 h-5" /> },
    { key: 'tests', label: 'Testlar', icon: <ClipboardList className="w-5 h-5" /> },
    { key: 'multiplayer', label: 'Duel', icon: <Swords className="w-5 h-5" /> },
    { key: 'leaderboard', label: 'Reyting', icon: <Trophy className="w-5 h-5" /> },
  ];

  // "Barchasi / Menyu" tugmasi bosilganda chiqadigan qo'shimcha bo'limlar
  const allNavItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'tests', label: 'Fan Testlari', icon: <ClipboardList className="w-5 h-5" /> },
    { key: 'tugofwar', label: 'Arqon Tortish', icon: <Flame className="w-5 h-5" /> },
    { key: 'multiplayer', label: '1v1 Duel', icon: <Swords className="w-5 h-5" /> },
    { key: 'boardgames', label: 'Shaxmat & Shashka', icon: <Crown className="w-5 h-5" /> },
    { key: 'millionaire', label: 'Kim Millioner?', icon: <Trophy className="w-5 h-5" /> },
    { key: 'memorygame', label: 'Xotira O\'yini', icon: <Brain className="w-5 h-5" /> },
    { key: 'pomodoro', label: 'Pomodoro Timer', icon: <Timer className="w-5 h-5" /> },
    { key: 'library', label: 'Kutubxona', icon: <BookOpen className="w-5 h-5" /> },
    { key: 'teachers', label: 'Ustozlar', icon: <Star className="w-5 h-5" /> },
    { key: 'quests', label: 'Do\'kon & Missiya', icon: <ShoppingBag className="w-5 h-5" /> },
  ];

  const handleItemClick = (key: TabKey | 'menu') => {
    if (key === 'menu') {
      setIsMenuOpen(!isMenuOpen);
    } else {
      setActiveTab(key);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Agar Menyu ochiq bo'lsa, ustiga bosganda yopish uchun fon */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 animate-fadeIn"
        />
      )}

      {/* Ochiladigan Barcha Bo'limlar Modali/Paneli */}
      {isMenuOpen && (
        <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl animate-slideUp">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-display font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Menu className="w-4 h-4 text-blue-500" />
              Barcha Bo'limlar va O'yinlar
            </h3>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
            {allNavItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleItemClick(item.key)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-blue-500/50'
                  }`}
                >
                  {item.icon}
                  <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Doimiy Pastki Navigatsiya Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 px-4 py-2 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleItemClick(item.key)}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25 scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* Menyu Tugmasi (Barchasini ochish uchun) */}
          <button
            onClick={() => handleItemClick('menu')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all cursor-pointer ${
              isMenuOpen
                ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/25 scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-[10px] mt-1 font-medium">Menyu</span>
          </button>
        </div>
      </div>
    </>
  );
};