# 🧠 devsisters.uz — PROJECT MEMORY & ARCHITECTURE

> **MUHIM ESLATMA HAR QANDAY YANGI AI UCHUN:**  
> Ushbu fayl `devsisters.uz` loyihasining to‘liq arxitekturasi, biznes mantiqi, ma’lumotlar bazasi, foydalanuvchi rollari va qat’iy qoidalarini o‘z ichiga oladi. Loyiha ustida ishlashdan oldin ushbu hujjatni to‘liq o‘qib chiqing!

---

## 1. 📌 Loyiha Haqida va Asosiy Maqsad

- **Loyiha nomi:** `devsisters.uz`
- **Rasmiy domen:** [https://devsisters.uz](https://devsisters.uz)
- **GitHub repozitoriy:** `https://github.com/SarvarDevYT/devsisters` (`main` tarmog‘i)
- **Deploy usuli:** **AVTOMATIK GITHUB CI/CD → VERCEL**
  > ⚠️ **QAT’IY TAQIQ:** Hech qachon `vercel deploy` CLI buyrug‘ini bajarmang! Foydalanuvchi GitHub repozitoriyni Vercel bilan avtomatik integratsiya qilib qo‘ygan. Har qanday o‘zgarishni faqat `git add`, `git commit` va `git push origin main` orqali yuboring. Vercel o‘zi avtomatik tarzda jonli saytga deploy qiladi.
- **Missiyasi:** O‘zbekiston qizlariga zamonaviy, xavfsiz, sifatli va mutlaqo **bepul** bilim olish muhitini taqdim etuvchi milliy ta’lim platformasi.

---

## 2. 🛠️ Texnologiyalar Steki (Tech Stack)

- **Freymvork:** Next.js 16.4 (App Router, Turbopack, React 19)
- **Dizayn & Stillar:** Tailwind CSS v4.3, Plus Jakarta Sans shrifti
- **Ma’lumotlar bazasi:** Supabase (PostgreSQL, Realtime) + LocalStorage (Offline fallback)
- **Tillar:** TypeScript, TSX
- **Asosiy kutubxonalar:**
  - `@supabase/supabase-js` — MB bilan ishlash
  - `lucide-react` — Zamonaviy vektor piktogrammalar
  - `canvas-confetti` — Test va ro‘yxatdan o‘tgandagi bayramona animatsiyalar

---

## 3. 👩‍🏫 7 Ta Fan va 7 Ta Professional Ustoz

Platformada 7 ta asosiy fan va ularning ustozlari belgilangan (`src/lib/data.ts` va Supabase `teachers` jadvali):

| № | Fan nomi | Slug | Ustozning F.I.SH | Tajriba & Mutaxassislik |
|---|----------|------|------------------|--------------------------|
| 1 | **Ingliz tili** | `ingliz-tili` | **Hazratova Sevinch** | IELTS 8.0, 5 yillik pedagogik tajriba, Speaking mutaxassisi |
| 2 | **Arab tili** | `arab-tili` | **Lutfulloyeva Mahliyo** | Misr Al-Azhar metodikasi, Tajvid va fonetika bo‘yicha 4 yillik tajriba |
| 3 | **Sport va Salomatlik** | `sport` | **Mattiyeva Ilmira** | Professional fitnes murabbiyi, qomatni to‘g‘rilash va gimnastika |
| 4 | **Ona tili va Adabiyot** | `ona-tili` | **Hikmatulloyeva Mubina** | Oliy toifali ona tili ustozi, 6 yillik tajriba, milliy grammatika |
| 5 | **Geografiya** | `geografiya` | **Ergashboyeva Gulnoza** | Xalqaro olimpiadalar sovrindori ustozi, vizual xaritalar |
| 6 | **Rus tili** | `rus-tili` | **Normo‘minova Shaxrizoda** | Rus tilini xorijiy til sifatida o‘rgatish bo‘yicha 4 yillik tajriba |
| 7 | **Kimyo** | `kimyo` | **Abdurashidova Farida** | Kimyo fani o‘qituvchisi, qiziqarli laboratoriya tajribalari |

---

## 4. 🧭 Sayt Strukturasi va Sahifalar (Pages & Routing)

### 1) Asosiy Bosh Sahifa (`src/app/page.tsx` — `/`)
- **`Hero.tsx`**: Loyiha shiori, «Darslarni Boshlash» va «Bilimni Sinash» tugmalari.
- **`TeachersSection.tsx`**: 7 ta ustoz kartochkalari va fan bo‘yicha tezkor filtrlar.
- **`FeaturesSection.tsx`**: Video darslar, testlar, amaliyot va kabinetdagi muloqot imkoniyatlari.
- **`LessonsSection.tsx`**: YouTube HD pleyerli darslar ro‘yxati.
- **`WebinarsSection.tsx`**: Ustozlar bilan jonli onlayn muloqot va vebinarlar taqvimi.
- **`QuizSection.tsx`**: Interaktiv testlar va 70%+ natijada sertifikat olish imkoniyati.
- **`PracticeSection.tsx`**: Til fanlari uchun flip-kartochkalar va sport gimnastikasi mashqlari.
- **`RoadmapSection.tsx`**: Loyihaning rivojlanish bosqichlari (1-bosqichdan 4-bosqichgacha).
- **`Footer.tsx`**: Platforma havolalari va ma’lumotlar.
- **Modallar:**
  - `VideoModal.tsx`: YouTube 16:9 HD Cinema video pleyeri.
  - `CertificateModal.tsx`: Rasmiy QR-kodli, muhrli va imzolangan chop etiluvchi hashamatli sertifikat.
  - `AiTutorModal.tsx`: 24/7 rejimdagi **SisterAI** repetitor bot.
  - `OnboardingModal.tsx`: Saytga birinchi marta kirgan mehmonlar uchun 2-bosqichli ro‘yxatdan o‘tish va fan tanlash modali.
  > ⚠️ **DIQQAT:** «Hamjamiyat va Jonli Chat» bloki asosiy sahifadan olib tashlangan va faqat avtorizatsiyadan o‘tgan shaxslar uchun shaxsiy kabinetlarga joylashtirilgan.

### 2) Yagona Autentifikatsiya Portali (`src/app/login/page.tsx` — `/login`)
- O‘quvchi, O‘qituvchi va Super Admin uchun bitta umumiy kirish joyi.
- Kirish (`mode === 'login'`) va Ro‘yxatdan o‘tish (`mode === 'register'`) rejimi.
- Ro‘yxatdan o‘tishda o‘quvchi o‘zi o‘rganmoqchi bo‘lgan fanni tanlaydi.
- ⚠️ Ommaviy ishlab chiqarish uchun 1 bosishda kiruvchi demo tugmalar to‘liq olib tashlangan.

### 3) O‘quvchi Shaxsiy Kabineti (`src/app/student/page.tsx` — `/student`)
- **Qat’iy 1 ta fanga biriktirilganlik (Single-subject isolation):** O‘quvchi faqat o‘zi tanlagan yagona fanning darslari, testlari va amaliyotini ko‘radi (boshqa fanlar chalkashmasligi uchun).
- **Sertifikat qulfi (Smart Locking):** Sertifikat faqat tanlangan fanning barcha videodarslari ko‘rilganda (`100%`) va testidan kamida `70%` ball to‘plangandagina ochiladi. Aks holda qulflangan holatda talablarni ko‘rsatadi.
- **Jonli Chat:** Ustozlar va boshqa o‘quvchi qizlar bilan to‘g‘ridan-to‘g‘ri savol-javob qiluvchi `CommunityChat` komponenti.

### 4) O‘qituvchi Kabineti (`src/app/teacher/page.tsx` — `/teacher`)
- Ustoz faqat o‘zining faniga tegishli videodarslarni ko‘radi, yangi YouTube video dars yuklaydi yoki mavjudlarini tahrirlaydi/o‘chiradi.
- O‘quvchilar bilan muloqot va chat menyusi (`CommunityChat`).

### 5) Super Admin Boshqaruv Paneli (`src/app/admin/page.tsx` — `/admin`)
- **Tizim statistikasi:** Jami o‘quvchilar soni, faol ustozlar va video darsliklar soni.
- **Fanlar bo‘yicha o‘quvchilar taqsimoti:** Har bir fanga qancha o‘quvchi a’zo bo‘lganligini onlayn hisoblovchi 7 ustunli jonli tahlil bloki.
- **Ustozlarni boshqarish:** Yangi ustoz qo‘shilganda uning kirish hisobi (`email` va `password`) avtomatik yaratiladi va unga o‘qituvchi roli biriktiriladi.
- **Foydalanuvchilar va Parollar jadvali:** Barcha foydalanuvchilarning roli, tanlangan fani, telefoni va parolini ochiq ko‘rish, tahrirlash hamda o‘chirish imkoniyati.
- **Jonli Chat va Moderatsiya:** Barcha o‘quvchilar va ustozlar xabarlarini nazorat qilish, nomaqbul xabarlarni o‘chirish.

---

## 5. 🗄️ Ma’lumotlar Bazasi Strukturasi (Supabase)

Supabase loyihasi: `https://gupkydkavvszqawvqukw.supabase.co`
Barcha jadvallarda `id` ustuni **UUID (`gen_random_uuid()`)** turida:

1. **`teachers`:**
   - `id` (UUID, Primary Key)
   - `name` (TEXT)
   - `subject` (TEXT)
   - `slug` (TEXT, unique)
   - `bio` (TEXT)
   - `experience` (TEXT)
   - `avatar_url` (TEXT)
   - `telegram` (TEXT)
   - `display_order` (INTEGER)

2. **`lessons`:**
   - `id` (UUID, Primary Key)
   - `title` (TEXT)
   - `description` (TEXT)
   - `video_url` (TEXT — YouTube URL)
   - `duration` (TEXT)
   - `subject_slug` (TEXT)
   - `order_num` (INTEGER)

3. **`quizzes`:**
   - `id` (UUID, Primary Key)
   - `subject_slug` (TEXT)
   - `title` (TEXT)
   - `questions` (JSONB)

4. **`users`:**
   - `id` (UUID, Primary Key)
   - `name` (TEXT)
   - `email` (TEXT, unique)
   - `password` (TEXT)
   - `role` (TEXT: `'student' | 'teacher' | 'admin'`)
   - `subject_slug` (TEXT — tanlangan fani)
   - `phone` (TEXT)
   - `points` (INTEGER)

5. **`community_posts`:**
   - `id` (UUID, Primary Key)
   - `author_name` (TEXT)
   - `title` (TEXT)
   - `content` (TEXT)
   - `likes` (INTEGER)
   - `created_at` (TIMESTAMP)

> 💡 **Eslatma:** Tarmoq uzilsa yoki Supabase cheklovi bo‘lsa, tizim avtomatik tarzda `src/lib/data.ts` va `localStorage` keshiga o‘tadi, sayt hech qachon to‘xtab qolmaydi.

---

## 6. 📱 Mobil Moslashuvchanlik Qoidalari (Mobile Responsiveness)

1. **Gorizontal skroll bo‘lmasligi:** `src/app/layout.tsx` dagi `<body>` elementi `w-full overflow-x-hidden relative` klasslariga ega bo‘lishi shart.
2. **Kategoriya chiplari:** Fanlar va darslar tugmalari telefonda gorizontal silliq surilishi (`overflow-x-auto pb-2 scrollbar-none sm:flex-wrap`) kerak.
3. **Flex elementlar:** Kichik ekranlarda (320px–375px) matnlar qisqarishi yoki sig‘ishi uchun `break-words`, `min-w-0`, `truncate` qo‘llanilgan.
4. **Jadvallar:** Admin panelidagi foydalanuvchilar jadvali `overflow-x-auto` konteyneriga o‘ralgan.

---

## 7. 🔒 Xavfsizlik va Kelajakdagi AI Uchun Qat'iy Qoidalar

1. **Hech qachon Supabase `anon` kaliti o‘rniga `service_role` kalitini frontend kodiga qo‘shmang.**
2. **Yangi o‘qituvchi yoki dars qo‘shganda `id` maydoniga ixtiyoriy string yozmang** — Supabase UUID kutadi, `id` maydoni kiritilmasa Supabase o‘zi avtomatik generatsiya qiladi.
3. **O‘quvchi kabinetida 7 ta fanning hammasini birdan ko‘rsatib yubormang** — o‘quvchi o‘zi tanlagan bitta fanni chuqur o‘rganishi uchun unga faqat o‘zining fani ko‘rinishi lozim.
4. **Har qanday kod o‘zgarishidan so‘ng terminalda `npm run build` buyrug‘ini ishlatib xatolik yo‘qligiga ishonch hosil qiling.**
5. **Foydalanuvchi bilan doim samimiy, tushunarli va professional o‘zbek tilida muloqot qiling.**
