import { 
  User, 
  TestQuestion, 
  Teacher, 
  TeacherReview, 
  PromoCode, 
  Announcement, 
  SiteSettings, 
  BadgeInfo, 
  HomeworkItem, 
  LibraryBook, 
  DailyQuest, 
  ShopItem,
  LessonScheduleItem,
  RealGameRoom,
  Subject,
  TeacherAccount,
  BoardGameRoom,
  BoardGameType,
  BotDifficulty
} from '../types';

export const INITIAL_TEACHER_ACCOUNTS: TeacherAccount[] = [
  {
    id: 'teacher_tursunboy',
    fullName: 'Tursunboy Habibullayev',
    subject: 'Texnologiya',
    username: 'tursunboy',
    password: '29maktab',
    createdAt: '2026-10-26'
  },
  {
    id: 'teacher_karimova',
    fullName: 'Karimova Ziyoda',
    subject: 'Matematika',
    username: 'karimova',
    password: '29maktab',
    createdAt: '2026-10-26'
  }
];

export const ALL_BADGES: BadgeInfo[] = [
  {
    id: 'fizika_dahosi',
    title: 'Fizika dahosi',
    description: 'Fizika fanidan kamida 5 ta savolga ketma-ket to\'g\'ri javob bergan',
    iconName: 'Zap',
    category: 'Fan',
    requiredCondition: '5 ta fizika savolini to\'g\'ri yechish'
  },
  {
    id: 'matematika_burguti',
    title: 'Matematika burguti',
    description: 'Tezkor hisoblash poygasida yuqori natija ko\'rsatgan',
    iconName: 'Target',
    category: 'Fan',
    requiredCondition: 'Tezkor arifmetikada 150+ ball to\'plash'
  },
  {
    id: 'faol_ishtirokchi',
    title: 'Faol ishtirokchi',
    description: 'Platformaga muntazam kirib, sinfdoshlari bilan bellashgan',
    iconName: 'Award',
    category: 'Ijtimoiy',
    requiredCondition: 'Kamida 3 ta duelda qatnashish'
  },
  {
    id: 'fan_ustasi',
    title: 'Fan ustasi',
    description: 'Barcha fanlar bo\'yicha testlarni muvaffaqiyatli tamomlagan',
    iconName: 'GraduationCap',
    category: 'Reyting',
    requiredCondition: 'Level 5 ga yetib borish'
  },
  {
    id: 'viktorina_chempioni',
    title: 'Viktorina chempioni',
    description: '1v1 Duel jangida raqibini mag\'lub etib, g\'olib bo\'lgan',
    iconName: 'Trophy',
    category: 'Multiplayer',
    requiredCondition: '3 ta 1v1 duelda g\'alaba qozonish'
  },
  {
    id: 'dostlik_timsoli',
    title: 'Do\'stlik timsoli',
    description: 'Eng yaqin do\'stini profiliga belgilab, o\'yinlarga taklif etgan',
    iconName: 'HeartHandshake',
    category: 'Profil',
    requiredCondition: 'Profilga do\'stini kiritish'
  },
  {
    id: 'maktab_iftixori',
    title: 'Maktab iftixori',
    description: '1000 dan ortiq XP yig\'ib, maktab peshqadamlari safiga kirgan',
    iconName: 'Crown',
    category: 'Elita',
    requiredCondition: '1000+ XP to\'plash'
  },
  {
    id: 'odobli_tahlilchi',
    title: 'Odobli tahlilchi',
    description: 'O\'qituvchilar va sinf rahbarini mezonlar asosida xolisona baholagan',
    iconName: 'ShieldCheck',
    category: 'Baholash',
    requiredCondition: 'Kamida bitta o\'qituvchiga baho berish'
  }
];

// 8-Sinf Texnologiya fani bo'yicha maxsus tuzilgan test savollari (To'g'ri javoblar aralashgan)
export const INITIAL_QUESTIONS: TestQuestion[] = [
  {
    id: 'q1',
    subject: 'Texnologiya',
    question: 'Yog\'ochga ishlov berish tokarlik stanogida (ST D-120M) zagotovkaga aylanma harakat beruvchi asosiy tugun nima deb ataladi?',
    options: ['Oldingi babka (Shpindel)', 'Orqa babka', 'Podruchnik', 'Stanina'],
    correctIndex: 0,
    explanation: 'Oldingi babka ichidagi shpindel valiga zagotovka qotiriladi va elektrodvigatel orqali unga aylanma harakat beriladi.',
    points: 20
  },
  {
    id: 'q2',
    subject: 'Texnologiya',
    question: 'Shtangensirkul asbobi yordamida detallarning qanday o\'lchamlarini aniqlash mumkin?',
    options: ['Faqat tashqi o\'lchamini', 'Faqat chuqurligini', 'Tashqi, ichki diametr va chuqurligini', 'Faqat burchak gradusini'],
    correctIndex: 2,
    explanation: 'Shtangensirkul pastki jag\'lari bilan tashqi, yuqori jag\'lari bilan ichki o\'lchamni va chuqurlik o\'lchagich tili bilan chuqurlikni o\'lchaydi.',
    points: 25
  },
  {
    id: 'q3',
    subject: 'Texnologiya',
    question: 'Metallarni arralashda chilangarlik ustaxonasida qaysi asbobdan foydalaniladi?',
    options: ['Duradgorlik nozovkasi', 'Lobzik', 'Chilangarlik nozovkasi (metall arra)', 'Metall qaychi'],
    correctIndex: 2,
    explanation: 'Metallarni to\'g\'ri chiziq bo\'ylab kesish va arralashda mayda tishli chilangarlik nozovkasi ishlatiladi.',
    points: 20
  },
  {
    id: 'q4',
    subject: 'Texnologiya',
    question: 'Buyumni tayyorlashning texnologik ketma-ketligi, qo\'llaniladigan asboblar va o\'lchamlar qaysi hujjatda ifodalanadi?',
    options: ['Smeta hujjati', 'Texnologik xarita', 'Kafolat taloni', 'Foydalanish qo\'llanmasi'],
    correctIndex: 1,
    explanation: 'Texnologik xaritada har bir operatsiyaning ketma-ketligi, ish qurollari, xomashyo va nazorat usullari batafsil ko\'rsatiladi.',
    points: 25
  },
  {
    id: 'q5',
    subject: 'Texnologiya',
    question: 'Quyidagi metallar guruhidan qaysi biri rangli metallar hisoblanadi?',
    options: ['Cho\'yan va Po\'lat', 'Temir va Rux', 'Mis (Cu) va Alyuminiy (Al)', 'Faqat cho\'yan'],
    correctIndex: 2,
    explanation: 'Temir va uning qotishmalari (cho\'yan, po\'lat) qora metallar, mis, alyuminiy, qo\'rg\'oshin va boshqalar rangli metallardir.',
    points: 20
  },
  {
    id: 'q6',
    subject: 'Texnologiya',
    question: 'Elektr zanjirida tok kuchini o\'lchovchi ampermetr asbobi zanjirga qanday ulanadi?',
    options: ['Ketma-ket', 'Parallel', 'Aralash usulda', 'Faqat manbaga to\'g\'ridan-to\'g\'ri'],
    correctIndex: 0,
    explanation: 'Ampermetr juda kichik ichki qarshilikka ega bo\'lgani sababli elektr zanjiriga faqat ketma-ket ulanadi.',
    points: 25
  },
  {
    id: 'q7',
    subject: 'Texnologiya',
    question: 'Ustaxona stanoklarida ishlashda eng muhim xavfsizlik texnikasi qoidasi qaysi?',
    options: ['Qalin charm qo\'lqopda ishlash', 'Maxsus kiyim kiyish, yenglarni tugish va himoya ko\'zoynagi taqish', 'Tezroq ishlash uchun himoya qopqog\'ini yechish', 'Stanok to\'xtamasdan turib detalni o\'lchash'],
    correctIndex: 1,
    explanation: 'Aylanuvchi mexanizmlarda qo\'lqop kiyish taqiqlanadi; maxsus fartuk, bosh kiyim va himoya ko\'zoynagi taqish shart.',
    points: 20
  },
  {
    id: 'q8',
    subject: 'Texnologiya',
    question: 'Chizmachilikda ko\'rinmas qirralar va teshiklarning konturi qaysi chiziq turi bilan chiziladi?',
    options: ['Asosiy yo\'g\'on tutash chiziq', 'Ingichka to\'lqinsimon chiziq', 'Shtrix-punktir chiziq', 'Shtrix (uziq-uziq) chiziq'],
    correctIndex: 3,
    explanation: 'Davlat standartiga ko\'ra buyumning ko\'rinmas konturlari shtrix (uziq-uziq) chiziq bilan chiziladi.',
    points: 20
  },
  {
    id: 'q9',
    subject: 'Texnologiya',
    question: 'Quyidagi daraxt turlaridan qaysi biri eng qattiq va pishiq yog\'ochlar guruhiga kiradi?',
    options: ['Terak', 'Eman (Dub)', 'Tol', 'Qarag\'ay'],
    correctIndex: 1,
    explanation: 'Eman (Dub) daraxti zichligi va qattiqligi yuqori bo\'lgan bargli qattiq yog\'ochlar sinfiga mansub.',
    points: 20
  },
  {
    id: 'q10',
    subject: 'Texnologiya',
    question: 'Metall yuzasiga oxirgi pardozlash (toza jilolash) berishda qaysi egov turidan foydalaniladi?',
    options: ['Drahyovoy (yirik tishli)', 'Lixovoy (o\'rta tishli)', 'Baxatli (mayin tishli)', 'Raspis egovi'],
    correctIndex: 2,
    explanation: 'Baxatli egovlar 1 sm uzunlikda 45-80 ta mayin tishga ega bo\'lib, 0.05-0.01 mm aniqlikda pardozlash imkonini beradi.',
    points: 25
  },
  {
    id: 'q11',
    subject: 'Texnologiya',
    question: 'O\'zbekistonda standart maishiy elektr tarmog\'ining o\'zgaruvchan kuchlanishi va chastotasi qancha?',
    options: ['110 Volt, 60 Hz', '380 Volt, 100 Hz', '220 Volt, 50 Hz', '12 Volt, 25 Hz'],
    correctIndex: 2,
    explanation: 'Respublikamiz standartlariga binoan xonadon va maktab maishiy tarmog\'i 220 V va 50 Hz chastotaga ega.',
    points: 20
  },
  {
    id: 'q12',
    subject: 'Texnologiya',
    question: '3D printerda buyumlarni qatlam-qatlam qilib eritib quyish orqali shakllantirish texnologiyasi nima deb ataladi?',
    options: ['Additiv texnologiya', 'Subtraktiv texnologiya', 'Shtamplash', 'Prokatlash'],
    correctIndex: 0,
    explanation: 'Materialni qatlamlab qo\'shib (add) borish orqali buyum yasash additiv ishlab chiqarish (3D printing) deyiladi.',
    points: 25
  }
];

