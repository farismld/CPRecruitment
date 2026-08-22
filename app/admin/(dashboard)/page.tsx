import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/StatCard";
import { ApplicantStatusChart } from "@/components/admin/ApplicantStatusChart";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { formatDateShort, APPLICANT_STATUS_COLORS } from "@/lib/utils";
import {
  Users,
  UserPlus,
  Clock,
  Video,
  CheckCircle2,
  Briefcase,
  Newspaper,
  ArrowRight,
  Inbox,
} from "lucide-react";
import type { ApplicantStatus } from "@/types/database";

export const dynamic = "force-dynamic";

interface RecentApplicant {
  id: string;
  application_number: string;
  full_name: string;
  status: ApplicantStatus;
  created_at: string;
  jobs: { title: string } | null;
}

const STATUS_LIST: ApplicantStatus[] = [
  "Baru",
  "Seleksi Administrasi",
  "Diproses",
  "Interview",
  "Lulus",
  "Tidak Lulus",
];

async function getDashboardData() {
  const supabase = createClient();

  const [
    { count: totalApplicants },
    { count: newApplicants },
    { count: processedApplicants },
    { count: interviewApplicants },
    { count: passedApplicants },
    { count: activeJobs },
    { count: totalNews },
    { data: statusCounts },
    { data: recentApplicants },
  ] = await Promise.all([
    supabase.from("applicants").select("*", { count: "exact", head: true }),
    supabase.from("applicants").select("*", { count: "exact", head: true }).eq("status", "Baru"),
    supabase.from("applicants").select("*", { count: "exact", head: true }).eq("status", "Diproses"),
    supabase.from("applicants").select("*", { count: "exact", head: true }).eq("status", "Interview"),
    supabase.from("applicants").select("*", { count: "exact", head: true }).eq("status", "Lulus"),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("applicants").select("status"),
    supabase
      .from("applicants")
      .select("id, application_number, full_name, status, created_at, jobs(title)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const chartData = STATUS_LIST.map((status) => ({
    status,
    total: (statusCounts || []).filter((a) => a.status === status).length,
  }));

  return {
    totalApplicants: totalApplicants || 0,
    newApplicants: newApplicants || 0,
    processedApplicants: processedApplicants || 0,
    interviewApplicants: interviewApplicants || 0,
    passedApplicants: passedApplicants || 0,
    activeJobs: activeJobs || 0,
    totalNews: totalNews || 0,
    chartData,
    recentApplicants: (recentApplicants || []) as unknown as RecentApplicant[],
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ringkasan aktivitas rekrutmen dan konten perusahaan.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Pelamar" value={data.totalApplicants} icon={Users} accent="brand" />
        <StatCard label="Pelamar Baru" value={data.newApplicants} icon={UserPlus} accent="amber" />
        <StatCard label="Sedang Diproses" value={data.processedApplicants} icon={Clock} accent="purple" />
        <StatCard label="Tahap Interview" value={data.interviewApplicants} icon={Video} accent="indigo" />
        <StatCard label="Pelamar Lulus" value={data.passedApplicants} icon={CheckCircle2} accent="emerald" />
        <StatCard label="Lowongan Aktif" value={data.activeJobs} icon={Briefcase} accent="brand" />
        <StatCard label="Total Berita" value={data.totalNews} icon={Newspaper} accent="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <ApplicantStatusChart data={data.chartData} />
        </div>

        <div className="lg:col-span-3 rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Pelamar Terbaru</h3>
            <Link
              href="/admin/applicants"
              className="text-xs font-medium text-brand-600 flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {data.recentApplicants.length > 0 ? (
            <div className="space-y-1">
              {data.recentApplicants.map((a) => (
                <Link
                  key={a.id}
                  href={`/admin/applicants/${a.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {a.jobs?.title || "-"} &middot; {a.application_number}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge className={APPLICANT_STATUS_COLORS[a.status]}>{a.status}</Badge>
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      {formatDateShort(a.created_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Inbox className="h-7 w-7" />}
              title="Belum ada pelamar"
              description="Data pelamar akan muncul di sini setelah ada yang mendaftar."
            />
          )}
        </div>
      </div>
    </div>
  );
}
