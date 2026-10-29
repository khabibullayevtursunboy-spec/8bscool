import React, { useState } from 'react';
import { Teacher, TeacherReview, User, TeacherCriteria } from '../types';
import { StorageService } from '../services/storage';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Search, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  GraduationCap,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface TeacherEvaluationProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onUserStatsUpdated: () => void;
}

export const TeacherEvaluation: React.FC<TeacherEvaluationProps> = ({
  currentUser,
  onOpenAuth,
  onUserStatsUpdated
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>(StorageService.getTeachers());
  const [reviews, setReviews] = useState<TeacherReview[]>(StorageService.getReviews());

  React.useEffect(() => {
    const refresh = () => {
      setTeachers(StorageService.getTeachers());
      setReviews(StorageService.getReviews());
    };
    window.addEventListener('storage', refresh);
    window.addEventListener('admin_data_updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('admin_data_updated', refresh);
    };
  }, []);

  const [filterType, setFilterType] = useState<'all' | 'class_master' | 'subject_teacher'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected teacher
  const [evaluatingTeacher, setEvaluatingTeacher] = useState<Teacher | null>(null);

  // Criteria ratings
  const [ratings, setRatings] = useState<TeacherCriteria>({
    teaching: 5,
    ethics: 5,
    care: 5,
    engaging: 5,
    fairness: 5
  });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [comment, setComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.className && t.className.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterType === 'class_master') return t.isClassMaster;
    if (filterType === 'subject_teacher') return !t.isClassMaster;
    return true;
  });

  const handleOpenEvaluation = (teacher: Teacher) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setEvaluatingTeacher(teacher);
    setRatings({ teaching: 5, ethics: 5, care: 5, engaging: 5, fairness: 5 });
    setComment('');
    setSubmitSuccess(false);
  };

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingTeacher) return;

    const studentDisplayName = isAnonymous || !currentUser 
      ? 'Anonim o\'quvchi' 
      : `${currentUser.fullName} (${currentUser.grade})`;

    StorageService.addReview({
      teacherId: evaluatingTeacher.id,
      studentName: studentDisplayName,
      isAnonymous,
      ratings,
      comment: comment.trim() || 'Darslar va muomala uchun katta rahmat ustoz!'
    }, currentUser?.id);

    setTeachers(StorageService.getTeachers());
    setReviews(StorageService.getReviews());
    setSubmitSuccess(true);
    onUserStatsUpdated();

    setTimeout(() => {
      setEvaluatingTeacher(null);
      setSubmitSuccess(false);
    }, 1500);
  };

  const handleLikeReview = (reviewId: string) => {
    StorageService.likeReview(reviewId);
    setReviews(StorageService.getReviews());
  };

  const renderStars = (score: number, onChange?: (val: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!onChange}
            onClick={() => onChange && onChange(star)}
            className={`${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform p-0.5`}
          >
            <Star
              className={`w-4 h-4 ${
                star <= score 
                  ? 'text-amber-400 fill-amber-400' 
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white rounded-3xl p-6 sm:p-10 shadow-md">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
            Shaffof va Ochiq Baholash
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white mt-1 mb-3">
            Sinf Rahbari va O'qituvchilarni Baholash
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-4">
            Sevimli sinf rahbaringiz yoki fan o'qituvchingizga 5 ta mezon bo'yicha baho bering va samimiy fikringizni bildiring. Xohlasangiz izohingizni anonim qoldirishingiz mumkin.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 text-xs text-emerald-200 border border-emerald-400/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Har bir xolis baholash uchun sizga +50 Coin va +40 XP beriladi!</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ustoz yoki fanni qidirish..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-850 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Barchasi ({teachers.length})
          </button>
          <button
            onClick={() => setFilterType('class_master')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'class_master'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sinf rahbarlari
          </button>
          <button
            onClick={() => setFilterType('subject_teacher')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'subject_teacher'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Fan o'qituvchilari
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
                      {teacher.fullName}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {teacher.subject}
                    </div>
                  </div>
                </div>

                {teacher.isClassMaster && (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                    {teacher.className}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                {teacher.bio}
              </p>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850 mb-5">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                    {teacher.averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{teacher.reviewsCount} ta baho</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenEvaluation(teacher)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Baholash va Fikr bildirish</span>
            </button>
          </div>
        ))}
      </div>

      {/* Reviews list */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            O'quvchilar tomonidan bildirilgan so'nggi fikrlar
          </h3>
          <span className="text-xs text-slate-500">Jami: {reviews.length} ta</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.slice(0, 6).map((rev) => {
            const teacher = teachers.find(t => t.id === rev.teacherId);
            const avgRating = ((rev.ratings.teaching + rev.ratings.ethics + rev.ratings.care + rev.ratings.engaging + rev.ratings.fairness) / 5).toFixed(1);

            return (
              <div
                key={rev.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {teacher?.fullName.split(' ')[0]} {teacher?.fullName.split(' ')[1]}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{avgRating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 italic mb-3 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <span>{rev.studentName}</span>
                  <button
                    onClick={() => handleLikeReview(rev.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-mono">{rev.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EVALUATION MODAL */}
      {evaluatingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  {evaluatingTeacher.fullName}
                </h3>
                <div className="text-xs text-slate-500">
                  {evaluatingTeacher.subject} {evaluatingTeacher.className ? `• ${evaluatingTeacher.className}` : ''}
                </div>
              </div>

              <button
                onClick={() => setEvaluatingTeacher(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEvaluation} className="p-6 overflow-y-auto space-y-4 flex-1">
              {submitSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Baholashingiz qabul qilindi! +50 Coin va +40 XP hisobingizga qo'shildi!</span>
                </div>
              )}

              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                5 Ta Mezon Bo'yicha Baholang (1 - 5 yulduz):
              </div>

              <div className="space-y-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    1. Dars o'tish mahorati:
                  </span>
                  {renderStars(ratings.teaching, (val) => setRatings({ ...ratings, teaching: val }))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    2. Odob-axloq va muomala:
                  </span>
                  {renderStars(ratings.ethics, (val) => setRatings({ ...ratings, ethics: val }))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    3. O'quvchilarga g'amxo'rlik:
                  </span>
                  {renderStars(ratings.care, (val) => setRatings({ ...ratings, care: val }))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    4. Qiziqarli mashg'ulotlar:
                  </span>
                  {renderStars(ratings.engaging, (val) => setRatings({ ...ratings, engaging: val }))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    5. Adolatlilik va xolislik:
                  </span>
                  {renderStars(ratings.fairness, (val) => setRatings({ ...ratings, fairness: val }))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  O'qituvchiga samimiy fikringiz:
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Darslar yoki ustoz haqidagi iliq fikrlaringizni yozing..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Anonim tarzda yuborish
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Bahoni tasdiqlash va yuborish
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
