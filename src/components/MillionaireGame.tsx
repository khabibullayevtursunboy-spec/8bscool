import React, { useState, useEffect } from 'react';
import { User, TestQuestion } from '../types';
import { StorageService } from '../services/storage';
import { 
  Trophy, 
  HelpCircle, 
  RotateCcw, 
  ShieldAlert, 
  XCircle, 
  CheckCircle2, 
  Clock,
  Zap,
  Sparkles,
  Users
} from 'lucide-react';

interface MillionaireGameProps {
  currentUser: User | null;
  onUserStatsUpdated: () => void;
}

const PRIZE_LADDER = [
  { level: 1, prize: 50, xp: 40 },
  { level: 2, prize: 100, xp: 80 },
  { level: 3, prize: 200, xp: 150 },
  { level: 4, prize: 400, xp: 300 },
  { level: 5, prize: 800, xp: 600 }, // 5-qadam (Super mukofot)
];

const COOLDOWN_HOURS = 8; // 8 soatlik bloklash vaqti

export const MillionaireGame: React.FC<MillionaireGameProps> = ({ currentUser, onUserStatsUpdated }) => {
  const allQuestions = StorageService.getQuestions();
  
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Lifelines (Yordamchilar)
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [audienceHelp, setAudienceHelp] = useState<string | null>(null);

  // 8 soatlik cheklov uchun holatlar (states)
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');

  const getLockKey = () => `millionaire_locked_until_${currentUser?.id || 'guest'}`;

  // Bloklash vaqtini tekshirish va taymerni yangilab turish
  useEffect(() => {
    const checkLockStatus = () => {
      const lockUntil = localStorage.getItem(getLockKey());
      if (lockUntil) {
        const remainingMs = parseInt(lockUntil, 10) - Date.now();
        if (remainingMs > 0) {
          setIsLocked(true);
          const hours = Math.floor(remainingMs / (1000 * 60 * 60));
          const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
          setTimeLeftStr(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          localStorage.removeItem(getLockKey());
          setIsLocked(false);
        }
      } else {
        setIsLocked(false);
      }
    };

    checkLockStatus();
    const timer = setInterval(checkLockStatus, 1000);
    return () => clearInterval(timer);
  }, [currentUser]);

  // Joriy savolni olish
  const questionIndex = currentLevel % (allQuestions.length || 1);
  const currentQ: TestQuestion = allQuestions[questionIndex] || {
    id: '1',
    subject: 'Texnologiya',
    question: 'Tokarlik stanokida qismni yo‘nishda qaysi keskich ishlatiladi?',
    options: ['O‘tkir rezak', 'Pichoq', 'Arra', 'Bolg‘a'],
    correctIndex: 0,
    explanation: 'Tokarlik stanoklarida maxsus rezaklar (keskichlar) ishlatiladi.'
  };

  const handleAnswer = (index: number) => {
    if (isAnswered || gameOver || isLocked) return;
    setSelectedOpt(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      if (currentLevel === PRIZE_LADDER.length - 1) {
        // 5-qadam (Oxirgi bosqich) - Yutuq!
        setGameWon(true);
        
        // 8 soatga o'yinni bloklaymiz
        const unlockTime = Date.now() + COOLDOWN_HOURS * 60 * 60 * 1000;
        localStorage.setItem(getLockKey(), unlockTime.toString());
        setIsLocked(true);

        if (currentUser) {
          const reward = PRIZE_LADDER[currentLevel];
          StorageService.addCoinsAndXp(currentUser.id, reward.prize, reward.xp);
          onUserStatsUpdated();
        }
      } else {
        setTimeout(() => {
          setCurrentLevel(prev => prev + 1);
          setSelectedOpt(null);
          setIsAnswered(false);
          setHiddenOptions([]);
          setAudienceHelp(null);
        }, 1500);
      }
    } else {
      setGameOver(true);
    }
  };

  const handleFiftyFifty = () => {
    if (fiftyFiftyUsed || isAnswered || isLocked) return;
    setFiftyFiftyUsed(true);

    const wrongIndexes = currentQ.options
      .map((_, idx) => idx)
      .filter(idx => idx !== currentQ.correctIndex);

    const shuffledWrong = wrongIndexes.sort(() => 0.5 - Math.random());
    setHiddenOptions([shuffledWrong[0], shuffledWrong[1]]);
  };

  const handleAudienceHelp = () => {
    if (audienceHelp || isAnswered || isLocked) return;
    const optionLetters = ['A', 'B', 'C', 'D'];
    const correctLetter = optionLetters[currentQ.correctIndex];
    setAudienceHelp(`Zal muxlislarining 78%i "${correctLetter}" javobiga ovoz berishdi!`);
  };

  const restartGame = () => {
    if (isLocked) return;
    setCurrentLevel(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setGameOver(false);
    setGameWon(false);
    setFiftyFiftyUsed(false);
    setHiddenOptions([]);
    setAudienceHelp(null);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn max-w-4xl mx-auto px-2 sm:px-4 pb-12 select-none">
      
      {/* 3D Banner Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-5 sm:p-8 bg-gradient-to-b from-amber-500 via-amber-600 to-orange-700 text-white border-4 border-amber-300/40 shadow-[0_12px_35px_rgba(245,158,11,0.4)]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 sm:w-64 sm:h-64 bg-yellow-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-black/30 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-yellow-300/40 text-[11px] font-extrabold text-yellow-300 shadow-inner">
              <Trophy className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
              <span>3D INTELLEKTUAL ARENA</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              KIM MILLIONER?
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 font-bold max-w-xs sm:max-w-md">
              Barcha 5 ta bosqichni muvaffaqiyatli bosib o'ting va bosh mukofotni qo'lga kiriting!
            </p>
          </div>

          {/* Mobile & Desktop 3D Prize Ladder */}
          <div className="w-full sm:w-auto bg-black/40 backdrop-blur-xl p-3 rounded-2xl border border-yellow-400/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
            <div className="flex sm:flex-col gap-1.5 overflow-x-auto no-scrollbar py-0.5 justify-between">
              {PRIZE_LADDER.slice().reverse().map((item, idx) => {
                const actualIdx = PRIZE_LADDER.length - 1 - idx;
                const isActive = actualIdx === currentLevel;
                const isPassed = actualIdx < currentLevel;

                return (
                  <div 
                    key={item.level}
                    className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-black flex items-center justify-between gap-3 shrink-0 transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-slate-950 shadow-[0_4px_12px_rgba(250,204,21,0.5)] scale-105 border-2 border-white' 
                        : isPassed 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 line-through opacity-80' 
                        : 'bg-white/5 text-amber-200/50 border border-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      {item.level}-Bosqich
                    </span>
                    <span>+{item.prize} Coin</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 8 SOATGA BLOKLANGAN XABARI (3D Card) */}
      {isLocked ? (
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-4 border-amber-500/30 rounded-[2.5rem] p-6 sm:p-10 text-center space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-scaleUp">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-[0_10px_25px_rgba(245,158,11,0.4)] border-2 border-yellow-200">
            <Clock className="w-10 h-10 text-slate-950 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white drop-shadow-md">
              Siz 5-qadamga yetib keldingiz! 🏆
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
              Bosh mukofotni yutib olganingiz uchun arena 8 soatga vaqtincha yopildi. Taymer tugagach, yana ishtirok etishingiz mumkin!
            </p>
          </div>
          <div className="inline-block px-6 py-3.5 bg-slate-800/90 border-2 border-amber-500/50 rounded-2xl text-amber-400 font-mono font-black text-base shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
            Qayta ochilish: <span className="text-white tracking-widest">{timeLeftStr}</span>
          </div>
        </div>
      ) : (
        <>
          {/* Lifelines 3D Buttons */}
          {!gameOver && !gameWon && (
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={handleFiftyFifty}
                disabled={fiftyFiftyUsed || isAnswered}
                className="flex-1 max-w-[160px] py-3 px-4 rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-700 active:translate-y-1 active:shadow-[0_2px_0_#312e81] border-b-4 border-indigo-900 text-white font-black text-xs sm:text-sm transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 shadow-[0_6px_0_#312e81]"
              >
                <ShieldAlert className="w-4 h-4 text-indigo-200" />
                <span>50 / 50</span>
              </button>

              <button
                onClick={handleAudienceHelp}
                disabled={!!audienceHelp || isAnswered}
                className="flex-1 max-w-[160px] py-3 px-4 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-700 active:translate-y-1 active:shadow-[0_2px_0_#78350f] border-b-4 border-amber-900 text-white font-black text-xs sm:text-sm transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 shadow-[0_6px_0_#78350f]"
              >
                <Users className="w-4 h-4 text-amber-200" />
                <span>Zal Yordami</span>
              </button>
            </div>
          )}

          {audienceHelp && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold text-center shadow-lg animate-fadeIn">
              💡 {audienceHelp}
            </div>
          )}

          {/* Main 3D Game Stage Card */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-4 border-slate-800 rounded-[2.5rem] p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
            
            {gameOver ? (
              <div className="py-10 text-center space-y-5 animate-scaleUp">
                <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-3xl flex items-center justify-center mx-auto border-2 border-rose-500/40 shadow-[0_10px_25px_rgba(244,63,94,0.3)]">
                  <XCircle className="w-10 h-10 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                    O'yin tugadi!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">
                    Noto'g'ri javob berildi. Bilimingizni oshirib qayta urinib ko'ring!
                  </p>
                </div>
                <button
                  onClick={restartGame}
                  className="px-7 py-3.5 bg-gradient-to-b from-amber-400 to-orange-600 active:translate-y-1 border-b-4 border-orange-800 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-[0_6px_0_#9a3412] hover:brightness-110 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Qaytadan boshlash</span>
                </button>
              </div>
            ) : gameWon ? (
              <div className="py-10 text-center space-y-5 animate-scaleUp">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-3xl flex items-center justify-center mx-auto border-2 border-yellow-200 shadow-[0_10px_35px_rgba(250,204,21,0.5)]">
                  <Trophy className="w-10 h-10 text-slate-950 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                    G'ALABA! SIZ MILLIONER BO'LDINGIZ! 🏆
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    Hisobingizga <span className="text-yellow-400 font-black">+{PRIZE_LADDER[PRIZE_LADDER.length - 1].prize} Coin</span> va <span className="text-blue-400 font-black">+{PRIZE_LADDER[PRIZE_LADDER.length - 1].xp} XP</span> qo'shildi!
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-extrabold text-xs">
                  Arena 8 soatga yopildi. Keyingi o'yinlarda omad!
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Status Bar */}
                <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-3">
                  <span className="text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Fan: {currentQ.subject}
                  </span>
                  <span className="font-mono text-slate-400">
                    Bosqich: <span className="text-yellow-400 font-black">{currentLevel + 1}</span> / {PRIZE_LADDER.length}
                  </span>
                </div>

                {/* 3D Question Card */}
                <div className="p-5 sm:p-7 rounded-3xl bg-slate-800/80 border-2 border-slate-700/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                  <h3 className="font-display font-bold text-base sm:text-xl text-white leading-relaxed text-center sm:text-left">
                    {currentQ.question}
                  </h3>
                </div>

                {/* 3D Options Hexagon Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQ.options.map((opt, idx) => {
                    if (hiddenOptions.includes(idx)) {
                      return <div key={idx} className="h-14 sm:h-16 opacity-0 pointer-events-none" />;
                    }

                    const isSelected = selectedOpt === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let btn3DStyle = 'bg-slate-800/90 text-slate-200 border-b-4 border-slate-950 hover:border-amber-500 hover:text-white shadow-[0_4px_0_#020617]';
                    
                    if (isAnswered) {
                      if (isCorrect) {
                        btn3DStyle = 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-b-4 border-emerald-900 shadow-[0_4px_0_#064e3b] font-black scale-[1.02]';
                      } else if (isSelected && !isCorrect) {
                        btn3DStyle = 'bg-gradient-to-r from-rose-500 to-red-600 text-white border-b-4 border-rose-900 shadow-[0_4px_0_#881337]';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleAnswer(idx)}
                        className={`h-14 sm:h-16 p-4 rounded-2xl border border-slate-700/60 text-left text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center justify-between cursor-pointer active:translate-y-1 active:shadow-none ${btn3DStyle}`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isAnswered && isCorrect ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {optionLabels[idx]}
                          </span>
                          <span className="truncate">{opt}</span>
                        </div>
                        {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};