import Link from "next/link";
import { Building2, MapPin, Mail, Phone, Facebook, Instagram, Linkedin } from "lucide-react";
import { getSiteSettings, s } from "@/lib/settings";

export async function Footer() {
  const st = await getSiteSettings();
  const name = s(st, "company_name", "PT Maju Bersama Indonesia");
  const fb = s(st, "facebook_url");
  const ig = s(st, "instagram_url");
  const li = s(st, "linkedin_url");

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-3">
            {s(st, "company_logo_url") ? (
              <img src={s(st, "company_logo_url")} alt={name} className="h-9 w-auto object-contain" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Building2 className="h-5 w-5" />
              </span>
            )}
            <span className="font-semibold text-white">{name}</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            {s(st, "footer_description", "Mitra terpercaya untuk solusi bisnis yang inovatif dan berkelanjutan.")}
          </p>
          <div className="flex gap-3 mt-4">
            {fb && <a href={fb} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors"><Facebook className="h-4 w-4" /></a>}
            {ig && <a href={ig} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors"><Instagram className="h-4 w-4" /></a>}
            {li && <a href={li} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors"><Linkedin className="h-4 w-4" /></a>}
            {!fb && !ig && !li && (
              <>
                <a href="#" aria-label="Facebook" className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors"><Facebook className="h-4 w-4" /></a>
                <a href="#" aria-label="Instagram" className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors"><Instagram className="h-4 w-4" /></a>
                <a href="#" aria-label="LinkedIn" className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors"><Linkedin className="h-4 w-4" /></a>
              </>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Navigasi</h4>
          <ul className="space-y-2.5 text-sm">
            {[["Tentang Kami","/tentang-kami"],["Layanan","/layanan"],["Berita","/berita"],["Karir","/karir"],["Lacak Lamaran","/lamaran/lacak"]].map(([l,h])=>(
              <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Layanan</h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>Konsultasi Bisnis</li>
            <li>Solusi Digital</li>
            <li>Manajemen Operasional</li>
            <li>Pengembangan SDM</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Kontak</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            {s(st,"company_address") && (
              <li className="flex gap-2.5"><MapPin className="h-4 w-4 shrink-0 mt-0.5 text-brand-400" /><span>{s(st,"company_address")}</span></li>
            )}
            {s(st,"company_phone") && (
              <li className="flex gap-2.5 items-center"><Phone className="h-4 w-4 shrink-0 text-brand-400" /><span>{s(st,"company_phone")}</span></li>
            )}
            {s(st,"company_email") && (
              <li className="flex gap-2.5 items-center"><Mail className="h-4 w-4 shrink-0 text-brand-400" /><span>{s(st,"company_email")}</span></li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} {name}. Seluruh hak cipta dilindungi.</p>
          <p>Dibangun dengan Next.js &amp; Supabase</p>
        </div>
      </div>
    </footer>
  );
}

