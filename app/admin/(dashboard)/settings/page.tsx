"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Building2, Layout, Palette, ImageIcon, Share2,
  Info, Layers, Star, Save, Loader2, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageEditor } from "@/components/admin/ImageEditor";

type Settings = Record<string, string>;

const TABS = [
  { id: "identity",   label: "Identitas",      icon: Building2 },
  { id: "hero",       label: "Halaman Utama",   icon: Layout },
  { id: "about",      label: "Tentang Kami",    icon: Info },
  { id: "services",   label: "Layanan",         icon: Layers },
  { id: "advantages", label: "Keunggulan",      icon: Star },
  { id: "theme",      label: "Tema & Warna",    icon: Palette },
  { id: "media",      label: "Logo & Foto",     icon: ImageIcon },
  { id: "social",     label: "Social Media",    icon: Share2 },
];

const COLORS = [
  { label: "Biru (Default)", v: "#1c5ff5" },
  { label: "Biru Tua",       v: "#1e3a8a" },
  { label: "Hijau",          v: "#16a34a" },
  { label: "Merah",          v: "#dc2626" },
  { label: "Ungu",           v: "#7c3aed" },
  { label: "Oranye",         v: "#ea580c" },
  { label: "Abu-abu",        v: "#374151" },
  { label: "Teal",           v: "#0d9488" },
];

