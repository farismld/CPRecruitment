"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Loading, ErrorState } from "@/components/ui/States";
import { formatDate, formatDateShort, APPLICANT_STATUS_COLORS } from "@/lib/utils";
import type { Applicant, ApplicantStatus } from "@/types/database";

const STATUS_FLOW: ApplicantStatus[] = [
  "Baru",
  "Seleksi Administrasi",
  "Diproses",
  "Interview",
  "Lulus",
  "Tidak Lulus",
];

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 sm:w-40 shrink-0">{label}</span>
      <span className="text-sm text-gray-800">{value || "-"}</span>
    </div>
  );
}

export default function ApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchApplicant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchApplicant() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/applicants/${id}`);
      const json = await res.json();
      if (res.ok) setApplicant(json.data);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(status: ApplicantStatus) {
    if (!applicant) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/applicants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setApplicant((prev) => (prev ? { ...prev, status } : prev));
        toast.success(`Status diperbarui menjadi "${status}"`);
      } else {
        toast.error("Gagal memperbarui status");
      }
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) return <Loading label="Memuat data pelamar..." />;
  if (error || !applicant) return <ErrorState title="Pelamar tidak ditemukan" />;

  return (
    <div>
      <Link
        href="/admin/applicants"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Data Pelamar
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{applicant.full_name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {applicant.application_number} &middot; Melamar {formatDate(applicant.created_at)}
          </p>
        </div>
        <Badge className={APPLICANT_STATUS_COLORS[applicant.status] + " text-sm px-3 py-1.5"}>
          {applicant.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <section className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-brand-600" /> Data Pribadi
            </h2>
            <InfoRow label="NIK" value={applicant.nik} />
            <InfoRow label="Tempat, Tanggal Lahir" value={`${applicant.birth_place}, ${formatDate(applicant.birth_date)}`} />
            <InfoRow label="Jenis Kelamin" value={applicant.gender} />
            <InfoRow label="Alamat" value={applicant.address} />
            <InfoRow label="Kota" value={applicant.city} />
            <InfoRow label="Nomor HP" value={<span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gray-400" />{applicant.phone}</span>} />
            <InfoRow label="Email" value={<span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gray-400" />{applicant.email}</span>} />
          </section>

          <section className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <GraduationCap className="h-4 w-4 text-brand-600" /> Pendidikan
            </h2>
            <InfoRow label="Pendidikan Terakhir" value={applicant.education} />
            <InfoRow label="Sekolah/Universitas" value={applicant.institution} />
            <InfoRow label="Jurusan" value={applicant.major} />
            <InfoRow label="Tahun Lulus" value={applicant.graduation_year} />
          </section>

          <section className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4 text-brand-600" /> Data Lamaran
            </h2>
            <InfoRow label="Posisi Dilamar" value={applicant.jobs?.title} />
            <InfoRow label="Pengalaman Kerja" value={applicant.work_experience} />
            <InfoRow label="Keahlian" value={applicant.skills} />
            <InfoRow label="Sertifikasi" value={applicant.certifications} />
            <InfoRow label="Sumber Informasi" value={applicant.source} />
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Ubah Status</h2>
            <div className="space-y-2">
              {STATUS_FLOW.map((s) => (
                <button
                  key={s}
                  disabled={updatingStatus}
                  onClick={() => updateStatus(s)}
                  className={`w-full text-left rounded-xl px-3.5 py-2.5 text-sm font-medium border transition-colors disabled:opacity-60 ${
                    applicant.status === s
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-brand-600" /> Dokumen
            </h2>
            <div className="space-y-2">
              <a
                href={`/api/applicants/${applicant.id}/document?type=cv`}
                target="_blank"
                className="flex items-center justify-between rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700">CV / Resume</span>
                <Download className="h-4 w-4 text-brand-600" />
              </a>
              {applicant.cover_letter_url && (
                <a
                  href={`/api/applicants/${applicant.id}/document?type=cover_letter`}
                  target="_blank"
                  className="flex items-center justify-between rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700">Surat Lamaran</span>
                  <Download className="h-4 w-4 text-brand-600" />
                </a>
              )}
              {applicant.certificate_url && (
                <a
                  href={`/api/applicants/${applicant.id}/document?type=certificate`}
                  target="_blank"
                  className="flex items-center justify-between rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700">Ijazah/Sertifikat</span>
                  <Download className="h-4 w-4 text-brand-600" />
                </a>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Tautan unduhan bersifat sementara dan aman, hanya dapat diakses oleh admin.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
