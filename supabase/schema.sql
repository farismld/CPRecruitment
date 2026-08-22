-- =========================================================================
-- SCHEMA DATABASE — PT Maju Bersama Indonesia (Company Profile + CRM)
-- Jalankan file ini di Supabase Dashboard > SQL Editor > New Query > Run
-- Aman dijalankan berkali-kali (pakai IF NOT EXISTS / DROP ... IF EXISTS)
-- =========================================================================

-- Extension untuk generate UUID
create extension if not exists "pgcrypto";

-- =========================================================================
-- 1. TABEL: admin_profiles
--    Menyimpan profil tambahan untuk admin yang terdaftar di Supabase Auth.
--    Password TIDAK disimpan di sini — Supabase Auth yang mengelola hash
--    password secara aman (bcrypt), kita hanya simpan role & nama.
-- =========================================================================
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  created_at timestamptz not null default now()
);

-- =========================================================================
-- 2. TABEL: news (berita)
-- =========================================================================
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text not null,
  image_url text,
  category text not null default 'Umum',
  author text not null default 'Admin',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_news_status on public.news(status);
create index if not exists idx_news_slug on public.news(slug);
create index if not exists idx_news_created_at on public.news(created_at desc);

-- =========================================================================
-- 3. TABEL: jobs (lowongan kerja)
-- =========================================================================
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  department text not null,
  location text not null,
  employment_type text not null default 'Full-time'
    check (employment_type in ('Full-time', 'Part-time', 'Kontrak', 'Magang', 'Freelance')),
  description text not null,
  requirements text not null,
  deadline date not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_jobs_slug on public.jobs(slug);
create index if not exists idx_jobs_deadline on public.jobs(deadline);

