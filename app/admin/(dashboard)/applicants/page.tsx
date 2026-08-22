"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, Trash2, Users, Download, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { SearchInput, FilterSelect } from "@/components/admin/SearchFilter";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { formatDateShort, APPLICANT_STATUS_COLORS } from "@/lib/utils";
import type { Applicant, ApplicantStatus } from "@/types/database";

const PAGE_SIZE = 10;
const STATUS_OPTIONS: ApplicantStatus[] = [
  "Baru",
  "Seleksi Administrasi",
  "Diproses",
  "Interview",
  "Lulus",
  "Tidak Lulus",
];

export default function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Applicant | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  async function fetchApplicants() {
    setLoading(true);
    try {
      const res = await fetch("/api/applicants");
      const json = await res.json();
      if (res.ok) setApplicants(json.data || []);
      else toast.error(json.error || "Gagal memuat data pelamar");
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  const jobOptions = useMemo(() => {
    const unique = new Map<string, string>();
    applicants.forEach((a) => {
      if (a.jobs) unique.set(a.jobs.id, a.jobs.title);
    });
    return Array.from(unique.entries()).map(([value, label]) => ({ value, label }));
  }, [applicants]);

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        a.full_name.toLowerCase().includes(q) ||
        a.application_number.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q);
      const matchStatus = statusFilter ? a.status === statusFilter : true;
      const matchJob = jobFilter ? a.job_id === jobFilter : true;
      const matchDate = dateFilter
        ? new Date(a.created_at).toISOString().slice(0, 10) === dateFilter
        : true;
      return matchSearch && matchStatus && matchJob && matchDate;
    });
  }, [applicants, search, statusFilter, jobFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/applicants/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Data pelamar berhasil dihapus");
        setApplicants((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        const json = await res.json();
        toast.error(json.error || "Gagal menghapus data pelamar");
      }
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Applicant>[] = [
    {
      header: "Pelamar",
      cell: (a) => (
        <div className="min-w-[200px]">
          <p className="font-medium text-gray-900">{a.full_name}</p>
          <p className="text-xs text-gray-400">{a.application_number}</p>
        </div>
      ),
    },
    { header: "Posisi", cell: (a) => <span className="text-gray-600">{a.jobs?.title || "-"}</span> },
    {
      header: "Kontak",
      cell: (a) => (
        <div className="text-xs text-gray-500 space-y-0.5">
          <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {a.email}</p>
          <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {a.phone}</p>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (a) => <Badge className={APPLICANT_STATUS_COLORS[a.status]}>{a.status}</Badge>,
    },
    { header: "Tanggal", cell: (a) => <span className="text-gray-500">{formatDateShort(a.created_at)}</span> },
    {
      header: "Aksi",
      className: "text-right",
      cell: (a) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`/api/applicants/${a.id}/document?type=cv`}
            target="_blank"
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Unduh CV"
          >
            <Download className="h-4 w-4" />
          </a>
          <Link
            href={`/admin/applicants/${a.id}`}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-brand-600"
            aria-label="Lihat detail"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteTarget(a)}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Hapus pelamar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Pelamar</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola dan pantau seluruh lamaran yang masuk.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Cari nama, no. lamaran, atau email..."
        />
        <FilterSelect
          value={jobFilter}
          onChange={(v) => { setJobFilter(v); setPage(1); }}
          options={jobOptions}
          placeholder="Semua Posisi"
        />
        <FilterSelect
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
          placeholder="Semua Status"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        emptyState={
          <EmptyState
            icon={<Users className="h-7 w-7" />}
            title="Belum ada data pelamar"
            description="Data pelamar akan muncul di sini setelah ada yang mendaftar lowongan."
          />
        }
        mobileCard={(a) => (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{a.full_name}</p>
                <p className="text-xs text-gray-400">{a.application_number}</p>
                <p className="text-xs text-gray-500 mt-1">{a.jobs?.title || "-"}</p>
              </div>
              <Badge className={APPLICANT_STATUS_COLORS[a.status]}>{a.status}</Badge>
            </div>
            <p className="text-xs text-gray-400 mt-2">{formatDateShort(a.created_at)}</p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
              <Link href={`/admin/applicants/${a.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-3.5 w-3.5" /> Detail
                </Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => setDeleteTarget(a)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      />

      {filtered.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Data Pelamar?"
        description={`Data pelamar "${deleteTarget?.full_name}" beserta dokumennya akan dihapus permanen.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
