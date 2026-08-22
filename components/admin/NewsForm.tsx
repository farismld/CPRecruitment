"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import Link from "next/link";
import type { News } from "@/types/database";

const CATEGORIES = ["Umum", "Perusahaan", "Prestasi", "CSR", "Teknologi", "Karir"];

export function NewsForm({ initialData }: { initialData?: News }) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [author, setAuthor] = useState(initialData?.author || "Admin");
  const [status, setStatus] = useState<"draft" | "published">(initialData?.status || "draft");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/news/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok) {
        setImageUrl(json.url);
      } else {
        toast.error(json.error || "Gagal mengupload gambar");
      }
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setUploadingImage(false);
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {};
    if (title.trim().length < 5) newErrors.title = "Judul minimal 5 karakter";
    if (excerpt.trim().length < 10) newErrors.excerpt = "Ringkasan minimal 10 karakter";
    if (content.trim().length < 20) newErrors.content = "Konten minimal 20 karakter";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(publishStatus: "draft" | "published") {
    if (!validate()) {
      toast.error("Mohon lengkapi form dengan benar");
      return;
    }

    setSaving(true);
    const payload = {
      title,
      excerpt,
      content,
      category,
      author,
      status: publishStatus,
      image_url: imageUrl || null,
    };

    try {
      const res = await fetch(isEdit ? `/api/news/${initialData!.id}` : "/api/news", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok) {
        toast.success(isEdit ? "Berita berhasil diperbarui" : "Berita berhasil ditambahkan");
        router.push("/admin/news");
        router.refresh();
      } else {
        toast.error(json.error || "Gagal menyimpan berita");
      }
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Berita
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? "Edit Berita" : "Tambah Berita Baru"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Judul Berita <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul berita yang menarik..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1.5">{errors.title}</p>}

            <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-5">
              Ringkasan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="Ringkasan singkat yang tampil di daftar berita..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{excerpt.length}/300 karakter</p>
            {errors.excerpt && <p className="text-xs text-red-500">{errors.excerpt}</p>}
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Isi Berita <span className="text-red-500">*</span>
            </label>
            <RichTextEditor content={content} onChange={setContent} placeholder="Tulis isi berita di sini..." />
            {errors.content && <p className="text-xs text-red-500 mt-1.5">{errors.content}</p>}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar Utama</label>
            {imageUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                <button
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:text-red-600"
                  aria-label="Hapus gambar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-8 cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors">
                {uploadingImage ? (
                  <Loader2 className="h-6 w-6 text-brand-500 animate-spin" />
                ) : (
                  <ImagePlus className="h-6 w-6 text-gray-400" />
                )}
                <span className="text-xs text-gray-500">
                  {uploadingImage ? "Mengupload..." : "Klik untuk upload gambar"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </label>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Penulis</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm space-y-3">
            <Button
              onClick={() => handleSubmit("published")}
              loading={saving}
              className="w-full"
            >
              {status === "published" && isEdit ? "Simpan Perubahan" : "Publikasikan"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit("draft")}
              loading={saving}
              className="w-full"
            >
              Simpan sebagai Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
