import type { Metadata } from "next";
import { BarChart3, Cpu, Settings, GraduationCap } from "lucide-react";
import { getSiteSettings, s } from "@/lib/settings";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Layanan",
  description: "Layanan konsultasi bisnis, solusi digital, manajemen operasional, dan pengembangan SDM.",
};

const ICONS = [BarChart3, Cpu, Settings, GraduationCap];

export default async function LayananPage() {
  const st = await getSiteSettings();

  const services = [1, 2, 3, 4].map((n) => ({
    title: s(st, `service_${n}_title`, ["Konsultasi Bisnis", "Solusi Digital", "Manajemen Operasional", "Pengembangan SDM"][n - 1]),
    desc: s(st, `service_${n}_desc`, "Layanan profesional untuk mendukung pertumbuhan bisnis Anda."),
    icon: ICONS[n - 1],
  }));

  return (
    <div>
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="text-sm font-medium text-brand-600">Layanan Kami</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            Solusi Bisnis yang Kami Tawarkan
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Rangkaian layanan komprehensif untuk mendukung pertumbuhan bisnis Anda di setiap tahapan.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5">
                <Icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

