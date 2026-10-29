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
  Clock 
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
          setTimeLeftStr(`${hours} soat ${minutes} daq ${seconds} son`);
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
    const correctLetter = ['A', 'B', 'C', 'D'][currentQ.correctIndex];
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

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-700 text-white border border-white/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-yellow-100">
              <Trophy className="w-3.5 h-3.5 text-yellow-300" />
              <span>Intellektual Shou</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Kim Millioner?
            </h2>
            <p className="text-xs sm:text-sm text-yellow-100/90 font-medium">
              5-qadamga yetib keling va bosh mukofotni qo'lga kiriting!
            </p>
          </div>

          <div className="flex sm:flex-col gap-1.5 bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            {PRIZE_LADDER.slice().reverse().map((item, idx) => {
              const actualIdx = PRIZE_LADDER.length - 1 - idx;
              const isActive = actualIdx === currentLevel;
              const isPassed = actualIdx < currentLevel;

              return (
                <div 
                  key={item.level}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center justify-between gap-4 transition-all ${
                    isActive ? 'bg-yellow-500 text-slate-950 scale-105 shadow-md' :
                    isPassed ? 'bg-emerald-500/20 text-emerald-300 line-through' : 'text-yellow-200/60'
                  }`}
                >
                  <span>{item.level}-Bosqich</span>
                  <span>+{item.prize} Coin</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 8 SOATGA BLOKLANGAN XABARI */}
      {isLocked ? (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">
            Siz 5-qadamga yetib keldingiz! 🏆
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto">
            Bosh mukofotni yutib olganingiz uchun o'yin 8 soatga vaqtincha yopildi. Taymer tugagach, qayta o'ynashingiz mumkin.
          </p>
          <div className="inline-block px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-600 dark:text-amber-400 font-mono font-bold text-sm">
            Qayta ochilish vaqti: {timeLeftStr}
          </div>
        </div>
      ) : (
        <>
          {/* Lifelines (Yordamchilar) */}
          {!gameOver && !gameWon && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleFiftyFifty}
                disabled={fiftyFiftyUsed || isAnswered}
                className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 disabled:opacity-40 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>50 / 50</span>
              </button>

              <button
                onClick={handleAudienceHelp}
                disabled={!!audienceHelp || isAnswered}
                className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 disabled:opacity-40 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Zal Yordami</span>
              </button>
            </div>
          )}

          {audienceHelp && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold text-center animate-fadeIn">
              💡 {audienceHelp}
            </div>
          )}

          {/* O'yin Kartasi */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative">
            {gameOver ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <XCircle className="w-10 h-10" />
                </div>
                <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                  O'yin tugadi! Xato javob berdingiz.
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Harakatni to'xtatmang, yana bir bor urinib ko'ring!
                </p>
                <button
                  onClick={restartGame}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-xl shadow-md hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Qaytadan o'ynash
                </button>
              </div>
            ) : gameWon ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Trophy className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                  Tabriklaymiz! Siz 5-qadamga yetdingiz! 🏆
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Hisobingizga <span className="text-amber-500 font-bold">+{PRIZE_LADDER[PRIZE_LADDER.length - 1].prize} Coin</span> va <span className="text-blue-500 font-bold">+{PRIZE_LADDER[PRIZE_LADDER.length - 1].xp} XP</span> qo'shildi!
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                  O'yin 8 soatga yopildi.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg">
                    Fan: {currentQ.subject}
                  </span>
                  <span className="font-mono">
                    Daraja: {currentLevel + 1} / {PRIZE_LADDER.length}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQ.options.map((opt, idx) => {
                    if (hiddenOptions.includes(idx)) {
                      return <div key={idx} className="p-4 rounded-xl opacity-0 pointer-events-none" />;
                    }

                    const isSelected = selectedOpt === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-amber-500';
                    if (isAnswered) {
                      if (isCorrect) btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-md';
                      else if (isSelected && !isCorrect) btnStyle = 'bg-rose-500 text-white border-rose-600';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleAnswer(idx)}
                        className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
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