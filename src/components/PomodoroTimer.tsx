import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { 
  Timer, Play, Pause, RotateCcw, Sparkles, Coffee, BookOpen, 
  Settings, Volume2, VolumeX, CheckCircle2, Award, Zap 
} from 'lucide-react';

interface PomodoroTimerProps {
  currentUser: User | null;
  onUserStatsUpdated: () => void;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface ModeConfig {
  label: string;
  duration: number; // sekundlarda
  color: string;
  gradient: string;
  ringColor: string;
  bgLight: string;
  icon: React.ReactNode;
  subtitle: string;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ currentUser, onUserStatsUpdated }) => {
  const [mode, setMode] = useState<TimerMode>('work');
  
  // Daqiqalar sozlamasi (default: 25, 5, 15)
  const [durations, setDurations] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15
  });

  const [timeLeft, setTimeLeft] = useState<number>(durations.work * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [taskName, setTaskName] = useState<string>('Maktab darslari / Uy vazifasi');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Audio ob'ekti
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Beep ovozi uchun audio tayyorlash
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  }, []);

  const modeConfigs: Record<TimerMode, ModeConfig> = {
    work: {
      label: 'Diqqat',
      duration: durations.work * 60,
      color: 'rose',
      gradient: 'from-rose-500 via-pink-500 to-red-600',
      ringColor: '#f43f5e',
      bgLight: 'bg-rose-50/50 dark:bg-rose-950/20',
      icon: <BookOpen className="w-4 h-4" />,
      subtitle: '📚 Diqqatni jamlab o‘qish vaqti',
    },
    shortBreak: {
      label: 'Qisqa tanaffus',
      duration: durations.shortBreak * 60,
      color: 'emerald',
      gradient: 'from-emerald-500 via-teal-500 to-green-600',
      ringColor: '#10b981',
      bgLight: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      icon: <Coffee className="w-4 h-4" />,
      subtitle: '☕ Ozgina dam oling, vizual xotirani tiklang',
    },
    longBreak: {
      label: 'Uzoq tanaffus',
      duration: durations.longBreak * 60,
      color: 'indigo',
      gradient: 'from-indigo-500 via-purple-500 to-blue-600',
      ringColor: '#6366f1',
      bgLight: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      icon: <Sparkles className="w-4 h-4" />,
      subtitle: '🌟 Chuqur hordiq chiqaring va energiyaga to‘ling',
    },
  };

  const currentConfig = modeConfigs[mode];

  // Mode yoki durations o'zgarganda vaqtni yangilash
  useEffect(() => {
    setTimeLeft(durations[mode] * 60);
    setIsRunning(false);
  }, [mode, durations]);

  // Taymer logikasi
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);

      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      if (mode === 'work') {
        setCompletedSessions(prev => prev + 1);
        if (currentUser) {
          StorageService.addCoinsAndXp(currentUser.id, 15, 20);
          onUserStatsUpdated();
        }
        alert('🎉 Tabriklaymiz! Diqqat sessiyasi yakunlandi! +15 Coin, +20 XP berildi!');
      } else {
        alert('🚀 Dam olish vaqti tugadi! Yangi marralar sari al g‘alaba!');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, currentUser, onUserStatsUpdated, soundEnabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = durations[mode] * 60;
  const progressPercentage = ((totalDuration - timeLeft) / totalDuration) * 100;
  const strokeDashoffset = 502 - (502 * progressPercentage) / 100;

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn px-2 sm:px-0">
      
      {/* Banner Card */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r ${currentConfig.gradient} text-white shadow-2xl transition-all duration-500`}>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-sm">
              <Timer className="w-3.5 h-3.5" />
              <span>Samaradorlik Klubi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
              Pomodoro Taymer
            </h2>
            <p className="text-xs sm:text-sm text-white/80 font-medium">
              Vaqtingizni to‘g‘ri boshqaring va har bir sessiyada mukofotlar yuting!
            </p>
          </div>

          {/* Stats Badge */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-inner">
            <div className="p-2 bg-white/20 rounded-xl text-yellow-300">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider font-bold text-white/70">Bajarildi</div>
              <div className="text-lg font-black text-white">{completedSessions} ta sessiya</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Timer Container */}
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
        
        {/* Controls header (Sound, Settings) */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isRunning ? 'Jarayonda...' : 'Tayyor'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              title={soundEnabled ? 'Ovozni o‘chirish' : 'Ovozni yoqish'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              title="Sozlamalar"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Settings Panel (Collapsible) */}
        {showSettings && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Vaqt sozlamalari (Daqiqa)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Diqqat</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={durations.work}
                  onChange={(e) => setDurations({ ...durations, work: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-center font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Qisqa break</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={durations.shortBreak}
                  onChange={(e) => setDurations({ ...durations, shortBreak: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-center font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Uzoq break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={durations.longBreak}
                  onChange={(e) => setDurations({ ...durations, longBreak: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-center font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 mb-8">
          {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => {
            const isSelected = mode === m;
            const cfg = modeConfigs[m];
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isSelected
                    ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-md scale-[1.02]`
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cfg.icon}
                <span className="hidden sm:inline">{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Task Input */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Masalan: Fizikadan 10 ta masala yechish..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm font-medium text-slate-900 dark:text-white text-center outline-none focus:ring-2 focus:ring-rose-500/50 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Circular Progress Timer Display */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
            {/* SVG Circle Progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
              {/* Background Track */}
              <circle
                cx="90"
                cy="90"
                r="80"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="90"
                cy="90"
                r="80"
                stroke={currentConfig.ringColor}
                strokeWidth="10"
                strokeDasharray="502"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center space-y-1">
              <div className="font-mono font-black text-5xl sm:text-6xl tracking-tight text-slate-900 dark:text-white">
                {formatTime(timeLeft)}
              </div>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 max-w-[140px]">
                {currentConfig.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Action Control Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-4 rounded-2xl font-black text-sm text-white shadow-xl transition-all transform active:scale-95 flex items-center gap-2.5 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : `bg-gradient-to-r ${currentConfig.gradient} hover:opacity-95 shadow-rose-500/20`
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>To'xtatib turish</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white ml-0.5" />
                <span>Boshlash</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(durations[mode] * 60);
            }}
            className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
            title="Qayta boshlash"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Reward Info Badge */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Mukofot: <strong>+15 Coin</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Tajriba: <strong>+20 XP</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};