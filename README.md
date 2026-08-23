# PT Maju Bersama Indonesia — Company Profile + CRM

Website company profile profesional dilengkapi CRM sederhana untuk
pengelolaan berita perusahaan dan data pelamar kerja. Dibangun dengan
Next.js 14, Supabase, dan Tailwind CSS — 100% dapat di-deploy gratis.

> ⚠️ **Data pada seed.sql adalah data contoh.** Ganti nama perusahaan,
> alamat, berita, lowongan, dan hapus data pelamar dummy sebelum go-live.

---

## 📦 Teknologi

| Layer          | Teknologi                              |
|-----------------|------------------------------------------|
| Frontend/Backend | Next.js 14 (App Router) + TypeScript    |
| Styling          | Tailwind CSS + Lucide Icons             |
| Database         | Supabase PostgreSQL (Free Tier)         |
| Auth             | Supabase Auth (email/password)          |
| File Storage     | Supabase Storage                        |
| Rich Text Editor | Tiptap                                  |
| Hosting          | Vercel (Free Tier)                      |

---

## 🗂️ Struktur Project

```text
company-profile/
├── app/
│   ├── (public)/           # Halaman publik (Navbar + Footer)
│   │   ├── page.tsx           → Home
│   │   ├── tentang-kami/
│   │   ├── layanan/
│   │   ├── berita/[slug]/
│   │   ├── karir/[slug]/lamar/
│   │   └── lamaran/lacak/
│   ├── admin/
│   │   ├── login/             # Halaman login (tanpa sidebar)
│   │   └── (dashboard)/       # Dashboard + sidebar (dilindungi middleware)
│   │       ├── page.tsx          → Dashboard/statistik
│   │       ├── applicants/[id]/
│   │       ├── news/[id]/
│   │       └── jobs/[id]/
│   ├── api/                # Route Handlers (server-side, service role key)
│   │   ├── admin/{login,logout}/
│   │   ├── applicants/[id]/document/  → signed URL download
│   │   ├── news/[id]/, news/upload/
│   │   ├── jobs/[id]/
│   │   └── track/          → lacak status lamaran (publik)
│   ├── sitemap.ts / robots.ts
│   └── layout.tsx
├── components/{ui,admin,public}/
├── lib/
│   ├── supabase/{client,server,admin}.ts
│   ├── auth.ts
│   └── utils.ts
├── types/database.ts
├── supabase/
│   ├── schema.sql       → jalankan pertama kali
│   ├── seed.sql         → data contoh (opsional)
│   └── create-admin.ts  → script buat akun admin
├── middleware.ts         → proteksi /admin/*
└── .env.example
```

---

## 🚀 Menjalankan di Komputer Lokal

### 1. Install dependencies

```bash
npm install
```

### 2. Siapkan Supabase (lihat bagian "Setup Supabase" di bawah)

### 3. Salin environment variables

```bash
cp .env.example .env.local
# lalu isi NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY sesuai project Supabase Anda
```

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Setup Supabase (Gratis)

### 1. Buat Project Supabase