export const INITIAL_SCHEDULE: LessonScheduleItem[] = [
  { id: 'sch_1', day: 'Dushanba', time: '08:00 - 08:45', subject: 'Texnologiya', room: 'Ustaxona (101)', teacher: 'Tursunboy Habibullayev' },
  { id: 'sch_2', day: 'Dushanba', time: '08:50 - 09:35', subject: 'Texnologiya (Amaliyot)', room: 'Ustaxona (101)', teacher: 'Tursunboy Habibullayev' },
  { id: 'sch_3', day: 'Seshanba', time: '09:45 - 10:30', subject: 'Texnik chizmachilik', room: '302-xona', teacher: 'Tursunboy Habibullayev' },
  { id: 'sch_4', day: 'Chorshanba', time: '08:00 - 08:45', subject: 'Metallga ishlov berish', room: 'Chilangarlik xonasi', teacher: 'Tursunboy Habibullayev' },
  { id: 'sch_5', day: 'Payshanba', time: '10:35 - 11:20', subject: 'Elektrotexnika asoslari', room: 'IT & Texno Lab', teacher: 'Tursunboy Habibullayev' },
  { id: 'sch_6', day: 'Juma', time: '11:30 - 12:15', subject: 'Zamonaviy texnologiyalar & 3D', room: 'IT Lab', teacher: 'Tursunboy Habibullayev' },
  { id: 'sch_7', day: 'Shanba', time: '09:00 - 10:30', subject: 'Hunarmandchilik to\'garagi', room: 'Ustaxona (101)', teacher: 'Tursunboy Habibullayev' }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't1',
    fullName: 'Karimova Ziyoda Rustamovna',
    subject: 'Matematika',
    isClassMaster: true,
    className: '8-B sinf rahbari',
    avatar: '',
    bio: '15 yillik tajribaga ega oliy toifali matematika fani o\'qituvchisi. Respublika olimpiadalariga o\'quvchilarni tayyorlaydi.',
    reviewsCount: 14,
    averageRating: 4.9
  },
  {
    id: 't2',
    fullName: 'Abdullayev Dilshod Ikromovich',
    subject: 'Fizika',
    isClassMaster: true,
    className: '9-A sinf rahbari',
    avatar: '',
    bio: 'Fizika fanidan qiziqarli laboratoriya tajribalari va amaliy darslari bilan mashhur ustoz.',
    reviewsCount: 11,
    averageRating: 4.8
  },
  {
    id: 't3',
    fullName: 'Rahmonova Nilufar Aliyevna',
    subject: 'Ona tili va Adabiyot',
    isClassMaster: true,
    className: '7-V sinf rahbari',
    avatar: '',
    bio: 'Badiiy nutq madaniyati va adabiy to\'garaklar rahbari, o\'quvchilarni kitobsevarlikka ilhomlantiradi.',
    reviewsCount: 9,
    averageRating: 4.7
  },
  {
    id: 't4',
    fullName: 'Sobirov Jamshid Po\'latovich',
    subject: 'Tarix',
    isClassMaster: true,
    className: '10-A sinf rahbari',
    avatar: '',
    bio: 'Tarixiy obidalar, buyuk allomalar merosi va vatanparvarlik ruhidagi darslar ustasi.',
    reviewsCount: 12,
    averageRating: 4.85
  },
  {
    id: 't5',
    fullName: 'Xalilova Gulnoza Baxtiyorovna',
    subject: 'Ingliz tili',
    isClassMaster: false,
    avatar: '',
    bio: 'IELTS 8.0 sohibi, zamonaviy Speaking Club va interaktiv metodlar asosida ingliz tilini o\'rgatadi.',
    reviewsCount: 16,
    averageRating: 4.95
  },
  {
    id: 't6',
    fullName: 'Mirzayev Elyor Samadovich',
    subject: 'Informatika & Robototexnika',
    isClassMaster: false,
    avatar: '',
    bio: 'Dasturlash, sun\'iy intellekt va robototexnika to\'garaklari koordinatori.',
    reviewsCount: 8,
    averageRating: 4.9
  }
];

