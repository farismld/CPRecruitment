import type { Metadata } from "next";
import { Target, Eye, Gem, MapPin, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali sejarah, visi, misi, nilai, dan struktur organisasi PT Maju Bersama Indonesia.",
};

const values = [
  { title: "Integritas", desc: "Menjunjung tinggi kejujuran dan etika dalam setiap aspek bisnis." },
  { title: "Inovasi", desc: "Terus berinovasi untuk memberikan solusi terbaik bagi klien." },
  { title: "Kolaborasi", desc: "Membangun kemitraan yang saling menguntungkan dan berkelanjutan." },
  { title: "Keunggulan", desc: "Berkomitmen memberikan hasil kerja dengan kualitas terbaik." },
];

const orgStructure = [
  { role: "Direktur Utama", name: "Budi Santoso" },
  { role: "Direktur Operasional", name: "Siti Rahayu" },
  { role: "Manajer HRD", name: "Ahmad Fauzi" },
  { role: "Manajer Marketing", name: "Dewi Lestari" },
  { role: "Manajer Keuangan", name: "Rudi Hartono" },
];

export default function TentangKamiPage() {
  return (
    <div>
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="text-sm font-medium text-brand-600">Tentang Kami</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            Mengenal PT Maju Bersama Indonesia
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Perjalanan panjang membangun kepercayaan melalui dedikasi,
            profesionalisme, dan komitmen terhadap kualitas.
          </p>
        </div>
      </section>

      {/* Sejarah & Profil */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sejarah Perusahaan</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          PT Maju Bersama Indonesia didirikan pada tahun 2010 dengan visi
          untuk menjadi mitra bisnis yang tepercaya bagi perusahaan-perusahaan
          di Indonesia. Berawal dari tim kecil dengan semangat besar,
          perusahaan terus bertumbuh dan berkembang hingga kini melayani
          ratusan klien dari berbagai sektor industri.
        </p>
        <p className="text-gray-600 leading-relaxed mb-10">
          Selama lebih dari 15 tahun, kami telah membuktikan komitmen dalam
          memberikan solusi bisnis yang relevan dengan perkembangan zaman,
          didukung oleh sumber daya manusia yang kompeten dan berdedikasi
          tinggi.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil Perusahaan</h2>
        <p className="text-gray-600 leading-relaxed">
          Kami bergerak di bidang konsultasi dan solusi bisnis yang mencakup
          strategi pemasaran, pengembangan digital, manajemen operasional,
          hingga pengembangan sumber daya manusia. Dengan kantor pusat di
          Jakarta dan cabang di beberapa kota besar, kami siap melayani
          kebutuhan bisnis klien di seluruh Indonesia.
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
                Menjadi perusahaan solusi bisnis terdepan dan tepercaya di
                Indonesia yang memberikan dampak positif berkelanjutan bagi
                klien dan masyarakat.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-7 border border-gray-100 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <Target className="h-5 w-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Misi</h3>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-1.5 list-disc pl-4">
                <li>Memberikan layanan berkualitas tinggi kepada setiap klien</li>
                <li>Membangun kemitraan jangka panjang yang saling menguntungkan</li>
                <li>Terus berinovasi mengikuti perkembangan teknologi</li>
                <li>Mengembangkan sumber daya manusia yang unggul</li>
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
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm text-center">
                <h4 className="font-semibold text-gray-900 text-sm mb-1.5">{v.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Struktur Organisasi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {orgStructure.map((person) => (
            <div
              key={person.role}
              className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 bg-white shadow-sm"
            >
              <div className="h-11 w-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold shrink-0">
                {person.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{person.name}</p>
                <p className="text-xs text-gray-500">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kontak */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Informasi Kontak
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm text-center">
              <MapPin className="h-6 w-6 text-brand-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                Jl. Sudirman Kav. 25, Jakarta Selatan, DKI Jakarta 12920
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm text-center">
              <Phone className="h-6 w-6 text-brand-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">(021) 555-0123</p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm text-center">
              <Mail className="h-6 w-6 text-brand-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">info@majubersama.co.id</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
