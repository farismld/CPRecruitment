import { clsx, type ClassValue } from "clsx";

/** Gabungkan className secara kondisional */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Ubah teks menjadi slug SEO-friendly: "Staff Marketing Digital" -> "staff-marketing-digital" */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Format tanggal ke format Indonesia: "19 Agustus 2026" */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Format tanggal + waktu relatif singkat */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Potong teks dengan batas karakter, tambahkan elipsis */
export function truncate(text: string, length = 120): string {
  const clean = text.replace(/<[^>]*>?/gm, ""); // strip HTML tags
  if (clean.length <= length) return clean;
  return clean.slice(0, length).trim() + "...";
}

/** Validasi tipe file yang diperbolehkan untuk upload dokumen */
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

/** Maksimal ukuran file upload: 2MB */
export const MAX_FILE_SIZE = 2 * 1024 * 1024;

export function isValidFileType(file: File): boolean {
  return ALLOWED_FILE_TYPES.includes(file.type);
}

export function isValidFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/** Badge warna berdasarkan status pelamar, dipakai di admin dashboard */
export const APPLICANT_STATUS_COLORS: Record<string, string> = {
  Baru: "bg-blue-50 text-blue-700 border-blue-200",
  "Seleksi Administrasi": "bg-amber-50 text-amber-700 border-amber-200",
  Diproses: "bg-purple-50 text-purple-700 border-purple-200",
  Interview: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Lulus: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Tidak Lulus": "bg-red-50 text-red-700 border-red-200",
};

export const JOB_STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  closed: "bg-red-50 text-red-700 border-red-200",
};

export const NEWS_STATUS_COLORS: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
};
