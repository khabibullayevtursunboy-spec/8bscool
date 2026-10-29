import React, { useState } from 'react';
import { TeacherAccount, User, TestQuestion, Subject } from '../types';
import { StorageService } from '../services/storage';
import { 
  X, 
  GraduationCap, 
  LogOut, 
  Plus, 
  Minus, 
  Award, 
  Trophy, 
  FileText, 
  Users, 
  Search, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Coins, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Trash2,
  Filter
} from 'lucide-react';

interface TeacherPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherAccount;
  onLogout: () => void;
  onDataChanged: () => void;
}

type TeacherTab = 'points' | 'ranking' | 'tests';

export const TeacherPanelModal: React.FC<TeacherPanelModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onLogout,
  onDataChanged
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('points');

  // Students state
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [searchStudent, setSearchStudent] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  // Custom point adjustment state
  const [customCoins, setCustomCoins] = useState<number>(30);
  const [customXp, setCustomXp] = useState<number>(35);
  const [pointMode, setPointMode] = useState<'add' | 'deduct'>('add');
  const [pointReason, setPointReason] = useState<string>('');
  const [pointsToast, setPointsToast] = useState<{ text: string; isError?: boolean } | null>(null);

  // Consecutive Test creation state
  const [testCounter, setTestCounter] = useState<number>(1);
  const [subject, setSubject] = useState<Subject>(teacher.subject || 'Texnologiya');
  const [questionText, setQuestionText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIdx, setCorrectIdx] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState<number>(25);
  const [testSuccessNotice, setTestSuccessNotice] = useState<string | null>(null);
  const [testErrorNotice, setTestErrorNotice] = useState<string | null>(null);
  const [addedInSession, setAddedInSession] = useState<TestQuestion[]>([]);

  // Existing tests list
  const [allQuestions, setAllQuestions] = useState<TestQuestion[]>(StorageService.getQuestions());

  if (!isOpen) return null;

  const refreshStudents = () => {
    const list = StorageService.getUsers();
    setUsers(list);
    if (selectedStudent) {
      const refreshed = list.find(u => u.id === selectedStudent.id) || null;
      setSelectedStudent(refreshed);
    }
  };

  // Quick adjust points (+ or -)
  const handleQuickAdjust = (coinAmount: number, xpAmount: number, isDeduct = false, reason = '') => {
    if (!selectedStudent) return;
    const coinDelta = isDeduct ? -Math.abs(coinAmount) : Math.abs(coinAmount);
    const xpDelta = isDeduct ? -Math.abs(xpAmount) : Math.abs(xpAmount);

    const res = StorageService.modifyStudentPoints(selectedStudent.id, coinDelta, xpDelta, reason);
    if (res.success && res.user) {
      setSelectedStudent(res.user);
      refreshStudents();
      setPointsToast({ text: res.message });
      setTimeout(() => setPointsToast(null), 3000);
      onDataChanged();
    }
  };

  // Custom point submit
  const handleCustomPointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const coinVal = Math.max(1, Number(customCoins) || 0);
    const xpVal = Math.max(1, Number(customXp) || 0);

    const coinDelta = pointMode === 'deduct' ? -coinVal : coinVal;
    const xpDelta = pointMode === 'deduct' ? -xpVal : xpVal;

    const res = StorageService.modifyStudentPoints(selectedStudent.id, coinDelta, xpDelta, pointReason);
    if (res.success && res.user) {
      setSelectedStudent(res.user);
      refreshStudents();
      setPointsToast({ text: res.message });
      setTimeout(() => setPointsToast(null), 3500);
      onDataChanged();
    }
  };

  // CONSECUTIVE TEST ADDING HANDLER (1-test, 2-test, 3-test...)
  const handleAddConsecutiveTest = (e: React.FormEvent) => {
    e.preventDefault();
    setTestSuccessNotice(null);
    setTestErrorNotice(null);

    const q = questionText.trim();
    const a = opt0.trim();
    const b = opt1.trim();
    const c = opt2.trim();
    const d = opt3.trim();

    if (!q || !a || !b || !c || !d) {
      setTestErrorNotice('Iltimos, savol matni va barcha 4 ta variantni to\'ldiring!');
      return;
    }

    const created = StorageService.addQuestion({
      subject,
      question: q,
      options: [a, b, c, d],
      correctIndex: Number(correctIdx),
      explanation: explanation.trim() || `${subject} fani o'quv dasturi asosidagi to'g'ri javob.`,
      points: Number(points) || 20
    });

    const nextNumber = testCounter + 1;
    setTestCounter(nextNumber);
    setAddedInSession(prev => [created, ...prev]);
    setAllQuestions(StorageService.getQuestions());

    // Reset input fields but KEEP subject and increment test number!
    setQuestionText('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setExplanation('');
    setTestSuccessNotice(`✅ ${testCounter}-test muvaffaqiyatli saqlandi! Endi ${nextNumber}-testni kiriting:`);
    onDataChanged();
  };

  const handleDeleteTest = (id: string) => {
    StorageService.deleteQuestion(id);
    setAllQuestions(StorageService.getQuestions());
    setAddedInSession(prev => prev.filter(q => q.id !== id));
    onDataChanged();
  };

  // Filter students
  const filteredStudents = users.filter(u => {
    const matchSearch = u.fullName.toLowerCase().includes(searchStudent.toLowerCase()) || 
                        u.username.toLowerCase().includes(searchStudent.toLowerCase());
    const matchGrade = gradeFilter === 'all' || u.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  // Ranking sorted by XP
  const rankedStudents = [...users].sort((a, b) => b.xp - a.xp);

  const availableGrades = Array.from(new Set(users.map(u => u.grade))).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white flex flex-wrap items-center justify-between gap-4 border-b border-emerald-700/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white">
                  {teacher.fullName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/25 text-emerald-200 border border-emerald-400/40">
                  {teacher.subject} fani o'qituvchisi
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                29-Maktab Ta'lim va Boshqaruv Tizimi • O'qituvchi Boshqaruv Kabineti
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-red-600/80 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="O'qituvchi akkauntidan chiqish"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Yopish"
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-4 sm:px-6 gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('points')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'points'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Ball Berish va Ayirish</span>
          </button>

          <button
            onClick={() => setActiveTab('ranking')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ranking'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>O'quvchilar Reytingi ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tests'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>Ketma-ket Test Joylash</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
              {allQuestions.filter(q => q.subject === teacher.subject).length} ta
            </span>
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: POINTS MANAGEMENT (ADD / DEDUCT) */}
          {activeTab === 'points' && (
            <div className="space-y-6">
              {/* Toast */}
              {pointsToast && (
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all ${
                  pointsToast.isError
                    ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:border-red-900'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300'
                }`}>
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{pointsToast.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Students List */}
                <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col max-h-[580px]">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>O'quvchini tanlang</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Jami: {filteredStudents.length} ta
                    </span>
                  </div>

                  {/* Search and Grade filters */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                        placeholder="Ism yoki login..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <select
                      value={gradeFilter}
                      onChange={(e) => setGradeFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <option value="all">Barchasi</option>
                      {availableGrades.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Students scroll list */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                    {filteredStudents.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        O'quvchi topilmadi
                      </div>
                    ) : (
                      filteredStudents.map(student => {
                        const isSelected = selectedStudent?.id === student.id;
                        return (
                          <div
                            key={student.id}
                            onClick={() => setSelectedStudent(student)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-950 dark:text-white shadow-xs'
                                : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                                {student.avatar ? (
                                  <img src={student.avatar} alt={student.fullName} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-500">
                                    {student.fullName[0]}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                  {student.fullName}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {student.grade} • Level {student.level}
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-xs font-bold text-amber-500 flex items-center gap-1 justify-end">
                                <Coins className="w-3 h-3" />
                                {student.coins}
                              </div>
                              <div className="text-[10px] text-blue-500 font-semibold flex items-center gap-0.5 justify-end">
                                <Zap className="w-2.5 h-2.5" />
                                {student.xp} XP
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right: Selected Student Action Card */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                  {selectedStudent ? (
                    <>
                      {/* Active student summary */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-xs shrink-0">
                            {selectedStudent.avatar ? (
                              <img src={selectedStudent.avatar} alt={selectedStudent.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-lg text-slate-600">
                                {selectedStudent.fullName[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-slate-900 dark:text-white">
                              {selectedStudent.fullName}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {selectedStudent.grade} sinf o'quvchisi • @{selectedStudent.username}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                          <div className="text-center">
                            <span className="block text-[10px] text-slate-400 font-medium">Coin</span>
                            <span className="text-xs sm:text-sm font-bold text-amber-500 flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5" />
                              {selectedStudent.coins}
                            </span>
                          </div>
                          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                          <div className="text-center">
                            <span className="block text-[10px] text-slate-400 font-medium">XP</span>
                            <span className="text-xs sm:text-sm font-bold text-blue-500 flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5" />
                              {selectedStudent.xp}
                            </span>
                          </div>
                          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                          <div className="text-center">
                            <span className="block text-[10px] text-slate-400 font-medium">Daraja</span>
                            <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              Lv.{selectedStudent.level}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Presets: ADD (+) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tezkor Ball Qo'shish (Rag'batlantirish)</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(20, 25, false, "Darsdagi faollik uchun")}
                            className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors text-left cursor-pointer group"
                          >
                            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                              <span>+20 Coin / +25 XP</span>
                              <Plus className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400 mt-1">
                              Darsdagi faollik uchun
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(50, 60, false, "Namunali topshiriq uchun")}
                            className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors text-left cursor-pointer group"
                          >
                            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                              <span>+50 Coin / +60 XP</span>
                              <Plus className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400 mt-1">
                              Namunali amaliy ish
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(100, 120, false, "Loyiha va olimpiada yutug'i")}
                            className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors text-left cursor-pointer group"
                          >
                            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                              <span>+100 Coin / +120 XP</span>
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400 mt-1">
                              Loyiha & olimpiada yutug'i
                            </p>
                          </button>
                        </div>
                      </div>

                      {/* Quick Presets: DEDUCT (-) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                          <Minus className="w-3.5 h-3.5 text-rose-600" />
                          <span>Ball Ayirish (Jazo / Kamchilik)</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(20, 20, true, "Uy vazifasi qilinmagan")}
                            className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors text-left cursor-pointer group"
                          >
                            <div className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center justify-between">
                              <span>-20 Coin / -20 XP</span>
                              <Minus className="w-3.5 h-3.5 text-rose-500" />
                            </div>
                            <p className="text-[10px] text-rose-600/80 dark:text-rose-400 mt-1">
                              Vazifa qilinmagan
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(50, 50, true, "Tartibbuzarlik uchun")}
                            className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors text-left cursor-pointer group"
                          >
                            <div className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center justify-between">
                              <span>-50 Coin / -50 XP</span>
                              <Minus className="w-3.5 h-3.5 text-rose-500" />
                            </div>
                            <p className="text-[10px] text-rose-600/80 dark:text-rose-400 mt-1">
                              Ustaxona xavfsizligini buzish
                            </p>
                          </button>
                        </div>
                      </div>

                      {/* Custom Amount Form */}
                      <form onSubmit={handleCustomPointSubmit} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Ixtiyoriy miqdorda ball sozlash
                          </span>
                          <div className="flex bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg">
                            <button
                              type="button"
                              onClick={() => setPointMode('add')}
                              className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                                pointMode === 'add'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              + Qo'shish
                            </button>
                            <button
                              type="button"
                              onClick={() => setPointMode('deduct')}
                              className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                                pointMode === 'deduct'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              - Ayirish
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Coin Miqdori
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={customCoins}
                              onChange={(e) => setCustomCoins(Math.max(1, Number(e.target.value)))}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              XP Miqdori
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={customXp}
                              onChange={(e) => setCustomXp(Math.max(1, Number(e.target.value)))}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Sabab yoki izoh (ixtiyoriy)
                          </label>
                          <input
                            type="text"
                            value={pointReason}
                            onChange={(e) => setPointReason(e.target.value)}
                            placeholder="masalan: Tokarlik stanogi amaliy topshirig'ini a'lo bajardi"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className={`w-full py-2.5 rounded-xl font-semibold text-xs text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
                            pointMode === 'add'
                              ? 'bg-emerald-600 hover:bg-emerald-700'
                              : 'bg-rose-600 hover:bg-rose-700'
                          }`}
                        >
                          {pointMode === 'add' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                          <span>{pointMode === 'add' ? "Ballarni o'quvchiga qo'shish" : "Ballarni o'quvchidan ayirib tashlash"}</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="py-20 text-center space-y-3">
                      <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <Users className="w-8 h-8" />
                      </div>
                      <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                        Chapdagi ro'yxatdan o'quvchini tanlang
                      </h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        O'quvchini tanlagandan so'ng unga bir bosishda coin va XP qo'shishingiz yoki ayirishingiz mumkin.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENT RANKING */}
          {activeTab === 'ranking' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    29-Maktab O'quvchilari Umumiy Reytingi
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    O'quvchilarning XP, Coin, level va yutuqlari bo'yicha saralangan to'liq ro'yxati
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="O'quvchini qidirish..."
                    className="pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4">O'rin</th>
                        <th className="py-3 px-4">O'quvchi</th>
                        <th className="py-3 px-4">Sinf</th>
                        <th className="py-3 px-4">Daraja</th>
                        <th className="py-3 px-4">XP</th>
                        <th className="py-3 px-4">Coin</th>
                        <th className="py-3 px-4">Duellar</th>
                        <th className="py-3 px-4 text-right">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {rankedStudents
                        .filter(u => u.fullName.toLowerCase().includes(searchStudent.toLowerCase()))
                        .map((st, idx) => (
                          <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-4 font-bold">
                              {idx === 0 ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-white font-bold text-xs">🥇</span>
                              ) : idx === 1 ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-xs">🥈</span>
                              ) : idx === 2 ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs">🥉</span>
                              ) : (
                                <span className="text-slate-400 font-mono">#{idx + 1}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                                  {st.avatar ? (
                                    <img src={st.avatar} alt={st.fullName} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                                      {st.fullName[0]}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900 dark:text-white">
                                    {st.fullName}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    @{st.username}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                                {st.grade}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                              Level {st.level}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-blue-600 dark:text-blue-400">
                              {st.xp} XP
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-amber-500">
                              {st.coins} Coin
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                {st.stats?.duelsWon || 0} g'alaba
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                {st.stats?.duelsPlayed || 0} duel
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedStudent(st);
                                  setActiveTab('points');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Ball berish
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONSECUTIVE TEST CREATION (1-test, 2-test, 3-test...) */}
          {activeTab === 'tests' && (
            <div className="space-y-6">
              {/* Consecutive Test Creator Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                      {testCounter}-TESTNI KIRITISH
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Ketma-ket savollar qo'shish rejimi
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    1-testni saqlaganingizdan keyin oyna yopilmaydi, avtomatik 2-testga o'tadi va dars savollarini uzluksiz kiritishingiz mumkin!
                  </p>
                </div>

                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  Ushbu sessiyada qo'shildi: <strong className="text-emerald-600 font-bold">{addedInSession.length} ta savol</strong>
                </div>
              </div>

              {/* Success / Error notification */}
              {testSuccessNotice && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>{testSuccessNotice}</span>
                </div>
              )}

              {testErrorNotice && (
                <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:border-red-900 text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                  <span>{testErrorNotice}</span>
                </div>
              )}

              {/* The Test Form */}
              <form onSubmit={handleAddConsecutiveTest} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Fan
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as Subject)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      To'g'ri javob varianti
                    </label>
                    <select
                      value={correctIdx}
                      onChange={(e) => setCorrectIdx(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                    >
                      <option value={0}>Variant A</option>
                      <option value={1}>Variant B</option>
                      <option value={2}>Variant C</option>
                      <option value={3}>Variant D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Savol Bali (Coin / XP)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {testCounter}-Test Savoli Matni
                  </label>
                  <textarea
                    rows={2}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder={`masalan: ${testCounter}-savol: Yog'ochga ishlov berish tokarlik stanogida zagotovkaga aylanma harakat beruvchi tugun qaysi?`}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>Variant A {correctIdx === 0 && <span className="text-emerald-600 font-bold">(To'g'ri javob)</span>}</span>
                    </label>
                    <input
                      type="text"
                      value={opt0}
                      onChange={(e) => setOpt0(e.target.value)}
                      placeholder="Variant A matnini kiriting"
                      required
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                        correctIdx === 0 ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>Variant B {correctIdx === 1 && <span className="text-emerald-600 font-bold">(To'g'ri javob)</span>}</span>
                    </label>
                    <input
                      type="text"
                      value={opt1}
                      onChange={(e) => setOpt1(e.target.value)}
                      placeholder="Variant B matnini kiriting"
                      required
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                        correctIdx === 1 ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>Variant C {correctIdx === 2 && <span className="text-emerald-600 font-bold">(To'g'ri javob)</span>}</span>
                    </label>
                    <input
                      type="text"
                      value={opt2}
                      onChange={(e) => setOpt2(e.target.value)}
                      placeholder="Variant C matnini kiriting"
                      required
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                        correctIdx === 2 ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>Variant D {correctIdx === 3 && <span className="text-emerald-600 font-bold">(To'g'ri javob)</span>}</span>
                    </label>
                    <input
                      type="text"
                      value={opt3}
                      onChange={(e) => setOpt3(e.target.value)}
                      placeholder="Variant D matnini kiriting"
                      required
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                        correctIdx === 3 ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    To'g'ri javobga izoh (Tushuntirish)
                  </label>
                  <input
                    type="text"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="masalan: Darslikdagi 4-mavzu bo'yicha shpindel valiga zagotovka qotiriladi..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {/* Submit button: Consecutive! */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>{testCounter}-testni saqlash va {testCounter + 1}-testga o'tish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Questions list for this teacher's subject */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>{subject} Fanidagi Barcha Testlar ({allQuestions.filter(q => q.subject === subject).length} ta)</span>
                  </h4>
                </div>

                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {allQuestions.filter(q => q.subject === subject).map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400 font-mono">#{idx + 1}</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {q.question}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11px]">
                          {q.options.map((opt, oIdx) => (
                            <span
                              key={oIdx}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium truncate ${
                                oIdx === q.correctIndex
                                  ? 'bg-emerald-100 text-emerald-800 font-bold dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-400/40'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}: {opt}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteTest(q.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0 cursor-pointer"
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

        </div>

      </div>
    </div>
  );
};
