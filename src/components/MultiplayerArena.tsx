import React, { useState, useEffect, useRef } from 'react';
import { User, Subject, TestQuestion, RealGameRoom } from '../types';
import { StorageService } from '../services/storage';
import { 
  Swords, 
  Users, 
  Zap, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Calculator, 
  Flame, 
  ArrowRight,
  Copy,
  Check,
  Award,
  Coins,
  AlertCircle,
  Clock,
  Share2
} from 'lucide-react';

interface MultiplayerArenaProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onUserStatsUpdated: () => void;
}

type GameMode = 'hub' | 'create_room' | 'join_room' | 'room_lobby' | 'room_battle' | 'room_result' | 'math_race' | 'math_result';

export const MultiplayerArena: React.FC<MultiplayerArenaProps> = ({
  currentUser,
  onOpenAuth,
  onUserStatsUpdated
}) => {
  const [activeMode, setActiveMode] = useState<GameMode>('hub');

  // ROOM STATE
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'Aralash'>('Texnologiya');
  const [activeRoom, setActiveRoom] = useState<RealGameRoom | null>(null);
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);

  // BATTLE TIMER
  const [timeLeft, setTimeLeft] = useState(12);

  // MATH RACE STATE
  const [mathTimeLeft, setMathTimeLeft] = useState(45);
  const [mathScore, setMathScore] = useState(0);
  const [mathStreak, setMathStreak] = useState(0);
  const [mathProblem, setMathProblem] = useState<{ question: string; answer: number; options: number[] }>({
    question: '16 + 19',
    answer: 35,
    options: [31, 35, 33, 37]
  });
  const [mathResult, setMathResult] = useState<{ score: number; maxStreak: number; coinsWon: number; xpWon: number }>({
    score: 0,
    maxStreak: 0,
    coinsWon: 0,
    xpWon: 0
  });

  const roundTimerRef = useRef<any>(null);
  const syncIntervalRef = useRef<any>(null);
  const mathTimerRef = useRef<any>(null);

  // Sync Room with Storage / BroadcastChannel
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('maktab29_broadcast_sync');
      channel.onmessage = () => {
        if (activeRoom) {
          const fresh = StorageService.getRoom(activeRoom.code);
          if (fresh) handleRoomUpdated(fresh);
        }
      };
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (activeRoom && e.key && e.key.includes('maktab29_rooms')) {
        const fresh = StorageService.getRoom(activeRoom.code);
        if (fresh) handleRoomUpdated(fresh);
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    // Periodic sync poll every 800ms to guarantee cross-tab real-time sync
    syncIntervalRef.current = setInterval(() => {
      if (activeRoom) {
        const fresh = StorageService.getRoom(activeRoom.code);
        if (fresh) handleRoomUpdated(fresh);
      }
    }, 800);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageEvent);
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
      if (roundTimerRef.current) clearInterval(roundTimerRef.current);
      if (mathTimerRef.current) clearInterval(mathTimerRef.current);
    };
  }, [activeRoom?.code, activeRoom?.status, activeRoom?.currentQIndex]);

  const handleRoomUpdated = (fresh: RealGameRoom) => {
    setActiveRoom(fresh);

    if (fresh.status === 'playing' && activeMode !== 'room_battle') {
      setActiveMode('room_battle');
      startRoundCountdown();
    } else if (fresh.status === 'finished' && activeMode !== 'room_result') {
      finishBattle(fresh);
    }
  };

  // 1. CREATE ROOM (HOST)
  const handleCreateRoom = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setRoomError(null);
    const room = StorageService.createRoom(currentUser, selectedSubject);
    setActiveRoom(room);
    setActiveMode('room_lobby');
  };

  // 2. JOIN ROOM (GUEST)
  const handleJoinRoom = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!inputRoomCode.trim()) {
      setRoomError('Iltimos, do\'stingiz bergan xona kodini kiriting!');
      return;
    }

    setRoomError(null);
    const res = StorageService.joinRoom(inputRoomCode, currentUser);
    if (!res.success) {
      setRoomError(res.message);
      return;
    }

    setActiveRoom(res.room!);
    setActiveMode('room_lobby');
  };

  // 3. START MATCH (Host or Guest triggers)
  const handleStartMatch = () => {
    if (!activeRoom || !activeRoom.guestId) return;

    activeRoom.status = 'playing';
    activeRoom.currentQIndex = 0;
    activeRoom.hostScore = 0;
    activeRoom.guestScore = 0;
    activeRoom.hostAnswer = null;
    activeRoom.guestAnswer = null;
    activeRoom.roundOver = false;
    activeRoom.roundTimeLeft = 12;

    StorageService.saveRoom(activeRoom);
    setActiveMode('room_battle');
    startRoundCountdown();
  };

  // Round countdown
  const startRoundCountdown = () => {
    if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    setTimeLeft(12);

    roundTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(roundTimerRef.current);
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeExpire = () => {
    if (!activeRoom) return;
    // Mark round over if time ran out
    activeRoom.roundOver = true;
    StorageService.saveRoom(activeRoom);

    // Auto advance after 2.5s
    setTimeout(() => {
      const advanced = StorageService.advanceRoomRound(activeRoom.code);
      if (advanced) {
        setActiveRoom(advanced);
        if (advanced.status === 'playing') {
          startRoundCountdown();
        } else if (advanced.status === 'finished') {
          finishBattle(advanced);
        }
      }
    }, 2500);
  };

  const handleAnswerSubmit = (optionIndex: number) => {
    if (!activeRoom || !currentUser || activeRoom.roundOver) return;

    const isHost = currentUser.id === activeRoom.hostId;
    if (isHost && activeRoom.hostAnswer !== null) return;
    if (!isHost && activeRoom.guestAnswer !== null) return;

    const updated = StorageService.submitRoomAnswer(activeRoom.code, currentUser.id, optionIndex, timeLeft);
    if (updated) {
      setActiveRoom(updated);

      if (updated.roundOver) {
        if (roundTimerRef.current) clearInterval(roundTimerRef.current);
        setTimeout(() => {
          const next = StorageService.advanceRoomRound(updated.code);
          if (next) {
            setActiveRoom(next);
            if (next.status === 'playing') {
              startRoundCountdown();
            } else if (next.status === 'finished') {
              finishBattle(next);
            }
          }
        }, 2500);
      }
    }
  };

  const finishBattle = (room: RealGameRoom) => {
    if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    setActiveMode('room_result');

    if (!currentUser) return;
    const isHost = currentUser.id === room.hostId;
    const myScore = isHost ? room.hostScore : room.guestScore;
    const oppScore = isHost ? room.guestScore : room.hostScore;
    const won = myScore > oppScore;

    const users = StorageService.getUsers();
    const u = users.find(x => x.id === currentUser.id);
    if (u) {
      u.stats.duelsPlayed = (u.stats.duelsPlayed || 0) + 1;
      if (won) {
        u.stats.duelsWon = (u.stats.duelsWon || 0) + 1;
      }
      StorageService.saveUsers(users);

      const coinsReward = won ? 80 : 30;
      const xpReward = won ? 120 : 50;
      StorageService.addCoinsAndXp(currentUser.id, coinsReward, xpReward);
      onUserStatsUpdated();
    }
  };

  // ----------------------------------------------------
  // MATH SPEED RACE (SOLO ARITHMETIC PRACTICE)
  // ----------------------------------------------------
  const generateMathProblem = () => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0;
    let b = 0;
    let ans = 0;

    if (op === '+') {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 50) + 10;
      ans = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 70) + 30;
      b = Math.floor(Math.random() * 30) + 5;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 12) + 3;
      b = Math.floor(Math.random() * 12) + 3;
      ans = a * b;
    }

    const wrong1 = ans + (Math.random() > 0.5 ? 2 : -2);
    const wrong2 = ans + (Math.random() > 0.5 ? 10 : -10);
    const wrong3 = ans + (Math.random() > 0.5 ? 4 : -4);

    const options = Array.from(new Set([ans, wrong1, wrong2, wrong3])).slice(0, 4);
    while (options.length < 4) {
      options.push(ans + options.length + 3);
    }
    options.sort(() => 0.5 - Math.random());

    return { question: `${a} ${op} ${b}`, answer: ans, options };
  };

  const startMathRace = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setMathScore(0);
    setMathStreak(0);
    setMathTimeLeft(45);
    setMathProblem(generateMathProblem());
    setActiveMode('math_race');

    if (mathTimerRef.current) clearInterval(mathTimerRef.current);

    mathTimerRef.current = setInterval(() => {
      setMathTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(mathTimerRef.current);
          endMathRace();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleMathAnswer = (val: number) => {
    if (val === mathProblem.answer) {
      const newStreak = mathStreak + 1;
      const points = 15 + newStreak * 5;
      setMathScore(s => s + points);
      setMathStreak(newStreak);
      setMathProblem(generateMathProblem());
    } else {
      setMathStreak(0);
      setMathProblem(generateMathProblem());
    }
  };

  const endMathRace = () => {
    if (mathTimerRef.current) clearInterval(mathTimerRef.current);
    setActiveMode('math_result');

    const coinsEarned = Math.floor(mathScore / 2);
    const xpEarned = Math.floor(mathScore * 0.8);

    setMathResult({
      score: mathScore,
      maxStreak: mathStreak,
      coinsWon: coinsEarned,
      xpWon: xpEarned
    });

    if (currentUser) {
      const users = StorageService.getUsers();
      const u = users.find(x => x.id === currentUser.id);
      if (u) {
        if (mathStreak > (u.stats.mathHighStreak || 0)) {
          u.stats.mathHighStreak = mathStreak;
        }
        StorageService.saveUsers(users);
      }
      StorageService.addCoinsAndXp(currentUser.id, coinsEarned, xpEarned);
      onUserStatsUpdated();
    }
  };

  const currentQ = activeRoom && activeRoom.questions ? activeRoom.questions[activeRoom.currentQIndex] : null;
  const isHost = currentUser?.id === activeRoom?.hostId;
  const myAnswer = isHost ? activeRoom?.hostAnswer : activeRoom?.guestAnswer;
  const oppAnswer = isHost ? activeRoom?.guestAnswer : activeRoom?.hostAnswer;

  return (
    <div className="w-full pb-16 animate-fadeIn">
      {/* 1. HUB VIEW */}
      {activeMode === 'hub' && (
        <div className="space-y-8">
          {/* Header banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white p-6 sm:p-10 shadow-md">
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Jonli Real-time Raqobat
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-4xl text-white mt-1 mb-3">
                Do'st Bilan Real 1v1 Intellektual Duel
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mb-6 leading-relaxed">
                Hech qanday botlar va simulyatorlarsiz! Xona kodi orqali do'stingiz boshqa telefonda yoki kompyuterda ulanadi va ikkingiz yuzma-yuz real-time testda bellashasiz.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveMode('create_room')}
                  className="px-5 py-3 bg-white text-blue-900 font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Swords className="w-4 h-4 text-blue-600" />
                  Yangi Xona Yaratish (Do'stni taklif qilish)
                </button>
                <button
                  onClick={() => setActiveMode('join_room')}
                  className="px-5 py-3 bg-blue-950/60 hover:bg-blue-950/80 text-white font-semibold rounded-xl text-xs sm:text-sm border border-blue-400/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-indigo-300" />
                  Do'st Xonasiga Ulanish (Kod bilan)
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  <Swords className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">
                  1v1 Real Do'stlik Jangi
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  5 ta savol, har bir savolga 12 soniya. Variantlar har safar tasodifiy aralashtiriladi, g'olibga +80 Coin va +120 XP taqdim etiladi.
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-6">
                  <span>5 ta savol</span>
                  <span>•</span>
                  <span>12 sek/savol</span>
                  <span>•</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">+80 Coin yutug'i</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveMode('create_room')}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Xona ochish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveMode('join_room')}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Kod kiritish
                </button>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">
                  Tezkor Arifmetika Mashg'uloti
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  45 soniya ichida hisoblash chaqqonligingizni sinang! Ketma-ket 5 ta to'g'ri topsangiz, kunlik arifmetika missiyasini bajargan bo'lasiz.
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-6">
                  <span>45 soniya</span>
                  <span>•</span>
                  <span>Cheksiz misollar</span>
                  <span>•</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Streak hisoblagich</span>
                </div>
              </div>

              <button
                onClick={startMathRace}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Mashg'ulotni boshlash</span>
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CREATE ROOM SETUP */}
      {activeMode === 'create_room' && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-blue-600" />
              Yangi Xona Yaratish
            </h3>
            <button
              onClick={() => setActiveMode('hub')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer"
            >
              Ortga
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Fan yo'nalishini tanlang:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Texnologiya', 'Aralash', 'Matematika', 'Fizika', 'Informatika', 'Mantiq', 'Ingliz tili', 'Tarix'] as const).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreateRoom}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            Xonani yaratish va kod olish
          </button>
        </div>
      )}

      {/* 3. JOIN ROOM SETUP */}
      {activeMode === 'join_room' && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Do'st Xonasiga Ulanish
            </h3>
            <button
              onClick={() => setActiveMode('hub')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer"
            >
              Ortga
            </button>
          </div>

          {roomError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{roomError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Do'stingiz bergan 5 xonali Xona Kodi:
              </label>
              <input
                type="text"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                placeholder="Masalan: MK-482"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center text-lg font-bold tracking-widest uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleJoinRoom}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Xonaga ulanish
            </button>
          </div>
        </div>
      )}

      {/* 4. ROOM LOBBY (WAITING FOR FRIEND TO JOIN) */}
      {activeMode === 'room_lobby' && activeRoom && (
        <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-lg text-center animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
              Fan: {activeRoom.subject}
            </span>
            <button
              onClick={() => {
                setActiveRoom(null);
                setActiveMode('hub');
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
            >
              Chiqish
            </button>
          </div>

          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">
            Multiplayer Xona Kutilmoqda
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Ushbu xona kodini do'stingizga yuboring. U o'z qurilmasida ushbu kodni kiritishi kerak:
          </p>

          {/* ROOM CODE DISPLAY */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 mb-6">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
              Xona Kodi
            </span>
            <div className="font-mono font-black text-3xl tracking-widest text-blue-700 dark:text-blue-300 mb-2">
              {activeRoom.code}
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(activeRoom.code);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Kodni nusxaladingiz!' : 'Kodni nusxalash'}</span>
            </button>
          </div>

          {/* Players in Room */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Host */}
            <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-800 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white overflow-hidden mx-auto mb-2 flex items-center justify-center font-bold text-sm">
                {activeRoom.hostAvatar ? (
                  <img src={activeRoom.hostAvatar} alt={activeRoom.hostName} className="w-full h-full object-cover" />
                ) : (
                  <span>{activeRoom.hostName.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {activeRoom.hostName}
              </div>
              <span className="text-[10px] text-blue-600 font-semibold block">Xona egasi ({activeRoom.hostGrade})</span>
            </div>

            {/* Guest */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              activeRoom.guestId
                ? 'border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-800'
                : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850'
            }`}>
              {activeRoom.guestId ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white overflow-hidden mx-auto mb-2 flex items-center justify-center font-bold text-sm">
                    {activeRoom.guestAvatar ? (
                      <img src={activeRoom.guestAvatar} alt={activeRoom.guestName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{activeRoom.guestName?.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {activeRoom.guestName}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Ulandi ({activeRoom.guestGrade})</span>
                </>
              ) : (
                <div className="py-2">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 mx-auto mb-2 flex items-center justify-center text-slate-400 animate-pulse">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium block">
                    Do'st ulanishi kutilmoqda...
                  </span>
                </div>
              )}
            </div>
          </div>

          {activeRoom.guestId ? (
            <button
              onClick={handleStartMatch}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer animate-bounce"
            >
              <Swords className="w-5 h-5" />
              Ikkala o'quvchi tayyor! Duelni boshlash
            </button>
          ) : (
            <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Boshqa oynada yoki boshqa telefonda kod kiritilishini kuting...</span>
            </div>
          )}
        </div>
      )}

      {/* 5. ACTIVE BATTLE STAGE */}
      {activeMode === 'room_battle' && activeRoom && currentQ && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
          {/* Top Scoreboard */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              {/* Host Player */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white overflow-hidden flex items-center justify-center font-bold text-xs shrink-0">
                  {activeRoom.hostAvatar ? (
                    <img src={activeRoom.hostAvatar} alt={activeRoom.hostName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{activeRoom.hostName.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {activeRoom.hostName} {isHost ? '(Siz)' : ''}
                  </div>
                  <div className="text-xs font-mono font-bold text-blue-600">
                    {activeRoom.hostScore} ball
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-mono text-base font-extrabold ${
                  timeLeft <= 3 
                    ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-950 animate-pulse' 
                    : 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-950'
                }`}>
                  {timeLeft}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                  Savol {activeRoom.currentQIndex + 1}/5
                </span>
              </div>

              {/* Guest Player */}
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {activeRoom.guestName} {!isHost ? '(Siz)' : ''}
                  </div>
                  <div className="text-xs font-mono font-bold text-indigo-600">
                    {activeRoom.guestScore} ball
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white overflow-hidden flex items-center justify-center font-bold text-xs shrink-0">
                  {activeRoom.guestAvatar ? (
                    <img src={activeRoom.guestAvatar} alt={activeRoom.guestName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{activeRoom.guestName?.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Live comparative bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
              <div 
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${(activeRoom.hostScore + 1) / (activeRoom.hostScore + activeRoom.guestScore + 2) * 100}%` }}
              />
              <div 
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${(activeRoom.guestScore + 1) / (activeRoom.hostScore + activeRoom.guestScore + 2) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Fan: {currentQ.subject}
              </span>
              <span>Qiymati: +{currentQ.points} ball</span>
            </div>

            <h3 className="font-display font-semibold text-base sm:text-lg text-slate-900 dark:text-white mb-6 leading-snug">
              {currentQ.question}
            </h3>

            {/* 4 Options (RANDOMIZED & DISTRIBUTED - Requirement 1) */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelectedByMe = myAnswer === idx;
                const isCorrectAnswer = idx === currentQ.correctIndex;

                let btnStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100';

                if (activeRoom.roundOver) {
                  if (isCorrectAnswer) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
                  } else if (isSelectedByMe && !isCorrectAnswer) {
                    btnStyle = 'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200';
                  }
                } else if (isSelectedByMe) {
                  btnStyle = 'border-blue-600 bg-blue-100 dark:bg-blue-950 text-blue-900 font-semibold ring-2 ring-blue-500';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={myAnswer !== null || activeRoom.roundOver}
                    onClick={() => handleAnswerSubmit(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer disabled:cursor-not-allowed ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {activeRoom.roundOver && isCorrectAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {activeRoom.roundOver && isSelectedByMe && !isCorrectAnswer && (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Waiting for opponent indicator */}
            {myAnswer !== null && !activeRoom.roundOver && (
              <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin shrink-0" />
                <span>Siz javob berdingiz! Do'stingiz javobi kutilmoqda...</span>
              </div>
            )}

            {/* Explanation when round over */}
            {activeRoom.roundOver && (
              <div className="mt-5 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300">
                <div className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  Izoh:
                </div>
                {currentQ.explanation}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. BATTLE RESULT */}
      {activeMode === 'room_result' && activeRoom && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-lg animate-fadeIn">
          {activeRoom.winnerId === currentUser?.id ? (
            <div>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-3xl mb-4 shadow-sm">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mb-1">
                G'ALABA QOZONDINGIZ!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Do'stingiz ustidan g'alaba qozonib mukofotlarga ega bo'ldingiz!
              </p>
            </div>
          ) : activeRoom.winnerId === 'draw' ? (
            <div>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center text-3xl mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-1">
                Durang Natija!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Ikkala o'quvchi teng kuchli bilim ko'rsatdi!
              </p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center text-3xl mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-1">
                Ajoyib Bellashuv!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Bu safar do'stingiz ilgarilab ketdi. Qaytadan duel oching!
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 mb-6">
            <div>
              <div className="text-xs text-slate-500">{activeRoom.hostName}</div>
              <div className="text-2xl font-bold font-mono text-blue-600">
                {activeRoom.hostScore}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{activeRoom.guestName}</div>
              <div className="text-2xl font-bold font-mono text-indigo-600">
                {activeRoom.guestScore}
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 mb-6 font-semibold flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> +{activeRoom.winnerId === currentUser?.id ? 80 : 30} Coin
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> +{activeRoom.winnerId === currentUser?.id ? 120 : 50} XP
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveMode('create_room')}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm cursor-pointer"
            >
              Yangi duel ochish
            </button>
            <button
              onClick={() => {
                setActiveRoom(null);
                setActiveMode('hub');
              }}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer"
            >
              Menyuga
            </button>
          </div>
        </div>
      )}

      {/* 7. MATH SPEED RACE (SOLO ARITHMETIC PRACTICE) */}
      {activeMode === 'math_race' && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-lg text-center animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs sm:text-sm">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{mathStreak} Streak</span>
            </div>

            <div className={`px-4 py-1.5 rounded-full font-mono font-bold text-xs sm:text-sm ${
              mathTimeLeft <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-700'
            }`}>
              ⏱️ {mathTimeLeft}s
            </div>

            <div className="font-mono font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {mathScore} Ball
            </div>
          </div>

          <div className="py-8 bg-slate-50 dark:bg-slate-800/80 rounded-2xl mb-6">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">
              Hisoblang:
            </span>
            <div className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-wide">
              {mathProblem.question} = ?
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {mathProblem.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleMathAnswer(opt)}
                className="py-4 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-xl font-mono text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-all cursor-pointer active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={endMathRace}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
          >
            To'xtatish
          </button>
        </div>
      )}

      {/* 8. MATH RESULT */}
      {activeMode === 'math_result' && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-lg animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-2xl mb-4">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mb-1">
            Vaqt Tugadi!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Arifmetika natijangiz:
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 mb-6 space-y-2">
            <div className="text-xs text-slate-500">Jami Ball</div>
            <div className="text-3xl font-extrabold font-mono text-amber-600">
              {mathResult.score}
            </div>
            <div className="text-xs text-slate-500">
              Maksimal to'g'ri ketma-ketlik (Streak): <strong>{mathResult.maxStreak} ta</strong>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 mb-6 font-semibold flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> +{mathResult.coinsWon} Coin
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> +{mathResult.xpWon} XP
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startMathRace}
              className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs sm:text-sm cursor-pointer"
            >
              Qayta o'ynash
            </button>
            <button
              onClick={() => setActiveMode('hub')}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer"
            >
              Menyuga
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
