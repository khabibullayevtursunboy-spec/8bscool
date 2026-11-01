import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { UZBEK_LANGUAGE_TESTS } from '../data/uzbekLanguageTests';
import {
  BookOpen,
  Clock,
  Trophy,
  CheckCircle2,
  ArrowLeft,
  Play,
  Sparkles,
  RefreshCw,
  XCircle
} from 'lucide-react';

interface TestsSectionProps {
  currentUser: User | null;
  onUserStatsUpdated: () => void;
}

type GradeQuestion = (typeof UZBEK_LANGUAGE_TESTS)[keyof typeof UZBEK_LANGUAGE_TESTS][number];

const SESSION_SIZE = 25;          // bir urinishdagi eng ko'p savol
const SECONDS_PER_QUESTION = 36;  // 25 ta savol = 15 daqiqa
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/* ---------- Foydalanuvchi to'g'ri yechgan savollarni eslab qolish ---------- */
const solvedStorageKey = (userId: unknown) => `tests_solved_${String(userId ?? 'guest')}`;

// Savol matni bo'yicha kalit: savollar tartibi o'zgarsa ham yechilganlar saqlanib qoladi
const questionKey = (grade: string, q: GradeQuestion) => `${grade}|${q.question}`;

const getSolvedSet = (userId: unknown): Set<string> => {
  try {
    const raw = localStorage.getItem(solvedStorageKey(userId));
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set<string>();
  }
};

