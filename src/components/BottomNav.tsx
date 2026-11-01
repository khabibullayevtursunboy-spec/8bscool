import React, { useState, useEffect } from 'react';
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
  Grid,
  X,
  ChevronRight,
  Sparkles
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

  // Menyudan tanlangan tab faol ekanligini tekshirish (Main-da bo'lmaganlar uchun indicator)
  const isCustomTabActive = !['home', 'tests', 'multiplayer', 'leaderboard'].includes(activeTab);

  // Menyu ochiqligida orqa fon skroll bo'lmasligi uchun
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Pastki asosiy 4 ta bo'lim
  const mainNavItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'Bosh sahifa', icon: <Home className="w-5 h-5" /> },
    { key: 'tests', label: 'Testlar', icon: <ClipboardList className="w-5 h-5" /> },
    { key: 'multiplayer', label: '1v1 Duel', icon: <Swords className="w-5 h-5" /> },
    { key: 'leaderboard', label: 'Reyting', icon: <Trophy className="w-5 h-5" /> },
  ];

  // Barcha menyu elementlari (Kategoriyalar bo'yicha ajratilgan)
  const menuCategories = [
    {
      title: "O'yinlar va Bellashuvlar",
      items: [
        { key: 'multiplayer' as TabKey, label: '1v1 Duel', desc: 'Real vaqtda bilim sinovi', icon: <Swords className="w-5 h-5 text-indigo-500" /> },
        { key: 'tugofwar' as TabKey, label: 'Arqon Tortish', desc: 'Jamoaviy bilim jangi', icon: <Flame className="w-5 h-5 text-orange-500" /> },
        { key: 'millionaire' as TabKey, label: 'Kim Millioner?', desc: 'Klassik intellektual o\'yin', icon: <Trophy className="w-5 h-5 text-amber-500" /> },
        { key: 'boardgames' as TabKey, label: 'Shaxmat & Shashka', desc: 'Mantiqiy o\'yinlar', icon: <Crown className="w-5 h-5 text-yellow-500" /> },
        { key: 'memorygame' as TabKey, label: 'Xotira O\'yini', desc: 'Miya faolligini oshirish', icon: <Brain className="w-5 h-5 text-pink-500" /> },
      ]
    },
    {
      title: "O'quv va Ta'lim",
      items: [
        { key: 'tests' as TabKey, label: 'Fan Testlari', desc: 'Barcha fanlardan testlar', icon: <ClipboardList className="w-5 h-5 text-blue-500" /> },
        { key: 'library' as TabKey, label: 'Kutubxona', desc: 'Kitoblar va qo\'llanmalar', icon: <BookOpen className="w-5 h-5 text-emerald-500" /> },
        { key: 'pomodoro' as TabKey, label: 'Pomodoro Timer', desc: 'Dars qilish taymeri', icon: <Timer className="w-5 h-5 text-rose-500" /> },
        { key: 'teachers' as TabKey, label: 'Ustozlar', desc: 'Tajribali o\'qituvchilar', icon: <Star className="w-5 h-5 text-purple-500" /> },
        { key: 'quests' as TabKey, label: 'Do\'kon & Missiya', desc: 'Bonus va mukofotlar', icon: <ShoppingBag className="w-5 h-5 text-cyan-500" /> },
      ]
    }
  ];

  const handleTabSelect = (key: TabKey) => {
    setActiveTab(key);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* 1. Telefonlar uchun Menyu Foni (Backdrop Overlay) */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 animate-fadeIn touch-none transition-opacity"
        />
      )}

      {/* 2. Telefonlarga Mos Bottom-Sheet Menyu Modal Panel */}
      <div 
        className={`fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-2xl border-t border-slate-200/80 dark:border-slate-800 transform transition-transform duration-300 ease-out flex flex-col max-h-[85vh] ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        {/* Yuqori surish liniyasi (Swipe Indicator) */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsMenuOpen(false)}>
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full cursor-pointer" />
        </div>

        {/* Menyu Sarlavhasi */}
        <div className="px-6 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-slate-900 dark:text-white leading-tight">
                Barcha Bo'limlar
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                O'zingizga kerakli bo'limni tanlang
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 active:scale-90 transition-transform cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menyu Ro'yxati (Skroll bo'ladigan qismi) */}
        <div className="p-5 overflow-y-auto space-y-5 pb-10 active:touch-pan-y">
          {menuCategories.map((cat, idx) => (
            <div key={idx} className="space-y-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                {cat.title}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.items.map((item) => {
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleTabSelect(item.key)}
                      className={`p-3.5 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98] border ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 active:bg-slate-100 dark:active:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-800 shadow-xs'}`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm leading-tight">{item.label}</div>
                          <div className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 opacity-60 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Doimiy Telefon Pastki Navigatsiya Paneli (Bottom Dock Navigation) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 sm:px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl select-none">
        <div className="max-w-lg mx-auto flex items-center justify-around gap-1">
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.key && !isMenuOpen;
            return (
              <button
                key={item.key}
                onClick={() => handleTabSelect(item.key)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer relative ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {/* Indikator - faol tab ostida kichik nuqta yoki fon */}
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-blue-500/15 dark:bg-blue-400/20 scale-110' : ''
                }`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Menyu Tugmasi (Barcha imkoniyatlar uchun) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer relative ${
              isMenuOpen || isCustomTabActive
                ? 'text-amber-500 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all relative ${
              isMenuOpen ? 'bg-amber-500 text-white rotate-90 duration-300' : isCustomTabActive ? 'bg-amber-500/15' : ''
            }`}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Grid className="w-5 h-5" />}

              {/* Menyu ichidagi boshqa tab faol bo'lsa bildirishnoma nuqtasi */}
              {isCustomTabActive && !isMenuOpen && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
              )}
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isMenuOpen || isCustomTabActive ? 'font-black text-amber-500' : 'font-semibold'}`}>
              Menyu
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};