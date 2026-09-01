import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings, s } from "@/lib/settings";
import { Hero, TrustBar } from "@/components/public/Hero";
import { NewsCard } from "@/components/public/NewsCard";
import { JobCard } from "@/components/public/JobCard";
import { EmptyState } from "@/components/ui/States";
import {
  ShieldCheck, Rocket, Users2, HeartHandshake,
  ArrowRight, Newspaper, Briefcase,
} from "lucide-react";
import type { News, Job } from "@/types/database";

export const revalidate = 60;

const ADVANTAGE_ICONS = [ShieldCheck, Rocket, Users2, HeartHandshake];

async function getHomeData() {
  const supabase = createClient();
  const [{ data: news }, { data: jobs }] = await Promise.all([
    supabase.from("news").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(3),
    supabase.from("jobs").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(3),
  ]);
  return { news: (news || []) as News[], jobs: (jobs || []) as Job[] };
}

export default async function HomePage() {
  const [{ news, jobs }, st] = await Promise.all([getHomeData(), getSiteSettings()]);

  const advantages = [1, 2, 3, 4].map((n, i) => ({
    icon: ADVANTAGE_ICONS[i],
    title: s(st, `advantage_${n}_title`, ["Terpercaya & Berpengalaman", "Inovasi Berkelanjutan", "Tim Profesional", "Berorientasi Pelanggan"][i]),
    desc: s(st, `advantage_${n}_desc`, "Layanan profesional terbaik untuk klien kami."),
  }));

  return (
    <>
      <Hero settings={st} />
      <TrustBar />

      {/* Profil singkat + Visi Misi */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-medium text-brand-600">Tentang Perusahaan</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
              Membangun Masa Depan Bisnis yang Lebih Baik
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              {s(st, "company_description", "PT Maju Bersama Indonesia adalah perusahaan yang bergerak di bidang konsultasi dan solusi bisnis.")}
            </p>
            <Link href="/tentang-kami" className="mt-6 inline-flex items-center gap-2 text-brand-600 font-medium text-sm hover:gap-3 transition-all">
              Selengkapnya Tentang Kami <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-brand-600 text-white p-6">
              <h3 className="font-semibold mb-2">Visi</h3>
              <p className="text-sm text-brand-50 leading-relaxed">
                {s(st, "about_vision", "Menjadi perusahaan solusi bisnis terdepan dan tepercaya di Indonesia.")}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-900 text-white p-6">
              <h3 className="font-semibold mb-2">Misi</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {s(st, "about_mission", "Memberikan layanan berkualitas|Membangun kemitraan").split("|")[0]}...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <div className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-6 max-w-lg">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s(st, "stat_years", "15+")}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Tahun Pengalaman</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s(st, "stat_clients", "500+")}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Klien Terlayani</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s(st, "stat_employees", "200+")}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Karyawan Profesional</p>
            </div>
          </div>
        </div>
      </div>

      {/* Keunggulan */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-medium text-brand-600">Keunggulan Kami</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">Mengapa Memilih Kami</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Berita terbaru */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
          <div>
            <span className="text-sm font-medium text-brand-600">Berita</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">Berita Terbaru</h2>
          </div>
          <Link href="/berita" className="text-sm font-medium text-brand-600 flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua Berita <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => <NewsCard key={item.id} news={item} />)}
          </div>
        ) : (
          <EmptyState icon={<Newspaper className="h-7 w-7" />} title="Belum ada berita" description="Berita terbaru akan tampil di sini." />
        )}
      </section>

      {/* Lowongan terbaru */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
            <div>
              <span className="text-sm font-medium text-brand-600">Karir</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">Lowongan Pekerjaan Terbaru</h2>
            </div>
            <Link href="/karir" className="text-sm font-medium text-brand-600 flex items-center gap-1 hover:gap-2 transition-all">
              Lihat Semua Lowongan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <EmptyState icon={<Briefcase className="h-7 w-7" />} title="Belum ada lowongan aktif" description="Lowongan pekerjaan terbaru akan tampil di sini." />
          )}
        </div>
      </section>

      {/* CTA */}
      <section id="kontak" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 sm:px-12 py-12 sm:py-16 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">Siap Berkolaborasi dengan Kami?</h2>
          <p className="mt-3 text-brand-50 max-w-xl mx-auto">
            {s(st, "footer_description", "Hubungi tim kami atau bergabunglah sebagai bagian dari keluarga besar perusahaan.")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={`mailto:${s(st, "company_email", "info@majubersama.co.id")}`}
              className="rounded-xl bg-white text-brand-700 px-6 py-3 text-sm font-medium hover:bg-brand-50 transition-colors">
              Hubungi Kami
            </a>
            <Link href="/karir"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors">
              Lihat Lowongan Kerja
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

