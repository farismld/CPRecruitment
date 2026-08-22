-- =========================================================================
-- DATA CONTOH (DUMMY) — Jalankan SETELAH schema.sql
-- CATATAN: Ini adalah data contoh untuk testing. GANTI/HAPUS sebelum
-- benar-benar go-live production.
-- =========================================================================

-- --- 5 Berita contoh ---
insert into public.news (title, slug, content, excerpt, image_url, category, author, status, created_at) values
('PT Maju Bersama Indonesia Raih Penghargaan Perusahaan Terbaik 2026',
 'pt-maju-bersama-indonesia-raih-penghargaan-perusahaan-terbaik-2026',
 '<p>Jakarta — PT Maju Bersama Indonesia kembali menorehkan prestasi dengan meraih penghargaan sebagai salah satu perusahaan dengan pertumbuhan terbaik tahun 2026. Penghargaan ini diberikan atas dedikasi perusahaan dalam inovasi dan pelayanan kepada pelanggan.</p><p>Direktur Utama menyampaikan apresiasi kepada seluruh karyawan atas kerja keras yang telah dilakukan sepanjang tahun.</p>',
 'PT Maju Bersama Indonesia meraih penghargaan perusahaan dengan pertumbuhan terbaik tahun 2026 atas inovasi dan pelayanan unggul.',
 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200',
 'Prestasi', 'Tim Media', 'published', now() - interval '2 days'),

('Pembukaan Kantor Cabang Baru di Surabaya',
 'pembukaan-kantor-cabang-baru-di-surabaya',
 '<p>Sebagai bagian dari strategi ekspansi, PT Maju Bersama Indonesia resmi membuka kantor cabang baru di Surabaya. Kantor ini akan melayani wilayah Jawa Timur dan sekitarnya.</p><p>Peresmian dihadiri oleh jajaran direksi dan mitra bisnis strategis perusahaan.</p>',
 'Ekspansi bisnis perusahaan berlanjut dengan pembukaan kantor cabang baru di Surabaya untuk melayani wilayah Jawa Timur.',
 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
 'Perusahaan', 'Tim Media', 'published', now() - interval '5 days'),

('Program CSR: Bantuan Pendidikan untuk 100 Anak',
 'program-csr-bantuan-pendidikan-untuk-100-anak',
 '<p>Sebagai wujud tanggung jawab sosial, perusahaan menyalurkan bantuan pendidikan berupa beasiswa dan perlengkapan sekolah kepada 100 anak di sekitar area operasional perusahaan.</p>',
 'Perusahaan menyalurkan bantuan pendidikan kepada 100 anak sebagai bagian dari program tanggung jawab sosial perusahaan.',
 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200',
 'CSR', 'Tim Media', 'published', now() - interval '10 days'),

('Peluncuran Layanan Digital Terbaru',
 'peluncuran-layanan-digital-terbaru',
 '<p>PT Maju Bersama Indonesia meluncurkan platform digital terbaru untuk mempermudah pelanggan dalam mengakses layanan perusahaan kapan saja dan di mana saja.</p>',
 'Platform digital terbaru diluncurkan untuk mempermudah akses layanan bagi seluruh pelanggan perusahaan.',
 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
 'Teknologi', 'Tim Media', 'published', now() - interval '15 days'),

('Rekrutmen Karyawan Baru Tahun 2026 Resmi Dibuka',
 'rekrutmen-karyawan-baru-tahun-2026-resmi-dibuka',
 '<p>Dalam rangka mendukung pertumbuhan bisnis, PT Maju Bersama Indonesia membuka kesempatan berkarir bagi talenta terbaik di berbagai posisi. Simak informasi lengkap lowongan di halaman Karir.</p>',
 'Kesempatan berkarir terbuka lebar di PT Maju Bersama Indonesia untuk berbagai posisi strategis tahun 2026.',
 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200',
 'Karir', 'Tim HRD', 'published', now() - interval '1 day')
on conflict (slug) do nothing;

-- --- 5 Lowongan contoh ---
insert into public.jobs (title, slug, department, location, employment_type, description, requirements, deadline, status, created_at) values
('Staff Marketing Digital', 'staff-marketing-digital', 'Marketing', 'Jakarta', 'Full-time',
 '<p>Bertanggung jawab merencanakan dan menjalankan strategi pemasaran digital perusahaan melalui berbagai kanal media sosial dan website.</p>',
 '<ul><li>Minimal S1 Marketing/Komunikasi</li><li>Pengalaman 1 tahun di bidang digital marketing</li><li>Menguasai Meta Ads & Google Ads</li></ul>',
 (current_date + interval '30 days')::date, 'active', now() - interval '3 days'),

