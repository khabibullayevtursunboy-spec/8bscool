import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { X, LogIn, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const AVATAR_OPTIONS = ['🚀', '⚡', '🎓', '🦁', '🌸', '👑', '🎯', '💡', '🦅', '🏆', '🔥', '🤖'];
const GRADE_OPTIONS = ['5-A', '5-B', '6-A', '6-B', '7-A', '7-B', '7-V', '8-A', '8-B', '8-V', '9-A', '9-B', '10-A', '10-B', '11-A', '11-B'];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('8-B');
  const [avatar, setAvatar] = useState('🚀');
  const [bio, setBio] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError('Iltimos, login va parolni to\'ldiring!');
      return;
    }

    const users = StorageService.getUsers();
    const user = users.find(
      u => u.username.toLowerCase() === loginUsername.trim().toLowerCase() && 
           (u.password ? u.password === loginPassword : true)
    );

    if (!user) {
      setError('Login yoki parol noto\'g\'ri! Qaytadan urinib ko\'ring.');
      return;
    }

    StorageService.setCurrentUserId(user.id);
    setSuccessMsg(`Xush kelibsiz, ${user.fullName}!`);
    setTimeout(() => {
      onSuccess(user);
      onClose();
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setError('Iltimos, ism, login va parolni kiriting!');
      return;
    }

    const users = StorageService.getUsers();
    const cleanUsername = username.trim().toLowerCase();
    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      setError('Bu login band! Boshqa login tanlang.');
      return;
    }

    const newUser: User = {
      id: 'user_' + Date.now(),
      username: cleanUsername,
      fullName: fullName.trim(),
      password: password,
      grade: grade,
      bio: bio.trim() || `${grade} sinf o'quvchisi. Bilimga intiluvchan!`,
      favoriteTeacher: '',
      bestFriend: '',
      avatar: avatar,
      coins: 200, // Xush kelibsiz bonusi
      xp: 250,
      level: 1,
      badges: ['faol_ishtirokchi'],
      inventory: [],
      stats: {
        duelsWon: 0,
        duelsPlayed: 0,
        testsCompleted: 0,
        reviewsGiven: 0,
        mathHighStreak: 0,
        questsCompleted: 0
      },
      claimedPromos: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedUsers = [...users, newUser];
    StorageService.saveUsers(updatedUsers);
    StorageService.setCurrentUserId(newUser.id);

    setSuccessMsg("Ro'yxatdan o'tish muvaffaqiyatli! +200 Coin va +250 XP taqdim etildi! 🎁");
    setTimeout(() => {
      onSuccess(newUser);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              tab === 'login'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Kirish (Login)
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              tab === 'register'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Yopish"
          className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content area */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Login (Foydalanuvchi nomi)
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="masalan: azizbek_8b"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Parol
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Parolingizni kiriting"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-sm shadow-blue-500/25 transition-colors cursor-pointer"
                >
                  Akkauntga kirish
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                <span>Demo akkaunt: </span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername('azizbek_8b');
                    setLoginPassword('123');
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  azizbek_8b (parol: 123)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ism va Familiya
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="masalan: Sardor Aliyev"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Login nomi
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="sardor_8b"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sinf
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {GRADE_OPTIONS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Parol
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kamida 4 ta belgi"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Profil avatarini tanlang
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map(av => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setAvatar(av)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform cursor-pointer ${
                        avatar === av 
                          ? 'bg-blue-100 dark:bg-blue-900/60 ring-2 ring-blue-600 scale-110' 
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  O'zingiz haqingizda qisqacha (Bio)
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="masalan: Fizika va robototexnika qiziqishim bor"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-lg text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                <span>Ro'yxatdan o'tganingiz uchun <strong>+200 Coin</strong> va <strong>+250 XP</strong> bonus beriladi!</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-sm shadow-blue-500/25 transition-colors cursor-pointer"
                >
                  Hisob yaratish
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
