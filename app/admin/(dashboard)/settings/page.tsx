"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Palette,
  Building2,
  Globe,
  Share2,
  Image as ImageIcon,
  Save,
  Loader2,
  Layout,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageEditor } from "@/components/admin/ImageEditor";

interface Settings {
  company_name: string;
  company_tagline: string;
  company_description: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_logo_url: string;
  hero_title: string;
  hero_subtitle: string;
  primary_color: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  footer_description: string;
  [key: string]: string;
}

const DEFAULT: Settings = {
  company_name: "",
  company_tagline: "",
  company_description: "",
  company_address: "",
  company_phone: "",
  company_email: "",
  company_logo_url: "",
  hero_title: "",
  hero_subtitle: "",
  primary_color: "#1c5ff5",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  footer_description: "",
};

const COLOR_PRESETS = [
  { label: "Biru (Default)", value: "#1c5ff5" },
  { label: "Biru Tua", value: "#1e3a8a" },
  { label: "Hijau", value: "#16a34a" },
  { label: "Merah", value: "#dc2626" },
  { label: "Ungu", value: "#7c3aed" },
  { label: "Oranye", value: "#ea580c" },
  { label: "Abu-abu", value: "#374151" },
  { label: "Teal", value: "#0d9488" },
];

const TABS = [
  { id: "identity", label: "Identitas", icon: Building2 },
  { id: "hero", label: "Hero & Konten", icon: Layout },
  { id: "theme", label: "Tema Warna", icon: Palette },
  { id: "media", label: "Logo & Gambar", icon: ImageIcon },
  { id: "social", label: "Social Media", icon: Share2 },
];