('Software Engineer (Backend)', 'software-engineer-backend', 'IT', 'Jakarta', 'Full-time',
 '<p>Mengembangkan dan memelihara sistem backend perusahaan, bekerja sama dengan tim frontend dan produk.</p>',
 '<ul><li>Minimal S1 Teknik Informatika</li><li>Menguasai Node.js/TypeScript</li><li>Memahami database relasional</li></ul>',
 (current_date + interval '45 days')::date, 'active', now() - interval '4 days'),

('Staff Finance & Accounting', 'staff-finance-accounting', 'Keuangan', 'Surabaya', 'Full-time',
 '<p>Mengelola pencatatan keuangan, laporan bulanan, dan rekonsiliasi transaksi perusahaan.</p>',
 '<ul><li>Minimal D3 Akuntansi</li><li>Teliti dan disiplin</li><li>Menguasai software akuntansi</li></ul>',
 (current_date + interval '20 days')::date, 'active', now() - interval '6 days'),

('Human Resources Officer', 'human-resources-officer', 'HRD', 'Jakarta', 'Full-time',
 '<p>Menangani proses rekrutmen, administrasi karyawan, dan pengembangan SDM perusahaan.</p>',
 '<ul><li>Minimal S1 Psikologi/Manajemen SDM</li><li>Pengalaman di bidang HR minimal 1 tahun</li></ul>',
 (current_date + interval '25 days')::date, 'active', now() - interval '2 days'),

('Magang Content Creator', 'magang-content-creator', 'Marketing', 'Jakarta', 'Magang',
 '<p>Membantu tim marketing dalam pembuatan konten foto, video, dan copywriting untuk media sosial perusahaan.</p>',
 '<ul><li>Mahasiswa aktif/fresh graduate</li><li>Kreatif dan aktif bermedia sosial</li><li>Bisa mengoperasikan aplikasi editing dasar</li></ul>',
 (current_date + interval '15 days')::date, 'active', now() - interval '1 day')
on conflict (slug) do nothing;

-- --- Beberapa data pelamar dummy untuk testing admin dashboard ---
-- (application_number di-generate otomatis oleh trigger)
insert into public.applicants
  (job_id, full_name, nik, birth_place, birth_date, gender, address, city, phone, email,
   education, institution, major, graduation_year, work_experience, skills, certifications,
   source, cv_url, status, created_at)
select
  j.id, 'Contoh Pelamar Satu', '3171234567890001', 'Jakarta', '1998-05-10', 'Laki-laki',
  'Jl. Contoh No. 1', 'Jakarta', '081234567801', 'pelamar1@example.com',
  'S1', 'Universitas Contoh', 'Ilmu Komunikasi', 2021,
  '2 tahun sebagai Social Media Specialist', 'Copywriting, SEO, Meta Ads', '-',
  'Instagram', 'dummy/cv-contoh-1.pdf', 'Baru', now() - interval '2 days'
from public.jobs j where j.slug = 'staff-marketing-digital'
union all
select
  j.id, 'Contoh Pelamar Dua', '3171234567890002', 'Bandung', '1996-08-21', 'Perempuan',
  'Jl. Contoh No. 2', 'Bandung', '081234567802', 'pelamar2@example.com',
  'S1', 'Institut Teknologi Contoh', 'Teknik Informatika', 2019,
  '3 tahun sebagai Backend Developer', 'Node.js, PostgreSQL, TypeScript', 'AWS Certified Developer',
  'LinkedIn', 'dummy/cv-contoh-2.pdf', 'Seleksi Administrasi', now() - interval '4 days'
from public.jobs j where j.slug = 'software-engineer-backend'
union all
select
  j.id, 'Contoh Pelamar Tiga', '3171234567890003', 'Surabaya', '1999-01-15', 'Perempuan',
  'Jl. Contoh No. 3', 'Surabaya', '081234567803', 'pelamar3@example.com',
  'D3', 'Politeknik Contoh', 'Akuntansi', 2022,
  'Fresh graduate, magang 6 bulan di KAP', 'Excel, Zahir Accounting', '-',
  'Website Kampus', 'dummy/cv-contoh-3.pdf', 'Interview', now() - interval '6 days'
from public.jobs j where j.slug = 'staff-finance-accounting';