const saveSolved = (userId: unknown, keys: string[]) => {
  try {
    const set = getSolvedSet(userId);
    keys.forEach((k) => set.add(k));
    localStorage.setItem(solvedStorageKey(userId), JSON.stringify(Array.from(set)));
  } catch {
    /* localStorage yopiq bo'lsa e'tibor bermaymiz */
  }
};

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const TestsSection: React.FC<TestsSectionProps> = ({ currentUser, onUserStatsUpdated }) => {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [session, setSession] = useState<GradeQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<{
    correct: number;
    wrong: number;
    coins: number;
    xp: number;
    remaining: number;
  } | null>(null);

  const userId = currentUser?.id;

  // Sinf bo'yicha: jami, yechilgan va qolgan savollar
  const getGradeStats = (grade: string) => {
    const all = UZBEK_LANGUAGE_TESTS[grade] || [];
    const solved = getSolvedSet(userId);
    const remaining = all.filter((q) => !solved.has(questionKey(grade, q))).length;
    return { total: all.length, remaining, solved: all.length - remaining };
  };

  const startTest = (grade: string) => {
    const all = UZBEK_LANGUAGE_TESTS[grade] || [];
    const solved = getSolvedSet(userId);
    // Faqat hali to'g'ri yechilmagan savollar (xato yechilganlar ham shu ichida)
    const pool = all.filter((q) => !solved.has(questionKey(grade, q)));
    if (pool.length === 0) return;

    const picked = shuffle(pool).slice(0, SESSION_SIZE);
    setSession(picked);
    setSelectedGrade(grade);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
    setResult(null);
    setTimeLeft(picked.length * SECONDS_PER_QUESTION);
  };

  const handleSelectOption = (qIndex: number, optionIndex: number) => {
    if (isFinished) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmitTest = () => {
    if (isFinished || !selectedGrade) return;

    let correct = 0;
    const solvedNow: string[] = [];
    session.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
        solvedNow.push(questionKey(selectedGrade, q));
      }
    });

    // To'g'ri javoblar endi bu foydalanuvchiga qayta chiqmaydi
    if (solvedNow.length > 0) saveSolved(userId, solvedNow);

    const coins = correct * 10;
    const xp = correct * 15;
    if (currentUser && correct > 0) {
      StorageService.addCoinsAndXp(currentUser.id, coins, xp);
      onUserStatsUpdated();
    }

    setResult({
      correct,
      wrong: session.length - correct,
      coins,
      xp,
      remaining: getGradeStats(selectedGrade).remaining
    });
    setIsFinished(true);
  };

  // Taymer: har soniyada 1 ga kamayadi
  useEffect(() => {
    if (!selectedGrade || isFinished) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [selectedGrade, isFinished]);

  // Vaqt tugasa test avtomatik yakunlanadi (har renderdagi eng yangi javoblar bilan)
  useEffect(() => {
    if (selectedGrade && !isFinished && session.length > 0 && timeLeft <= 0) {
      handleSubmitTest();
    }
  }, [timeLeft, selectedGrade, isFinished, session.length]);

  const formatTime = (seconds: number) => {
    const s = Math.max(0, seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /* ===================== SINFLAR TANLASH OYNASI ===================== */
  if (!selectedGrade) {
    const grades = Object.keys(UZBEK_LANGUAGE_TESTS);
    const stats = grades.map((g) => ({ grade: g, ...getGradeStats(g) }));
    const allDone = stats.length > 0 && stats.every((s) => s.remaining === 0);

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
              To'g'ri yechilgan savollar qayta chiqmaydi, xato yechilganlari esa keyingi safar yana
              uchraydi. Har to'g'ri javob uchun Coin va XP olasiz.
            </p>
          </div>
        </div>

        {allDone && (
          <div className="neon-card p-6 sm:p-8 text-center animate-pop">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white grid place-items-center shadow-xl shadow-orange-500/30 animate-float mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
              Barcha testlarni yechdingiz! 🎉
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5">
              Admin yangi test qo'shishini kuting.
            </p>
          </div>
        )}

        <div className="stagger grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map(({ grade, total, solved, remaining }) => {
            const done = remaining === 0;
            const sessionCount = Math.min(remaining, SESSION_SIZE);
            const minutes = Math.ceil((sessionCount * SECONDS_PER_QUESTION) / 60);

            return (
              <div key={grade} className="game-card p-6 flex flex-col justify-between group">
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                    done ? 'from-emerald-500 via-teal-400 to-emerald-500' : 'from-blue-500 via-indigo-400 to-purple-500'
                  }`}
                />

                <div>
                  <div
                    className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${
                      done
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30'
                    }`}
                  >
                    {done ? <CheckCircle2 className="w-7 h-7" /> : <BookOpen className="w-7 h-7" />}
                  </div>

                  <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                    {grade} - Ona tili
                  </h3>

                  {/* Jarayon */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>Yechilgan savollar</span>
                      <span className="font-mono">{solved} / {total}</span>
                    </div>
                    <div className="xp-bar">
                      <span style={{ width: `${total ? (solved / total) * 100 : 0}%` }} />
                    </div>
                  </div>

                  {done ? (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed mb-6 font-bold">
                      ✅ Bu sinf testlarini to'liq yechdingiz. Admin yangi test qo'shishini kuting.
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-6">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Vaqt: {minutes} daqiqa</span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span>{sessionCount} ta savol</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => startTest(grade)}
                  disabled={done}
                  className={
                    done
                      ? 'w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed'
                      : 'btn-gradient w-full !py-3 !text-xs'
                  }
                >
                  {done ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Hammasi yechilgan</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{solved > 0 ? 'Qolganlarini Ishlash' : 'Testni Boshlash'}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ===================== TEST OYNASI ===================== */
  const currentQ = session[currentQIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const lowTime = timeLeft <= 60 && !isFinished;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-3xl mx-auto">
      <div className="game-card flex items-center justify-between p-4">
        <button
          onClick={() => setSelectedGrade(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sinflarga qaytish</span>
        </button>

        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono font-bold text-xs border ${
            lowTime
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-soft-pulse'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Qolgan vaqt: {formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="neon-card p-6 sm:p-8 space-y-6">
        {isFinished && result ? (
          <div className="py-6 text-center space-y-5 animate-fadeIn">
            <div
              className={`w-20 h-20 rounded-3xl text-white flex items-center justify-center mx-auto shadow-xl animate-pop ${
                result.correct > 0
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30'
                  : 'bg-gradient-to-br from-slate-500 to-slate-700 shadow-slate-500/30'
              }`}
            >
              <Trophy className="w-10 h-10" />
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Test yakunlandi! 🎯
            </h3>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="game-card p-4">
                <div className="flex items-center justify-center gap-1.5 font-display font-black text-3xl text-emerald-500">
                  <CheckCircle2 className="w-6 h-6" /> {result.correct}
                </div>
                <div className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                  TO'G'RI
                </div>
              </div>
              <div className="game-card p-4">
                <div className="flex items-center justify-center gap-1.5 font-display font-black text-3xl text-rose-500">
                  <XCircle className="w-6 h-6" /> {result.wrong}
                </div>
                <div className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                  XATO / JAVOBSIZ
                </div>
              </div>
            </div>

            {result.correct > 0 && (
              <div className="animate-pop inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm font-black text-amber-700 dark:text-amber-300">
                Mukofot: +{result.coins} Coin, +{result.xp} XP qo'shildi!
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
              {result.remaining === 0
                ? "🎉 Bu sinf bo'yicha barcha testlarni yechdingiz! Admin yangi test qo'shishini kuting."
                : result.wrong > 0
                ? `🔁 Xato yoki javobsiz ${result.wrong} ta savol keyingi safar yana chiqadi. Jami ${result.remaining} ta savol qoldi.`
                : `Yana ${result.remaining} ta savol qoldi.`}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {result.remaining > 0 && (
                <button onClick={() => startTest(selectedGrade)} className="btn-gradient">
                  <RefreshCw className="w-4 h-4" />
                  Qolganlarini ishlash
                </button>
              )}
              <button
                onClick={() => setSelectedGrade(null)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95"
              >
                Boshqa sinfni tanlash
              </button>
            </div>
          </div>
        ) : (
          currentQ && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                  <span>Savol {currentQIndex + 1} / {session.length}</span>
                  <span className="text-blue-600 dark:text-blue-400">{selectedGrade} Ona tili</span>
                </div>
                <div className="xp-bar">
                  <span style={{ width: `${(answeredCount / session.length) * 100}%` }} />
                </div>
                <div className="text-[11px] font-bold text-slate-400 mt-1.5">
                  Javob berilgan: {answeredCount} / {session.length}
                </div>
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
                      className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer active:scale-[.99] ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-500/25 -translate-y-0.5'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:-translate-y-0.5'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg grid place-items-center text-[11px] font-black shrink-0 ${
                            isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {OPTION_LETTERS[idx] ?? idx + 1}
                        </span>
                        <span>{option}</span>
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Oldingi
                </button>

                {currentQIndex < session.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex((prev) => prev + 1)}
                    className="btn-gradient !py-2.5 !px-6 !text-xs"
                  >
                    Keyingi
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95 transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Testni Yakunlash</span>
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};