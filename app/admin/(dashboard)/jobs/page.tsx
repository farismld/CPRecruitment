"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Briefcase, Eye, Users } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { SearchInput, FilterSelect } from "@/components/admin/SearchFilter";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { formatDate, JOB_STATUS_COLORS } from "@/lib/utils";
import type { Job } from "@/types/database";

const PAGE_SIZE = 10;

const STATUS_LABEL: Record<string, string> = {
  active: "Aktif",
  draft: "Draft",
  closed: "Ditutup",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      const json = await res.json();
      if (res.ok) setJobs(json.data || []);
      else toast.error(json.error || "Gagal memuat lowongan");
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchSearch = j.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter ? j.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [jobs, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function toggleStatus(job: Job) {
    const newStatus = job.status === "active" ? "closed" : "active";
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Lowongan ${newStatus === "active" ? "diaktifkan" : "ditutup"}`);
        setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)));
      } else {
        toast.error("Gagal mengubah status");
      }
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Lowongan berhasil dihapus");
        setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        const json = await res.json();
        toast.error(json.error || "Gagal menghapus lowongan");
      }
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Job>[] = [
    {
      header: "Posisi",
      cell: (j) => (
        <div className="min-w-[180px]">
          <p className="font-medium text-gray-900">{j.title}</p>
          <p className="text-xs text-gray-400">{j.department} &middot; {j.location}</p>
        </div>
      ),
    },
    {
      header: "Pelamar",
      cell: (j) => (
        <span className="inline-flex items-center gap-1.5 text-gray-600">
          <Users className="h-3.5 w-3.5 text-gray-400" />
          {j.applicant_count ?? 0}
        </span>
      ),
    },
    { header: "Batas Waktu", cell: (j) => <span className="text-gray-500">{formatDate(j.deadline)}</span> },
    {
      header: "Status",
      cell: (j) => (
        <button onClick={() => toggleStatus(j)}>
          <Badge className={JOB_STATUS_COLORS[j.status] + " cursor-pointer hover:opacity-80"}>
            {STATUS_LABEL[j.status]}
          </Badge>
        </button>
      ),
    },
    {
      header: "Aksi",
      className: "text-right",
      cell: (j) => (
        <div className="flex items-center justify-end gap-1.5">
          {j.status === "active" && (
            <Link
              href={`/karir/${j.slug}`}
              target="_blank"
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Lihat lowongan"
            >
              <Eye className="h-4 w-4" />
            </Link>
          )}
          <Link
            href={`/admin/jobs/${j.id}`}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-brand-600"
            aria-label="Edit lowongan"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteTarget(j)}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Hapus lowongan"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Lowongan</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola lowongan pekerjaan perusahaan.</p>
        </div>
        <LinkButton href="/admin/jobs/new" size="md">
          <Plus className="h-4 w-4" /> Tambah Lowongan
        </LinkButton>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Cari posisi lowongan..." />
        <FilterSelect
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          options={[
            { value: "active", label: "Aktif" },
            { value: "draft", label: "Draft" },
            { value: "closed", label: "Ditutup" },
          ]}
          placeholder="Semua Status"
        />
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        emptyState={
          <EmptyState
            icon={<Briefcase className="h-7 w-7" />}
            title="Belum ada lowongan"
            description="Mulai tambahkan lowongan pekerjaan pertama."
            action={
              <LinkButton href="/admin/jobs/new" size="sm">
                <Plus className="h-4 w-4" /> Tambah Lowongan
              </LinkButton>
            }
          />
        }
        mobileCard={(j) => (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{j.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{j.department} &middot; {j.location}</p>
              </div>
              <button onClick={() => toggleStatus(j)} className="shrink-0">
                <Badge className={JOB_STATUS_COLORS[j.status]}>{STATUS_LABEL[j.status]}</Badge>
              </button>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {j.applicant_count ?? 0} pelamar</span>
              <span>Hingga {formatDate(j.deadline)}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
              <Link href={`/admin/jobs/${j.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => setDeleteTarget(j)}>
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
        title="Hapus Lowongan?"
        description={`Lowongan "${deleteTarget?.title}" beserta seluruh data pelamarnya akan dihapus permanen.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
