import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-5 text-brand-500">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 text-gray-500 max-w-sm">
        Halaman yang Anda cari mungkin telah dipindahkan atau tidak lagi tersedia.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 text-white px-6 py-3 text-sm font-medium hover:bg-brand-700 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
