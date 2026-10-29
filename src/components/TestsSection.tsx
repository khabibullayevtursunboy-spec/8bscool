import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { UZBEK_LANGUAGE_TESTS } from '../data/uzbekLanguageTests';
import { BookOpen, Clock, Trophy, CheckCircle2, ArrowLeft, Play, Sparkles } from 'lucide-react';

interface TestsSectionProps {
  currentUser: User | null;
  onUserStatsUpdated: () => void;
}

export const TestsSection: React.FC<TestsSectionProps> = ({ currentUser, onUserStatsUpdated }) => {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);

  const questions = selectedGrade ? UZBEK_LANGUAGE_TESTS[selectedGrade] || [] : [];

  // Taymer logikasi
  useEffect(() => {
    let timer: any = null;
    if (selectedGrade && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedGrade, isFinished, timeLeft]);

  const startTest = (grade: string) => {
    setSelectedGrade(grade);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
    setTimeLeft(15 * 60); // 25 ta savol uchun 15 daqiqa
  };

  const handleSelectOption = (qIndex: number, optionIndex: number) => {
    if (isFinished) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmitTest = () => {
    let correctCount = 0;

    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsFinished(true);

    if (currentUser && correctCount > 0) {
      const earnedCoins = correctCount * 10;
      const earnedXp = correctCount * 15;
      StorageService.addCoinsAndXp(currentUser.id, earnedCoins, earnedXp);
      onUserStatsUpdated();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sinflar tanlash oynasi
  if (!selectedGrade) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white border border-white/20 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-blue-100">
              <BookOpen className="w-3.5 h-3.5 text-blue-300" />
              <span>Ona tili Fan Testlari</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Sinfingizni tanlang va bilimingizni sinang!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium max-w-xl">
              6, 7 va 8-sinflar uchun 25 talik testlarni ishlab, Coin va XP ballarini qo'lga kiriting.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Object.keys(UZBEK_LANGUAGE_TESTS).map(grade => (
            <div
              key={grade}
              className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-500/50 transition-all flex flex-col justify-between group hover:shadow-xl duration-300"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                  {grade} - Ona tili
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 font-medium">
                  Ushbu bo'limda {grade} o'quvchilari uchun 25 ta saralangan test savollari mavjud.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-6">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Vaqt: 15 daqiqa</span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <span>25 ta savol</span>
                </div>
              </div>

              <button
                onClick={() => startTest(grade)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Testni Boshlash</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-3xl mx-auto">
      <div className="flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
        <button
          onClick={() => setSelectedGrade(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sinflarga qaytish</span>
        </button>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs border border-amber-500/20">
          <Clock className="w-4 h-4" />
          <span>Qolgan vaqt: {formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {isFinished ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">
              Test yakunlandi! 🎯
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Siz <span className="text-blue-600 font-bold">{questions.length} ta</span> savoldan <span className="text-emerald-500 font-bold">{score} ta</span> to'g'ri javob topdingiz.
            </p>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-sm mx-auto text-xs font-bold text-amber-700 dark:text-amber-300">
              Mukofot: +{score * 10} Coin, +{score * 15} XP qo'shildi!
            </div>
            <button
              onClick={() => setSelectedGrade(null)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              Boshqa sinfni tanlash
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Savol {currentQIndex + 1} / {questions.length}</span>
              <span className="text-blue-600 dark:text-blue-400">{selectedGrade} Ona tili</span>
            </div>

            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQIndex, idx)}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500'
                    }`}
                  >
                    <span>{option}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Oldingi
              </button>

              {currentQIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Keyingi
                </button>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Testni Yakunlash</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};