function InputField({
  label, value, onChange, placeholder, type = "text", rows,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; rows?: number;
}) {
  const cls = "w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {rows ? (
        <textarea rows={rows} className={cls + " resize-none"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input type={type} className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (res.ok) setSettings({ ...DEFAULT, ...json.data });
    } catch { toast.error("Gagal memuat pengaturan"); }
    finally { setLoading(false); }
  }

  function update(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Pengaturan berhasil disimpan! Perubahan akan terlihat setelah halaman di-refresh.");
      } else {
        const json = await res.json();
        toast.error(json.error || "Gagal menyimpan");
      }
    } catch { toast.error("Tidak dapat terhubung ke server"); }
    finally { setSaving(false); }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
    </div>
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Website</h1>
          <p className="text-sm text-gray-500 mt-1">Kustomisasi tampilan dan konten website perusahaan.</p>
        </div>
        <Button onClick={handleSave} loading={saving} size="md">
          <Save className="h-4 w-4" /> Simpan Semua Perubahan
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-52 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? "bg-brand-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content panel */}
        <div className="flex-1 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">

          {activeTab === "identity" && (
            <>
              <h2 className="font-semibold text-gray-900 text-lg">Identitas Perusahaan</h2>
              <InputField label="Nama Perusahaan" value={settings.company_name} onChange={(v) => update("company_name", v)} placeholder="PT Maju Bersama Indonesia" />
              <InputField label="Tagline" value={settings.company_tagline} onChange={(v) => update("company_tagline", v)} placeholder="Mitra Bisnis Terpercaya Anda" />
              <InputField label="Deskripsi Singkat" value={settings.company_description} onChange={(v) => update("company_description", v)} placeholder="Deskripsi perusahaan..." rows={3} />
              <InputField label="Alamat" value={settings.company_address} onChange={(v) => update("company_address", v)} placeholder="Jl. Sudirman Kav. 25, Jakarta" rows={2} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Nomor Telepon" value={settings.company_phone} onChange={(v) => update("company_phone", v)} placeholder="(021) 555-0123" />
                <InputField label="Email" type="email" value={settings.company_email} onChange={(v) => update("company_email", v)} placeholder="info@perusahaan.co.id" />
              </div>
            </>
          )}

          {activeTab === "hero" && (
            <>
              <h2 className="font-semibold text-gray-900 text-lg">Hero & Konten Utama</h2>
              <p className="text-sm text-gray-500">Teks yang tampil di bagian paling atas halaman Home.</p>
              <InputField label="Judul Hero" value={settings.hero_title} onChange={(v) => update("hero_title", v)} placeholder="Mitra Bisnis Menuju Pertumbuhan Berkelanjutan" />
              <InputField label="Subjudul Hero" value={settings.hero_subtitle} onChange={(v) => update("hero_subtitle", v)} placeholder="Deskripsi singkat yang menarik..." rows={2} />
              <InputField label="Deskripsi Footer" value={settings.footer_description} onChange={(v) => update("footer_description", v)} placeholder="Teks singkat di footer website..." rows={2} />
            </>
          )}

          {activeTab === "theme" && (
            <>
              <h2 className="font-semibold text-gray-900 text-lg">Tema Warna</h2>
              <p className="text-sm text-gray-500">Pilih warna utama yang akan digunakan di seluruh website.</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Warna Preset</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.value}
                      title={color.label}
                      onClick={() => update("primary_color", color.value)}
                      className={`h-10 w-full rounded-xl border-2 transition-transform hover:scale-110 ${
                        settings.primary_color === color.value
                          ? "border-gray-800 scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Warna Kustom
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => update("primary_color", e.target.value)}
                    className="h-10 w-16 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => update("primary_color", e.target.value)}
                    placeholder="#1c5ff5"
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-mono w-36 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <div
                    className="flex-1 h-10 rounded-xl flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: settings.primary_color }}
                  >
                    Preview Warna
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-700">
                <strong>Catatan:</strong> Perubahan warna memerlukan update kode di <code>tailwind.config.ts</code> untuk diterapkan penuh di semua komponen. Untuk sekarang, warna ini akan tersimpan dan dapat digunakan secara bertahap.
              </div>
            </>
          )}

          {activeTab === "media" && (
            <>
              <h2 className="font-semibold text-gray-900 text-lg">Logo & Gambar</h2>
              <p className="text-sm text-gray-500">Upload dan edit gambar untuk kebutuhan website.</p>

              <ImageEditor
                label="Logo Perusahaan"
                currentUrl={settings.company_logo_url || undefined}
                folder="logo"
                aspectRatio="free"
                hint="Direkomendasikan format PNG transparan. Maks. 2MB."
                onUploadComplete={(url) => update("company_logo_url", url)}
              />

              {settings.company_logo_url && (
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Logo (untuk referensi)</label>
                  <input
                    readOnly
                    value={settings.company_logo_url}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-500 font-mono"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                </div>
              )}

              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-medium text-gray-800 mb-1">Upload Gambar Bebas</h3>
                <p className="text-xs text-gray-500 mb-3">Upload gambar untuk keperluan lain (gambar berita, dll). URL akan dikembalikan setelah upload.</p>
                <ImageEditor
                  label="Gambar Bebas"
                  folder="general"
                  aspectRatio="16:9"
                  hint="JPG, PNG, atau WEBP. Maks. 2MB. Output: 1280×720px."
                  onUploadComplete={(url) => {
                    navigator.clipboard.writeText(url);
                    toast.success("URL gambar disalin ke clipboard!");
                  }}
                />
              </div>
            </>
          )}

          {activeTab === "social" && (
            <>
              <h2 className="font-semibold text-gray-900 text-lg">Social Media</h2>
              <p className="text-sm text-gray-500">Link media sosial yang tampil di footer dan navbar.</p>
              <InputField label="Facebook" type="url" value={settings.facebook_url} onChange={(v) => update("facebook_url", v)} placeholder="https://facebook.com/perusahaan" />
              <InputField label="Instagram" type="url" value={settings.instagram_url} onChange={(v) => update("instagram_url", v)} placeholder="https://instagram.com/perusahaan" />
              <InputField label="LinkedIn" type="url" value={settings.linkedin_url} onChange={(v) => update("linkedin_url", v)} placeholder="https://linkedin.com/company/perusahaan" />
            </>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button onClick={handleSave} loading={saving}>
              <Save className="h-4 w-4" /> Simpan Perubahan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
