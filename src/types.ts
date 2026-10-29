export type Subject = 
  | 'Texnologiya'
  | 'Matematika' 
  | 'Fizika' 
  | 'Ingliz tili' 
  | 'Tarix' 
  | 'Biologiya' 
  | 'Kimyo' 
  | 'Ona tili' 
  | 'Informatika' 
  | 'Mantiq'
  | string;

export interface UserStats {
  duelsWon: number;
  duelsPlayed: number;
  testsCompleted: number;
  reviewsGiven: number;
  mathHighStreak: number;
  questsCompleted: number;
  boardGamesWon?: number;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  password?: string;
  grade: string; // e.g. "8-B"
  bio: string;
  favoriteTeacher: string;
  bestFriend: string;
  avatar: string; // Real image data URL or image link, NOT an emoji
  coins: number;
  xp: number;
  level: number;
  badges: string[];
  inventory: string[]; // Xarid qilingan buyumlar
  stats: UserStats;
  claimedPromos: string[];
  lastDailyBonusDate?: string; // YYYY-MM-DD
  dailyBonusStreak?: number;   // 1 to 7
  createdAt: string;
}

export interface TeacherAccount {
  id: string;
  fullName: string;
  subject: string;
  username: string;
  password?: string;
  createdAt: string;
}

export interface BadgeInfo {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon identifier
  category: string;
  requiredCondition: string;
}

export interface TestQuestion {
  id: string;
  subject: Subject;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface PromoCode {
  id: string;
  code: string;
  coins: number;
  xp: number;
  active: boolean;
  maxUses: number;
  usedCount: number;
  description: string;
}

export interface TeacherCriteria {
  teaching: number;   // Dars o'tish mahorati
  ethics: number;     // Odob-axloq va muomala
  care: number;       // O'quvchilarga g'amxo'rlik
  engaging: number;   // Qiziqarli mashg'ulotlar
  fairness: number;   // Adolatlilik
}

export interface TeacherReview {
  id: string;
  teacherId: string;
  studentName: string;
  isAnonymous: boolean;
  ratings: TeacherCriteria;
  comment: string;
  date: string;
  likes: number;
}

export interface Teacher {
  id: string;
  fullName: string;
  subject: string;
  isClassMaster: boolean;
  className?: string; // e.g. "8-B sinf rahbari"
  avatar: string; // Real image or photo URL
  bio: string;
  reviewsCount: number;
  averageRating: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'important' | 'event';
  author: string;
}

export interface SiteSettings {
  schoolName: string;
  heroTitle: string;
  heroSubtitle: string;
  motto: string;
  footerText: string;
}

export interface HomeworkItem {
  id: string;
  subject: Subject;
  task: string;
  dueDate: string;
  completed: boolean;
}

export interface LibraryBook {
  id: string;
  title: string;
  grade: string;
  subject: Subject;
  author: string;
  pages: number;
  summary: string;
  readTime: string;
  fileUrl?: string; // Elektron kitob / PDF havolasi
  content?: string; // Elektron konspekt yoki boblar matni
}

export type BoardGameType = 'chess' | 'checkers';
export type BotDifficulty = 'easy' | 'medium' | 'hard';

export interface BoardGameRoom {
  code: string;
  gameType: BoardGameType;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  hostGrade?: string;
  guestId?: string;
  guestName?: string;
  guestAvatar?: string;
  guestGrade?: string;
  boardState: string; // JSON serialized matrix
  currentTurn: 'white' | 'black';
  status: 'waiting' | 'playing' | 'white_won' | 'black_won' | 'draw';
  winner?: 'white' | 'black' | 'draw';
  moveHistory: string[];
  lastUpdated: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardXp: number;
  completed: boolean;
  type: 'duel' | 'math' | 'homework' | 'review' | 'book' | 'chess';
}

export interface ShopItem {
  id: string;
  title: string;
  price: number;
  description: string;
  category: 'badge' | 'status' | 'frame';
  iconName: string;
}

export interface LessonScheduleItem {
  id: string;
  day: 'Dushanba' | 'Seshanba' | 'Chorshanba' | 'Payshanba' | 'Juma' | 'Shanba';
  time: string;
  subject: string;
  room: string;
  teacher: string;
}

export interface RealGameRoom {
  code: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostGrade: string;
  guestId?: string;
  guestName?: string;
  guestAvatar?: string;
  guestGrade?: string;
  subject: Subject | 'Aralash';
  status: 'waiting' | 'ready' | 'playing' | 'finished';
  questions: TestQuestion[];
  currentQIndex: number;
  hostScore: number;
  guestScore: number;
  hostAnswer: number | null;
  guestAnswer: number | null;
  hostAnswerTime: number | null;
  guestAnswerTime: number | null;
  roundTimeLeft: number;
  roundOver: boolean;
  winnerId?: string | 'draw';
  lastUpdated: number;
}
