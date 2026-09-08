import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings, s } from "@/lib/settings";
import { JobCard } from "@/components/public/JobCard";
import { EmptyState } from "@/components/ui/States";
import { Briefcase, Search } from "lucide-react";
import type { Job } from "@/types/database";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Karir",
  description: "Bergabunglah dan temukan lowongan pekerjaan terbaru.",
};

async function getJobs(): Promise<Job[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  return (data || []) as Job[];
}

export default async function KarirPage() {
  const [jobs, st] = await Promise.all([getJobs(), getSiteSettings()]);

  return (
    <div>
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="text-sm font-medium text-brand-600">Karir</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            {s(st, "career_page_title", "Bergabung Bersama Kami")}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            {s(st, "career_page_desc", "Temukan kesempatan berkarir dan kembangkan potensi terbaik Anda bersama kami.")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <p className="text-sm text-gray-500">
            {jobs.length} lowongan pekerjaan tersedia
          </p>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Briefcase className="h-7 w-7" />}
            title="Belum ada lowongan tersedia"
            description="Silakan cek kembali secara berkala untuk lowongan terbaru."
          />
        )}

        <div className="mt-14 rounded-2xl bg-brand-50 border border-brand-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-brand-600 shrink-0" />
            <p className="text-sm text-gray-700">
              Sudah melamar sebelumnya? Cek status lamaran Anda kapan saja.
            </p>
          </div>
          <a
            href="/lamaran/lacak"
            className="shrink-0 rounded-xl bg-brand-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Lacak Status Lamaran
          </a>
        </div>
      </section>
    </div>
  );
}
