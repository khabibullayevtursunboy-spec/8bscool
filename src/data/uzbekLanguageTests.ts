export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const UZBEK_LANGUAGE_TESTS: { [key: string]: TestQuestion[] } = {
  "6-sinf": [
    {
      id: 1,
      question: "Qaysi so'zda qo'shaloq undosh harf xato yozilgan?",
      options: ["metall", "kommunal", "gramatika", "parallelogramm"],
      correctIndex: 2,
      explanation: "\"Grammatika\" so'zi ikkita 'm' bilan yozilishi kerak."
    },
    {
      id: 2,
      question: "Fe'lning bo'lishsiz shaklini hosil qiluvchi qo'shimchani toping.",
      options: ["-ma, -mas", "-di, -kan", "-gan, -yatgan", "-moq, -ish"],
      correctIndex: 0,
      explanation: "Fe'lga -ma (yoki -mas) qo'shimchasi qo'shilish orqali bo'lishsizlik bildiradi."
    },
    {
      id: 3,
      question: "Qaysi qatordagi so'zlarning barchasi ot turkumiga oid?",
      options: ["kitob, yugurmoq, qalam", "maktab, o'quvchi, daftar", "chiroyli, daraxt, sariq", "o'qidi, yozdi, keldi"],
      correctIndex: 1,
      explanation: "Maktab, o'quvchi va daftar so'zlari narsa-buyum va shaxsni bildirib, ot turkumiga kiradi."
    },
    {
      id: 4,
      question: "Tub so'zni aniqlang.",
      options: ["tuzli", "paxtakor", "bog'bon", "qalam"],
      correctIndex: 3,
      explanation: "\"Qalam\" so'zi asosiy ma'no qismiga bo'linmaydigan tub so'z."
    },
    {
      id: 5,
      question: "Gapda qaysi bo'lak bosh bo'lak hisoblanadi?",
      options: ["To'ldiruvchi", "Hol", "Ega va Kesim", "Aniqlovchi"],
      correctIndex: 2,
      explanation: "Ega va kesim gapning grammatik asosini tashkil etib, bosh bo'laklar deyiladi."
    },
    {
      id: 6,
      question: "Qaysi so'z yasama so'z hisoblanadi?",
      options: ["suvchi", "kitob", "suv", "qalam"],
      correctIndex: 0,
      explanation: "\"Suvchi\" so'zi suv otidan -chi qo'shimchasi yordamida yasalgan."
    },
    {
      id: 7,
      question: "Sifat darajalarini ko'rsating.",
      options: ["O'tgan, hozirgi, kelasi", "Oddiy, orttirma, qiyosiy", "Tub, yasama, qo'shma", "Birlik, ko'plik"],
      correctIndex: 1,
      explanation: "Sifatlar oddiy, qiyosiy va orttirma darajalarga ega bo'ladi."
    },
    {
      id: 8,
      question: "Qaysi qatorda imxosi xato so'z berilgan?",
      options: ["adolat", "sahovat", "sahro", "mulohaza"],
      correctIndex: 2,
      explanation: "\"Sahro\" so'zi 'h' harfi bilan yoziladi, lekin ba'zan xato yozilishi mumkin (lekin bu yerda to'g'ri berilgan variantlar ichidan xatosini topish uchun boshqa misol ko'riladi: masalan, 'mexribon' o'rniga 'mehribon')."
    },
    {
      id: 9,
      question: "Sonlar ma'no jihatdan nechta turga bo'linadi?",
      options: ["3 ta", "5 ta", "6 ta", "2 ta"],
      correctIndex: 2,
      explanation: "Sonlar ma'no jihatdan 6 turga bo'linadi: miqdor, tartib, jamlovchi, taqsimiy, kasr va taxmin sonlar."
    },
    {
      id: 10,
      question: "Darak gap oxiriga qaysi tinish belgisi qo'yiladi?",
      options: ["So'roq belgisi (?)", "Undov belgisi (!)", "Nuqta (.)", "Vergul (,)"],
      correctIndex: 2,
      explanation: "Darak gaplar ma'lum bir voqea-hodisa haqida darak beradi va oxiriga nuqta qo'yiladi."
    },
    {
      id: 11,
      question: "Qaysi olmosh shaxs olmoshiga kiradi?",
      options: ["bu", "kim", "men", "hamma"],
      correctIndex: 2,
      explanation: "\"Men\" so'zi shaxs-predmetni bildiruvchi shaxs olmoshidir."
    },
    {
      id: 12,
      question: "Fe'lning zamonlarini aniqlang.",
      options: ["O'tgan, hozirgi, kelasi", "Aniq, gumon, shart", "Sodda, qo'shma", "Bo'lishli, bo'lishsiz"],
      correctIndex: 0,
      explanation: "Fe'llar ish-harakatning bajarilish paytiga ko'ra o'tgan, hozirgi va kelasi zamonlarga bo'linadi."
    },
    {
      id: 13,
      question: "Uy داشlashgan bo'laklar orasiga qaysi tinish belgisi qo'yiladi?",
      options: ["Nuqta", "Vergul", "Ikki nuqta", "tire"],
      correctIndex: 1,
      explanation: "Uyushiq bo'laklar bir xil so'roqqa javob bo'lib, o'zaro vergul bilan ajratiladi."
    },
    {
      id: 14,
      question: "Qaysi so'zda o'zak va qo'shimcha to'g'ri ajratilgan?",
      options: ["gul-zor", "maktab-lar", "kitob-im", "barchasi to'g'ri"],
      correctIndex: 3,
      explanation: "Berilgan barcha so'zlarda o'zak va yasovchi/grammatik qo'shimchalar to'g'ri ajratilgan."
    },
    {
      id: 15,
      question: "Tilimizda nechta unli tovush bor?",
      options: ["24 ta", "6 ta", "5 ta", "32 ta"],
      correctIndex: 1,
      explanation: "O'zbek tilida 6 ta unli tovush mavjud: a, o', u, i, e, o."
    },
    {
      id: 16,
      question: "So'z birikmasining asosiy qismlari nima deb ataladi?",
      options: ["Ega va kesim", "Hokim va tobe so'z", "Old va oxirgi so'z", "Asos va qo'shimcha"],
      correctIndex: 1,
      explanation: "So'z birikmasi hokim va tobe so'zlardan tashkil topadi."
    },
    {
      id: 17,
      question: "Qaysi qatorda ko'makchili qurilma berilgan?",
      options: ["bilan, uchun, kabi", "va, yoki, ammo", "lekin, biroq, ham", "oh, eh, baq"],
      correctIndex: 0,
      explanation: "Bilan, uchun, kabi so'zlari ko'makchi hisoblanadi."
    },
    {
      id: 18,
      question: "Undov so'zlar nimani bildiradi?",
      options: ["Buyruqni", "His-hayajon va undovni", "Belgini", "Harakatni"],
      correctIndex: 1,
      explanation: "Undovlar so'zlovchining turli xil his-hayajonlarini bildiradi."
    },
    {
      id: 19,
      question: "Qaysi gap so'roq gap hisoblanadi?",
      options: ["Kitobni o'qi.", "Bugun maktabga bormaysanmi?", "Qani edi borgan bo'lsam.", "Nafis musiqa tinglaymiz."],
      correctIndex: 1,
      explanation: "Javob olish maqsadida aytilgan gaplar so'roq gaplardir."
    },
    {
      id: 20,
      question: "Ma'nodosh so'zlarni toping.",
      options: ["katta - kichik", "chiroyli - go'zal", "oq - qora", "issiq - sovuq"],
      correctIndex: 1,
      explanation: "Chiroyli va go'zal so'zlari bir xil ma'noni anglatuvchi ma'nodosh (sinonim) so'zlardir."
    },
    {
      id: 21,
      question: "Fe'lning bo'lishli shaklini toping.",
      options: ["kelma", "o'qimadi", "yozdi", "bor-ma"],
      correctIndex: 2,
      explanation: "\"Yozdi\" so'zi harakatning bajarilishini bildiruvchi bo'lishli fe'ldir."
    },
    {
      id: 22,
      question: "Sifat so'z turkumining so'roqlari qaysi?",
      options: ["Kim? Nima?", "Qanday? Qaysi?", "Qancha? Necha?", "Nima qildi?"],
      correctIndex: 1,
      explanation: "Sifat narsa-buyumning belgisini bildirib, qanday? qaysi? so'roqlariga javob bo'ladi."
    },
    {
      id: 23,
      question: "Otning kelishiklari nechta?",
      options: ["4 ta", "6 ta", "5 ta", "3 ta"],
      correctIndex: 0,
      explanation: "O'zbek tilida otning 6 ta kelishigi bor: Bosh, Qaratish, Tushum, O'rin-payt, Chiqish, Jo'nalish."
    },
    {
      id: 24,
      question: "Qaysi qatorda qo'shma so'z berilgan?",
      options: ["temiryo'l", "gulzor", "suvchi", "ishchi"],
      correctIndex: 0,
      explanation: "\"Temiryo'l\" so'zi ikki mustaqil so'zning qo'shilishidan hosil bo'lgan."
    },
    {
      id: 25,
      question: "Matn nima?",
      options: ["Bitta so'z", "O'zaro mazmunan bog'langan gaplar", "Faqat undov gaplar", "So'z birikmasi"],
      correctIndex: 1,
      explanation: "Matn mazmunan va grammatik jihatdan o'zaro bog'langan ikki yoki undan ortiq gaplardan tuziladi."
    }
  ],
  "7-sinf": [
    {
      id: 1,
      question: "Fe'lning nisbatlarini ko'rsating.",
      options: ["Bo'lishli va bo'lishsiz", "O'timli va o'timsiz", "Aniq, majhul, o'zlik, orttirma, birgalik", "Hozirgi va o'tgan"],
      correctIndex: 2,
      explanation: "Fe'l nisbatlari 5 taga bo'linadi: aniq, majhul, o'zlik, orttirma va birgalik nisbatlar."
    },
    {
      id: 2,
      question: "Ravish so'z turkumi nimani bildiradi?",
      options: ["Predmetning belgisini", "Harakatning belgi, payt, sabab va tarzini", "Narsa nomini", "Soni va miqdorini"],
      correctIndex: 1,
      explanation: "Ravish harakat yoki holatning bajarilish tarzi, payti, o'rni va darajasini bildiradi."
    },
    {
      id: 3,
      question: "Qaysi qatorda o'timli fe'l berilgan?",
      options: ["uxlamoq", "kulmoq", "kitobni o'qimoq", "yugurmoq"],
      correctIndex: 2,
      explanation: "Tushum kelishigidagi so'z bilan bog'lana oladigan fe'llar o'timli fe'llar deyiladi."
    },
    {
      id: 4,
      question: "Takroriy so'zlar qanday yoziladi?",
      options: ["Doim qo'shib", "Chiziqcha (-) bilan", "Alohida", "Vergul bilan"],
      correctIndex: 1,
      explanation: "Takroriy so'zlar qismlari orasiga chiziqcha qo'yib yoziladi (masalan: sekin-sekin)."
    },
    {
      id: 5,
      question: "Qaysi qatorda sof ko'makchi berilgan?",
      options: ["uchun, kabi, singari", "oldida, yonida, ostida", "tufayli, sababli", "bilan, qarab"],
      correctIndex: 0,
      explanation: "Uchun, kabi, singari kabi so'zlar sof ko'makchilardir."
    },
    {
      id: 6,
      question: "Ergashgan qo'shma gaplarda qismlar qanday bog'lanadi?",
      options: ["Faqat ohang yordamida", "Bog'lovchi va bog'lovchi vositalar yordamida", "Faqat vergul bilan", "Qo'shish yo'li bilan"],
      correctIndex: 1,
      explanation: "Ergashgan qo'shma gapda bosh va ergash gaplar ko'makchi, bog'lovchi va nisbiy so'zlar bilan bog'lanadi."
    },
    {
      id: 7,
      question: "Sintaksis nimani o'rganadi?",
      options: ["So'zlarning tuzilishini", "So'z birikmasi va gaplarni", "Tovushlarni", "Imloni"],
      correctIndex: 1,
      explanation: "Sintaksis bo'limi so'z birikmasi va gaplarning tuzilish qoidalarini o'rganadi."
    },
    {
      id: 8,
      question: "Qaysi so'zda ma'no ko'chishi (metofora) mavjud?",
      options: ["stolning oyog'i", "qalamning uchi", "daftar varaqlari", "uyning eshigi"],
      correctIndex: 0,
      explanation: "\"Stolning oyog'i\" deganda o'xshatish asosida ma'no ko'chishi (metafora) sodir bo'lgan."
    },
    {
      id: 9,
      question: "Frazeologizmni toping.",
      options: ["kitob o'qimoq", "ko'z to'ymoq", "maktabga bormoq", "suv ichmoq"],
      correctIndex: 1,
      explanation: "\"Ko'z to'ymoq\" – tayyor ma'noli barqaror so'z birikmasi (frazeologizm)."
    },
    {
      id: 10,
      question: "Orttirma nisbat qo'shimchasi qaysi?",
      options: ["-il, -in", "-tir, -giz, -kaz", "-ish", "-dir"],
      correctIndex: 1,
      explanation: "Orttirma nisbat -tir, -giz, -kaz, -t, -ar kabi qo'shimchalar yordamida yasaladi."
    },
    {
      id: 11,
      question: "Undalma gapda qanday vazifani bajaradi?",
      options: ["Bosh bo'lak bo'ladi", "Gap bo'lagi bo'lmaydi", "To'ldiruvchi bo'ladi", "Hol vazifasini bajaradi"],
      correctIndex: 1,
      explanation: "Undalmalar gap bo'laklari bilan grammatik bog'lanmaydi va gap bo'lagi hisoblanmaydi."
    },
    {
      id: 12,
      question: "Bog'lovchisiz qo'shma gap qismlari nima orqali bog'lanadi?",
      options: ["Faqat intonatsiya (ohang)", "Bog'lovchilar", "Ko'makchilar", "Yuklamalar"],
      correctIndex: 0,
      explanation: "Bog'lovchisiz qo'shma gaplar asosan ohang (intonatsiya) yordamida birikadi."
    },
    {
      id: 13,
      question: "Qaysi so'zda imlo xatosi bor?",
      options: ["ma'suliyat", "mas'uliyat", "tashabbus", "adabiyot"],
      correctIndex: 0,
      explanation: "To'g'ri yozilishi: \"mas'uliyat\" (tutuq belgisi bilan)."
    },
    {
      id: 14,
      question: "Fe'lning xususiy shakllari qaysilar?",
      options: ["Sifatdosh, ravishdosh, harakat nomi", "Aniq, buyruq, shart", "O'timli, o'timsiz", "Bo'lishli, bo'lishsiz"],
      correctIndex: 0,
      explanation: "Sifatdosh, ravishdosh va harakat nomi fe'lning o'ziga xos xususiy shakllari sanaladi."
    },
    {
      id: 15,
      question: "Harakat nomini yasovchi qo'shimchalar qaysilar?",
      options: ["-gan, -ayotgan", "-sh, -ch, -mak", "-ib, -gach", "-ar, -mas"],
      correctIndex: 1,
      explanation: "Harakat nomi fe'l o'zagiga -sh (-ish), -uv, -mak qo'shilishi bilan yasaladi."
    },
    {
      id: 16,
      question: "Qaysi qatorda holning turi xato ko'rsatilgan?",
      options: ["Payt holi", "O'rin holi", "Sabab holi", "Shaxs holi"],
      correctIndex: 3,
      explanation: "\"Shaxs holi\" degan hol turi o'zbek tilida mavjud emas."
    },
    {
      id: 17,
      question: "Qaysi so'z tarkibida orttirma nisbat qo'shimchasi bor?",
      options: ["yozildi", "kulishdi", "qildirmoq", "kiyindi"],
      correctIndex: 2,
      explanation: "\"Qildirmoq\" so'zidagi -tir (-dir) qo'shimchasi orttirma nisbatni hosil qilgan."
    },
    {
      id: 18,
      question: "Ravishlar ma'nosiga ko'ra nechta turga bo'linadi?",
      options: ["3 ta", "4 ta", "5 ta", "6 ta"],
      correctIndex: 1,
      explanation: "Ravishlar 4 turga bo'linadi: payt, o'rin, daraja-miqdor va tarz ravishlari."
    },
    {
      id: 19,
      question: "Ko'makchilar qaysi so'z turkumidan keyin keladi?",
      options: ["Faqat fe'ldan keyin", "Ot va otlashgan so'zlardan keyin", "Faqat olmoshdan keyin", "Ravishdan keyin"],
      correctIndex: 1,
      explanation: "Ko'makchilar ot va ot vazifasida keluvchi so'zlardan keyin keladi."
    },
    {
      id: 20,
      question: "Birgalik nisbat qo'shimchasi qaysi?",
      options: ["-ish", "-dir", "-in", "-il"],
      correctIndex: 0,
      explanation: "Birgalik nisbat fe'l asosiga -ish (-sh) qo'shimchasini qo'shish bilan yasaladi."
    },
    {
      id: 21,
      question: "Qaysi qatorda uyushiq bo'lakli gap berilgan?",
      options: ["Men kitob o'qidim.", "Bog'da olma, o'rik, gilos pishdi.", "U uyga keldi va ovqatlandi.", "Quyosh charaqlab chiqdi."],
      correctIndex: 1,
      explanation: "\"Olma, o'rik, gilos\" bir xil so'roqqa javob bo'lib, uyushiq bo'lakni tashkil etgan."
    },
    {
      id: 22,
      question: "Qanday qo'shma gaplar teng bog'langan qo'shma gaplar deyiladi?",
      options: ["Qismlari teng huquqli bo'lib, bog'lovchilar bilan birikkan", "Biri ikkinchisiga tobe bo'lgan", "Faqat ohang bilan bog'langan", "Ergashgan gapli"],
      correctIndex: 0,
      explanation: "Teng bog'langan qo'shma gap qismlari grammatik jihatdan o'zaro teng huquqli bo'ladi."
    },
    {
      id: 23,
      question: "Moddiy (tub) va ko'chma ma'noli so'zlar qaysi bo'limda o'rganiladi?",
      options: ["Fonetika", "Leksikologiya", "Sintaksis", "Morfologiya"],
      correctIndex: 1,
      explanation: "Leksikologiya bo'limi so'zlarning ma'nosi, ularning ko'chish turlarini o'rganadi."
    },
    {
      id: 24,
      question: "Yuklamalar gapga qanday vazifa yuklaydi?",
      options: ["Yangi so'z yasaydi", "Qo'shimcha ma'no nozikliklarini kiritadi", "Faqat ega bo'ladi", "So'zlarni bog'laydi"],
      correctIndex: 1,
      explanation: "Yuklamalar so'z yoki gapga qo'shimcha ma'no va ifodalilik bag'ishlaydi."
    },
    {
      id: 25,
      question: "Sifatdosh qaysi qo'shimchalar yordamida yasaladi?",
      options: ["-gan, -iyotgan, -r, -acak", "-sh, -mak", "-ib, -gach", "-cha, -larcha"],
      correctIndex: 0,
      explanation: "Sifatdosh fe'lga -gan, -kan, -r, -ajak kabi qo'shimchalarning qo'shilishidan yasaladi."
    }
  ],
  "8-sinf": [
    {
      id: 1,
      question: "Sintaktik aloqa turlari qaysilar?",
      options: ["Moslashish, boshqarish, bitishish", "Tub, yasama, qo'shma", "Ega, kesim, to'ldiruvchi", "Aniq, majhul, o'zlik"],
      correctIndex: 0,
      explanation: "So'z birikmalarida sintaktik aloqa 3 xil bo'ladi: moslashish, boshqarish va bitishish."
    },
    {
      id: 2,
      question: "Qaysi gapda moslashish aloqasi mavjud?",
      options: ["akaning kitobi", "sovuq kun", "uyga bormoq", "chiroyli qiz"],
      correctIndex: 0,
      explanation: "Qaratish kelishigidagi hokim so'z va egalik qo'shimchali tobe so'z moslashish aloqasini hosil qiladi."
    },
    {
      id: 3,
      question: "Fe'lning vazifa shakllari qaysilar?",
      options: ["Sifatdosh, ravishdosh, harakat nomi", "Shaxslangan va shaxssiz fe'llar", "O'timli va o'timsiz", "Bo'lishli va bo'lishsiz"],
      correctIndex: 1,
      explanation: "Fe'l gapda kesim vazifasini bajarishiga ko'ra shaxslangan va shaxssiz shaklarga bo'linadi."
    },
    {
      id: 4,
      question: "Qaysi qatorda bir tarkibli gap berilgan?",
      options: ["Bahor keldi.", "Tong otmoqda.", "Qushlar sayramoqda.", "O'quvchilar darsda."],
      correctIndex: 1,
      explanation: "\"Tong otmoqda\" – faqat kesimdan iborat bir tarkibli (shaxssiz/atov) gap."
    },
    {
      id: 5,
      question: "Ergashgan qo'shma gaplarda ergash gap bosh gapga nechta usul bilan bog'lanadi?",
      options: ["2 ta", "3 ta", "4 ta", "5 ta"],
      correctIndex: 1,
      explanation: "Ergash gap bosh gapga 3 xil usul bilan bog'lanadi: 1) bog'lovchilar, 2) ko'makchilar, 3) nisbiy so'zlar."
    },
    {
      id: 6,
      question: "Qaysi qatorda to'liqsiz fe'l qatnashgan?",
      options: ["edi, emish, ekan", "ketdi, keldi, bordi", "o'qimoq, yozmoq", "bor, yo'q, kerak"],
      correctIndex: 0,
      explanation: "Edi, emish, ekan yordamchi fe'llari to'liqsiz fe'llar deb ataladi."
    },
    {
      id: 7,
      question: "Uyushiq bo'laklarning umumlashtiruvchi bo'lak bilan kelganda qanday tinish belgisi ishlatiladi?",
      options: ["Faqat vergul", "Ikki nuqta yoki tire (-)", "Nuqta", "So'roq belgisi"],
      correctIndex: 1,
      explanation: "Umumlashtiruvchi so'zning o'rniga qarab ikki nuqta yoki tire belgisi ishlatiladi."
    },
    {
      id: 8,
      question: "Fe'lning qaysi shakli harakatning paytini bildiradi?",
      options: ["Sifatdosh", "Ravishdosh", "Harakat nomi", "Orttirma nisbat"],
      correctIndex: 1,
      explanation: "Ravishdosh fe'lning asosiy harakatiga qo'shimcha ravish ma'nosini (payt, tarz, sabab) yuklaydi."
    },
    {
      id: 9,
      question: "Qaysi so'zda bitishish aloqasi mavjud?",
      options: ["qiziqarli kitob", "maktabga bormoq", "uyning derazasi", "xatni o'qimoq"],
      correctIndex: 0,
      explanation: "Bitishish aloqasida tobe so'z o'zgarmasdan hokim so'zga ma'no jihatdan yopishadi (\"qiziqarli kitob\")."
    },
    {
      id: 10,
      question: "Atov gaplar nima?",
      options: ["Faqat egadan tashkil topgan bir tarkibli gap", "Kesimi yo'q, faqat atоvchi so'zdan iborat bir tarkibli gap", "Ikki bosh bo'lakli gap", "So'roq gap"],
      correctIndex: 1,
      explanation: "Atov gaplar predmet yoki hodisaning borligini tasdiqlovchi bir tarkibli gaplardir."
    },
    {
      id: 11,
      question: "Qo'shma gap tarkibidagi sodda gaplar bir-biriga nima orqali bog'lanadi?",
      options: ["Faqat ohang", "Bog'lovchilar, bog'lovchi so'zlar va ohang", "Faqat ko'makchilar", "Qo'shimchalar"],
      correctIndex: 1,
      explanation: "Qo'shma gap qismlari bog'lovchi, nisbiy so'z va intonatsiya orqali birikadi."
    },
    {
      id: 12,
      question: "Qaysi qatorda sabab ergash gapli qo'shma gap berilgan?",
      options: ["Havo sovuq bo'lgani uchun, uyda qoldik.", "Agar vaqti bo'lsa, keladi.", "Kimki o'qisa, imtihondan o'tadi.", "Quyosh chiqqanda, yo'lga chiqdik."],
      correctIndex: 0,
      explanation: "Sabab ergash gap bosh gapdagi voqeaning sababini bildiradi."
    },
    {
      id: 13,
      question: "Qaysi so'zda boshqarish aloqasi ishtirok etgan?",
      options: ["kitobni o'qimoq", "qizil gul", "tez yugurmoq", "baland ovoz"],
      correctIndex: 0,
      explanation: "Tobe so'zning ma'lum bir kelishik shaklida kelib hokim so'zga bog'lanishi boshqarishdir (\"kitobni o'qimoq\")."
    },
    {
      id: 14,
      question: "Shaxsi topilmagan (shaxssiz) gaplarning kesimi qaysi shaxsda bo'ladi?",
      options: ["1-shaxsda", "2-shaxsda", "3-shaxs birligida", "Ko'plik shaklida"],
      correctIndex: 2,
      explanation: "Shaxssiz gaplarda ega bo'lmaydi va kesimi odatda 3-shaxs birligida keladi."
    },
    {
      id: 15,
      question: "Ko'chirma gap muallif so'zidan keyin kelsa, qanday tinish belgisi qo'yiladi?",
      options: ["Tire qo'yiladi", "Ikki nuqta qo'yilib, qo'shtirnoqqa olinadi", "Faqat vergul", "Nuqta qo'yiladi"],
      correctIndex: 1,
      explanation: "Muallif gapidan keyin ko'chirma gap kelsa, ikki nuqta qo'yilib qo'shtirnoqqa olinadi."
    },
    {
      id: 16,
      question: "Qaysi qatorda shart ergash gapli qo'shma gap berilgan?",
      options: ["Agar dars qilsang, bahoying yaxshi bo'ladi.", "Chunki u kech qoldi.", "Har qancha harakat qilma, foydasi yo'q.", "Shunday ishki, natijasi ko'rinsin."],
      correctIndex: 0,
      explanation: "Shart ergash gap bosh gapdagi ish-harakatning bajarilish shartini bildiradi."
    },
    {
      id: 17,
      question: "Ayiruv bog'lovchilarini toping.",
      options: ["va, hamda", "iyo, yoki, yo", "lekin, biroq", "chunki, shuning uchun"],
      correctIndex: 1,
      explanation: "Yo, yoki, yohud kabi bog'lovchilar ayiruv bog'lovchilari hisoblanadi."
    },
    {
      id: 18,
      question: "Qaysi gapda undalmali gap berilgan?",
      options: ["Aziz do'stim, keling!", "Bugun havo juda yaxshi.", "Qayerga boryapsiz?", "Qani edi barchasi yaxshi bo'lsa."],
      correctIndex: 0,
      explanation: "\"Aziz do'stim\" so'zi murojaatni bildirib, undalma vazifasida kelgan."
    },
    {
      id: 19,
      question: "Sifatdosh qaysi gap bo'lagi vazifasida kelishi ko'proq uchraydi?",
      options: ["Faqat ega", "Aniqlovchi va kesim", "Faqat hol", "Faqat to'ldiruvchi"],
      correctIndex: 1,
      explanation: "Sifatdoshlar gapda asosan aniqlovchi va kesim vazifasini bajaradi."
    },
    {
      id: 20,
      question: "Olmoshlar tuzilishiga ko'ra nechta turga bo'linadi?",
      options: ["2 ta", "3 ta", "4 ta", "5 ta"],
      correctIndex: 1,
      explanation: "Olmoshlar tuzilishiga ko'ra tub, qo'shma va juft olmoshlarga bo'linadi."
    },
    {
      id: 21,
      question: "To'liqsiz fe'llar gapda qanday vazifani bajaradi?",
      options: ["Mustaqil kesim bo'ladi", "Ot bilan birga qo'shilib ot-kesim hosil qiladi", "Faqat ega bo'ladi", "Hol vazifasini bajaradi"],
      correctIndex: 1,
      explanation: "To'liqsiz fe'llar boshqa so'zlar bilan birikib, qo'shma kesim yoki ot-kesimni hosil qilishga xizmat qiladi."
    },
    {
      id: 22,
      question: "Qaysi qatorda zidlov bog'langan qo'shma gap berilgan?",
      options: ["Quyosh chiqdi, ammo havo sovuq edi.", "U keldi va darsni boshladi.", "Yo sen ket, yo men ketaman.", "Chunki u dars qilmadi."],
      correctIndex: 0,
      explanation: "Zidlov bog'lovchilari (ammo, lekin, biroq) yordamida bog'langan qo'shma gap zidlov bog'langan qo'shma gapdir."
    },
    {
      id: 23,
      question: "Qaysi so'z turkumi yordamchi so'zlar sirasiga kirmaydi?",
      options: ["Ko'makchi", "Bog'lovchi", "Fe'l", "Yuklama"],
      correctIndex: 2,
      explanation: "Fe'l mustaqil ma'noli so'z turkumi bo'lib, yordamchi so'zlarga kirmaydi."
    },
    {
      id: 24,
      question: "Qaratish kelishigi qo'shimchalari qaysilar?",
      options: ["-ning", "-ni", "-ga", "-da"],
      correctIndex: 0,
      explanation: "Qaratish kelishigining asosiy qo'shimchasi \"-ning\" hisoblanadi."
    },
    {
      id: 25,
      question: "So'z birikmasining hokim so'zi qayerda turadi?",
      options: ["Har doim boshida", "Har doim oxirida", "O'rtada", "Old yoki oxirgi o'rinda kelishi mumkin"],
      correctIndex: 1,
      explanation: "O'zbek tilida so'z birikmasida hokim so'z doimo birikmaning oxirida keladi."
    }
  ]
};