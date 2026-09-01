import type { Metadata } from "next";
import { Target, Eye, Gem, MapPin, Mail, Phone } from "lucide-react";
import { getSiteSettings, s } from "@/lib/settings";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const st = await getSiteSettings();
  return {
    title: "Tentang Kami",
    description: s(st, "about_profile", "Kenali perusahaan kami lebih dekat."),
  };
}

export default async function TentangKamiPage() {
  const st = await getSiteSettings();

  const misi = s(st, "about_mission", "Memberikan layanan berkualitas|Membangun kemitraan|Berinovasi|Mengembangkan SDM")
    .split("|").filter(Boolean);
  const nilai = s(st, "about_values", "Integritas|Inovasi|Kolaborasi|Keunggulan")
    .split("|").filter(Boolean);

  return (
    <div>
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="text-sm font-medium text-brand-600">Tentang Kami</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            Mengenal {s(st, "company_name", "PT Maju Bersama Indonesia")}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            {s(st, "company_tagline")}
          </p>
        </div>
      </section>

      {/* Sejarah & Profil */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sejarah Perusahaan</h2>
        <p className="text-gray-600 leading-relaxed mb-10 whitespace-pre-line">
          {s(st, "about_history", "Perusahaan kami berdiri dengan visi membangun kepercayaan melalui dedikasi dan profesionalisme.")}
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil Perusahaan</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {s(st, "about_profile", "Kami bergerak di bidang konsultasi dan solusi bisnis.")}
        </p>
      </section>

      {/* Visi Misi Nilai */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="rounded-2xl bg-white p-7 border border-gray-100 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <Eye className="h-5 w-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {s(st, "about_vision", "Menjadi perusahaan solusi bisnis terdepan dan tepercaya di Indonesia.")}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-7 border border-gray-100 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <Target className="h-5 w-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Misi</h3>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-1.5 list-disc pl-4">
                {misi.map((m, i) => <li key={i}>{m.trim()}</li>)}
              </ul>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
              <Gem className="h-5 w-5 text-brand-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Nilai Perusahaan</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {nilai.map((v) => (
              <div key={v} className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm text-center">
                <h4 className="font-semibold text-gray-900 text-sm">{v.trim()}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Informasi Kontak</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm text-center">
            <MapPin className="h-6 w-6 text-brand-600 mx-auto mb-3" />
            <p className="text-sm text-gray-600">{s(st, "company_address", "Jakarta, Indonesia")}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm text-center">
            <Phone className="h-6 w-6 text-brand-600 mx-auto mb-3" />
            <p className="text-sm text-gray-600">{s(st, "company_phone", "-")}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm text-center">
            <Mail className="h-6 w-6 text-brand-600 mx-auto mb-3" />
            <p className="text-sm text-gray-600">{s(st, "company_email", "-")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

