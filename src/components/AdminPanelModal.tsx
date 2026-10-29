import React, { useState } from 'react';
import { 
  User, 
  TestQuestion, 
  PromoCode, 
  Announcement, 
  SiteSettings, 
  Subject,
  Teacher,
  LessonScheduleItem,
  LibraryBook
} from '../types';
import { StorageService, ALL_BADGES } from '../services/storage';
import { 
  X, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Check, 
  Gift, 
  Bell, 
  FileText, 
  Coins, 
  Award, 
  Sliders, 
  Search,
  Users,
  Calendar,
  GraduationCap,
  BookOpen,
  Edit2
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

type AdminTab = 'tests' | 'library' | 'teachers' | 'promos' | 'announcements' | 'students' | 'texts';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('tests');

  // 1. Tests State
  const [questions, setQuestions] = useState<TestQuestion[]>(StorageService.getQuestions());
  const [adminTestCounter, setAdminTestCounter] = useState<number>(1);
  const [newSubject, setNewSubject] = useState<Subject>('Texnologiya');
  const [newQText, setNewQText] = useState('');
  const [newOpt0, setNewOpt0] = useState('');
  const [newOpt1, setNewOpt1] = useState('');
  const [newOpt2, setNewOpt2] = useState('');
  const [newOpt3, setNewOpt3] = useState('');
  const [newCorrectIdx, setNewCorrectIdx] = useState<number>(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newPoints, setNewPoints] = useState(20);
  const [testSearch, setTestSearch] = useState('');
  const [testMessage, setTestMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // 2. Teachers State
  const [teachers, setTeachers] = useState<Teacher[]>(StorageService.getTeachers());
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherIsClassMaster, setNewTeacherIsClassMaster] = useState(false);
  const [newTeacherClassName, setNewTeacherClassName] = useState('8-B sinf rahbari');
  const [newTeacherBio, setNewTeacherBio] = useState('');
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTeacherSubject, setEditTeacherSubject] = useState('');

  // 3. Library Books State (Elektron Kitoblar)
  const [books, setBooks] = useState<LibraryBook[]>(StorageService.getLibraryBooks());
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookSubject, setNewBookSubject] = useState<Subject>('Texnologiya');
  const [newBookGrade, setNewBookGrade] = useState('8-sinf');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookPages, setNewBookPages] = useState(160);
  const [newBookReadTime, setNewBookReadTime] = useState('3 soat');
  const [newBookSummary, setNewBookSummary] = useState('');
  const [newBookFileUrl, setNewBookFileUrl] = useState('');
  const [newBookContent, setNewBookContent] = useState('');
  const [bookSuccessMsg, setBookSuccessMsg] = useState<string | null>(null);

  // 4. Promos State
  const [promos, setPromos] = useState<PromoCode[]>(StorageService.getPromos());
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoCoins, setNewPromoCoins] = useState(300);
  const [newPromoXp, setNewPromoXp] = useState(250);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // 6. Announcements State
  const [announcements, setAnnouncements] = useState<Announcement[]>(StorageService.getAnnouncements());
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnType, setNewAnnType] = useState<'info' | 'important' | 'event'>('info');

  // 7. Students State
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [studentSearch, setStudentSearch] = useState('');

  // 8. Site Texts State
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  if (!isOpen) return null;

  // ---------------------------------------------
  // HANDLERS: TESTS (FIXED & VALIDATED)
  // ---------------------------------------------
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setTestMessage(null);

    const q = newQText.trim();
    const opt0 = newOpt0.trim();
    const opt1 = newOpt1.trim();
    const opt2 = newOpt2.trim();
    const opt3 = newOpt3.trim();

    if (!q || !opt0 || !opt1 || !opt2 || !opt3) {
      setTestMessage({ text: 'Xatolik: Savol matni va barcha 4 ta variant to\'ldirilishi shart!', isError: true });
      return;
    }

    const created = StorageService.addQuestion({
      subject: newSubject,
      question: q,
      options: [opt0, opt1, opt2, opt3],
      correctIndex: Number(newCorrectIdx),
      explanation: newExplanation.trim() || 'To\'g\'ri javob darslik qoidalariga asoslanadi.',
      points: Number(newPoints) || 20
    });

    setQuestions(StorageService.getQuestions());
    const nextNum = adminTestCounter + 1;
    setAdminTestCounter(nextNum);
    setNewQText('');
    setNewOpt0('');
    setNewOpt1('');
    setNewOpt2('');
    setNewOpt3('');
    setNewExplanation('');
    setTestMessage({ 
      text: `✅ ${adminTestCounter}-test saqlandi! Endi ${nextNum}-testni kiriting:`, 
      isError: false 
    });
    onDataChanged();
  };

  const handleDeleteQuestion = (id: string) => {
    StorageService.deleteQuestion(id);
    setQuestions(StorageService.getQuestions());
    onDataChanged();
  };



  // ---------------------------------------------
  // HANDLERS: TEACHERS MANAGEMENT
  // ---------------------------------------------
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherSubject.trim()) return;

    StorageService.addTeacher({
      fullName: newTeacherName.trim(),
      subject: newTeacherSubject.trim(),
      isClassMaster: newTeacherIsClassMaster,
      className: newTeacherIsClassMaster ? newTeacherClassName.trim() : undefined,
      avatar: '',
      bio: newTeacherBio.trim() || `${newTeacherSubject} fani o'qituvchisi.`
    });

    setTeachers(StorageService.getTeachers());
    setNewTeacherName('');
    setNewTeacherSubject('');
    setNewTeacherBio('');
    onDataChanged();
  };

  const handleSaveEditTeacher = (t: Teacher) => {
    StorageService.updateTeacher({
      ...t,
      fullName: editTeacherName.trim() || t.fullName,
      subject: editTeacherSubject.trim() || t.subject
    });
    setTeachers(StorageService.getTeachers());
    setEditingTeacherId(null);
    onDataChanged();
  };

  const handleDeleteTeacher = (id: string) => {
    StorageService.deleteTeacher(id);
    setTeachers(StorageService.getTeachers());
    onDataChanged();
  };

  // ---------------------------------------------
  // HANDLERS: LIBRARY BOOKS
  // ---------------------------------------------
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;

    StorageService.addLibraryBook({
      title: newBookTitle.trim(),
      subject: newBookSubject,
      grade: newBookGrade,
      author: newBookAuthor.trim() || '29-Maktab Ustozlari',
      pages: Number(newBookPages) || 160,
      summary: newBookSummary.trim() || 'Elektron darslik va amaliy qo\'llanma.',
      readTime: newBookReadTime.trim() || '3 soat',
      fileUrl: newBookFileUrl.trim() || undefined,
      content: newBookContent.trim() || undefined
    });

    setBooks(StorageService.getLibraryBooks());
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookSummary('');
    setNewBookFileUrl('');
    setNewBookContent('');
    setBookSuccessMsg('✅ Muvaffaqiyatli: Yangi elektron kitob kutubxonaga qo\'shildi!');
    setTimeout(() => setBookSuccessMsg(null), 3000);
    onDataChanged();
  };

  const handleDeleteBook = (id: string) => {
    StorageService.deleteLibraryBook(id);
    setBooks(StorageService.getLibraryBooks());
    onDataChanged();
  };

  // ---------------------------------------------
  // HANDLERS: PROMOS
  // ---------------------------------------------
  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    const clean = newPromoCode.trim().toUpperCase();
    const current = StorageService.getPromos();
    if (current.some(p => p.code.toUpperCase() === clean)) {
      alert('Bu promokod allaqachon mavjud!');
      return;
    }

    const newObj: PromoCode = {
      id: 'promo_' + Date.now(),
      code: clean,
      coins: Number(newPromoCoins) || 100,
      xp: Number(newPromoXp) || 100,
      active: true,
      maxUses: 500,
      usedCount: 0,
      description: newPromoDesc.trim() || 'Admin tomonidan taqdim etilgan promokod.'
    };

    const updated = [newObj, ...current];
    StorageService.savePromos(updated);
    setPromos(updated);
    setNewPromoCode('');
    setNewPromoDesc('');
    onDataChanged();
  };

  const handleTogglePromo = (id: string) => {
    const updated = promos.map(p => p.id === id ? { ...p, active: !p.active } : p);
    StorageService.savePromos(updated);
    setPromos(updated);
    onDataChanged();
  };

  const handleDeletePromo = (id: string) => {
    const updated = promos.filter(p => p.id !== id);
    StorageService.savePromos(updated);
    setPromos(updated);
    onDataChanged();
  };

  // ---------------------------------------------
  // HANDLERS: ANNOUNCEMENTS
  // ---------------------------------------------
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    StorageService.addAnnouncement({
      title: newAnnTitle.trim(),
      content: newAnnContent.trim(),
      type: newAnnType,
      author: 'Maktab Ma\'muriyati'
    });

    setAnnouncements(StorageService.getAnnouncements());
    setNewAnnTitle('');
    setNewAnnContent('');
    onDataChanged();
  };

  const handleDeleteAnnouncement = (id: string) => {
    StorageService.deleteAnnouncement(id);
    setAnnouncements(StorageService.getAnnouncements());
    onDataChanged();
  };

  // ---------------------------------------------
  // HANDLERS: STUDENTS
  // ---------------------------------------------
  const handleModifyUserCurrency = (userId: string, coinDelta: number, xpDelta: number) => {
    StorageService.addCoinsAndXp(userId, coinDelta, xpDelta);
    setUsers(StorageService.getUsers());
    onDataChanged();
  };

  const handleGrantBadge = (userId: string, badgeId: string) => {
    const all = StorageService.getUsers();
    const u = all.find(x => x.id === userId);
    if (u && !u.badges.includes(badgeId)) {
      u.badges.push(badgeId);
      StorageService.saveUsers(all);
      setUsers([...all]);
      onDataChanged();
    }
  };

  // ---------------------------------------------
  // HANDLERS: SITE TEXTS
  // ---------------------------------------------
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settings);
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 2000);
    onDataChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white">
                  Maxfiy Admin Boshqaruv Paneli
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                  KOD: 29maktab
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dars jadvali, ustozlar, testlar, promokodlar va sayt matnlarini to'liq boshqarish
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Yopish"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (All sections user requested) */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-6 gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('tests')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tests' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Testlar ({questions.length})
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'library' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-teal-500" />
            Elektron Kutubxona ({books.length})
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'teachers' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-500" />
            Ustozlar ({teachers.length})
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'promos' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Gift className="w-4 h-4 text-rose-500" />
            Promokodlar ({promos.length})
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'announcements' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            E'lonlar
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'students' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4 text-blue-500" />
            O'quvchilar ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('texts')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'texts' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Sayt Matnlari
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: TESTS MANAGEMENT (FIXED BUGS & ROBUST VALIDATION) */}
          {activeTab === 'tests' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  Yangi Test Savoli Qo'shish
                </h4>

                {testMessage && (
                  <div className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    testMessage.isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{testMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleAddQuestion} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Fan
                      </label>
                      <select
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value as Subject)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                      >
                        {(['Matematika', 'Fizika', 'Ingliz tili', 'Tarix', 'Biologiya', 'Kimyo', 'Ona tili', 'Informatika', 'Mantiq'] as const).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        To'g'ri javob varianti
                      </label>
                      <select
                        value={newCorrectIdx}
                        onChange={(e) => setNewCorrectIdx(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-blue-600 dark:text-blue-400"
                      >
                        <option value={0}>Variant A</option>
                        <option value={1}>Variant B</option>
                        <option value={2}>Variant C</option>
                        <option value={3}>Variant D</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ball (Qiymati)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="100"
                        value={newPoints}
                        onChange={(e) => setNewPoints(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Savol matni
                    </label>
                    <input
                      type="text"
                      value={newQText}
                      onChange={(e) => setNewQText(e.target.value)}
                      placeholder="Savol matnini to'liq kiriting..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${newCorrectIdx === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        A varianti {newCorrectIdx === 0 ? '(TO\'G\'RI JAVOB)' : ''}
                      </label>
                      <input
                        type="text"
                        value={newOpt0}
                        onChange={(e) => setNewOpt0(e.target.value)}
                        placeholder="A varianti matni..."
                        required
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${newCorrectIdx === 0 ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${newCorrectIdx === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        B varianti {newCorrectIdx === 1 ? '(TO\'G\'RI JAVOB)' : ''}
                      </label>
                      <input
                        type="text"
                        value={newOpt1}
                        onChange={(e) => setNewOpt1(e.target.value)}
                        placeholder="B varianti matni..."
                        required
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${newCorrectIdx === 1 ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${newCorrectIdx === 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        C varianti {newCorrectIdx === 2 ? '(TO\'G\'RI JAVOB)' : ''}
                      </label>
                      <input
                        type="text"
                        value={newOpt2}
                        onChange={(e) => setNewOpt2(e.target.value)}
                        placeholder="C varianti matni..."
                        required
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${newCorrectIdx === 2 ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${newCorrectIdx === 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        D varianti {newCorrectIdx === 3 ? '(TO\'G\'RI JAVOB)' : ''}
                      </label>
                      <input
                        type="text"
                        value={newOpt3}
                        onChange={(e) => setNewOpt3(e.target.value)}
                        placeholder="D varianti matni..."
                        required
                        className={`w-full px-3 py-2 rounded-xl border text-xs ${newCorrectIdx === 3 ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      To'g'ri javob izohi
                    </label>
                    <input
                      type="text"
                      value={newExplanation}
                      onChange={(e) => setNewExplanation(e.target.value)}
                      placeholder="Javobdan so'ng ko'rinadigan ilmiy tushuntirish..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>{adminTestCounter}-testni saqlash va {adminTestCounter + 1}-testga o'tish</span>
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Questions list */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                    Mavjud Testlar Ro'yxati ({questions.length} ta)
                  </h4>
                  <input
                    type="text"
                    value={testSearch}
                    onChange={(e) => setTestSearch(e.target.value)}
                    placeholder="Savollarni qidirish..."
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                  {questions
                    .filter(q => q.question.toLowerCase().includes(testSearch.toLowerCase()) || q.subject.toLowerCase().includes(testSearch.toLowerCase()))
                    .map((q, idx) => (
                      <div key={q.id} className="p-3.5 bg-white dark:bg-slate-900 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              {q.subject}
                            </span>
                            <span className="text-xs text-slate-400">+{q.points} ball</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            {idx + 1}. {q.question}
                          </p>
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                            To'g'ri javob: <strong>{q.options[q.correctIndex]}</strong>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Savolni o'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}


          {/* TAB 3: TEACHERS MANAGEMENT (User requested: "hatto ustozlarni ismni ham o'zgartirish") */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  Yangi Ustoz / Sinf Rahbari Qo'shish
                </h4>

                <form onSubmit={handleAddTeacher} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ustozning Ism va Familiyasi
                      </label>
                      <input
                        type="text"
                        value={newTeacherName}
                        onChange={(e) => setNewTeacherName(e.target.value)}
                        placeholder="masalan: Abdullayev Dilshod Ikromovich"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Dars beradigan fani
                      </label>
                      <input
                        type="text"
                        value={newTeacherSubject}
                        onChange={(e) => setNewTeacherSubject(e.target.value)}
                        placeholder="masalan: Fizika va Astronomiya"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTeacherIsClassMaster}
                        onChange={(e) => setNewTeacherIsClassMaster(e.target.checked)}
                        className="w-4 h-4 accent-emerald-600"
                      />
                      <span>Sinf rahbari hisoblanadi</span>
                    </label>

                    {newTeacherIsClassMaster && (
                      <input
                        type="text"
                        value={newTeacherClassName}
                        onChange={(e) => setNewTeacherClassName(e.target.value)}
                        placeholder="8-B sinf rahbari"
                        className="flex-1 px-3 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ustoz haqida qisqacha ma'lumot (Bio)
                    </label>
                    <textarea
                      rows={2}
                      value={newTeacherBio}
                      onChange={(e) => setNewTeacherBio(e.target.value)}
                      placeholder="Tajribasi, yutuqlari va to'garaklari..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Ustozni saqlash
                  </button>
                </form>
              </div>

              {/* Teachers List with Instant Name Edit */}
              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {teachers.map((t) => (
                  <div key={t.id} className="p-4 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {editingTeacherId === t.id ? (
                      <div className="flex-1 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={editTeacherName}
                          onChange={(e) => setEditTeacherName(e.target.value)}
                          className="px-3 py-1 text-xs rounded-lg border border-blue-500 bg-white dark:bg-slate-800 font-semibold flex-1"
                        />
                        <input
                          type="text"
                          value={editTeacherSubject}
                          onChange={(e) => setEditTeacherSubject(e.target.value)}
                          className="px-3 py-1 text-xs rounded-lg border border-blue-500 bg-white dark:bg-slate-800 flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditTeacher(t)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                        >
                          Saqlash
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{t.fullName}</span>
                          {t.isClassMaster && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              {t.className}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          Fan: {t.subject} • Reyting: {t.averageRating} ({t.reviewsCount} ta baho)
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 shrink-0">
                      {editingTeacherId !== t.id && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTeacherId(t.id);
                            setEditTeacherName(t.fullName);
                            setEditTeacherSubject(t.subject);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteTeacher(t.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ELECTRONIC LIBRARY BOOKS MANAGEMENT */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  Kutubxonaga Yangi Elektron Kitob / Darslik Qo'shish
                </h4>

                {bookSuccessMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{bookSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddBook} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Elektron kitob / Darslik nomi
                    </label>
                    <input
                      type="text"
                      value={newBookTitle}
                      onChange={(e) => setNewBookTitle(e.target.value)}
                      placeholder="masalan: 8-Sinf Texnologiya Asoslari"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Fan
                    </label>
                    <select
                      value={newBookSubject}
                      onChange={(e) => setNewBookSubject(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-teal-600 dark:text-teal-400"
                    >
                      {['Texnologiya', 'Matematika', 'Fizika', 'Informatika', 'Kimyo', 'Biologiya', 'Tarix', 'Ingliz tili'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Muallif
                    </label>
                    <input
                      type="text"
                      value={newBookAuthor}
                      onChange={(e) => setNewBookAuthor(e.target.value)}
                      placeholder="masalan: T. Habibullayev"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sinf
                    </label>
                    <input
                      type="text"
                      value={newBookGrade}
                      onChange={(e) => setNewBookGrade(e.target.value)}
                      placeholder="8-sinf"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Betlar soni
                    </label>
                    <input
                      type="number"
                      value={newBookPages}
                      onChange={(e) => setNewBookPages(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Elektron PDF / Onlayn o'qish havolasi (ixtiyoriy)
                    </label>
                    <input
                      type="url"
                      value={newBookFileUrl}
                      onChange={(e) => setNewBookFileUrl(e.target.value)}
                      placeholder="https://... (masalan darslik PDF yoki veb-sayt havolasi)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Qisqacha annotatsiya / izoh
                    </label>
                    <textarea
                      rows={2}
                      value={newBookSummary}
                      onChange={(e) => setNewBookSummary(e.target.value)}
                      placeholder="Darslikning asosiy mazmuni va boblari haqida..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Elektron matn / Boblar konspekti (ilova ichida o'qish uchun)
                    </label>
                    <textarea
                      rows={3}
                      value={newBookContent}
                      onChange={(e) => setNewBookContent(e.target.value)}
                      placeholder="Kitobning asosiy qoidalari, boblari va nazariy matnini bu yerga yozishingiz mumkin..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Elektron kitobni saqlash</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Books List */}
              <div className="space-y-2">
                <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                  Mavjud Kitoblar Ro'yxati ({books.length} ta)
                </h4>
                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                  {books.map(b => (
                    <div key={b.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{b.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold">
                            {b.subject}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Muallif: {b.author} • {b.grade} • {b.pages} bet {b.fileUrl ? '• PDF mavjud' : ''}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBook(b.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROMOCODES MANAGEMENT */}
          {activeTab === 'promos' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-rose-500" />
                  Yangi Kunlik Promokod Yaratish
                </h4>

                <form onSubmit={handleAddPromo} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Promokod nomi
                    </label>
                    <input
                      type="text"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                      placeholder="MASALAN: AQL8B"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Beriladigan Coin
                    </label>
                    <input
                      type="number"
                      value={newPromoCoins}
                      onChange={(e) => setNewPromoCoins(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Beriladigan XP
                    </label>
                    <input
                      type="number"
                      value={newPromoXp}
                      onChange={(e) => setNewPromoXp(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Kodni qo'shish
                    </button>
                  </div>
                </form>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {promos.map((promo) => (
                  <div key={promo.id} className="p-4 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{promo.code}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          promo.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {promo.active ? 'Faol' : 'Muzlatilgan'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>+{promo.coins} Coin</span>
                        <span>•</span>
                        <span>+{promo.xp} XP</span>
                        <span>•</span>
                        <span>Ishlatildi: {promo.usedCount} marta</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePromo(promo.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 transition-colors cursor-pointer"
                      >
                        {promo.active ? 'Muzlatish' : 'Faollashtirish'}
                      </button>
                      <button
                        onClick={() => handleDeletePromo(promo.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  Yangi Rasmiy E'lon Joylash
                </h4>

                <form onSubmit={handleAddAnnouncement} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        E'lon sarlavhasi
                      </label>
                      <input
                        type="text"
                        value={newAnnTitle}
                        onChange={(e) => setNewAnnTitle(e.target.value)}
                        placeholder="masalan: Matematika olimpiadasi g'oliblari"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Turi
                      </label>
                      <select
                        value={newAnnType}
                        onChange={(e) => setNewAnnType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      >
                        <option value="info">Ma'lumot</option>
                        <option value="important">Muhim</option>
                        <option value="event">Musobaqa / Tadbir</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      E'lon matni
                    </label>
                    <textarea
                      rows={2}
                      value={newAnnContent}
                      onChange={(e) => setNewAnnContent(e.target.value)}
                      placeholder="Barcha o'quvchilarga ko'rinadigan matn..."
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    E'lonni e'lon qilish
                  </button>
                </form>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 bg-white dark:bg-slate-900 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-sm text-slate-900 dark:text-white">{ann.title}</h5>
                        <span className="text-[10px] text-slate-400">{ann.date} • {ann.author}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{ann.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: STUDENTS */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Ro'yxatdan o'tgan o'quvchilar ({users.length} nafar)
                </h4>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Qidirish..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {users
                  .filter(u => u.fullName.toLowerCase().includes(studentSearch.toLowerCase()) || u.username.toLowerCase().includes(studentSearch.toLowerCase()))
                  .map((user) => (
                    <div key={user.id} className="p-4 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white overflow-hidden flex items-center justify-center font-bold text-xs shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{user.fullName.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900 dark:text-white">{user.fullName}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium">{user.grade}</span>
                            <span className="text-xs text-slate-400">@{user.username}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold">{user.coins} Coin</span>
                            <span>•</span>
                            <span className="text-blue-600 dark:text-blue-400 font-mono font-semibold">{user.xp} XP (Lv.{user.level})</span>
                            <span>•</span>
                            <span>{user.badges.length} ta nishon</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleModifyUserCurrency(user.id, 100, 100)}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 cursor-pointer"
                        >
                          +100 Coin/XP
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModifyUserCurrency(user.id, 500, 500)}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 cursor-pointer"
                        >
                          +500 Coin/XP
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModifyUserCurrency(user.id, -100, -100)}
                          className="px-2.5 py-1 text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-100 cursor-pointer"
                        >
                          -100 Coin
                        </button>

                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleGrantBadge(user.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                          className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                        >
                          <option value="" disabled>+ Nishon berish</option>
                          {ALL_BADGES.map(b => (
                            <option key={b.id} value={b.id} disabled={user.badges.includes(b.id)}>
                              {b.title} {user.badges.includes(b.id) ? '(Bor)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 8: SITE TEXTS & SETTINGS */}
          {activeTab === 'texts' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
              {saveSettingsSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Sayt matnlari saqlandi!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sayt & Maktab Nomi
                </label>
                <input
                  type="text"
                  value={settings.schoolName}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bosh Sahifa Sarlavhasi (Hero Title)
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bosh Sahifa Tavsifi (Hero Subtitle)
                </label>
                <textarea
                  rows={3}
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Maktab Shiori (Motto)
                </label>
                <input
                  type="text"
                  value={settings.motto}
                  onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Footer Matni
                </label>
                <input
                  type="text"
                  value={settings.footerText}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Matnlarni Saqlash
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
