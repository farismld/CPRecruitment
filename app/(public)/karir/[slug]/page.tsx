import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Briefcase,
  Building2,
  Clock,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { Job } from "@/types/database";

export const revalidate = 30;

async function getJobBySlug(slug: string): Promise<Job | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  return data as Job | null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);
  if (!job) return { title: "Lowongan Tidak Ditemukan" };

  return {
    title: `${job.title} — Karir`,
    description: `Lowongan ${job.title} di ${job.department}, ${job.location}. Segera lamar sebelum ${formatDate(job.deadline)}.`,
  };
}

export default async function KarirDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const job = await getJobBySlug(params.slug);
  if (!job) notFound();

  const isExpired = new Date(job.deadline) < new Date();

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <Link
          href="/karir"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Karir
        </Link>
      </div>

      <header className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{job.title}</h1>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-gray-400" />
            {job.department}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-gray-400" />
            {job.employment_type}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gray-400" />
            Batas: {formatDate(job.deadline)}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">Deskripsi Pekerjaan</h2>
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </section>

        <section className="mb-10">
          <h2 className="font-semibold text-gray-900 mb-3">Persyaratan</h2>
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: job.requirements }}
          />
        </section>

        {isExpired ? (
          <div className="rounded-2xl bg-gray-100 p-6 text-center text-sm text-gray-500">
            Lowongan ini sudah melewati batas waktu pendaftaran.
          </div>
        ) : (
          <div className="rounded-2xl bg-brand-50 border border-brand-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900">Tertarik dengan posisi ini?</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Lengkapi formulir pendaftaran secara online sekarang.
              </p>
            </div>
            <Link
              href={`/karir/${job.slug}/lamar`}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-brand-600 text-white px-6 py-3 text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Lamar Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