export const INITIAL_REVIEWS: TeacherReview[] = [
  {
    id: 'rev1',
    teacherId: 't1',
    studentName: 'Anonim o\'quvchi',
    isAnonymous: true,
    ratings: { teaching: 5, ethics: 5, care: 5, engaging: 5, fairness: 5 },
    comment: 'Ziyoda opa 8-B sinfimizning eng mehribon rahbari! Har bir qiyin formulani hayotiy misollar bilan tushuntirib beradilar.',
    date: '2026-10-24',
    likes: 7
  },
  {
    id: 'rev2',
    teacherId: 't2',
    studentName: 'Sardorbek (9-A)',
    isAnonymous: false,
    ratings: { teaching: 5, ethics: 5, care: 4, engaging: 5, fairness: 5 },
    comment: 'Fizika xonasidagi amaliy tajribalar har doim hayratlanarli o\'tadi. Rahmat ustoz!',
    date: '2026-10-22',
    likes: 4
  }
];

export const INITIAL_PROMOCODES: PromoCode[] = [
  {
    id: 'promo1',
    code: 'TEXNO2026',
    coins: 250,
    xp: 200,
    active: true,
    maxUses: 1000,
    usedCount: 15,
    description: '8-sinf Texnologiya fani maxsus promokodi!'
  },
  {
    id: 'promo2',
    code: 'TURSUNBOY',
    coins: 300,
    xp: 300,
    active: true,
    maxUses: 500,
    usedCount: 12,
    description: 'Tursunboy ustozning maxsus rag\'batlantiruvchi promokodi!'
  },
  {
    id: 'promo3',
    code: 'USTOZ29',
    coins: 200,
    xp: 150,
    active: true,
    maxUses: 1000,
    usedCount: 20,
    description: 'Ustozlar tomonidan taqdim etiladigan rasmiy promokod.'
  },
  {
    id: 'promo4',
    code: 'MAKTAB29',
    coins: 100,
    xp: 50,
    active: true,
    maxUses: 2000,
    usedCount: 35,
    description: '29-Maktab o\'quvchilari uchun umumiy promokod.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    title: '29-Maktabda Fanlar Bo\'yicha 1v1 Intellektual Duel Ligasi Boshlandi!',
    content: 'O\'quvchilar endi do\'stlari bilan online savol-javob duelida bellashib, maktab reytingida yuqoriga ko\'tarilishi va maxsus nishonlarni ochishi mumkin!',
    date: '26 Oktyabr, 2026',
    type: 'event',
    author: 'Maktab Ma\'muriyati'
  },
  {
    id: 'ann2',
    title: 'Sinf Rahbari va Ustozlarni Baholash Oyligi',
    content: 'Sevimli o\'qituvchilaringiz mehnatini 5 ta mezon bo\'yicha baholab, samimiy izoh qoldiring. O\'z fikringizni anonim yoki ochiq tarzda yozishingiz mumkin.',
    date: '25 Oktyabr, 2026',
    type: 'important',
    author: 'O\'quvchilar Kengashi'
  }
];

export const INITIAL_HOMEWORK: HomeworkItem[] = [
  {
    id: 'hw1',
    subject: 'Matematika',
    task: 'Darslikdagi 145-148 mashqlar: Kvadrat tenglamalarni diskriminant orqali yechish.',
    dueDate: 'Ertaga, 08:30',
    completed: false
  },
  {
    id: 'hw2',
    subject: 'Fizika',
    task: 'Nyuton qonunlariga oid 3 ta masalani laboratoriya daftariga yechib kelish.',
    dueDate: 'Chorshanba, 09:15',
    completed: false
  },
  {
    id: 'hw3',
    subject: 'Ingliz tili',
    task: 'Unit 4: "Modern Technologies" mavzusida 100 so\'zlik insho yozish.',
    dueDate: 'Payshanba, 10:00',
    completed: false
  }
];

export const INITIAL_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 'b1',
    title: 'Algebra va Analiz Asoslari (8-sinf)',
    grade: '8-sinf',
    subject: 'Matematika',
    author: 'O\'zbekiston Milliy Darsligi',
    pages: 224,
    summary: 'Chiziqli funksiyalar, kvadrat tenglamalar, ko\'phadlar va ularning amaliy tatbiqlari.',
    readTime: '4 soat'
  },
  {
    id: 'b2',
    title: 'Fizika Kursi (8-sinf)',
    grade: '8-sinf',
    subject: 'Fizika',
    author: 'P. Habibullayev',
    pages: 198,
    summary: 'Issiqlik hodisalari, elektr zaryadlari, doimiy tok qonunlari va optika asoslari.',
    readTime: '3.5 soat'
  },
  {
    id: 'b3',
    title: 'O\'zbekiston Tarixi (8-sinf)',
    grade: '8-sinf',
    subject: 'Tarix',
    author: 'A. Muhammadjonov',
    pages: 256,
    summary: 'O\'rta asrlarda O\'rta Osiyo xonliklari, madaniyat, ilm-fan va allomalar merosi.',
    readTime: '5 soat'
  },
  {
    id: 'b4',
    title: 'Informatika va Raqamli Dunyo (8-sinf)',
    grade: '8-sinf',
    subject: 'Informatika',
    author: 'M. Aripov',
    pages: 176,
    summary: 'Algoritmlash, Python dasturlash tili asoslari, kiberxavfsizlik va veb-texnologiyalar.',
    readTime: '3 soat'
  }
];

export const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: 'q_duel',
    title: '1v1 Duelda g\'alaba qozonish',
    description: 'Viktorina duelida raqibingizdan ko\'ra ko\'proq ball to\'plang (Kamida 1 ta g\'alaba)',
    rewardCoins: 50,
    rewardXp: 80,
    completed: false,
    type: 'duel'
  },
  {
    id: 'q_math',
    title: 'Arifmetika poygasida 5+ streak',
    description: '45 soniyalik hisoblash poygasida ketma-ket 5 ta misolni to\'g\'ri yeching',
    rewardCoins: 40,
    rewardXp: 60,
    completed: false,
    type: 'math'
  },
  {
    id: 'q_chess',
    title: 'Shaxmat yoki Shashka o\'yinida g\'alaba',
    description: 'Botga qarshi yoki do\'stingiz bilan shaxmat/shashka o\'ynab kamida 1 marta g\'olib bo\'ling',
    rewardCoins: 50,
    rewardXp: 70,
    completed: false,
    type: 'chess'
  },
  {
    id: 'q_rev',
    title: 'Ustozga samimiy baho berish',
    description: 'O\'qituvchilar reytingida kamida bitta ustozga xolis baho qoldiring',
    rewardCoins: 50,
    rewardXp: 40,
    completed: false,
    type: 'review'
  }
];

