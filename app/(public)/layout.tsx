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

  // Konversi hex ke RGB untuk CSS variable
  function hexToRgb(hex: string): string {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return "28, 95, 245";
    return `${r}, ${g}, ${b}`;
  }

  const rgb = hexToRgb(primaryColor);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        // CSS variables yang dipakai di seluruh halaman public
        ["--color-brand" as string]: primaryColor,
        ["--color-brand-rgb" as string]: rgb,
      }}
    >
      {/* Inject warna brand ke Tailwind via style tag */}
      <style>{`
        :root {
          --tw-brand-600: ${primaryColor};
        }
        .text-brand-600 { color: ${primaryColor} !important; }
        .bg-brand-600 { background-color: ${primaryColor} !important; }
        .border-brand-600 { border-color: ${primaryColor} !important; }
        .hover\\:bg-brand-700:hover { background-color: ${primaryColor}cc !important; }
        .hover\\:text-brand-700:hover { color: ${primaryColor}cc !important; }
        .focus\\:ring-brand-500:focus { --tw-ring-color: ${primaryColor}80 !important; }
        .from-brand-600 { --tw-gradient-from: ${primaryColor} !important; }
        .to-brand-700 { --tw-gradient-to: ${primaryColor}cc !important; }
        .bg-brand-50 { background-color: ${primaryColor}15 !important; }
        .bg-brand-100 { background-color: ${primaryColor}25 !important; }
        .text-brand-700 { color: ${primaryColor}dd !important; }
        .border-brand-200 { border-color: ${primaryColor}40 !important; }
        .ring-brand-500 { --tw-ring-color: ${primaryColor}80 !important; }
        .ring-2.ring-brand-500 { box-shadow: 0 0 0 2px ${primaryColor}80 !important; }
        .from-brand-50 { --tw-gradient-from: ${primaryColor}10 !important; }
        .bg-brand-200 { background-color: ${primaryColor}35 !important; }
      `}</style>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

