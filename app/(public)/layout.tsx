import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { getSiteSettings, s } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const st = await getSiteSettings();
  const primaryColor = s(st, "primary_color", "#1c5ff5");
  const companyName = s(st, "company_name", "PT Maju Bersama Indonesia");
  const logoUrl = s(st, "company_logo_url", "");

  // Konversi hex ke variasi warna untuk CSS
  function adjustColor(hex: string, amount: number): string {
    const clean = hex.replace("#", "");
    let r = parseInt(clean.substring(0, 2), 16);
    let g = parseInt(clean.substring(2, 4), 16);
    let b = parseInt(clean.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return hex;
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  const darkerColor = adjustColor(primaryColor, -20);
  const lightColor = primaryColor + "18";
  const lightColor2 = primaryColor + "28";
  const lightColor3 = primaryColor + "38";
  const semiColor = primaryColor + "cc";
  const ringColor = primaryColor + "80";

  return (
    <div className="flex min-h-screen flex-col">
      <style>{`
        .text-brand-600, .text-brand-700 { color: ${primaryColor} !important; }
        .bg-brand-600 { background-color: ${primaryColor} !important; }
        .bg-brand-700, .hover\\:bg-brand-700:hover { background-color: ${darkerColor} !important; }
        .bg-brand-50 { background-color: ${lightColor} !important; }
        .bg-brand-100 { background-color: ${lightColor2} !important; }
        .bg-brand-200 { background-color: ${lightColor3} !important; }
        .border-brand-600 { border-color: ${primaryColor} !important; }
        .border-brand-200 { border-color: ${lightColor3} !important; }
        .border-brand-100 { border-color: ${lightColor2} !important; }
        .from-brand-600 { --tw-gradient-from: ${primaryColor} var(--tw-gradient-from-position) !important; }
        .to-brand-700 { --tw-gradient-to: ${darkerColor} var(--tw-gradient-to-position) !important; }
        .from-brand-50 { --tw-gradient-from: ${lightColor} var(--tw-gradient-from-position) !important; }
        .text-brand-50 { color: ${lightColor} !important; }
        .text-brand-400 { color: ${semiColor} !important; }
        .ring-brand-500, .focus\\:ring-brand-500:focus { --tw-ring-color: ${ringColor} !important; }
        a.hover\\:text-brand-700:hover, button.hover\\:text-brand-700:hover { color: ${darkerColor} !important; }
        .hover\\:bg-brand-50:hover { background-color: ${lightColor} !important; }
        .hover\\:bg-brand-100:hover { background-color: ${lightColor2} !important; }
        .bg-gradient-to-r.from-brand-600 { background: linear-gradient(to right, ${primaryColor}, ${darkerColor}) !important; }
        .bg-gradient-to-b.from-brand-50 { background: linear-gradient(to bottom, ${lightColor}, white) !important; }
      `}</style>
      <Navbar companyName={companyName} logoUrl={logoUrl || undefined} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