export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'item_gold_frame',
    title: 'VIP Oltin Profil Ramkasi',
    price: 300,
    description: 'Profilingiz va reytingda tilla rangli jilo bag\'ishlaydi',
    category: 'frame',
    iconName: 'Crown'
  },
  {
    id: 'item_pro_title',
    title: '"Olimpiadachi" Maxsus Unvoni',
    price: 250,
    description: 'Profilingizda "Olimpiadachi" faxriy nishoni paydo bo\'ladi',
    category: 'status',
    iconName: 'Award'
  },
  {
    id: 'item_star_badge',
    title: 'Intellektual Yulduz Belgisi',
    price: 200,
    description: 'Boshqa sinfdoshlar oldida alohida ajralib turuvchi belgi',
    category: 'badge',
    iconName: 'Sparkles'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  schoolName: "29-Maktab 8-Sinf Texnologiya Portali",
  heroTitle: "8-Sinf Texnologiya Fani & Multiplayer Portali",
  heroSubtitle: "29-sonli maktab 8-sinf o'quvchilari uchun texnologiya, duradgorlik, chilangarlik, elektrotexnika va texnologik xaritalar bo'yicha interaktiv bellashuv va ta'lim tizimi.",
  motto: "Hunarni o'rgan, mohir usta bo'l!",
  footerText: "© 2026 29-sonli maktab. 8-Sinf Texnologiya ta'limi. Made in Tursunboy."
};

const KEYS = {
  USERS: 'maktab29_users_v4',
  CURRENT_USER_ID: 'maktab29_current_user_id_v4',
  QUESTIONS: 'maktab29_questions_v4',
  TEACHERS: 'maktab29_teachers_v4',
  REVIEWS: 'maktab29_reviews_v4',
  PROMOS: 'maktab29_promocodes_v4',
  ANNOUNCEMENTS: 'maktab29_announcements_v4',
  HOMEWORK: 'maktab29_homework_v4',
  SCHEDULE: 'maktab29_schedule_v4',
  LIBRARY: 'maktab29_library_v4',
  QUESTS: 'maktab29_quests_v4',
  SETTINGS: 'maktab29_settings_v4',
  ROOMS: 'maktab29_rooms_v4',
  THEME: 'maktab29_theme_mode_v4',
  TEACHER_ACCOUNTS: 'maktab29_teacher_accounts_v4',
  CURRENT_TEACHER_ID: 'maktab29_current_teacher_id_v4',
  BOARD_ROOMS: 'maktab29_board_rooms_v4'
};

const KEY_TO_SECTION_MAP: Record<string, string> = {
  [KEYS.QUESTIONS]: 'questions',
  [KEYS.SCHEDULE]: 'schedule',
  [KEYS.TEACHERS]: 'teachers',
  [KEYS.SETTINGS]: 'settings',
  [KEYS.ANNOUNCEMENTS]: 'announcements',
  [KEYS.LIBRARY]: 'library',
  [KEYS.PROMOS]: 'promos',
  [KEYS.USERS]: 'users',
  [KEYS.ROOMS]: 'rooms',
  [KEYS.QUESTS]: 'quests',
  [KEYS.HOMEWORK]: 'homework',
  [KEYS.TEACHER_ACCOUNTS]: 'teacher_accounts',
  [KEYS.BOARD_ROOMS]: 'board_rooms'
};

let localServerVersion = 0;
let isPollingStarted = false;

async function checkServerUpdates() {
  try {
    const res = await fetch('/api/version');
    if (!res.ok) return;
    const info = await res.json();
    if (info.version && info.version > localServerVersion) {
      const fullRes = await fetch('/api/data');
      if (!fullRes.ok) return;
      const serverData = await fullRes.json();
      localServerVersion = info.version;

      let changed = false;
      for (const [key, section] of Object.entries(KEY_TO_SECTION_MAP)) {
        if (serverData[section] !== undefined) {
          localStorage.setItem(key, JSON.stringify(serverData[section]));
          changed = true;
        }
      }
      if (changed && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('admin_data_updated'));
      }
    }
  } catch {
    // offline or local-only fallback
  }
}

async function syncInitialToServer() {
  try {
    const payload: Record<string, any> = {};
    for (const [key, section] of Object.entries(KEY_TO_SECTION_MAP)) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          payload[section] = JSON.parse(raw);
        } catch {}
      }
    }

    const res = await fetch('/api/data/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const resData = await res.json();
      if (resData.version) {
        localServerVersion = resData.version;
      }
      if (resData.data) {
        let changed = false;
        for (const [key, section] of Object.entries(KEY_TO_SECTION_MAP)) {
          const val = resData.data[section];
          if (val !== undefined) {
            if (Array.isArray(val) && val.length > 0) {
              localStorage.setItem(key, JSON.stringify(val));
              changed = true;
            } else if (val && !Array.isArray(val)) {
              localStorage.setItem(key, JSON.stringify(val));
              changed = true;
            }
          }
        }
        if (changed && typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('admin_data_updated'));
        }
      }
    }
  } catch {
    // quiet fallback
  }
}

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('maktab29_broadcast_sync');
      channel.postMessage({ key, timestamp: Date.now() });
      channel.close();
    }

    // Persist to Express backend so changes apply across all devices!
    const section = KEY_TO_SECTION_MAP[key];
    if (section && typeof window !== 'undefined') {
      fetch('/api/data/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: value })
      })
      .then(r => r.json())
      .then(d => {
        if (d && d.version) {
          localServerVersion = d.version;
        }
      })
      .catch(() => {});
    }
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export function calculateLevel(xp: number): number {
  if (xp < 200) return 1;
  if (xp < 500) return 2;
  if (xp < 900) return 3;
  if (xp < 1400) return 4;
  if (xp < 2000) return 5;
  if (xp < 2800) return 6;
  if (xp < 3800) return 7;
  return Math.floor(xp / 500) + 1;
}

/**
 * Shuffles options for any question so that the correct answer is randomly distributed!
 */
export function shuffleQuestionOptions(q: TestQuestion): TestQuestion {
  const correctOptionText = q.options[q.correctIndex];
  const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
  const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

  return {
    ...q,
    options: shuffledOptions,
    correctIndex: newCorrectIndex !== -1 ? newCorrectIndex : 0
  };
}

