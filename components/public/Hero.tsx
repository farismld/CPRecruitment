import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-200 blur-3xl" />
        <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-brand-100 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 text-brand-700 px-3.5 py-1.5 text-xs font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Perusahaan Terpercaya Sejak 2010
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Mitra Bisnis Anda Menuju
            <span className="text-brand-600"> Pertumbuhan Berkelanjutan</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
            PT Maju Bersama Indonesia menghadirkan solusi bisnis yang inovatif,
            andal, dan berkelanjutan untuk membantu perusahaan Anda tumbuh
            lebih cepat di era digital.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/tentang-kami"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors shadow-sm"
            >
              Kenali Kami Lebih Dekat
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/karir"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Lihat Lowongan Kerja
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">15+</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Tahun Pengalaman</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">500+</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Klien Terlayani</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">200+</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Karyawan Profesional</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustBar() {
  const items = [
    { icon: ShieldCheck, label: "Terpercaya & Kredibel" },
    { icon: Users, label: "Tim Profesional" },
    { icon: Sparkles, label: "Inovasi Berkelanjutan" },
  ];
  return (
    <div className="border-y border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-gray-600">
            <Icon className="h-4 w-4 text-brand-600" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
