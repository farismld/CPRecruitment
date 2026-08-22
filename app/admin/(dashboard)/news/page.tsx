"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Newspaper, Eye } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { SearchInput, FilterSelect } from "@/components/admin/SearchFilter";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { formatDateShort, NEWS_STATUS_COLORS } from "@/lib/utils";
import type { News } from "@/types/database";

const PAGE_SIZE = 10;

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<News | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      const json = await res.json();
      if (res.ok) setNews(json.data || []);
      else toast.error(json.error || "Gagal memuat berita");
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return news.filter((n) => {
      const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter ? n.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [news, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/news/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Berita berhasil dihapus");
        setNews((prev) => prev.filter((n) => n.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        const json = await res.json();
        toast.error(json.error || "Gagal menghapus berita");
      }
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<News>[] = [
    {
      header: "Berita",
      cell: (n) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="relative h-11 w-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {n.image_url ? (
              <Image src={n.image_url} alt={n.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">
                <Newspaper className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate max-w-xs">{n.title}</p>
            <p className="text-xs text-gray-400">{n.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (n) => <Badge className={NEWS_STATUS_COLORS[n.status]}>{n.status === "published" ? "Published" : "Draft"}</Badge>,
    },
    { header: "Penulis", cell: (n) => <span className="text-gray-600">{n.author}</span> },
    { header: "Tanggal", cell: (n) => <span className="text-gray-500">{formatDateShort(n.created_at)}</span> },
    {
      header: "Aksi",
      className: "text-right",
      cell: (n) => (
        <div className="flex items-center justify-end gap-1.5">
          {n.status === "published" && (
            <Link
              href={`/berita/${n.slug}`}
              target="_blank"
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Lihat berita"
            >
              <Eye className="h-4 w-4" />
            </Link>
          )}
          <Link
            href={`/admin/news/${n.id}`}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-brand-600"
            aria-label="Edit berita"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteTarget(n)}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Hapus berita"
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
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Berita</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola berita dan artikel perusahaan.</p>
        </div>
        <LinkButton href="/admin/news/new" size="md">
          <Plus className="h-4 w-4" /> Tambah Berita
        </LinkButton>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Cari judul berita..." />
        <FilterSelect
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          options={[
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" },
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
            icon={<Newspaper className="h-7 w-7" />}
            title="Belum ada berita"
            description="Mulai tambahkan berita pertama Anda."
            action={
              <LinkButton href="/admin/news/new" size="sm">
                <Plus className="h-4 w-4" /> Tambah Berita
              </LinkButton>
            }
          />
        }
        mobileCard={(n) => (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="flex gap-3">
              <div className="relative h-16 w-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {n.image_url ? (
                  <Image src={n.image_url} alt={n.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <Newspaper className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm truncate">{n.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.category} &middot; {formatDateShort(n.created_at)}</p>
                <div className="mt-2">
                  <Badge className={NEWS_STATUS_COLORS[n.status]}>{n.status === "published" ? "Published" : "Draft"}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
              <Link href={`/admin/news/${n.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => setDeleteTarget(n)}>
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
        title="Hapus Berita?"
        description={`Berita "${deleteTarget?.title}" akan dihapus permanen dan tidak dapat dikembalikan.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
