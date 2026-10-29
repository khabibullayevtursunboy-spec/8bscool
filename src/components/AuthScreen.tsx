import React, { useState } from 'react';
import { User, TeacherAccount } from '../types';
import { StorageService } from '../services/storage';
import { TeacherAuthModal } from './TeacherAuthModal';
import { 
  LogIn, 
  UserPlus, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Sun, 
  Moon, 
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  User as UserIcon,
  Image as ImageIcon,
  ShieldAlert,
  KeyRound,
  X
} from 'lucide-react';

interface AuthScreenProps {
  onSuccess: (user: User) => void;
  onTeacherSuccess: (teacher: TeacherAccount) => void;
  onOpenAdmin: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const GRADE_OPTIONS = [
  '5-A', '5-B', '6-A', '6-B', 
  '7-A', '7-B', '7-V', 
  '8-A', '8-B', '8-V', 
  '9-A', '9-B', '10-A', '10-B', '11-A', '11-B'
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ 
  onSuccess, 
  onTeacherSuccess,
  onOpenAdmin, 
  theme, 
  toggleTheme 
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState(false);

  // Login form
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('8-B');
  const [bio, setBio] = useState('');
  const [avatarDataUrl, setAvatarDataUrl] = useState('');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle local image file upload from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      setError('Rasm hajmi juda katta (maksimal 2.5 MB bo\'lishi kerak)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarDataUrl(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = StorageService.getUsers();
    const cleanU = loginUsername.trim().toLowerCase();

    const user = users.find(u => 
      u.username.toLowerCase() === cleanU && 
      (u.password ? u.password === loginPassword : true)
    );

    if (!user) {
      setError('Bunday login yoki parol topilmadi! Agar birinchi marta kirayotgan bo\'lsangiz, avval "Ro\'yxatdan o\'tish" bo\'limiga o\'ting.');
      return;
    }

    StorageService.setCurrentUserId(user.id);
    setSuccessMsg(`Xush kelibsiz, ${user.fullName}!`);
    setTimeout(() => {
      onSuccess(user);
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setError('Ism, login va parolni kiritish shart!');
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    const users = StorageService.getUsers();
    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      setError('Bu login band! Boshqa login kiriting.');
      return;
    }

    // Determine final real avatar (uploaded base64 or URL)
    let finalAvatar = avatarDataUrl || avatarUrlInput.trim();

    const newUser: User = {
      id: 'user_' + Date.now(),
      username: cleanUsername,
      fullName: fullName.trim(),
      password,
      grade,
      bio: bio.trim() || `${grade} sinf o'quvchisi. Bilimga intiluvchan!`,
      favoriteTeacher: '',
      bestFriend: '',
      avatar: finalAvatar,
      coins: 0,
      xp: 0,
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

    setSuccessMsg('Akkaunt muvaffaqiyatli yaratildi! Kirilmoqda...');
    setTimeout(() => {
      onSuccess(newUser);
    }, 500);
  };

  // 4 rapid clicks on "Made in Tursunboy" in AuthScreen
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleTursunboyClick = () => {
    const now = Date.now();
    if (now - lastClickTime > 2500) {
      setClickCount(1);
      setLastClickTime(now);
    } else {
      const next = clickCount + 1;
      setClickCount(next);
      setLastClickTime(now);
      if (next >= 4) {
        setClickCount(0);
        setShowAdminPrompt(true);
        setAdminPassword('');
        setAdminError(false);
      }
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '29maktab') {
      setShowAdminPrompt(false);
      setAdminPassword('');
      setAdminError(false);
      onOpenAdmin();
    } else {
      setAdminError(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm shrink-0">
            29
          </div>
          <div>
            <h1 className="font-display font-extrabold text-sm sm:text-lg text-slate-900 dark:text-white leading-tight">
              29-Maktab • 8-Sinf Texnologiya
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:block">
              O'quvchilar intellektual va multiplayer tizimi
            </p>
          </div>
        </div>

        {/* Right side controls: Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Rejimni almashtirish"
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Kunduzgi</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Kechgi</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Admin Password Prompt Modal (activated by Made in Tursunboy 4 clicks) */}
      {showAdminPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowAdminPrompt(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Admin Panelga Kirish
                </h3>
                <p className="text-xs text-slate-500">Parolni kiriting</p>
              </div>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    placeholder="masalan: Khabibullayev"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError(false);
                    }}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  *(masalan: Khabibullayev bu misol tariqasida yozilgan, parol emas)*
                </p>
                {adminError && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">
                    Noto'g'ri parol!
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminPrompt(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Center Auth Card */}
      <div className="max-w-lg w-full mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          {/* Header tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
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
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                tab === 'register'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Ro'yxatdan o'tish
            </button>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Foydalanuvchi nomi (Login)
                  </label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Login nomingizni kiriting"
                    required
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Parol
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Parolingizni kiriting"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Tizimga kirish</span>
                  </button>
                </div>

                <div className="pt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                  Akkauntingiz yo'qmi?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('register'); setError(null); }}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Ro'yxatdan o'ting
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* STRICT WARNING BANNER AS REQUESTED */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border-2 border-amber-500/40 text-amber-950 dark:text-amber-100 shadow-xs space-y-1.5 animate-pulse">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black text-xs sm:text-sm uppercase tracking-wide">
                    <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>DIQQAT! QAT'IY OGOHLANTIRISH</span>
                  </div>
                  <p className="font-extrabold text-xs sm:text-[13px] leading-snug text-amber-900 dark:text-amber-200">
                    ILTIMOS O'ZINGIZNING HAQIQIY ISM-FAMILIYANGIZNI KIRITING! 2 TA AKKAUNT OCHISH QAT'IYAN TAQIQLANADI, AKS HOLDA TIZIMDAN BUTUNLAY BLOKLANASIZ!
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ism va Familiyangiz
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="masalan: Farhod Karimov"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Login
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="farhod_8b"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sinf
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* REAL PHOTO UPLOAD (NO EMOJIS - USER CHOOSES THEIR OWN PHOTO) */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    Profil rasmingizni yuklang (Foydalanuvchi o'z rasmi)
                  </label>

                  <div className="flex items-center gap-4">
                    {/* Preview box */}
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                      {avatarDataUrl || avatarUrlInput ? (
                        <img 
                          src={avatarDataUrl || avatarUrlInput} 
                          alt="Profil ko'rinishi" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-8 h-8 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Qurilmadan rasm tanlash</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="url"
                        value={avatarUrlInput}
                        onChange={(e) => setAvatarUrlInput(e.target.value)}
                        placeholder="yoki rasm havolasini (URL) qo'ying"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    O'zingiz haqingizda (Bio)
                  </label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Qiziqishlaringiz yoki sevimli fanningiz..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Ro'yxatdan o'tish va kirish</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Understated gray "O'qituvchi" button as requested */}
      <div className="text-center pt-2 pb-1">
        <button
          type="button"
          onClick={() => setShowTeacherModal(true)}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium transition-colors cursor-pointer py-1 px-3 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/60 inline-flex items-center gap-1.5"
          title="O'qituvchi sifatida tizimga kirish yoki ro'yxatdan o'tish"
        >
          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
          <span>O'qituvchi</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 space-y-1">
        <div
          onClick={handleTursunboyClick}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors select-none cursor-pointer inline-block px-3 py-1 rounded-lg"
          title="29-Maktab Texnologiya Portali"
        >
          Made in Tursunboy
        </div>
        <p className="text-[11px] text-slate-400">
          © 2026 29-sonli umumta'lim maktabi. 8-Sinf Texnologiya fani platformasi.
        </p>
      </footer>

      {/* Teacher Authentication Modal */}
      <TeacherAuthModal
        isOpen={showTeacherModal}
        onClose={() => setShowTeacherModal(false)}
        onSuccess={(t) => {
          setShowTeacherModal(false);
          onTeacherSuccess(t);
        }}
      />
    </div>
  );
};
