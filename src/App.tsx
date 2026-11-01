/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import schoolHeroBanner from './assets/images/school_hero_banner_1793015711991.jpg';
import { User, TeacherAccount, SiteSettings, Announcement, TestQuestion } from './types';
import { StorageService } from './services/storage';
import { AuthScreen } from './components/AuthScreen';
import { Navbar } from './components/Navbar';
import { BottomNav, TabKey } from './components/BottomNav';
import { ProfileModal } from './components/ProfileModal';
import { MultiplayerArena } from './components/MultiplayerArena';
import { BoardGamesArena } from './components/BoardGamesArena';
import { MillionaireGame } from './components/MillionaireGame';
import { MemoryGame } from './components/MemoryGame';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TestsSection } from './components/TestsSection';
import { DigitalLibrary } from './components/DigitalLibrary';
import { TeacherEvaluation } from './components/TeacherEvaluation';
import { Leaderboard } from './components/Leaderboard';
import { QuestsAndShop } from './components/QuestsAndShop';
import { AdminPanelModal } from './components/AdminPanelModal';
import { SettingsModal } from './components/SettingsModal';
import { TeacherPanelModal } from './components/TeacherPanelModal';
import { DailyBonusModal } from './components/DailyBonusModal';
import { Footer } from './components/Footer';
import { TugOfWarGame } from './components/TugOfWarGame';
import { HistoryPuzzleGame } from './components/HistoryPuzzleGame';
import {
  Swords,
  Trophy,
  Gift,
  Sparkles,
  Bell,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  GraduationCap,
  Crown,
  Brain,
  Timer,
  ClipboardList,
  Flame,
  Rocket,
  Puzzle,
  RefreshCw,
  type LucideIcon
} from 'lucide-react';

/* ---------- Jonli fon (aurora + grid) ---------- */
function Backdrop() {
  return (
    <>
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-blob" />
        <div className="aurora-blob" />
        <div className="aurora-blob" />
      </div>
      <div className="grid-bg" aria-hidden="true" />
    </>
  );
}

