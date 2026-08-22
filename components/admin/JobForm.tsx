"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import Link from "next/link";
import type { Job, EmploymentType } from "@/types/database";

const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Part-time", "Kontrak", "Magang", "Freelance"];

export function JobForm({ initialData }: { initialData?: Job }) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    initialData?.employment_type || "Full-time"
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [requirements, setRequirements] = useState(initialData?.requirements || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");
  const [status, setStatus] = useState<"draft" | "active" | "closed">(
    initialData?.status || "draft"
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (title.trim().length < 3) newErrors.title = "Judul posisi minimal 3 karakter";
    if (!department.trim()) newErrors.department = "Departemen wajib diisi";
    if (!location.trim()) newErrors.location = "Lokasi wajib diisi";
    if (description.trim().length < 20) newErrors.description = "Deskripsi minimal 20 karakter";
    if (requirements.trim().length < 20) newErrors.requirements = "Persyaratan minimal 20 karakter";
    if (!deadline) newErrors.deadline = "Batas pendaftaran wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(publishStatus: "draft" | "active") {
    if (!validate()) {
      toast.error("Mohon lengkapi form dengan benar");
      return;
    }

    setSaving(true);
    const payload = {
      title,
      department,
      location,
      employment_type: employmentType,
      description,
      requirements,
      deadline,
      status: publishStatus,
    };

    try {
      const res = await fetch(isEdit ? `/api/jobs/${initialData!.id}` : "/api/jobs", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok) {
        toast.success(isEdit ? "Lowongan berhasil diperbarui" : "Lowongan berhasil ditambahkan");
        router.push("/admin/jobs");
        router.refresh();
      } else {
        toast.error(json.error || "Gagal menyimpan lowongan");
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
        href="/admin/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Lowongan
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? "Edit Lowongan" : "Tambah Lowongan Baru"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Posisi <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Staff Marketing Digital"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1.5">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Departemen <span className="text-red-500">*</span>
                </label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Marketing"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {errors.department && <p className="text-xs text-red-500 mt-1.5">{errors.department}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Jakarta"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {errors.location && <p className="text-xs text-red-500 mt-1.5">{errors.location}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Deskripsi Pekerjaan <span className="text-red-500">*</span>
            </label>
            <RichTextEditor content={description} onChange={setDescription} placeholder="Jelaskan tanggung jawab dan tugas posisi ini..." />
            {errors.description && <p className="text-xs text-red-500 mt-1.5">{errors.description}</p>}
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Persyaratan <span className="text-red-500">*</span>
            </label>
            <RichTextEditor content={requirements} onChange={setRequirements} placeholder="Sebutkan kualifikasi dan persyaratan pelamar..." />
            {errors.requirements && <p className="text-xs text-red-500 mt-1.5">{errors.requirements}</p>}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipe Pekerjaan</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Batas Pendaftaran <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.deadline && <p className="text-xs text-red-500 mt-1.5">{errors.deadline}</p>}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm space-y-3">
            <Button onClick={() => handleSubmit("active")} loading={saving} className="w-full">
              {status === "active" && isEdit ? "Simpan Perubahan" : "Aktifkan Lowongan"}
            </Button>
            <Button variant="outline" onClick={() => handleSubmit("draft")} loading={saving} className="w-full">
              Simpan sebagai Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
