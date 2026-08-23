import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { isValidFileType, isValidFileSize } from "@/lib/utils";

async function assertAuthenticated() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}

/** GET: daftar semua pelamar — HANYA untuk admin */
export async function GET() {
  const isAuth = await assertAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("applicants")
    .select("*, jobs(id, title, slug)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

const applicantSchema = z.object({
  job_id: z.string().uuid("Lowongan tidak valid"),
  full_name: z.string().min(3, "Nama lengkap wajib diisi"),
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  birth_place: z.string().min(2, "Tempat lahir wajib diisi"),
  birth_date: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["Laki-laki", "Perempuan"]),
  address: z.string().min(5, "Alamat wajib diisi"),
  city: z.string().min(2, "Kota wajib diisi"),
  phone: z.string().min(9, "Nomor HP tidak valid"),
  email: z.string().email("Format email tidak valid"),
  education: z.string().min(1, "Pendidikan terakhir wajib diisi"),
  institution: z.string().min(2, "Nama sekolah/universitas wajib diisi"),
  major: z.string().min(2, "Jurusan wajib diisi"),
  graduation_year: z.coerce.number().min(1980).max(new Date().getFullYear() + 1),
  work_experience: z.string().optional().nullable(),
  skills: z.string().optional().nullable(),
  certifications: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
});

/** POST: pelamar baru mengirimkan lamaran (public, tanpa login) */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const rawFields: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") rawFields[key] = value;
    });

    const parsed = applicantSchema.safeParse(rawFields);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // Ekstrak data yang sudah tervalidasi ke variabel lokal
    // agar TypeScript tidak perlu mengecek ulang `parsed.success`
    const validatedData = parsed.data;

    // Pastikan lowongan yang dilamar memang masih aktif
    const supabase = createClient();
    const { data: jobData } = await supabase
      .from("jobs")
      .select("id, status, deadline")
      .eq("id", validatedData.job_id)
      .eq("status", "active")
      .maybeSingle();

    const job = jobData as { id: string; status: string; deadline: string } | null;

    if (!job) {
      return NextResponse.json(
        { error: "Lowongan tidak ditemukan atau sudah tidak aktif" },
        { status: 400 }
      );
    }
    if (new Date(job.deadline) < new Date()) {
      return NextResponse.json(
        { error: "Batas waktu pendaftaran untuk lowongan ini sudah berakhir" },
        { status: 400 }
      );
    }

    // Validasi & upload dokumen
    const admin = createAdminClient();
    const cvFile = formData.get("cv") as File | null;
    const coverLetterFile = formData.get("cover_letter") as File | null;
    const certificateFile = formData.get("certificate") as File | null;

    if (!cvFile || cvFile.size === 0) {
      return NextResponse.json({ error: "CV wajib diupload" }, { status: 400 });
    }
    if (!isValidFileType(cvFile) || !isValidFileSize(cvFile)) {
      return NextResponse.json(
        { error: "CV harus PDF/JPG/PNG dan maksimal 2MB" },
        { status: 400 }
      );
    }

    const jobId = validatedData.job_id;

    async function uploadDoc(file: File, label: string): Promise<string> {
      const ext = file.name.split(".").pop();
      const path = `applicants/${jobId}/${Date.now()}-${label}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const buffer = await file.arrayBuffer();
      const { error } = await admin.storage
        .from("applicant-documents")
        .upload(path, buffer, { contentType: file.type });
      if (error) throw new Error(`Gagal mengupload ${label}: ${error.message}`);
      return path;
    }

    const cv_url = await uploadDoc(cvFile, "cv");

    let cover_letter_url: string | null = null;
    if (coverLetterFile && coverLetterFile.size > 0) {
      if (!isValidFileType(coverLetterFile) || !isValidFileSize(coverLetterFile)) {
        return NextResponse.json(
          { error: "Surat lamaran harus PDF/JPG/PNG dan maksimal 2MB" },
          { status: 400 }
        );
      }
      cover_letter_url = await uploadDoc(coverLetterFile, "cover-letter");
    }

    let certificate_url: string | null = null;
    if (certificateFile && certificateFile.size > 0) {
      if (!isValidFileType(certificateFile) || !isValidFileSize(certificateFile)) {
        return NextResponse.json(
          { error: "Ijazah/Sertifikat harus PDF/JPG/PNG dan maksimal 2MB" },
          { status: 400 }
        );
      }
      certificate_url = await uploadDoc(certificateFile, "certificate");
    }

    // Insert data pelamar (bypass RLS lewat service role, karena anon
    // sengaja tidak diberi izin INSERT langsung — lihat schema.sql)
    const { data: applicant, error: insertError } = await admin
      .from("applicants")
      .insert({
        ...validatedData,
        email: validatedData.email.trim().toLowerCase(),
        cv_url,
        cover_letter_url,
        certificate_url,
        status: "Baru",
      })
      .select("application_number")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(
      { application_number: applicant.application_number },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memproses lamaran";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
