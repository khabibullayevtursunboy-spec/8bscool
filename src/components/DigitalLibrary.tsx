import React, { useState, useEffect } from 'react';
import { LibraryBook, Subject } from '../types';
import { StorageService } from '../services/storage';
import { 
  BookOpen, 
  Search, 
  Clock, 
  FileText, 
  Eye, 
  X, 
  Sparkles, 
  ExternalLink,
  BookMarked,
  Filter
} from 'lucide-react';

export const DigitalLibrary: React.FC = () => {
  const [books, setBooks] = useState<LibraryBook[]>(StorageService.getLibraryBooks());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [readingBook, setReadingBook] = useState<LibraryBook | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setBooks(StorageService.getLibraryBooks());
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('admin_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('admin_data_updated', handleUpdate);
    };
  }, []);

  const subjects = ['all', 'Texnologiya', 'Matematika', 'Fizika', 'Informatika', 'Tarix', 'Ingliz tili'];

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = selectedSubject === 'all' || b.subject === selectedSubject;
    return matchesSearch && matchesSub;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner with Glassmorphic Gradient */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-teal-800 via-emerald-800 to-cyan-900 text-white border border-white/15 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-teal-200 shadow-xs">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Raqamli Darsliklar & Qo'llanmalar</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            29-Maktab Elektron Kutubxonasi
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed font-medium">
            Maktab dasturidagi rasmiy darsliklar, qo'llanmalar, texnologik xaritalar va elektron kitoblarni to'g'ridan-to'g'ri o'qing yoki ko'rib chiqing.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kitob yoki mavzuni qidirish..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
          {subjects.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              {sub === 'all' ? 'Barcha fanlar' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Books Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40 text-teal-500" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Ushbu bo'limda elektron kitoblar topilmadi</p>
            <p className="text-xs text-slate-400 mt-1">Boshqa kalit so'zlar bilan qidirib ko'ring</p>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-teal-500/40"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                  <span className="font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-lg">
                    {book.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {book.grade}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-400 mb-3 font-semibold">
                  Muallif: <span className="text-slate-600 dark:text-slate-300">{book.author}</span>
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed font-medium">
                  {book.summary}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 mb-4 font-semibold">
                  <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{book.pages} bet</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{book.readTime}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReadingBook(book)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-500/20 active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  <span>Elektron o'qish</span>
                </button>

                {book.fileUrl && (
                  <a
                    href={book.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Yuklab olish / Havola"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reading Modal */}
      {readingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[88vh] flex flex-col">
            <button
              onClick={() => setReadingBook(null)}
              aria-label="Yopish"
              className="absolute top-5 right-5 p-2 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all hover:rotate-90 duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 font-bold">
                {readingBook.subject}
              </span>
              <span className="text-xs text-slate-400 font-bold">
                {readingBook.grade}
              </span>
            </div>

            <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white mb-1">
              {readingBook.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-semibold">
              Muallif: <span className="text-slate-700 dark:text-slate-200">{readingBook.author}</span> • {readingBook.pages} betlik elektron darslik konspekti
            </p>

            <div className="overflow-y-auto flex-1 pr-2 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-b border-slate-200/80 dark:border-slate-800 py-4 custom-scrollbar">
              <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
                <span className="font-bold text-teal-700 dark:text-teal-300 block mb-1">
                  Darslik annotatsiyasi:
                </span>
                {readingBook.summary}
              </div>

              {readingBook.content ? (
                <div className="space-y-3 whitespace-pre-line p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700 font-sans font-medium">
                  {readingBook.content}
                </div>
              ) : (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Mavzular mundarijasi va amaliy ko'nikmalar:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 pl-1 font-medium text-slate-600 dark:text-slate-300">
                    <li>1-bob: Nazariy qoidalar va darslik mezonlari.</li>
                    <li>2-bob: Amaliy ko'nikmalar va texnologik xaritalar tahlili.</li>
                    <li>3-bob: Mustaqil fikrlash, hisob-kitoblar va olimpiada mashqlari.</li>
                  </ul>
                </div>
              )}

              {readingBook.fileUrl && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                    Elektron PDF / Darslik to'liq nusxasi mavjud:
                  </span>
                  <a
                    href={readingBook.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all inline-flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    <span>Havolani ochish</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setReadingBook(null)}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-teal-500/20 active:scale-95"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};