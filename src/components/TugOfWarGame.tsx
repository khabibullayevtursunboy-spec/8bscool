import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { Zap, Trophy, Flame, RotateCcw, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface TugOfWarProps {
  currentUser: User | null;
  onUserStatsUpdated: () => void;
}

export const TugOfWarGame: React.FC<TugOfWarProps> = ({ currentUser, onUserStatsUpdated }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [ropePosition, setRopePosition] = useState(0); // -5 (Bot yutmoqda) dan +5 (O'quvchi yutmoqda) gacha, 0 - o'rtada
  const [score, setScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'bot' | null>(null);

  // Misol holati
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState('+');
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');

  // Yangi misol generatsiya qilish
  const generateQuestion = () => {
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1 = Math.floor(Math.random() * 50) + 10;
    let n2 = Math.floor(Math.random() * 50) + 10;

    if (op === '-' && n1 < n2) {
      // Manfiy chiqmasligi uchun almashtiramiz
      [n1, n2] = [n2, n1];
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(op);
    setUserAnswer('');
  };

  const startGame = () => {
    setGameStarted(true);
    setRopePosition(0);
    setScore(0);
    setBotScore(0);
    setGameOver(false);
    setWinner(null);
    generateQuestion();
  };

  // Bot vaqti-vaqti bilan o'quvchiga qarshi arqonni tortib turadi
  useEffect(() => {
    let botInterval: any = null;
    if (gameStarted && !gameOver) {
      botInterval = setInterval(() => {
        // Bot har 3 sekundda bir harakat qilishi mumkin
        setRopePosition(prev => {
          const nextPos = prev - 1;
          if (nextPos <= -5) {
            setGameOver(true);
            setWinner('bot');
          }
          return nextPos;
        });
        setBotScore(prev => prev + 1);
      }, 4000);
    }
    return () => clearInterval(botInterval);
  }, [gameStarted, gameOver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameOver) return;

    const correctAns = operator === '+' ? num1 + num2 : num1 - num2;

    if (parseInt(userAnswer) === correctAns) {
      // To'g'ri javob - O'quvchi arqonni tortadi
      setMessage('To‘g‘ri! 🦾');
      setScore(prev => prev + 1);

      setRopePosition(prev => {
        const nextPos = prev + 2; // To'g'ri javob uchun ko'proq siljiydi
        if (nextPos >= 5) {
          setGameOver(true);
          setWinner('player');
          // Mukofot berish
          if (currentUser) {
            StorageService.addCoinsAndXp(currentUser.id, 30, 40);
            onUserStatsUpdated();
          }
        }
        return nextPos;
      });

      generateQuestion();
    } else {
      setMessage('Xato! ❌');
      setUserAnswer('');
    }
  };

  if (!gameStarted) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-3xl mx-auto text-center">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white border border-white/20 shadow-2xl space-y-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Flame className="w-10 h-10 text-yellow-200 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Mental Arifmetika: Arqon Tortish
            </h2>
            <p className="text-sm sm:text-base text-amber-100 max-w-lg mx-auto font-medium">
              Tezkor hisoblang, botni yeng va arqonni o‘z tomoningizga tortib sovrinlarni qo‘lga kiriting!
            </p>
          </div>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-white text-orange-600 font-black rounded-2xl shadow-lg hover:bg-amber-50 transition-all cursor-pointer active:scale-95 text-base"
          >
            O'yinni Boshlash 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-3xl mx-auto">
      {/* O'yin paneli va Vizual Arqon */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
        
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="text-blue-600 dark:text-blue-400 font-bold">👤 Siz (Ball: {score})</span>
          <span className="font-mono uppercase tracking-widest text-amber-500">Tug-of-War Battle</span>
          <span className="text-rose-600 dark:text-rose-400 font-bold">🤖 Bot (Ball: {botScore})</span>
        </div>

        {/* Arqon tortish vizual chizig'i */}
        <div className="relative w-full h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center px-4 shadow-inner">
          <div className="absolute inset-y-0 left-1/2 w-1 bg-amber-500/50 -translate-x-1/2 z-0" />
          
          {/* Harakatlanuvchi tugun / bayroqcha */}
          <div 
            className="absolute transition-all duration-300 z-10 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-md"
            style={{ left: `calc(50% + ${ropePosition * 8}%)` }}
          >
            ⚡
          </div>

          <div className="w-full flex justify-between text-xs font-bold text-slate-400 z-0">
            <span>&larr; Bot tomoni</span>
            <span>Sizning tomoningiz &rarr;</span>
          </div>
        </div>

        {gameOver ? (
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-inner ${
              winner === 'player' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
            }`}>
              <Trophy className="w-12 h-12 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {winner === 'player' ? 'Tabriklaymiz, Siz G‘olib Bo‘ldingiz! 🎉' : 'Bot g‘olib chiqdi! Yana harakat qilib ko‘ring 🤖'}
              </h3>
              {winner === 'player' && (
                <p className="text-xs text-amber-600 font-bold">
                  Mukofot: +30 Coin, +40 XP qo'shildi!
                </p>
              )}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Qaytadan o'ynash
              </button>
              <button
                onClick={() => setGameStarted(false)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
              >
                Chiqish
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-6 text-center">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <span className="text-xs font-extrabold text-amber-500 uppercase tracking-wider">Tezkor Hisob-kitob</span>
              <div className="font-mono font-black text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-wider">
                {num1} {operator} {num2} = ?
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Javobni kiriting..."
                  autoFocus
                  className="flex-1 px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white text-center outline-none focus:border-amber-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer active:scale-95"
                >
                  Kiritish
                </button>
              </form>
              {message && <p className="text-xs font-bold text-amber-500 animate-pulse">{message}</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};