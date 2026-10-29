import React, { useState } from 'react';
import { User, BadgeInfo } from '../types';
import { StorageService, ALL_BADGES } from '../services/storage';
import { 
  X, 
  Coins, 
  Award, 
  Check, 
  Sparkles, 
  Gift, 
  LogOut, 
  Heart, 
  Users, 
  BookOpen, 
  Trophy, 
  Lock, 
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  User as UserIcon,
  Zap,
  Target,
  GraduationCap,
  Crown,
  HeartHandshake
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUserUpdated: (user: User) => void;
  onLogout: () => void;
}

const GRADE_OPTIONS = [
  '5-A', '5-B', '6-A', '6-B', 
  '7-A', '7-B', '7-V', 
  '8-A', '8-B', '8-V', 
  '9-A', '9-B', '10-A', '10-B', '11-A', '11-B'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'badges' | 'promo'>('profile');

  // Form states
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [grade, setGrade] = useState(currentUser.grade);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [favoriteTeacher, setFavoriteTeacher] = useState(currentUser.favoriteTeacher || '');
  const [bestFriend, setBestFriend] = useState(currentUser.bestFriend || '');
  
  // Real Photo Upload
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');

  // Promo code input
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Save feedback
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    let newBadges = [...currentUser.badges];
    if (bestFriend.trim() && !newBadges.includes('dostlik_timsoli')) {
      newBadges.push('dostlik_timsoli');
    }

    const finalAvatar = avatar || avatarUrlInput.trim() || currentUser.avatar;

    const updated: User = {
      ...currentUser,
      fullName: fullName.trim() || currentUser.fullName,
      grade,
      bio: bio.trim(),
      favoriteTeacher: favoriteTeacher.trim(),
      bestFriend: bestFriend.trim(),
      avatar: finalAvatar,
      badges: newBadges
    };

    const saved = StorageService.updateUser(updated);
    onUserUpdated(saved);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClaimPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = StorageService.claimPromo(promoInput, currentUser.id);
    setPromoMessage({ text: result.message, isError: !result.success });
    if (result.success) {
      setPromoInput('');
      const freshUser = StorageService.getCurrentUser();
      if (freshUser) onUserUpdated(freshUser);
    }
  };

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Target': return <Target className="w-5 h-5 text-rose-500" />;
      case 'Award': return <Award className="w-5 h-5 text-blue-500" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-emerald-500" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-rose-500" />;
      case 'Crown': return <Crown className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-teal-500" />;
      default: return <Award className="w-5 h-5 text-blue-500" />;
    }
  };

  const nextLevelXp = (currentUser.level + 1) * 350;
  const currentLevelFloor = currentUser.level * 200;
  const xpProgress = Math.min(100, Math.max(10, ((currentUser.xp - currentLevelFloor) / (nextLevelXp - currentLevelFloor)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-r from-blue-600/10 via-indigo-500/20 to-purple-600/10 blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative flex items-center justify-between p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-850 dark:to-slate-900">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-md flex items-center justify-center font-bold text-xl shrink-0 transition-transform duration-300 group-hover:scale-105">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span>{fullName.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  {fullName}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/50 shadow-xs">
                  {grade}
                </span>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
                <span className="font-medium text-slate-600 dark:text-slate-400">@{currentUser.username}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="font-mono tabular-nums text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                  <Coins className="w-3.5 h-3.5 inline text-amber-500" /> {currentUser.coins} Coin
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-lg border border-blue-200/50 dark:border-blue-900/30">
                  <Award className="w-3.5 h-3.5 inline" /> {currentUser.level}-Daraja
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Yopish"
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer hover:rotate-90 duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level XP Progress Bar */}
        <div className="px-6 py-3 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Daraja {currentUser.level} tajribasi
            </span>
            <span className="font-mono tabular-nums text-blue-600 dark:text-blue-400 font-bold">{currentUser.xp} / {nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 h-2.5 rounded-full overflow-hidden p-0.5 ring-1 ring-slate-300/30 dark:ring-slate-600/30">
            <div 
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800 px-6 gap-2 sm:gap-6 text-xs sm:text-sm font-bold bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 px-2 relative transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Profil ma'lumotlari
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-fadeIn" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`py-3.5 px-2 relative transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'badges'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            Nishonlar
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {currentUser.badges.length}/{ALL_BADGES.length}
            </span>
            {activeTab === 'badges' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-fadeIn" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('promo')}
            className={`py-3.5 px-2 relative transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'promo'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Gift className="w-4 h-4 text-rose-500" />
            Promokodlar
            {activeTab === 'promo' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-fadeIn" />
            )}
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {savedSuccess && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5 animate-fadeIn">
                  <div className="p-1 bg-emerald-500 text-white rounded-lg">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Profil ma'lumotlaringiz muvaffaqiyatli saqlandi!</span>
                </div>
              )}

              {/* REAL PHOTO UPLOAD */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Profil rasmingiz (O'zingiz yuklaysiz)
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    {avatar || avatarUrlInput ? (
                      <img src={avatar || avatarUrlInput} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20 transition-all cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Yangi rasm tanlash</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <input
                      type="url"
                      value={avatarUrlInput}
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                      placeholder="yoki rasm havolasini (URL) kiriting"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ism va Familiya
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Sinfingiz
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                  >
                    {GRADE_OPTIONS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  O'zingiz haqingizda (Bio)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Qiziqishlaringiz haqida yozing..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Yoqtirgan o'qituvchingiz / fani
                  </label>
                  <input
                    type="text"
                    value={favoriteTeacher}
                    onChange={(e) => setFavoriteTeacher(e.target.value)}
                    placeholder="masalan: Dilshod aka (Fizika)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    Eng yaqin do'stingiz
                  </label>
                  <input
                    type="text"
                    value={bestFriend}
                    onChange={(e) => setBestFriend(e.target.value)}
                    placeholder="masalan: Jasur (8-B)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Chiqish
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  O'zgarishlarni saqlash
                </button>
              </div>
            </form>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                🏆 Platformadagi faoliyatingiz va yutuqlaringiz orqali maxsus nishonlarni qo'lga kiriting:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_BADGES.map((badge) => {
                  const isUnlocked = currentUser.badges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3 relative overflow-hidden ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-blue-500/5 to-indigo-500/10 dark:from-blue-500/10 dark:to-indigo-500/5 border-blue-500/30 dark:border-blue-500/20 shadow-xs'
                          : 'bg-slate-50/60 dark:bg-slate-850/40 border-slate-200/80 dark:border-slate-800 opacity-60 grayscale-[0.3]'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                        isUnlocked 
                          ? 'bg-white dark:bg-slate-800 shadow-md ring-2 ring-blue-500/20' 
                          : 'bg-slate-200/70 dark:bg-slate-800/80'
                      }`}>
                        {renderBadgeIcon(badge.iconName)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {badge.title}
                          </h4>
                          {isUnlocked ? (
                            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                              Ochiq
                            </span>
                          ) : (
                            <div className="p-1 bg-slate-200/60 dark:bg-slate-800 rounded-md">
                              <Lock className="w-3 h-3 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'promo' && (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-50 to-rose-50/30 dark:from-slate-800/40 dark:to-rose-950/20 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
                    <Gift className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Kunlik Promokodni Faollashtirish
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  Admin yoki sinf rahbari bergan maxsus kodlarni kiriting hamda bepul **Coin** va **XP** mukofotlariga ega bo'ling!
                </p>

                <form onSubmit={handleClaimPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="MASALAN: MAKTAB2026"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono font-bold tracking-wider uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    Olish
                  </button>
                </form>

                {promoMessage && (
                  <div className={`mt-3.5 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
                    promoMessage.isError 
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}>
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{promoMessage.text}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};