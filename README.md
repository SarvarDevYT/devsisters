# 🌸 devsisters.uz — Raqamli Avlod Qizlar Uchun Ta'lim Platformasi

[![Live Site](https://img.shields.io/badge/Production-devsisters.uz-e11d48?style=for-the-badge&logo=vercel)](https://devsisters.uz)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

**devsisters.uz** — O‘zbekiston qizlariga zamonaviy, qulay va mutlaqo bepul bilim olish muhitini taqdim etuvchi milliy raqamli ta’lim platformasi. Platforma 7 ta asosiy fanni, 7 nafar tajribali ustozni, interaktiv video darslarni, jonli muloqot xonalarini va sun’iy intellekt repetitorini o‘z ichiga oladi.

---

## 🌐 Jonli Havolalar (Live Deployments)

- 🌍 **Asosiy portal:** [https://devsisters.uz](https://devsisters.uz)
- 🔗 **Muqobil havola:** [https://www.devsisters.uz](https://www.devsisters.uz)
- 📱 **Ilova portali:** [https://app.devsisters.uz](https://app.devsisters.uz)
- 🛡️ **Admin boshqaruv portali:** [https://admin.devsisters.uz](https://admin.devsisters.uz)

---

## 📚 7 Ta Fan va Tajribali Ustozlar

1. 🇬🇧 **Ingliz tili** — *Hazratova Sevinch* (IELTS 8.0, erkin muloqot va grammatika)
2. 📖 **Arab tili** — *Lutfulloyeva Mahliyo* (Tajvid qoidalari, arab alifbosi va so‘zlashuv)
3. 🏃‍♀️ **Sport va Salomatlik** — *Mattiyeva Ilmira* (Qomatni tiklash, ertalabki badantarbiya)
4. 📝 **Ona tili va Adabiyot** — *Hikmatulloyeva Mubina* (Oliy toifali o‘qituvchi, milliy grammatika)
5. 🌍 **Geografiya** — *Ergashboyeva Gulnoza* (Xaritalar, qit’alar va tabiiy zonalar)
6. 🇷🇺 **Rus tili** — *Normo‘minova Shaxrizoda* (Nol darajadan ravon ruscha so‘zlashuv)
7. 🧪 **Kimyo** — *Abdurashidova Farida* (Laboratoriya asoslari, davriy jadval va reaksiyalar)

---

## ✨ Asosiy Imkoniyatlar & Funksiyalar

- 💬 **Ommaviy Jonli Muhokama Chati & Forum:** Ustozlar va o‘quvchilar o‘rtasida real-vaqt muloqoti, savol-javoblar va emoji reaksiyalar.
- 🤖 **SisterAI Smart Repetitor:** 24/7 rejimda 7 ta fan bo‘yicha o‘quvchilarga darslarni tushuntirib beruvchi suzuvchi AI yordamchi.
- 🎓 **QR-kodli Rasmiy Ta’lim Sertifikati:** Testlarni topshirgan yoki kurslarni muvaffaqiyatli o‘zlashtirgan o‘quvchilar uchun chop etiladigan/yuklab olinadigan hashamatli sertifikat.
- 📅 **Jonli Vebinarlar & Master-klasslar Jadvali:** Haftalik onlayn jonli darslar taqvimi va eslatma tizimi.
- 🔐 **Ko‘p Rollik Avtorizatsiya Tizimi (`/login`):**
  - **O‘quvchi Kabineti (`/student`):** Shaxsiy yutuqlar, ballar, testlar, lug‘at kartochkalari va badantarbiya mashqlari.
  - **O‘qituvchi Portali (`/teacher`):** Yangi videodarslar yuklash, tavsif va vazifalarni boshqarish.
  - **Super Admin Paneli (`/admin`):** Ustozlar ro‘yxati, darsliklar va foydalanuvchilar/parollarni to‘liq nazorat qilish.
- 📱 **PWA (Progressive Web App):** Har qanday telefonga o‘rnatib olish imkoniyati.

---

## 🛠️ Texnologiyalar Steki

- **Frontend & Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Dizayn & UI:** Tailwind CSS, Lucide Icons, Canvas Confetti, Google Fonts (Plus Jakarta Sans)
- **Ma’lumotlar bazasi:** Supabase (PostgreSQL, Row Level Security)
- **Deploy & Hosting:** Vercel Edge Network
- **Domen & DNS:** Eskiz.uz DNS Hosting + Vercel SSL

---

## 💻 Loyihani Mahalliy Muhitda Ishga Tushirish

```bash
# 1. Repozitoriyani klonlash
git clone https://github.com/SarvarDevYT/devsisters.git
cd devsisters

# 2. Bog'liqliklarni o'rnatish
npm install

# 3. Muhit o'zgaruvchilarini sozlash (.env.local)
NEXT_PUBLIC_SUPABASE_URL="https://uibaudggdyerfamvmobw.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
ADMIN_SECRET_KEY="devsisters_admin_2025"

# 4. Dasturni ishga tushirish
npm run dev
```

Brauzerda oching: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Kirish Ma'lumotlari

| Rol | Email | Parol |
| :--- | :--- | :--- |
| **O‘quvchi** | `malika@devsisters.uz` | `student123` |
| **O‘qituvchi** | `sevinch@devsisters.uz` | `teacher123` |
| **Super Admin** | `admin@devsisters.uz` | `admin2025` |

---

## 📄 Litsenziya

Ushbu loyiha MIT litsenziyasi ostida ochiq taqdim etiladi.
Muallif: **SarvarDevYT**