function Field({ label, name, value, onChange, rows, type = "text", hint }: {
  label: string; name: string; value: string;
  onChange: (k: string, v: string) => void;
  rows?: number; type?: string; hint?: string;
}) {
  const cls = "w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {rows
        ? <textarea rows={rows} className={cls + " resize-none"} value={value} onChange={e => onChange(name, e.target.value)} />
        : <input type={type} className={cls} value={value} onChange={e => onChange(name, e.target.value)} />
      }
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("identity");

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(j => { setSettings(j.data || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const update = useCallback((key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        toast.success("Tersimpan! Refresh halaman website untuk melihat perubahan.");
        setTimeout(() => setSaved(false), 4000);
      } else {
        toast.error("Gagal menyimpan, coba lagi");
      }
    } catch { toast.error("Tidak dapat terhubung ke server"); }
    finally { setSaving(false); }
  }

  const g = (key: string, fb = "") => settings[key] ?? fb;

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
    </div>
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Website</h1>
          <p className="text-sm text-gray-500 mt-1">Edit semua teks, gambar, dan tampilan website dari sini.</p>
        </div>
        <Button onClick={save} loading={saving} size="md">
          {saved ? <><CheckCircle2 className="h-4 w-4" /> Tersimpan</> : <><Save className="h-4 w-4" /> Simpan Perubahan</>}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:w-52 shrink-0 pb-1 lg:pb-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={"flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors " + (tab === id ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-100")}>
              <Icon className="h-4 w-4 shrink-0" />{label}
            </button>
          ))}
        </nav>

        <div className="flex-1 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">

          {tab === "identity" && <>
            <h2 className="font-semibold text-gray-900 text-lg">Identitas Perusahaan</h2>
            <Field label="Nama Perusahaan" name="company_name" value={g("company_name")} onChange={update} />
            <Field label="Tagline / Slogan" name="company_tagline" value={g("company_tagline")} onChange={update} />
            <Field label="Deskripsi Perusahaan" name="company_description" value={g("company_description")} onChange={update} rows={4} />
            <Field label="Alamat Lengkap" name="company_address" value={g("company_address")} onChange={update} rows={2} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nomor Telepon" name="company_phone" value={g("company_phone")} onChange={update} />
              <Field label="Email" name="company_email" type="email" value={g("company_email")} onChange={update} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Tahun Pengalaman" name="stat_years" value={g("stat_years","15+")} onChange={update} hint='Contoh: "15+"' />
              <Field label="Jumlah Klien" name="stat_clients" value={g("stat_clients","500+")} onChange={update} hint='Contoh: "500+"' />
              <Field label="Jumlah Karyawan" name="stat_employees" value={g("stat_employees","200+")} onChange={update} hint='Contoh: "200+"' />
            </div>
          </>}

          {tab === "hero" && <>
            <h2 className="font-semibold text-gray-900 text-lg">Halaman Utama (Home)</h2>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-sm text-blue-700">Teks yang tampil di halaman utama website.</div>
            <Field label="Judul Besar" name="hero_title" value={g("hero_title")} onChange={update} />
            <Field label="Teks di bawah judul" name="hero_subtitle" value={g("hero_subtitle")} onChange={update} rows={3} />
            <Field label="Teks CTA / ajakan di bawah halaman" name="footer_description" value={g("footer_description")} onChange={update} rows={2} />
          </>}

          {tab === "about" && <>
            <h2 className="font-semibold text-gray-900 text-lg">Halaman Tentang Kami</h2>
            <Field label="Visi Perusahaan" name="about_vision" value={g("about_vision")} onChange={update} rows={3} />
            <Field label="Misi Perusahaan" name="about_mission" value={g("about_mission")} onChange={update} rows={5}
              hint="Pisahkan setiap poin dengan tanda | — Contoh: Misi pertama|Misi kedua|Misi ketiga" />
            <Field label="Nilai-nilai Perusahaan" name="about_values" value={g("about_values")} onChange={update}
              hint="Pisahkan dengan | — Contoh: Integritas|Inovasi|Kolaborasi" />
            <Field label="Sejarah Perusahaan" name="about_history" value={g("about_history")} onChange={update} rows={5} />
            <Field label="Profil Perusahaan" name="about_profile" value={g("about_profile")} onChange={update} rows={5} />
          </>}

          {tab === "services" && <>
            <h2 className="font-semibold text-gray-900 text-lg">Layanan Perusahaan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1,2,3,4].map(n => (
                <div key={n} className="rounded-xl border border-gray-100 p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Layanan {n}</p>
                  <Field label="Judul" name={`service_${n}_title`} value={g(`service_${n}_title`)} onChange={update} />
                  <Field label="Deskripsi" name={`service_${n}_desc`} value={g(`service_${n}_desc`)} onChange={update} rows={3} />
                </div>
              ))}
            </div>
          </>}

          {tab === "advantages" && <>
            <h2 className="font-semibold text-gray-900 text-lg">Keunggulan Perusahaan</h2>
            <p className="text-sm text-gray-500">Tampil di bagian "Mengapa Memilih Kami" di halaman utama.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1,2,3,4].map(n => (
                <div key={n} className="rounded-xl border border-gray-100 p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Keunggulan {n}</p>
                  <Field label="Judul" name={`advantage_${n}_title`} value={g(`advantage_${n}_title`)} onChange={update} />
                  <Field label="Deskripsi" name={`advantage_${n}_desc`} value={g(`advantage_${n}_desc`)} onChange={update} rows={2} />
                </div>
              ))}
            </div>
          </>}

          {tab === "theme" && <>
            <h2 className="font-semibold text-gray-900 text-lg">Tema & Warna</h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
              {COLORS.map(c => (
                <button key={c.v} title={c.label} onClick={() => update("primary_color", c.v)}
                  className={"h-10 rounded-xl border-2 transition-transform hover:scale-110 " + (g("primary_color") === c.v ? "border-gray-800 scale-110" : "border-transparent")}
                  style={{ backgroundColor: c.v }} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input type="color" value={g("primary_color","#1c5ff5")} onChange={e => update("primary_color", e.target.value)}
                className="h-10 w-16 rounded-lg border border-gray-300 cursor-pointer p-0.5" />
              <input type="text" value={g("primary_color","#1c5ff5")} onChange={e => update("primary_color", e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-mono w-32 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <div className="flex-1 h-10 rounded-xl flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: g("primary_color","#1c5ff5") }}>
                Preview Warna
              </div>
            </div>
          </>}

          {tab === "media" && <>
            <h2 className="font-semibold text-gray-900 text-lg">Logo & Foto</h2>
            <ImageEditor label="Logo Perusahaan" currentUrl={g("company_logo_url") || undefined}
              folder="logo" aspectRatio="free" hint="PNG transparan lebih bagus. Maks. 2MB."
              onUploadComplete={url => update("company_logo_url", url)} />
            <hr className="border-gray-100" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Upload Foto untuk Berita</h3>
              <p className="text-sm text-gray-500 mb-3">Setelah upload, URL foto akan disalin otomatis — tempel di editor berita.</p>
              <ImageEditor label="Upload Foto" folder="general" aspectRatio="16:9" hint="JPG/PNG maks 2MB."
                onUploadComplete={url => { navigator.clipboard.writeText(url); toast.success("URL foto disalin! Tempel di editor berita."); }} />
            </div>
          </>}

          {tab === "social" && <>
            <h2 className="font-semibold text-gray-900 text-lg">Social Media</h2>
            <Field label="Facebook" name="facebook_url" type="url" value={g("facebook_url")} onChange={update} hint="https://facebook.com/namaperusahaan" />
            <Field label="Instagram" name="instagram_url" type="url" value={g("instagram_url")} onChange={update} hint="https://instagram.com/namaperusahaan" />
            <Field label="LinkedIn" name="linkedin_url" type="url" value={g("linkedin_url")} onChange={update} hint="https://linkedin.com/company/namaperusahaan" />
          </>}

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button onClick={save} loading={saving}>
              {saved ? <><CheckCircle2 className="h-4 w-4" /> Tersimpan</> : <><Save className="h-4 w-4" /> Simpan Perubahan</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

