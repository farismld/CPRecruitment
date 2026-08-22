"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import Link from "next/link";
import type { Job } from "@/types/database";

const EDUCATION_LEVELS = ["SMA/SMK", "D3", "D4", "S1", "S2", "S3"];
const SOURCES = ["Instagram", "LinkedIn", "Website Perusahaan", "Website Kampus", "Referensi Teman", "Job Fair", "Lainnya"];

interface FormState {
  full_name: string;
  nik: string;
  birth_place: string;
  birth_date: string;
  gender: "" | "Laki-laki" | "Perempuan";
  address: string;
  city: string;
  phone: string;
  email: string;
  education: string;
  institution: string;
  major: string;
  graduation_year: string;
  work_experience: string;
  skills: string;
  certifications: string;
  source: string;
}

const initialState: FormState = {
  full_name: "",
  nik: "",
  birth_place: "",
  birth_date: "",
  gender: "",
  address: "",
  city: "",
  phone: "",
  email: "",
  education: "",
  institution: "",
  major: "",
  graduation_year: "",
  work_experience: "",
  skills: "",
  certifications: "",
  source: "",
};

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";

export function ApplicantForm({ job }: { job: Job }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [cv, setCv] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [coverLetterError, setCoverLetterError] = useState("");
  const [certificate, setCertificate] = useState<File | null>(null);
  const [certificateError, setCertificateError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (form.full_name.trim().length < 3) e.full_name = "Nama lengkap wajib diisi";
    if (!/^\d{16}$/.test(form.nik)) e.nik = "NIK harus 16 digit angka";
    if (!form.birth_place.trim()) e.birth_place = "Tempat lahir wajib diisi";
    if (!form.birth_date) e.birth_date = "Tanggal lahir wajib diisi";
    if (!form.gender) e.gender = "Jenis kelamin wajib dipilih";
    if (!form.address.trim()) e.address = "Alamat wajib diisi";
    if (!form.city.trim()) e.city = "Kota wajib diisi";
    if (!/^0\d{8,13}$/.test(form.phone.replace(/[\s-]/g, ""))) e.phone = "Nomor HP tidak valid (contoh: 081234567890)";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Format email tidak valid";
    if (!form.education) e.education = "Pendidikan terakhir wajib dipilih";
    if (!form.institution.trim()) e.institution = "Nama sekolah/universitas wajib diisi";
    if (!form.major.trim()) e.major = "Jurusan wajib diisi";
    if (!/^\d{4}$/.test(form.graduation_year)) e.graduation_year = "Tahun lulus tidak valid";
    if (!cv) e.cv = "CV wajib diupload";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Mohon lengkapi form dengan benar");
      const firstError = document.querySelector("[data-error='true']");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("job_id", job.id);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (cv) fd.append("cv", cv);
      if (coverLetter) fd.append("cover_letter", coverLetter);
      if (certificate) fd.append("certificate", certificate);

      const res = await fetch("/api/applicants", { method: "POST", body: fd });
      const json = await res.json();

      if (res.ok) {
        setApplicationNumber(json.application_number);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(json.error || "Gagal mengirim lamaran");
      }
    } catch {
      toast.error("Tidak dapat terhubung ke server. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (applicationNumber) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:py-24 text-center">
        <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6 text-emerald-500">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Lamaran berhasil dikirim. Terima kasih telah melamar di perusahaan kami.
        </h1>
        <p className="mt-3 text-gray-500">
          Simpan nomor lamaran Anda untuk melacak status seleksi kapan saja.
        </p>

        <div className="mt-8 rounded-2xl bg-brand-50 border border-brand-100 p-6">
          <p className="text-xs text-brand-600 font-medium mb-1">Nomor Lamaran Anda</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl font-bold text-brand-800 tracking-wide">{applicationNumber}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(applicationNumber);
                toast.success("Nomor lamaran disalin");
              }}
              className="p-2 text-brand-600 hover:bg-brand-100 rounded-lg"
              aria-label="Salin nomor lamaran"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/lamaran/lacak"
            className="rounded-xl bg-brand-600 text-white px-6 py-3 text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Lacak Status Lamaran
          </Link>
          <Link
            href="/karir"
            className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Lihat Lowongan Lain
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href={`/karir/${job.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Detail Lowongan
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Formulir Pendaftaran</h1>
      <p className="mt-2 text-gray-500">
        Melamar untuk posisi <span className="font-medium text-gray-700">{job.title}</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Data Pribadi */}
        <section className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Data Pribadi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama Lengkap" required error={errors.full_name}>
              <input className={inputClass} value={form.full_name} onChange={(e) => update("full_name", e.target.value)} data-error={!!errors.full_name} />
            </Field>
            <Field label="NIK" required error={errors.nik}>
              <input className={inputClass} maxLength={16} inputMode="numeric" value={form.nik} onChange={(e) => update("nik", e.target.value.replace(/\D/g, ""))} data-error={!!errors.nik} />
            </Field>
            <Field label="Tempat Lahir" required error={errors.birth_place}>
              <input className={inputClass} value={form.birth_place} onChange={(e) => update("birth_place", e.target.value)} data-error={!!errors.birth_place} />
            </Field>
            <Field label="Tanggal Lahir" required error={errors.birth_date}>
              <input type="date" className={inputClass} value={form.birth_date} onChange={(e) => update("birth_date", e.target.value)} data-error={!!errors.birth_date} />
            </Field>
            <Field label="Jenis Kelamin" required error={errors.gender}>
              <select className={inputClass} value={form.gender} onChange={(e) => update("gender", e.target.value as FormState["gender"])} data-error={!!errors.gender}>
                <option value="">Pilih...</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </Field>
            <Field label="Kota Domisili" required error={errors.city}>
              <input className={inputClass} value={form.city} onChange={(e) => update("city", e.target.value)} data-error={!!errors.city} />
            </Field>
            <Field label="Nomor HP" required error={errors.phone}>
              <input className={inputClass} placeholder="081234567890" value={form.phone} onChange={(e) => update("phone", e.target.value)} data-error={!!errors.phone} />
            </Field>
            <Field label="Email" required error={errors.email}>
              <input type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} data-error={!!errors.email} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Alamat Lengkap" required error={errors.address}>
                <textarea rows={2} className={inputClass + " resize-none"} value={form.address} onChange={(e) => update("address", e.target.value)} data-error={!!errors.address} />
              </Field>
            </div>
          </div>
        </section>

        {/* Pendidikan */}
        <section className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Pendidikan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Pendidikan Terakhir" required error={errors.education}>
              <select className={inputClass} value={form.education} onChange={(e) => update("education", e.target.value)} data-error={!!errors.education}>
                <option value="">Pilih...</option>
                {EDUCATION_LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </Field>
            <Field label="Tahun Lulus" required error={errors.graduation_year}>
              <input className={inputClass} maxLength={4} inputMode="numeric" value={form.graduation_year} onChange={(e) => update("graduation_year", e.target.value.replace(/\D/g, ""))} data-error={!!errors.graduation_year} />
            </Field>
            <Field label="Nama Sekolah/Universitas" required error={errors.institution}>
              <input className={inputClass} value={form.institution} onChange={(e) => update("institution", e.target.value)} data-error={!!errors.institution} />
            </Field>
            <Field label="Jurusan" required error={errors.major}>
              <input className={inputClass} value={form.major} onChange={(e) => update("major", e.target.value)} data-error={!!errors.major} />
            </Field>
          </div>
        </section>

        {/* Data Lamaran */}
        <section className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Data Lamaran</h2>
          <div className="space-y-4">
            <Field label="Pengalaman Kerja">
              <textarea rows={3} className={inputClass + " resize-none"} placeholder="Ceritakan pengalaman kerja Anda (opsional)" value={form.work_experience} onChange={(e) => update("work_experience", e.target.value)} />
            </Field>
            <Field label="Keahlian">
              <textarea rows={2} className={inputClass + " resize-none"} placeholder="Contoh: Microsoft Office, Public Speaking, dll" value={form.skills} onChange={(e) => update("skills", e.target.value)} />
            </Field>
            <Field label="Sertifikasi">
              <input className={inputClass} placeholder="Sertifikasi yang dimiliki (opsional)" value={form.certifications} onChange={(e) => update("certifications", e.target.value)} />
            </Field>
            <Field label="Sumber Informasi Lowongan">
              <select className={inputClass} value={form.source} onChange={(e) => update("source", e.target.value)}>
                <option value="">Pilih...</option>
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </section>

        {/* Dokumen */}
        <section className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-1">Dokumen</h2>
          <p className="text-xs text-gray-400 mb-4">Format PDF, JPG, atau PNG. Maksimal 2MB per file.</p>
          <div className="space-y-4">
            <div data-error={!!errors.cv}>
              <FileUpload
                label="CV / Resume"
                required
                file={cv}
                error={errors.cv || cvError}
                onChange={(f, err) => { setCv(f); setCvError(err || ""); }}
              />
            </div>
            <FileUpload
              label="Surat Lamaran"
              file={coverLetter}
              error={coverLetterError}
              onChange={(f, err) => { setCoverLetter(f); setCoverLetterError(err || ""); }}
            />
            <FileUpload
              label="Ijazah & Sertifikat Pendukung"
              hint="Gabungkan ijazah dan sertifikat dalam satu file PDF jika lebih dari satu. Maks. 2MB."
              file={certificate}
              error={certificateError}
              onChange={(f, err) => { setCertificate(f); setCertificateError(err || ""); }}
            />
          </div>
        </section>

        <Button type="submit" size="lg" loading={submitting} className="w-full">
          {submitting ? "Mengirim Lamaran..." : "Kirim Lamaran"}
        </Button>
      </form>
    </div>
  );
}