1. Buka [supabase.com](https://supabase.com) → **Start your project** → daftar/login.
2. Klik **New Project**, isi nama project, password database, pilih region (`Singapore` untuk latensi terbaik dari Indonesia).
3. Tunggu ± 2 menit hingga project siap.

### 2. Jalankan Database Schema

1. Di dashboard Supabase, buka menu **SQL Editor** → **New Query**.
2. Salin seluruh isi `supabase/schema.sql`, tempel, lalu klik **Run**.
   Ini akan membuat semua tabel, trigger nomor lamaran otomatis, RLS
   policy, dan storage bucket.
3. (Opsional, untuk testing) Buat query baru, salin isi `supabase/seed.sql`, lalu **Run** untuk mengisi data contoh (5 berita, 5 lowongan, 3 pelamar dummy).

### 3. Ambil API Keys

Buka **Project Settings → API**, salin:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** (klik "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`
  ⚠️ **JANGAN PERNAH** membagikan atau meng-commit key ini ke Git.

Tempel ketiganya ke `.env.local`.

### 4. Buat Akun Admin Pertama

Setelah `.env.local` terisi, jalankan:

```bash
npm run create-admin -- admin@majubersama.co.id "PasswordAman123!" "Nama Admin"
```

Script ini membuat user di Supabase Auth sekaligus profil admin di tabel
`admin_profiles`. Login di `/admin/login` dengan kredensial tersebut.

Alternatif manual: **Authentication → Users → Add User** di dashboard
Supabase, lalu insert manual baris ke tabel `admin_profiles` dengan `id`
yang sama dengan `id` user tersebut.

### 5. Verifikasi Storage & RLS

`schema.sql` sudah otomatis membuat 2 bucket:

- `applicant-documents` (privat — hanya admin bisa baca)
- `news-images` (publik — untuk gambar berita)

Cek di menu **Storage** bahwa kedua bucket sudah ada. RLS policy juga
sudah otomatis aktif (lihat bagian akhir `schema.sql`); Anda bisa
memverifikasinya di menu **Authentication → Policies**.

### 6. Autentikasi (opsional tapi disarankan)

Di **Authentication → Settings**, matikan "Enable email confirmations"
jika Anda ingin admin baru langsung bisa login tanpa verifikasi email
(karena akun admin dibuat manual oleh Anda, bukan self sign-up).

---

## ☁️ Deploy ke Vercel (Gratis)

### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/company-profile.git
git push -u origin main
```

> `.env.local` **tidak akan ter-commit** karena sudah ada di `.gitignore`.

### 2. Hubungkan GitHub ke Vercel

1. Buka [vercel.com](https://vercel.com) → login dengan akun GitHub.
2. Klik **Add New → Project**, pilih repository `company-profile`.
3. Framework Preset otomatis terdeteksi sebagai **Next.js**.

### 3. Masukkan Environment Variables

Di halaman konfigurasi sebelum deploy (atau **Project → Settings →
Environment Variables** setelahnya), tambahkan:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | (dari Supabase) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (dari Supabase) |
| `SUPABASE_SERVICE_ROLE_KEY` | (dari Supabase — tandai sebagai **Sensitive**) |
| `NEXT_PUBLIC_SITE_URL` | `https://nama-project-anda.vercel.app` |
| `NEXT_PUBLIC_COMPANY_NAME` | `PT Maju Bersama Indonesia` |

### 4. Deploy

Klik **Deploy**. Tunggu ± 1-2 menit. Vercel akan memberikan URL gratis:

```
https://company-profile-xxxx.vercel.app
```

Setiap `git push` ke branch `main` akan otomatis men-deploy ulang.

### 5. (Opsional) Perbarui `NEXT_PUBLIC_SITE_URL`

Setelah tahu URL final, update env var `NEXT_PUBLIC_SITE_URL` di Vercel
agar sitemap.xml dan Open Graph metadata menunjuk ke URL yang benar,
lalu redeploy (**Deployments → ⋯ → Redeploy**).

### 6. (Opsional) Custom Domain

**Project → Settings → Domains** → tambahkan domain Anda sendiri jika
punya, atau gunakan subdomain `.vercel.app` gratis selamanya.

---

## 🔒 Ringkasan Keamanan

- Password admin dikelola sepenuhnya oleh Supabase Auth (hash bcrypt),
  **tidak pernah** disimpan sebagai plaintext di database aplikasi.
- Data pelamar (`applicants`) **tidak dapat dibaca sama sekali** oleh
  role `anon`/publik — hanya admin yang login (`authenticated`) yang
  bisa membaca lewat RLS policy.
- Insert data pelamar dari form public dilakukan lewat API route
  server-side yang memvalidasi input dengan Zod, bukan langsung dari
  browser ke database.
- Dokumen pelamar disimpan di bucket **privat**; admin mengunduhnya
  lewat signed URL sementara (kedaluwarsa 60 detik).
- `SUPABASE_SERVICE_ROLE_KEY` hanya pernah diimpor di kode server
  (`lib/supabase/admin.ts`), tidak pernah dikirim ke browser.
- Semua route `/admin/*` dilindungi `middleware.ts` — otomatis redirect
  ke halaman login jika sesi tidak valid.

---

## 🧩 Fitur Utama

- Company profile (Home, Tentang Kami, Layanan) — 100% responsive
- Berita/artikel dengan CRUD admin, rich text editor, upload gambar
- Lowongan kerja dengan CRUD admin, status aktif/draft/ditutup
- Form pendaftaran pelamar dengan upload dokumen (CV, surat lamaran, ijazah/sertifikat)
- Nomor lamaran otomatis (`LAM-2026-00001`) + halaman lacak status
- Dashboard CRM dengan statistik & grafik status pelamar
- Manajemen pelamar: search, filter (posisi/status/tanggal), ubah status, download dokumen
- SEO dasar: sitemap.xml, robots.txt, meta tags, Open Graph, slug SEO-friendly

## 📝 Catatan Pengembangan Lanjutan

- **Email notification**: struktur sudah siap untuk ditambahkan (misalnya
  memakai [Resend](https://resend.com) free tier 100 email/hari) di
  `app/api/applicants/route.ts` setelah insert berhasil.
- **Multi-admin role**: kolom `role` di `admin_profiles` sudah tersedia
  (`admin` / `super_admin`) untuk pengembangan hak akses bertingkat.

