import Link from "next/link";
import { Building2, MapPin, Mail, Phone, Facebook, Instagram, Linkedin } from "lucide-react";

const companyName =
  process.env.NEXT_PUBLIC_COMPANY_NAME || "PT Maju Bersama Indonesia";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="font-semibold text-white">{companyName}</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Mitra terpercaya untuk solusi bisnis yang inovatif, andal, dan
            berkelanjutan sejak awal berdiri.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" aria-label="Facebook" className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Navigasi</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/tentang-kami" className="hover:text-white transition-colors">Tentang Kami</Link></li>
            <li><Link href="/layanan" className="hover:text-white transition-colors">Layanan</Link></li>
            <li><Link href="/berita" className="hover:text-white transition-colors">Berita</Link></li>
            <li><Link href="/karir" className="hover:text-white transition-colors">Karir</Link></li>
            <li><Link href="/lamaran/lacak" className="hover:text-white transition-colors">Lacak Lamaran</Link></li>
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
            <li className="flex gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-brand-400" />
              <span>Jl. Sudirman Kav. 25, Jakarta Selatan, DKI Jakarta 12920</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Phone className="h-4 w-4 shrink-0 text-brand-400" />
              <span>(021) 555-0123</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Mail className="h-4 w-4 shrink-0 text-brand-400" />
              <span>info@majubersama.co.id</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} {companyName}. Seluruh hak cipta dilindungi.</p>
          <p>Dibangun dengan Next.js &amp; Supabase</p>
        </div>
      </div>
    </footer>
  );
}