export const StorageService = {
  init() {
    if (!localStorage.getItem(KEYS.USERS)) {
      setStorage(KEYS.USERS, []);
    }
    if (!localStorage.getItem(KEYS.QUESTIONS)) {
      setStorage(KEYS.QUESTIONS, INITIAL_QUESTIONS);
    }
    if (!localStorage.getItem(KEYS.TEACHERS)) {
      setStorage(KEYS.TEACHERS, INITIAL_TEACHERS);
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
      setStorage(KEYS.REVIEWS, INITIAL_REVIEWS);
    }
    if (!localStorage.getItem(KEYS.PROMOS)) {
      setStorage(KEYS.PROMOS, INITIAL_PROMOCODES);
    }
    if (!localStorage.getItem(KEYS.ANNOUNCEMENTS)) {
      setStorage(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    }
    if (!localStorage.getItem(KEYS.HOMEWORK)) {
      setStorage(KEYS.HOMEWORK, INITIAL_HOMEWORK);
    }
    if (!localStorage.getItem(KEYS.SCHEDULE)) {
      setStorage(KEYS.SCHEDULE, INITIAL_SCHEDULE);
    }
    if (!localStorage.getItem(KEYS.LIBRARY)) {
      setStorage(KEYS.LIBRARY, INITIAL_LIBRARY_BOOKS);
    }
    if (!localStorage.getItem(KEYS.QUESTS)) {
      setStorage(KEYS.QUESTS, INITIAL_QUESTS);
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      setStorage(KEYS.SETTINGS, INITIAL_SETTINGS);
    }
    if (!localStorage.getItem(KEYS.TEACHER_ACCOUNTS)) {
      setStorage(KEYS.TEACHER_ACCOUNTS, INITIAL_TEACHER_ACCOUNTS);
    }

    // Start background sync with server for cross-device updates
    if (typeof window !== 'undefined') {
      syncInitialToServer().then(() => {
        if (!isPollingStarted) {
          isPollingStarted = true;
          setInterval(checkServerUpdates, 2000);
          window.addEventListener('focus', checkServerUpdates);
          window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              checkServerUpdates();
            }
          });
        }
      });
    }
  },

  shuffleQuestionOptions(q: TestQuestion): TestQuestion {
    return shuffleQuestionOptions(q);
  },

  // USERS
  getUsers(): User[] {
    return getStorage<User[]>(KEYS.USERS, []);
  },

  saveUsers(users: User[]) {
    setStorage(KEYS.USERS, users);
  },

  getCurrentUser(): User | null {
    const currentId = localStorage.getItem(KEYS.CURRENT_USER_ID);
    if (!currentId) return null;
    const users = this.getUsers();
    return users.find(u => u.id === currentId) || null;
  },

  setCurrentUserId(id: string | null) {
    if (id) {
      localStorage.setItem(KEYS.CURRENT_USER_ID, id);
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER_ID);
    }
  },

  updateUser(updated: User): User {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updated.id);
    updated.level = calculateLevel(updated.xp);
    if (index !== -1) {
      users[index] = updated;
    } else {
      users.push(updated);
    }
    this.saveUsers(users);
    return updated;
  },

  addCoinsAndXp(userId: string, coinsDelta: number, xpDelta: number, badgeToUnlock?: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return null;

    user.coins = Math.max(0, user.coins + coinsDelta);
    user.xp = Math.max(0, user.xp + xpDelta);
    user.level = calculateLevel(user.xp);

    if (badgeToUnlock && !user.badges.includes(badgeToUnlock)) {
      user.badges.push(badgeToUnlock);
    }

    if (user.xp >= 1000 && !user.badges.includes('maktab_iftixori')) {
      user.badges.push('maktab_iftixori');
    }

    this.saveUsers(users);
    return user;
  },

  // QUESTIONS
  getQuestions(): TestQuestion[] {
    return getStorage<TestQuestion[]>(KEYS.QUESTIONS, INITIAL_QUESTIONS);
  },

  saveQuestions(questions: TestQuestion[]) {
    setStorage(KEYS.QUESTIONS, questions);
  },

  getShuffledQuestions(subject?: Subject | 'Aralash', count: number = 5): TestQuestion[] {
    const all = this.getQuestions();
    let filtered = !subject || subject === 'Aralash'
      ? all
      : all.filter(q => q.subject === subject);

    if (filtered.length === 0) filtered = all;

    const randomized = [...filtered].sort(() => Math.random() - 0.5).slice(0, count);
    return randomized.map(shuffleQuestionOptions);
  },

  addQuestion(question: Omit<TestQuestion, 'id'>): TestQuestion {
    const questions = this.getQuestions();
    const newQ: TestQuestion = {
      ...question,
      id: 'q_' + Date.now() + Math.random().toString(36).substring(2, 6)
    };
    questions.push(newQ);
    this.saveQuestions(questions);
    return newQ;
  },

  deleteQuestion(id: string) {
    const questions = this.getQuestions().filter(q => q.id !== id);
    this.saveQuestions(questions);
  },

  // REAL MULTIPLAYER ROOMS (SYNCED ACROSS TABS / WINDOWS / SESSIONS)
  getAllRooms(): Record<string, RealGameRoom> {
    return getStorage<Record<string, RealGameRoom>>(KEYS.ROOMS, {});
  },

  getRoom(code: string): RealGameRoom | null {
    const cleanCode = code.trim().toUpperCase();
    const rooms = this.getAllRooms();
    return rooms[cleanCode] || null;
  },

  saveRoom(room: RealGameRoom) {
    const rooms = this.getAllRooms();
    room.lastUpdated = Date.now();
    rooms[room.code] = room;
    setStorage(KEYS.ROOMS, rooms);
  },

  createRoom(host: User, subject: Subject | 'Aralash'): RealGameRoom {
    const code = 'MK-' + Math.floor(100 + Math.random() * 900);
    const questions = this.getShuffledQuestions(subject, 5);

    const newRoom: RealGameRoom = {
      code,
      hostId: host.id,
      hostName: host.fullName,
      hostAvatar: host.avatar,
      hostGrade: host.grade,
      subject,
      status: 'waiting',
      questions,
      currentQIndex: 0,
      hostScore: 0,
      guestScore: 0,
      hostAnswer: null,
      guestAnswer: null,
      hostAnswerTime: null,
      guestAnswerTime: null,
      roundTimeLeft: 12,
      roundOver: false,
      lastUpdated: Date.now()
    };

    this.saveRoom(newRoom);
    return newRoom;
  },

  joinRoom(code: string, guest: User): { success: boolean; message: string; room?: RealGameRoom } {
    const cleanCode = code.trim().toUpperCase();
    const room = this.getRoom(cleanCode);

    if (!room) {
      return { success: false, message: 'Bunday xona kodi topilmadi! Kodni tekshirib qaytadan kiriting.' };
    }

    if (room.hostId === guest.id) {
      return { success: true, message: 'Siz bu xonaning egasisiz.', room };
    }

    if (room.guestId && room.guestId !== guest.id) {
      return { success: false, message: 'Bu xonada allaqachon 2 kishi o\'ynamoqda!' };
    }

    room.guestId = guest.id;
    room.guestName = guest.fullName;
    room.guestAvatar = guest.avatar;
    room.guestGrade = guest.grade;
    room.status = 'ready';
    this.saveRoom(room);

    return { success: true, message: 'Xonaga muvaffaqiyatli ulandingiz!', room };
  },

  // -------------------------------------------------------------
  // SHAXMAT VA SHASHKA XONALARI (MULTIPLAYER DO'STLAR BILAN)
  // -------------------------------------------------------------
  getAllBoardRooms(): Record<string, BoardGameRoom> {
    return getStorage<Record<string, BoardGameRoom>>(KEYS.BOARD_ROOMS, {});
  },

  getBoardRoom(code: string): BoardGameRoom | null {
    const cleanCode = code.trim().toUpperCase();
    const rooms = this.getAllBoardRooms();
    return rooms[cleanCode] || null;
  },

  saveBoardRoom(room: BoardGameRoom) {
    const rooms = this.getAllBoardRooms();
    room.lastUpdated = Date.now();
    rooms[room.code] = room;
    setStorage(KEYS.BOARD_ROOMS, rooms);
  },

  createBoardRoom(host: User, gameType: BoardGameType): BoardGameRoom {
    const prefix = gameType === 'chess' ? 'CH-' : 'SH-';
    const code = prefix + Math.floor(100 + Math.random() * 900);

    const initialBoard = gameType === 'chess' 
      ? [
          ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
          ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
          ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
        ]
      : [
          ['', 'bM', '', 'bM', '', 'bM', '', 'bM'],
          ['bM', '', 'bM', '', 'bM', '', 'bM', ''],
          ['', 'bM', '', 'bM', '', 'bM', '', 'bM'],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['wM', '', 'wM', '', 'wM', '', 'wM', ''],
          ['', 'wM', '', 'wM', '', 'wM', '', 'wM'],
          ['wM', '', 'wM', '', 'wM', '', 'wM', '']
        ];

    const newRoom: BoardGameRoom = {
      code,
      gameType,
      hostId: host.id,
      hostName: host.fullName,
      hostAvatar: host.avatar,
      hostGrade: host.grade,
      boardState: JSON.stringify(initialBoard),
      currentTurn: 'white',
      status: 'waiting',
      moveHistory: [],
      lastUpdated: Date.now()
    };

    this.saveBoardRoom(newRoom);
    return newRoom;
  },

  joinBoardRoom(code: string, guest: User): { success: boolean; message: string; room?: BoardGameRoom } {
    const cleanCode = code.trim().toUpperCase();
    const room = this.getBoardRoom(cleanCode);

    if (!room) {
      return { success: false, message: 'Bunday o\'yin xonasi topilmadi! Kodni to\'g\'ri kiritganingizni tekshiring.' };
    }

    if (room.hostId === guest.id) {
      return { success: true, message: 'Siz bu xonaning egasisiz (Oq donalar).', room };
    }

    if (room.guestId && room.guestId !== guest.id) {
      return { success: false, message: 'Ushbu xonada allaqachon 2 kishi o\'ynamoqda!' };
    }

    room.guestId = guest.id;
    room.guestName = guest.fullName;
    room.guestAvatar = guest.avatar;
    room.guestGrade = guest.grade;
    room.status = 'playing';
    this.saveBoardRoom(room);

    return { success: true, message: 'Xonaga muvaffaqiyatli ulandingiz! Siz qora donalarda o\'ynaysiz.', room };
  },

  recordBoardGameWin(userId: string, gameType: BoardGameType, difficulty?: BotDifficulty): { coins: number; xp: number } {
    let coins = 60;
    let xp = 70;

    if (difficulty === 'easy') {
      coins = 40;
      xp = 50;
    } else if (difficulty === 'medium') {
      coins = 70;
      xp = 90;
    } else if (difficulty === 'hard') {
      coins = 120;
      xp = 150;
    }

    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      if (!user.stats) {
        user.stats = {
          duelsWon: 0,
          duelsPlayed: 0,
          testsCompleted: 0,
          reviewsGiven: 0,
          mathHighStreak: 0,
          questsCompleted: 0
        };
      }
      user.stats.boardGamesWon = (user.stats.boardGamesWon || 0) + 1;
      this.saveUsers(users);
    }

    this.addCoinsAndXp(userId, coins, xp, 'faol_ishtirokchi');
    return { coins, xp };
  },

  submitRoomAnswer(code: string, userId: string, answerIndex: number, timeLeft: number): RealGameRoom | null {
    const room = this.getRoom(code);
    if (!room) return null;

    const currentQ = room.questions[room.currentQIndex];
    if (!currentQ) return room;

    const isCorrect = answerIndex === currentQ.correctIndex;
    const addedPoints = isCorrect ? currentQ.points + Math.max(0, timeLeft * 2) : 0;

    if (userId === room.hostId && room.hostAnswer === null) {
      room.hostAnswer = answerIndex;
      room.hostAnswerTime = timeLeft;
      room.hostScore += addedPoints;
    } else if (userId === room.guestId && room.guestAnswer === null) {
      room.guestAnswer = answerIndex;
      room.guestAnswerTime = timeLeft;
      room.guestScore += addedPoints;
    }

    // Check if both answered
    if (room.hostAnswer !== null && (room.guestAnswer !== null || !room.guestId)) {
      room.roundOver = true;
    }

    this.saveRoom(room);
    return room;
  },

  advanceRoomRound(code: string): RealGameRoom | null {
    const room = this.getRoom(code);
    if (!room) return null;

    if (room.currentQIndex + 1 < room.questions.length) {
      room.currentQIndex += 1;
      room.hostAnswer = null;
      room.guestAnswer = null;
      room.hostAnswerTime = null;
      room.guestAnswerTime = null;
      room.roundTimeLeft = 12;
      room.roundOver = false;
    } else {
      room.status = 'finished';
      if (room.hostScore > room.guestScore) {
        room.winnerId = room.hostId;
      } else if (room.guestScore > room.hostScore) {
        room.winnerId = room.guestId;
      } else {
        room.winnerId = 'draw';
      }
    }

    this.saveRoom(room);
    return room;
  },

  // SCHEDULE MANAGEMENT (EDITABLE BY ADMIN)
  getSchedule(): LessonScheduleItem[] {
    return getStorage<LessonScheduleItem[]>(KEYS.SCHEDULE, INITIAL_SCHEDULE);
  },

  saveSchedule(items: LessonScheduleItem[]) {
    setStorage(KEYS.SCHEDULE, items);
  },

  addScheduleItem(item: Omit<LessonScheduleItem, 'id'>): LessonScheduleItem {
    const list = this.getSchedule();
    const newItem: LessonScheduleItem = {
      ...item,
      id: 'sch_' + Date.now() + Math.random().toString(36).substring(2, 5)
    };
    list.push(newItem);
    this.saveSchedule(list);
    return newItem;
  },

  updateScheduleItem(updated: LessonScheduleItem) {
    const list = this.getSchedule();
    const idx = list.findIndex(i => i.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
      this.saveSchedule(list);
    }
  },

  deleteScheduleItem(id: string) {
    const list = this.getSchedule().filter(i => i.id !== id);
    this.saveSchedule(list);
  },

  // TEACHERS MANAGEMENT (EDITABLE BY ADMIN)
  getTeachers(): Teacher[] {
    return getStorage<Teacher[]>(KEYS.TEACHERS, INITIAL_TEACHERS);
  },

  saveTeachers(teachers: Teacher[]) {
    setStorage(KEYS.TEACHERS, teachers);
  },

  addTeacher(teacher: Omit<Teacher, 'id' | 'reviewsCount' | 'averageRating'>): Teacher {
    const list = this.getTeachers();
    const newT: Teacher = {
      ...teacher,
      id: 't_' + Date.now(),
      reviewsCount: 0,
      averageRating: 5.0
    };
    list.push(newT);
    this.saveTeachers(list);
    return newT;
  },

  updateTeacher(updated: Teacher) {
    const list = this.getTeachers();
    const idx = list.findIndex(t => t.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
      this.saveTeachers(list);
    }
  },

  deleteTeacher(id: string) {
    const list = this.getTeachers().filter(t => t.id !== id);
    this.saveTeachers(list);
  },

  // LIBRARY MANAGEMENT (EDITABLE BY ADMIN)
  getLibraryBooks(): LibraryBook[] {
    return getStorage<LibraryBook[]>(KEYS.LIBRARY, INITIAL_LIBRARY_BOOKS);
  },

  saveLibraryBooks(books: LibraryBook[]) {
    setStorage(KEYS.LIBRARY, books);
  },

  addLibraryBook(book: Omit<LibraryBook, 'id'>): LibraryBook {
    const list = this.getLibraryBooks();
    const newB: LibraryBook = {
      ...book,
      id: 'b_' + Date.now()
    };
    list.push(newB);
    this.saveLibraryBooks(list);
    return newB;
  },

  deleteLibraryBook(id: string) {
    const list = this.getLibraryBooks().filter(b => b.id !== id);
    this.saveLibraryBooks(list);
  },

  // HOMEWORK
  getHomework(): HomeworkItem[] {
    return getStorage<HomeworkItem[]>(KEYS.HOMEWORK, INITIAL_HOMEWORK);
  },

  toggleHomework(id: string): HomeworkItem[] {
    const list = this.getHomework();
    const item = list.find(h => h.id === id);
    if (item) {
      item.completed = !item.completed;
      setStorage(KEYS.HOMEWORK, list);
    }
    return list;
  },

  addHomework(hw: Omit<HomeworkItem, 'id' | 'completed'>): HomeworkItem {
    const list = this.getHomework();
    const newItem: HomeworkItem = {
      ...hw,
      id: 'hw_' + Date.now(),
      completed: false
    };
    list.unshift(newItem);
    setStorage(KEYS.HOMEWORK, list);
    return newItem;
  },

  deleteHomework(id: string) {
    const list = this.getHomework().filter(h => h.id !== id);
    setStorage(KEYS.HOMEWORK, list);
  },

  // QUESTS WITH REAL CONDITION CHECK
  getQuests(): DailyQuest[] {
    return getStorage<DailyQuest[]>(KEYS.QUESTS, INITIAL_QUESTS);
  },

  canClaimQuest(quest: DailyQuest, user: User, homeworkList: HomeworkItem[]): { canClaim: boolean; reason?: string } {
    if (quest.completed) {
      return { canClaim: false, reason: 'Ushbu missiya allaqachon bajarilgan.' };
    }

    if (quest.type === 'duel') {
      if ((user.stats?.duelsWon || 0) < 1) {
        return { 
          canClaim: false, 
          reason: 'Shart bajarilmagan: 1v1 viktorina duelida kamida 1 marta g\'alaba qozonishingiz kerak!' 
        };
      }
    } else if (quest.type === 'math') {
      if ((user.stats?.mathHighStreak || 0) < 5) {
        return { 
          canClaim: false, 
          reason: 'Shart bajarilmagan: Arifmetika poygasida ketma-ket kamida 5 ta to\'g\'ri javob (streak) to\'plashingiz kerak!' 
        };
      }
    } else if (quest.type === 'chess' || quest.type === 'homework') {
      if ((user.stats?.boardGamesWon || 0) < 1 && (!homeworkList || !homeworkList.some(h => h.completed))) {
        return { 
          canClaim: false, 
          reason: 'Shart bajarilmagan: Shaxmat yoki Shashka o\'yinida kamida 1 marta g\'alaba qozonishingiz kerak!' 
        };
      }
    } else if (quest.type === 'review') {
      if ((user.stats?.reviewsGiven || 0) < 1) {
        return { 
          canClaim: false, 
          reason: 'Shart bajarilmagan: O\'qituvchilar bo\'limida kamida 1 ta ustozga xolis baho qoldirishingiz kerak!' 
        };
      }
    }

    return { canClaim: true };
  },

  claimQuest(questId: string, user: User, homeworkList: HomeworkItem[]): { success: boolean; message: string } {
    const quests = this.getQuests();
    const q = quests.find(item => item.id === questId);
    if (!q) return { success: false, message: 'Missiya topilmadi.' };

    const check = this.canClaimQuest(q, user, homeworkList);
    if (!check.canClaim) {
      return { success: false, message: check.reason || 'Shartlar bajarilmagan!' };
    }

    q.completed = true;
    setStorage(KEYS.QUESTS, quests);

    // Update stats & currency
    const users = this.getUsers();
    const u = users.find(x => x.id === user.id);
    if (u) {
      u.stats.questsCompleted = (u.stats.questsCompleted || 0) + 1;
      this.saveUsers(users);
    }

    this.addCoinsAndXp(user.id, q.rewardCoins, q.rewardXp);
    return { 
      success: true, 
      message: `Ajoyib! Missiya tasdiqlandi: +${q.rewardCoins} Coin va +${q.rewardXp} XP hisobingizga qo'shildi!` 
    };
  },

  // REVIEWS
  getReviews(): TeacherReview[] {
    return getStorage<TeacherReview[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  },

  addReview(review: Omit<TeacherReview, 'id' | 'date' | 'likes'>, userId?: string): TeacherReview {
    const reviews = this.getReviews();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const newRev: TeacherReview = {
      ...review,
      id: 'rev_' + Date.now(),
      date: dateStr,
      likes: 0
    };
    reviews.unshift(newRev);
    setStorage(KEYS.REVIEWS, reviews);

    const teachers = this.getTeachers();
    const teacher = teachers.find(t => t.id === review.teacherId);
    if (teacher) {
      const teacherReviews = reviews.filter(r => r.teacherId === review.teacherId);
      const totalScore = teacherReviews.reduce((acc, r) => {
        const avgCriteria = (r.ratings.teaching + r.ratings.ethics + r.ratings.care + r.ratings.engaging + r.ratings.fairness) / 5;
        return acc + avgCriteria;
      }, 0);
      teacher.reviewsCount = teacherReviews.length;
      teacher.averageRating = Number((totalScore / teacherReviews.length).toFixed(2));
      this.saveTeachers(teachers);
    }

    if (userId) {
      const users = this.getUsers();
      const user = users.find(u => u.id === userId);
      if (user) {
        user.stats.reviewsGiven += 1;
        this.addCoinsAndXp(userId, 50, 40, 'odobli_tahlilchi');
      }
    }

    return newRev;
  },

  likeReview(reviewId: string) {
    const reviews = this.getReviews();
    const rev = reviews.find(r => r.id === reviewId);
    if (rev) {
      rev.likes += 1;
      setStorage(KEYS.REVIEWS, reviews);
    }
  },

  // SHOP
  buyShopItem(userId: string, item: ShopItem): { success: boolean; message: string } {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'Foydalanuvchi topilmadi' };

    if (!user.inventory) user.inventory = [];
    if (user.inventory.includes(item.id)) {
      return { success: false, message: 'Siz allaqachon bu buyumni xarid qilgansiz!' };
    }
    if (user.coins < item.price) {
      return { success: false, message: 'Hisobingizda yetarli coin mavjud emas!' };
    }

    user.coins -= item.price;
    user.inventory.push(item.id);
    this.saveUsers(users);
    return { success: true, message: `"${item.title}" muvaffaqiyatli xarid qilindi!` };
  },

  // PROMOS
  getPromos(): PromoCode[] {
    return getStorage<PromoCode[]>(KEYS.PROMOS, INITIAL_PROMOCODES);
  },

  savePromos(promos: PromoCode[]) {
    setStorage(KEYS.PROMOS, promos);
  },

  claimPromo(codeStr: string, userId: string): { success: boolean; message: string; coins?: number; xp?: number } {
    const cleanCode = codeStr.trim().toUpperCase();
    const promos = this.getPromos();
    const promo = promos.find(p => p.code.toUpperCase() === cleanCode);

    if (!promo) return { success: false, message: 'Bunday promokod topilmadi!' };
    if (!promo.active) return { success: false, message: 'Ushbu promokod muddati tugagan.' };
    if (promo.usedCount >= promo.maxUses) return { success: false, message: 'Promokod limiti to\'lgan.' };

    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'Foydalanuvchi topilmadi.' };

    if (user.claimedPromos.includes(cleanCode)) {
      return { success: false, message: 'Siz bu promokoddan foydalangansiz!' };
    }

    promo.usedCount += 1;
    this.savePromos(promos);

    user.claimedPromos.push(cleanCode);
    user.coins += promo.coins;
    user.xp += promo.xp;
    user.level = calculateLevel(user.xp);
    this.saveUsers(users);

    return { 
      success: true, 
      message: `Tabriklaymiz! +${promo.coins} Coin va +${promo.xp} XP qo'shildi!`,
      coins: promo.coins,
      xp: promo.xp
    };
  },

  // ANNOUNCEMENTS
  getAnnouncements(): Announcement[] {
    return getStorage<Announcement[]>(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  saveAnnouncements(announcements: Announcement[]) {
    setStorage(KEYS.ANNOUNCEMENTS, announcements);
  },

  addAnnouncement(announcement: Omit<Announcement, 'id' | 'date'>): Announcement {
    const list = this.getAnnouncements();
    const newAnn: Announcement = {
      ...announcement,
      id: 'ann_' + Date.now(),
      date: new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    list.unshift(newAnn);
    this.saveAnnouncements(list);
    return newAnn;
  },

  deleteAnnouncement(id: string) {
    const list = this.getAnnouncements().filter(a => a.id !== id);
    this.saveAnnouncements(list);
  },

  // SETTINGS
  getSettings(): SiteSettings {
    return getStorage<SiteSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  saveSettings(settings: SiteSettings) {
    setStorage(KEYS.SETTINGS, settings);
  },

  // THEME
  getTheme(): 'dark' | 'light' {
    const stored = localStorage.getItem(KEYS.THEME);
    if (stored === 'dark' || stored === 'light') return stored;
    return 'light';
  },

  setTheme(theme: 'dark' | 'light') {
    localStorage.setItem(KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // TEACHER ACCOUNTS & AUTH
  getTeacherAccounts(): TeacherAccount[] {
    return getStorage<TeacherAccount[]>(KEYS.TEACHER_ACCOUNTS, INITIAL_TEACHER_ACCOUNTS);
  },

  saveTeacherAccounts(accounts: TeacherAccount[]) {
    setStorage(KEYS.TEACHER_ACCOUNTS, accounts);
  },

  getCurrentTeacher(): TeacherAccount | null {
    const id = localStorage.getItem(KEYS.CURRENT_TEACHER_ID);
    if (!id) return null;
    const teachers = this.getTeacherAccounts();
    return teachers.find(t => t.id === id) || null;
  },

  setCurrentTeacherId(id: string | null) {
    if (id) {
      localStorage.setItem(KEYS.CURRENT_TEACHER_ID, id);
    } else {
      localStorage.removeItem(KEYS.CURRENT_TEACHER_ID);
    }
  },

  registerTeacher(fullName: string, subject: string, username: string, password: string): { success: boolean; message: string; teacher?: TeacherAccount } {
    const cleanU = username.trim().toLowerCase();
    const cleanName = fullName.trim();
    if (!cleanName || !cleanU || !password.trim()) {
      return { success: false, message: "Ism, fan, login va parolni to'ldirish shart!" };
    }
    const accounts = this.getTeacherAccounts();
    if (accounts.some(a => a.username.toLowerCase() === cleanU)) {
      return { success: false, message: "Bu login bilan o'qituvchi allaqachon mavjud!" };
    }

    const newTeacher: TeacherAccount = {
      id: 'teacher_' + Date.now(),
      fullName: cleanName,
      subject: subject.trim() || 'Texnologiya',
      username: cleanU,
      password: password.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    accounts.push(newTeacher);
    this.saveTeacherAccounts(accounts);
    this.setCurrentTeacherId(newTeacher.id);
    return { success: true, message: `Xush kelibsiz, ${newTeacher.fullName}!`, teacher: newTeacher };
  },

  loginTeacher(username: string, password: string): { success: boolean; message: string; teacher?: TeacherAccount } {
    const cleanU = username.trim().toLowerCase();
    const accounts = this.getTeacherAccounts();
    const teacher = accounts.find(a => 
      a.username.toLowerCase() === cleanU && 
      (a.password ? a.password === password : true)
    );
    if (!teacher) {
      return { success: false, message: "O'qituvchi logini yoki paroli noto'g'ri!" };
    }
    this.setCurrentTeacherId(teacher.id);
    return { success: true, message: `Xush kelibsiz, ${teacher.fullName}!`, teacher };
  },

  logoutTeacher() {
    this.setCurrentTeacherId(null);
  },

  // MODIFY STUDENT POINTS (COIN / XP) BY TEACHER OR ADMIN
  modifyStudentPoints(studentId: string, coinDelta: number, xpDelta: number, _reason?: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.id === studentId);
    if (!user) {
      return { success: false, message: "O'quvchi topilmadi!" };
    }

    user.coins = Math.max(0, user.coins + coinDelta);
    user.xp = Math.max(0, user.xp + xpDelta);
    user.level = calculateLevel(user.xp);

    this.saveUsers(users);

    const coinSign = coinDelta >= 0 ? `+${coinDelta}` : `${coinDelta}`;
    const xpSign = xpDelta >= 0 ? `+${xpDelta}` : `${xpDelta}`;
    const msg = `${user.fullName}: ${coinSign} Coin, ${xpSign} XP muvaffaqiyatli saqlandi!`;
    return { success: true, message: msg, user };
  },

  // DAILY BONUS FOR STUDENTS
  canClaimDailyBonus(user: User): boolean {
    const today = new Date().toISOString().split('T')[0];
    return user.lastDailyBonusDate !== today;
  },

  getDailyBonusDay(user: User): number {
    const streak = user.dailyBonusStreak || 0;
    return (streak % 7) + 1; // 1 to 7
  },

  claimDailyBonus(userId: string): { success: boolean; message: string; coinsEarned: number; xpEarned: number; streak: number } {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: "Foydalanuvchi topilmadi", coinsEarned: 0, xpEarned: 0, streak: 0 };
    }

    const today = new Date().toISOString().split('T')[0];
    if (user.lastDailyBonusDate === today) {
      return { success: false, message: "Bugungi kunlik bonusni allaqachon olgansiz! Ertaga yana kiring.", coinsEarned: 0, xpEarned: 0, streak: user.dailyBonusStreak || 1 };
    }

    // Check if streak is continuous
    let streak = user.dailyBonusStreak || 0;
    if (user.lastDailyBonusDate) {
      const lastDate = new Date(user.lastDailyBonusDate);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak = streak >= 7 ? 1 : streak + 1;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    const dayNumber = streak;
    const rewardsMap: Record<number, { coins: number; xp: number }> = {
      1: { coins: 30, xp: 25 },
      2: { coins: 50, xp: 45 },
      3: { coins: 80, xp: 70 },
      4: { coins: 120, xp: 100 },
      5: { coins: 160, xp: 140 },
      6: { coins: 200, xp: 180 },
      7: { coins: 300, xp: 250 }
    };

    const reward = rewardsMap[dayNumber] || { coins: 50, xp: 50 };
    user.coins += reward.coins;
    user.xp += reward.xp;
    user.level = calculateLevel(user.xp);
    user.lastDailyBonusDate = today;
    user.dailyBonusStreak = streak;

    if (streak >= 7 && !user.badges.includes('faol_ishtirokchi')) {
      user.badges.push('faol_ishtirokchi');
    }

    this.saveUsers(users);

    return {
      success: true,
      message: `Kunlik ${dayNumber}-kun bonusi: +${reward.coins} Coin va +${reward.xp} XP qo'shildi!`,
      coinsEarned: reward.coins,
      xpEarned: reward.xp,
      streak
    };
  }
};