/* ---------- Asosiy sahifadagi o'yin kartalari ---------- */
interface FeatureCard {
  tab: string;
  title: string;
  desc: string;
  cta: string;
  icon: LucideIcon;
  iconWrap: string;
  ctaColor: string;
  accent: string;
  hot?: boolean;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    tab: 'tests',
    title: 'Fan Testlari',
    desc: "Fanlar bo'yicha belgilangan vaqt ichida testlar ishlab, coin va XP ballar to'plang.",
    cta: 'Testlarga kirish',
    icon: ClipboardList,
    iconWrap: 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/30',
    ctaColor: 'text-blue-600 dark:text-blue-400',
    accent: 'from-blue-500 via-cyan-400 to-blue-500'
  },
  {
    tab: 'tugofwar',
    title: 'Arqon tortish',
    desc: "Do'stlaring bilan kuch sinash va jamoangni g'alabaga olib bor!",
    cta: "O'yinni boshlash",
    icon: Swords,
    iconWrap: 'bg-gradient-to-br from-rose-500 to-orange-500 shadow-rose-500/30',
    ctaColor: 'text-rose-600 dark:text-rose-400',
    accent: 'from-rose-500 via-orange-400 to-rose-500',
    hot: true
  },
  {
    tab: 'multiplayer',
    title: '1v1 Viktorina Dueli',
    desc: "Sinfdoshlar bilan xona kodi orqali test jangi o'tkazing yoki tezkor raqib bilan kuch sinashing.",
    cta: 'Duelga kirish',
    icon: Swords,
    iconWrap: 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-indigo-500/30',
    ctaColor: 'text-indigo-600 dark:text-indigo-400',
    accent: 'from-indigo-500 via-purple-400 to-indigo-500',
    hot: true
  },
  {
    tab: 'boardgames',
    title: 'Shaxmat & Shashka Arenasi',
    desc: "Sun'iy intellekt botga yoki sinfdosh do'stingizga qarshi 1v1 shaxmat va shashka o'ynang.",
    cta: "O'yinga kirish",
    icon: Crown,
    iconWrap: 'bg-gradient-to-br from-amber-500 to-yellow-500 shadow-amber-500/30',
    ctaColor: 'text-amber-600 dark:text-amber-400',
    accent: 'from-amber-500 via-yellow-400 to-amber-500'
  },
  {
    tab: 'millionaire',
    title: 'Kim Millioner?',
    desc: 'Bosqichma-bosqich qiyinlashuvchi savollar, yordamchi imkoniyatlar va katta mukofotlar!',
    cta: "O'yinga kirish",
    icon: Trophy,
    iconWrap: 'bg-gradient-to-br from-yellow-400 to-amber-600 shadow-yellow-500/30',
    ctaColor: 'text-yellow-600 dark:text-yellow-400',
    accent: 'from-yellow-400 via-amber-500 to-yellow-400'
  },
  {
    tab: 'memorygame',
    title: "Xotira O'yini",
    desc: 'Fan formulalari va juftliklarini yashirin kartochkalar ostidan toping va xotirangizni sinang!',
    cta: "O'yinga kirish",
    icon: Brain,
    iconWrap: 'bg-gradient-to-br from-teal-500 to-emerald-500 shadow-teal-500/30',
    ctaColor: 'text-teal-600 dark:text-teal-400',
    accent: 'from-teal-500 via-emerald-400 to-teal-500'
  },
  {
    tab: 'pomodoro',
    title: 'Pomodoro Vaqt Nazorati',
    desc: 'Uyda yoki maktabda dars tayyorlash uchun 25/5 daqiqalik samarali vaqt rejimini boshqaring.',
    cta: 'Taymerni ochish',
    icon: Timer,
    iconWrap: 'bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-fuchsia-500/30',
    ctaColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    accent: 'from-fuchsia-500 via-pink-400 to-fuchsia-500'
  },
  {
    tab: 'historypuzzle',
    title: 'Tarix Puzzle',
    desc: "Tarixiy voqealarni to'g'ri yilga joylang. Bilmasangiz — yordam tugmasi tepada maslahat beradi!",
    cta: "O'yinni boshlash",
    icon: Puzzle,
    iconWrap: 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-violet-500/30',
    ctaColor: 'text-violet-600 dark:text-violet-400',
    accent: 'from-violet-500 via-indigo-400 to-violet-500',
    hot: true
  }
];

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/* ---------- Kunlik savol: har bir foydalanuvchi yechgan savollarni eslab qolish ---------- */
const solvedStorageKey = (userId: unknown) => `daily_solved_${String(userId)}`;

const questionKey = (q: TestQuestion): string => {
  const id = (q as unknown as { id?: string | number }).id;
  return id !== undefined && id !== null ? `id:${id}` : `q:${q.question}`;
};

const getSolvedSet = (userId: unknown): Set<string> => {
  try {
    const raw = localStorage.getItem(solvedStorageKey(userId));
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set<string>();
  }
};