-- =========================================================================
-- 4. TABEL: applicants (data pelamar — DATA SENSITIF)
-- =========================================================================
create table if not exists public.applicants (
  id uuid primary key default gen_random_uuid(),
  application_number text not null unique,
  job_id uuid not null references public.jobs(id) on delete cascade,

  -- Data pribadi
  full_name text not null,
  nik text not null,
  birth_place text not null,
  birth_date date not null,
  gender text not null check (gender in ('Laki-laki', 'Perempuan')),
  address text not null,
  city text not null,
  phone text not null,
  email text not null,

  -- Pendidikan
  education text not null,
  institution text not null,
  major text not null,
  graduation_year int not null,

  -- Data lamaran
  work_experience text,
  skills text,
  certifications text,
  source text,

  -- Dokumen (path di Supabase Storage, bukan public URL langsung)
  cv_url text not null,
  cover_letter_url text,
  certificate_url text,

  status text not null default 'Baru'
    check (status in ('Baru', 'Seleksi Administrasi', 'Diproses', 'Interview', 'Lulus', 'Tidak Lulus')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_applicants_job_id on public.applicants(job_id);
create index if not exists idx_applicants_status on public.applicants(status);
create index if not exists idx_applicants_app_number on public.applicants(application_number);
create index if not exists idx_applicants_email on public.applicants(email);

-- =========================================================================
-- 5. FUNCTION: generate nomor lamaran otomatis -> LAM-2026-00001
-- =========================================================================
create sequence if not exists public.applicant_seq start 1;

create or replace function public.generate_application_number()
returns text
language plpgsql
as $$
declare
  next_val int;
  current_year text;
begin
  current_year := to_char(now(), 'YYYY');
  next_val := nextval('public.applicant_seq');
  return 'LAM-' || current_year || '-' || lpad(next_val::text, 5, '0');
end;
$$;

-- =========================================================================
-- 6. TRIGGER: auto set application_number & updated_at
-- =========================================================================
create or replace function public.set_application_number()
returns trigger
language plpgsql
as $$
begin
  if new.application_number is null or new.application_number = '' then
    new.application_number := public.generate_application_number();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_application_number on public.applicants;
create trigger trg_set_application_number
  before insert on public.applicants
  for each row execute function public.set_application_number();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_news_updated_at on public.news;
create trigger trg_news_updated_at before update on public.news
  for each row execute function public.set_updated_at();

drop trigger if exists trg_jobs_updated_at on public.jobs;
create trigger trg_jobs_updated_at before update on public.jobs
  for each row execute function public.set_updated_at();

drop trigger if exists trg_applicants_updated_at on public.applicants;
create trigger trg_applicants_updated_at before update on public.applicants
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =========================================================================

alter table public.admin_profiles enable row level security;
alter table public.news enable row level security;
alter table public.jobs enable row level security;
alter table public.applicants enable row level security;

-- --- admin_profiles ---
-- Hanya admin yang login boleh melihat profil admin (tidak ada akses publik)
drop policy if exists "admin_profiles_select_own" on public.admin_profiles;
create policy "admin_profiles_select_own"
  on public.admin_profiles for select
  using (auth.uid() = id);

-- --- news ---
-- Publik hanya boleh membaca berita yang published
drop policy if exists "news_public_select_published" on public.news;
create policy "news_public_select_published"
  on public.news for select
  using (status = 'published');

-- Admin (authenticated) boleh melihat semua berita termasuk draft
drop policy if exists "news_admin_select_all" on public.news;
create policy "news_admin_select_all"
  on public.news for select
  using (auth.role() = 'authenticated');

-- Hanya admin (authenticated) yang boleh insert/update/delete
drop policy if exists "news_admin_insert" on public.news;
create policy "news_admin_insert"
  on public.news for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "news_admin_update" on public.news;
create policy "news_admin_update"
  on public.news for update
  using (auth.role() = 'authenticated');

drop policy if exists "news_admin_delete" on public.news;
create policy "news_admin_delete"
  on public.news for delete
  using (auth.role() = 'authenticated');

-- --- jobs ---
-- Publik hanya boleh membaca lowongan yang aktif
drop policy if exists "jobs_public_select_active" on public.jobs;
create policy "jobs_public_select_active"
  on public.jobs for select
  using (status = 'active');

drop policy if exists "jobs_admin_select_all" on public.jobs;
create policy "jobs_admin_select_all"
  on public.jobs for select
  using (auth.role() = 'authenticated');

drop policy if exists "jobs_admin_insert" on public.jobs;
create policy "jobs_admin_insert"
  on public.jobs for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "jobs_admin_update" on public.jobs;
create policy "jobs_admin_update"
  on public.jobs for update
  using (auth.role() = 'authenticated');

drop policy if exists "jobs_admin_delete" on public.jobs;
create policy "jobs_admin_delete"
  on public.jobs for delete
  using (auth.role() = 'authenticated');

-- --- applicants (DATA PRIBADI — PALING KETAT) ---
-- TIDAK ADA policy SELECT untuk anon/public sama sekali.
-- Insert dari form public dilakukan lewat API route server-side yang
-- memakai SERVICE ROLE KEY (bypass RLS secara terkontrol), BUKAN dari
-- browser langsung ke Supabase. Ini mencegah pelamar lain membaca data
-- pelamar lain, dan mencegah scraping data pribadi.

-- Hanya admin (authenticated) yang boleh membaca data pelamar
drop policy if exists "applicants_admin_select" on public.applicants;
create policy "applicants_admin_select"
  on public.applicants for select
  using (auth.role() = 'authenticated');

-- Hanya admin yang boleh update status pelamar
drop policy if exists "applicants_admin_update" on public.applicants;
create policy "applicants_admin_update"
  on public.applicants for update
  using (auth.role() = 'authenticated');

-- Hanya admin yang boleh menghapus data pelamar
drop policy if exists "applicants_admin_delete" on public.applicants;
create policy "applicants_admin_delete"
  on public.applicants for delete
  using (auth.role() = 'authenticated');

-- Catatan: TIDAK ADA policy INSERT untuk role 'anon'. Insert applicant HANYA
-- boleh lewat API route (/api/applicants) yang menggunakan service_role key
-- di server. Ini mencegah orang mengirim data langsung dari client tanpa
-- validasi & tanpa upload dokumen yang benar.

-- =========================================================================
-- 8. STORAGE BUCKET (dokumen pelamar) — private, tidak public
-- Jalankan ini juga; atau buat manual lewat Dashboard > Storage
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('applicant-documents', 'applicant-documents', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;

-- Storage policy: hanya server (service role) yang boleh upload ke
-- applicant-documents. Admin (authenticated) boleh membaca untuk download CV.
drop policy if exists "applicant_docs_admin_read" on storage.objects;
create policy "applicant_docs_admin_read"
  on storage.objects for select
  using (bucket_id = 'applicant-documents' and auth.role() = 'authenticated');

-- news-images: publik boleh baca (untuk ditampilkan di website),
-- hanya admin yang boleh upload/hapus
drop policy if exists "news_images_public_read" on storage.objects;
create policy "news_images_public_read"
  on storage.objects for select
  using (bucket_id = 'news-images');

drop policy if exists "news_images_admin_write" on storage.objects;
create policy "news_images_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'news-images' and auth.role() = 'authenticated');

drop policy if exists "news_images_admin_delete" on storage.objects;
create policy "news_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'news-images' and auth.role() = 'authenticated');

-- =========================================================================
-- SELESAI. Lanjutkan dengan supabase/seed.sql untuk data dummy.
-- =========================================================================