const markSolved = (userId: unknown, key: string) => {
  try {
    const set = getSolvedSet(userId);
    set.add(key);
    localStorage.setItem(solvedStorageKey(userId), JSON.stringify(Array.from(set)));
  } catch {
    /* localStorage yopiq bo'lsa e'tibor bermaymiz */
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  // Modals
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dailyBonusOpen, setDailyBonusOpen] = useState(false);

  // Teacher Account & Panel
  const [currentTeacher, setCurrentTeacher] = useState<TeacherAccount | null>(null);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);

  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Quick Daily Question on Home page
  const [dailyQIndex, setDailyQIndex] = useState(0);
  const [dailySelectedOpt, setDailySelectedOpt] = useState<number | null>(null);
  const [dailyResult, setDailyResult] = useState<'correct' | 'wrong' | null>(null);
  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [dailyStatus, setDailyStatus] = useState<'playing' | 'all_done' | 'empty'>('playing');
  const [dailyProgress, setDailyProgress] = useState({ solved: 0, total: 0 });
  const lastDailyKey = useRef<string | null>(null);

  useEffect(() => {
    StorageService.init();

    // Check saved theme
    const savedTheme = StorageService.getTheme();
    setTheme(savedTheme);
    applyThemeClass(savedTheme);

    // Check if user is already logged in
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);

    // Check if teacher is already logged in
    const teacher = StorageService.getCurrentTeacher();
    setCurrentTeacher(teacher);

    setSettings(StorageService.getSettings());
    setAnnouncements(StorageService.getAnnouncements());

    const handleStorageChange = () => {
      setCurrentUser(StorageService.getCurrentUser());
      setCurrentTeacher(StorageService.getCurrentTeacher());
      setSettings(StorageService.getSettings());
      setAnnouncements(StorageService.getAnnouncements());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const applyThemeClass = (t: 'dark' | 'light') => {
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    StorageService.setTheme(nextTheme);
    applyThemeClass(nextTheme);
  };

  const handleUserStatsUpdated = () => {
    setCurrentUser(StorageService.getCurrentUser());
  };

  const handleLogout = () => {
    StorageService.setCurrentUserId(null);
    setCurrentUser(null);
    setProfileOpen(false);
    setActiveTab('home');
  };

  const handleTeacherLogout = () => {
    StorageService.logoutTeacher();
    setCurrentTeacher(null);
    setTeacherModalOpen(false);
  };

  const [currentDailyQ, setCurrentDailyQ] = useState<TestQuestion | null>(null);

  // Foydalanuvchi hali to'g'ri yechmagan savollardan bittasini tanlaydi
  const loadDailyQuestion = (userId: unknown) => {
    setDailySelectedOpt(null);
    setDailyResult(null);
    setDailyAnswered(false);

    const all = StorageService.getQuestions();
    if (all.length === 0) {
      setCurrentDailyQ(null);
      setDailyStatus('empty');
      setDailyProgress({ solved: 0, total: 0 });
      return;
    }

    const solved = getSolvedSet(userId);
    const pool = all.filter((q) => !solved.has(questionKey(q)));
    setDailyProgress({ solved: all.length - pool.length, total: all.length });

    if (pool.length === 0) {
      setCurrentDailyQ(null);
      setDailyStatus('all_done');
      return;
    }

    setDailyStatus('playing');
    // Xato yechilgan savol darhol qaytib kelmasligi uchun avvalgisini chetlab o'tamiz
    const candidates =
      pool.length > 1 ? pool.filter((q) => questionKey(q) !== lastDailyKey.current) : pool;
    const raw = candidates[Math.floor(Math.random() * candidates.length)];
    lastDailyKey.current = questionKey(raw);
    setCurrentDailyQ(StorageService.shuffleQuestionOptions(raw));
  };

  useEffect(() => {
    if (!currentUser) return;
    loadDailyQuestion(currentUser.id);
  }, [dailyQIndex, currentUser?.id]);

  const handleDailyAnswer = (index: number) => {
    if (dailyAnswered || !currentDailyQ) return;
    setDailySelectedOpt(index);
    setDailyAnswered(true);

    if (index === currentDailyQ.correctIndex) {
      setDailyResult('correct');
      if (currentUser) {
        // To'g'ri yechilgan savol shu foydalanuvchiga endi chiqmaydi
        if (lastDailyKey.current) markSolved(currentUser.id, lastDailyKey.current);
        setDailyProgress((p) => ({ ...p, solved: Math.min(p.total, p.solved + 1) }));
        StorageService.addCoinsAndXp(currentUser.id, 25, 30);
        handleUserStatsUpdated();
      }
    } else {
      setDailyResult('wrong');
    }
  };

  const handleNextDailyQ = () => {
    setDailySelectedOpt(null);
    setDailyResult(null);
    setDailyAnswered(false);
    setDailyQIndex(prev => prev + 1);
  };

  const handleAdminDataChanged = () => {
    setSettings(StorageService.getSettings());
    setAnnouncements(StorageService.getAnnouncements());
    setCurrentUser(StorageService.getCurrentUser());
    const uid = StorageService.getCurrentUser()?.id ?? currentUser?.id;
    if (uid !== undefined) loadDailyQuestion(uid);
    window.dispatchEvent(new Event('admin_data_updated'));
  };

  // IF NOT LOGGED IN AS STUDENT:
  if (!currentUser) {
    return (
      <div className={`relative min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors ${theme}`}>
        <Backdrop />

        <AuthScreen
          onSuccess={(u) => setCurrentUser(u)}
          onTeacherSuccess={(t) => {
            setCurrentTeacher(t);
            setTeacherModalOpen(true);
          }}
          onOpenAdmin={() => setAdminOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Teacher Panel Modal */}
        {currentTeacher && (
          <TeacherPanelModal
            isOpen={teacherModalOpen}
            onClose={() => setTeacherModalOpen(false)}
            teacher={currentTeacher}
            onLogout={handleTeacherLogout}
            onDataChanged={handleAdminDataChanged}
          />
        )}

        {/* Admin Panel Modal */}
        <AdminPanelModal
          isOpen={adminOpen}
          onClose={() => setAdminOpen(false)}
          onDataChanged={handleAdminDataChanged}
        />
      </div>
    );
  }

  const canClaim = StorageService.canClaimDailyBonus(currentUser);

  return (
    <div className={`relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors ${theme}`}>
      <Backdrop />

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        settings={settings}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="relative flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-28 sm:pb-32">

        {/* TAB 1: ASOSIY (HOME) */}
        {activeTab === 'home' && (
          <div className="space-y-8 sm:space-y-10 animate-fadeIn">

            {/* Daily Bonus Banner for Students */}
            {currentUser && (
              <div
                onClick={() => setDailyBonusOpen(true)}
                className={`p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer group ${
                  canClaim
                    ? 'neon-card'
                    : 'game-card'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3.5 rounded-2xl shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${
                      canClaim
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white animate-float shadow-amber-500/40'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-black text-slate-900 dark:text-white text-sm sm:text-base">
                        {canClaim ? '🎁 Bugungi Kunlik Bonus Tayyor!' : '✅ Bugungi Kunlik Bonus Olingan'}
                      </span>
                      <span className="badge-glow">
                        <Flame className="w-3 h-3" />
                        {StorageService.getDailyBonusDay(currentUser)}-kun / 7
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {canClaim
                        ? "Har kuni kirib, bepul Coin va XP oling. Sovg'ani qabul qilish uchun bosing!"
                        : 'Ertaga yana kiring va keyingi kattaroq bonusni oching!'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setDailyBonusOpen(true); }}
                  className={`shrink-0 cursor-pointer ${
                    canClaim
                      ? 'btn-gradient btn-gold animate-soft-pulse !py-2.5 !px-5 !text-xs'
                      : 'px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95'
                  }`}
                >
                  {canClaim ? 'Bonusni Olish' : "Grafikni Ko'rish"}
                </button>
              </div>
            )}

            {/* Announcement Banner */}
            {announcements.length > 0 && (
              <div className="game-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <span className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shrink-0 shadow-lg shadow-blue-500/30">
                    <Bell className="w-4 h-4" />
                    <span className="live-dot absolute -top-1 -right-1" />
                  </span>
                  <div className="text-xs font-medium">
                    <span className="font-display font-extrabold text-blue-700 dark:text-blue-300 mr-2 block sm:inline text-sm">
                      {announcements[0].title}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {announcements[0].content}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0 font-mono font-bold self-end sm:self-auto bg-slate-200/60 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg">
                  {announcements[0].date}
                </span>
              </div>
            )}

            {/* Hero Split Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-center space-y-7">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-5 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-700 dark:text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.15)] animate-fadeIn">
                    <Sparkles className="w-4 h-4 text-fuchsia-500 animate-pulse" />
                    <span>8-SINF • GAMING & INTELLEKTUAL ARENA</span>
                  </div>

                  <h1 className="gaming-portal-title">
                    <span className="block">8-SINF UCHUN</span>
                    <span className="gaming-title-accent block">GAMING PORTAL</span>
                  </h1>

                  <p className="gaming-portal-subtitle mt-6 max-w-xl">
                    Do‘stlaring bilan bellash, bilimlaringni sinab ko‘r va reytingda yuqoriga ko‘taril!
                  </p>
                </div>

                {/* Main Action CTAs */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setActiveTab('tests')}
                    className="btn-gradient"
                  >
                    <ClipboardList className="w-4 h-4" />
                    Fan Testlarini Ishlash
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('multiplayer')}
                    className="btn-gradient btn-gold"
                  >
                    <Swords className="w-4 h-4" />
                    Multiplayer Duel
                  </button>
                </div>

                {/* Quick stats strip */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
                  {[
                    { value: '500+', label: "O'quvchi bellashuvi", icon: Rocket },
                    { value: '10 ta', label: 'Fan olimpiadasi', icon: Zap },
                    { value: '100%', label: 'Ochiq baholash', icon: CheckCircle2 }
                  ].map((s) => (
                    <div key={s.label} className="game-card p-3.5 sm:p-4 text-center">
                      <s.icon className="w-4 h-4 mx-auto mb-1.5 text-indigo-500 dark:text-indigo-300" />
                      <span className="block font-display font-black text-xl sm:text-2xl text-gradient">
                        {s.value}
                      </span>
                      <span className="block text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Hero Image Card */}
              <div className="lg:col-span-5 relative">
                <div className="neon-card h-full min-h-[360px] p-[3px]">
                  <div className="relative isolate h-full min-h-[354px] rounded-[22px] overflow-hidden group">
                    <img
                      src={schoolHeroBanner}
                      alt="29-Maktab o'quvchilari"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent flex flex-col justify-end p-6 text-white">
                      <div className="flex items-center gap-2 mb-1.5">
                        <GraduationCap className="w-5 h-5 text-amber-400" />
                        <span className="text-xs font-bold tracking-wide text-cyan-200 uppercase">
                          29-Maktab Iqtidorlari
                        </span>
                      </div>
                      <h3 className="font-display font-black text-xl text-white">
                        Ilm, Texnologiya va Do'stlik
                      </h3>
                      <p className="text-xs text-slate-200 mt-1.5 font-medium leading-relaxed">
                        O'quvchilarning dars jadvali, multiplayer intellektual bellashuvlari va o'qituvchilar reytingi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Suzuvchi badge'lar */}
                <div className="hidden sm:flex absolute -top-4 -left-4 items-center gap-2 px-3.5 py-2 rounded-2xl glass-card border border-white/60 dark:border-slate-700 shadow-xl animate-float">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">Reytingda #1 bo'l</span>
                </div>
                <div
                  className="hidden sm:flex absolute -bottom-4 -right-3 items-center gap-2 px-3.5 py-2 rounded-2xl glass-card border border-white/60 dark:border-slate-700 shadow-xl animate-float"
                  style={{ animationDelay: '-2s' }}
                >
                  <Zap className="w-4 h-4 text-fuchsia-500 fill-fuchsia-500" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">+XP har kuni</span>
                </div>
              </div>
            </div>

            {/* Bo'lim sarlavhasi */}
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <span className="badge-glow mb-2">
                  <Sparkles className="w-3 h-3" />
                  O'YINLAR MARKAZI
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white mt-2">
                  O'zingga mos <span className="text-gradient">o'yinni tanla</span>
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="live-dot" />
                {FEATURE_CARDS.length} ta o'yin tayyor
              </span>
            </div>

            {/* Bento Highlights */}
            <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {FEATURE_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.tab}
                    onClick={() => setActiveTab(card.tab as TabKey)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActiveTab(card.tab as TabKey);
                      }
                    }}
                    className="game-card p-6 cursor-pointer group"
                  >
                    {/* Tepadagi rangli chiziq */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accent} opacity-80 group-hover:opacity-100`} />

                    {/* Katta shaffof raqam */}
                    <span className="absolute -top-2 right-4 font-display font-black text-7xl text-slate-900/[0.04] dark:text-white/[0.05] select-none pointer-events-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {card.hot && (
                      <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                        <Flame className="w-3 h-3" /> HOT
                      </span>
                    )}

                    <div
                      className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${card.iconWrap}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5 font-medium">
                      {card.desc}
                    </p>

                    <div className={`flex items-center gap-1.5 text-xs font-extrabold ${card.ctaColor}`}>
                      <span>{card.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promokod Faollashtirish Qismi */}
            <div className="neon-card p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0 animate-soft-pulse">
                  <Gift className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white">
                      Maxsus Promokodingiz Bormi?
                    </h3>
                    <span className="badge-glow">BONUS COIN</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium max-w-xl">
                    Tursunboy ustoz yoki admin bergan promokodlarni kiriting va bepul Coin & XP ballariga ega bo'ling!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="btn-gradient w-full sm:w-auto shrink-0"
              >
                <Gift className="w-4 h-4" />
                <span>Promokodni Kiritish</span>
              </button>
            </div>

            {/* Savollar tugagan yoki umuman yo'q holat */}
            {dailyStatus !== 'playing' && (
              <div className="neon-card p-6 sm:p-10 text-center">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white grid place-items-center shadow-xl shadow-orange-500/30 animate-float mb-5">
                  <Trophy className="w-10 h-10" />
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                  {dailyStatus === 'all_done' ? 'Barcha testlarni yechdingiz! 🎉' : "Hozircha test yo'q"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 max-w-md mx-auto leading-relaxed">
                  {dailyStatus === 'all_done'
                    ? "Zo'r natija! Admin yangi test qo'shishini kuting. Yangi savol paydo bo'lishi bilan shu yerda ko'rasiz."
                    : "Admin test qo'shishini kuting."}
                </p>

                {dailyStatus === 'all_done' && (
                  <div className="max-w-xs mx-auto mt-5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>Yechilgan savollar</span>
                      <span className="font-mono">{dailyProgress.solved} / {dailyProgress.total}</span>
                    </div>
                    <div className="xp-bar"><span style={{ width: '100%' }} /></div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setDailyQIndex((prev) => prev + 1)}
                  className="btn-gradient mt-6"
                >
                  <RefreshCw className="w-4 h-4" />
                  Yangi test bormi? Tekshirish
                </button>
              </div>
            )}

            {/* Daily Challenge Interactive Box */}
            {dailyStatus === 'playing' && currentDailyQ && (
              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-950 text-white p-6 sm:p-9 shadow-2xl shadow-indigo-900/30 border border-indigo-400/20">
                {/* Dekorativ yorug'lik dog'lari */}
                <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider mb-1.5">
                      <Zap className="w-4 h-4 fill-amber-300" />
                      Kunlik Intellektual Sinov
                    </div>
                    <h3 className="font-display font-black text-2xl text-white">
                      Fan: <span className="text-gradient">{currentDailyQ.subject}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3.5 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs font-mono font-bold text-amber-200 border border-white/15 shadow-lg">
                      🪙 +25 Coin &nbsp;|&nbsp; ⚡ +30 XP
                    </span>
                    {dailyAnswered && (
                      <button
                        onClick={handleNextDailyQ}
                        className="btn-gradient !py-2 !px-4 !text-xs animate-pop"
                      >
                        Keyingi savol
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Yechilgan savollar jarayoni */}
                <div className="relative mb-5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-200 mb-1.5">
                    <span>Yechilgan savollar</span>
                    <span className="font-mono">{dailyProgress.solved} / {dailyProgress.total}</span>
                  </div>
                  <div className="xp-bar">
                    <span
                      style={{
                        width: `${dailyProgress.total ? (dailyProgress.solved / dailyProgress.total) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>

                <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-white/10">
                  <p className="font-display text-base sm:text-lg font-bold text-white mb-6 leading-relaxed">
                    {currentDailyQ.question}
                  </p>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${dailyResult === 'wrong' ? 'animate-shake' : ''}`}>
                    {currentDailyQ.options.map((option, idx) => {
                      const isSelected = dailySelectedOpt === idx;
                      const isCorrect = idx === currentDailyQ.correctIndex;

                      let btnStyle =
                        'bg-white/10 hover:bg-white/20 hover:-translate-y-1 hover:border-cyan-300/60 border-white/15 text-white';
                      let letterStyle = 'bg-white/15 text-white';
                      if (dailyAnswered) {
                        btnStyle = 'bg-white/5 border-white/10 text-white/60';
                        letterStyle = 'bg-white/10 text-white/60';
                        if (isCorrect) {
                          btnStyle =
                            'bg-emerald-500/80 border-emerald-300 text-white font-bold shadow-lg shadow-emerald-500/30 animate-pop';
                          letterStyle = 'bg-white/25 text-white';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-500/80 border-rose-300 text-white shadow-lg shadow-rose-500/30';
                          letterStyle = 'bg-white/25 text-white';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={dailyAnswered}
                          onClick={() => handleDailyAnswer(idx)}
                          className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer disabled:cursor-not-allowed active:scale-[.98] ${btnStyle}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-lg grid place-items-center text-[11px] font-black shrink-0 ${letterStyle}`}>
                              {OPTION_LETTERS[idx] ?? idx + 1}
                            </span>
                            <span>{option}</span>
                          </span>
                          {dailyAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                          {dailyAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {dailyAnswered && (
                    <div className="animate-fadeIn mt-5 pt-5 border-t border-white/10">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 ${
                          dailyResult === 'correct'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                        }`}
                      >
                        {dailyResult === 'correct' ? "🎉 To'g'ri! Mukofot hisobingizga qo'shildi" : "😕 Xato, lekin keyingisi sizniki!"}
                      </div>
                      <div className="text-xs text-blue-100 flex items-start gap-2 font-medium leading-relaxed">
                        <span className="font-bold text-amber-300 shrink-0">Izoh:</span>
                        <span>{currentDailyQ.explanation}</span>
                      </div>
                      <p className="mt-3 text-[11px] font-bold text-slate-300">
                        {dailyResult === 'correct'
                          ? '✅ Bu savol endi sizga qayta chiqmaydi.'
                          : "🔁 Bu savol keyinroq yana chiqadi, qayta urinib ko'ring!"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: ARQON TORTISH */}
        {activeTab === ('tugofwar' as TabKey) && (
          <TugOfWarGame
            currentUser={currentUser}
            onUserStatsUpdated={handleUserStatsUpdated}
          />
        )}

        {/* TAB: TARIX PUZZLE */}
        {activeTab === ('historypuzzle' as TabKey) && (
          <HistoryPuzzleGame
            currentUser={currentUser}
            onUserStatsUpdated={handleUserStatsUpdated}
          />
        )}

        {/* TAB: TESTLAR */}
        {activeTab === 'tests' && (
          <TestsSection
            currentUser={currentUser}
            onUserStatsUpdated={handleUserStatsUpdated}
          />
        )}

        {/* TAB: MULTIPLAYER */}
        {activeTab === 'multiplayer' && (
          <MultiplayerArena
            currentUser={currentUser}
            onOpenAuth={() => {}}
            onUserStatsUpdated={handleUserStatsUpdated}
          />
        )}

        {/* TAB: SHAXMAT VA SHASHKA */}
        {activeTab === 'boardgames' && (
          <BoardGamesArena
            currentUser={currentUser}
            onUserUpdated={(updated) => setCurrentUser(updated)}
          />
        )}

        {/* TAB: KIM MILLIONER? */}
        {activeTab === 'millionaire' && (
          <MillionaireGame
            currentUser={currentUser}
            onUserStatsUpdated={handleUserStatsUpdated}
          />
        )}

        {/* TAB: XOTIRA O'YINI */}
        {activeTab === 'memorygame' && (
          <MemoryGame
            currentUser={currentUser}
            onUserStatsUpdated={handleUserStatsUpdated}
          />
        )}

        {/* TAB: POMODORO */}
        {activeTab === 'pomodoro' && (
          <PomodoroTimer
            currentUser={currentUser}
            onUserStatsUpdated={handleUserStatsUpdated}
          />
        )}

        {/* TAB: KUTUBXONA */}
        {activeTab === 'library' && (
          <DigitalLibrary />
        )}

        {/* TAB: USTOZLARNI BAHOLASH */}
        {activeTab === 'teachers' && (
          <TeacherEvaluation
            currentUser={currentUser}
            onOpenAuth={() => {}}
            onUserStatsUpdated={handleUserStatsUpdated}
          />
        )}

        {/* TAB: REYTING */}
        {activeTab === 'leaderboard' && (
          <Leaderboard
            currentUser={currentUser}
            onOpenProfile={() => setProfileOpen(true)}
          />
        )}

        {/* TAB: MISSIYALAR & DO'KON */}
        {activeTab === 'quests' && (
          <QuestsAndShop
            currentUser={currentUser}
            onUserUpdated={(updated) => setCurrentUser(updated)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onAdminUnlocked={() => setAdminOpen(true)}
        setActiveTab={(t) => setActiveTab(t as TabKey)}
      />

      {/* Fixed Bottom Navigation Dock */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Profile Modal */}
      {currentUser && (
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          currentUser={currentUser}
          onUserUpdated={(updated) => setCurrentUser(updated)}
          onLogout={handleLogout}
        />
      )}

      {/* Secret Admin Panel Modal */}
      <AdminPanelModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onDataChanged={handleAdminDataChanged}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentUser={currentUser}
        onUserUpdated={(updated) => setCurrentUser(updated)}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Daily Bonus Modal */}
      {currentUser && (
        <DailyBonusModal
          isOpen={dailyBonusOpen}
          onClose={() => setDailyBonusOpen(false)}
          user={currentUser}
          onClaimed={(updated) => setCurrentUser(updated)}
        />
      )}
    </div>
  );
}