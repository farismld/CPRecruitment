"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, CheckCircle2, Clock, XCircle, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

interface TrackResult {
  application_number: string;
  status: string;
  created_at: string;
  full_name: string;
  jobs: { title: string } | null;
}

const STEPS = [
  "Baru",
  "Seleksi Administrasi",
  "Diproses",
  "Interview",
  "Lulus",
];

const STEP_DESCRIPTIONS: Record<string, string> = {
  Baru: "Lamaran diterima",
  "Seleksi Administrasi": "Sedang dalam seleksi administrasi",
  Diproses: "Sedang diproses",
  Interview: "Tahap interview",
  Lulus: "Lulus",
  "Tidak Lulus": "Tidak lulus",
};

export default function LacakLamaranPage() {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_number: applicationNumber, email }),
      });
      const json = await res.json();

      if (res.ok) {
        setResult(json.data);
      } else {
        setNotFound(true);
        toast.error(json.error || "Data tidak ditemukan");
      }
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  const isRejected = result?.status === "Tidak Lulus";
  const currentStepIndex = result ? STEPS.indexOf(result.status) : -1;

  return (
    <div className="bg-gray-50 min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center mb-10">
          <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 text-brand-600">
            <FileSearch className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lacak Status Lamaran</h1>
          <p className="mt-2 text-gray-500">
            Masukkan nomor lamaran dan email yang Anda gunakan saat mendaftar.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Lamaran</label>
            <input
              value={applicationNumber}
              onChange={(e) => setApplicationNumber(e.target.value)}
              placeholder="LAM-2026-00001"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@anda.com"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <Button type="submit" loading={loading} className="w-full" size="lg">
            <Search className="h-4 w-4" /> Cek Status
          </Button>
        </form>

        {notFound && (
          <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 p-5 text-center text-sm text-red-700">
            Data lamaran tidak ditemukan. Periksa kembali nomor lamaran dan email Anda.
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100">
              <div>
                <p className="font-semibold text-gray-900">{result.full_name}</p>
                <p className="text-sm text-gray-500">{result.jobs?.title || "-"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{result.application_number}</p>
                <p className="text-xs text-gray-400">{formatDate(result.created_at)}</p>
              </div>
            </div>

            {isRejected ? (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
                <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 font-medium">
                  Mohon maaf, lamaran Anda belum berhasil pada seleksi kali ini. Terima kasih atas
                  partisipasinya.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                            isDone || isCurrent
                              ? "bg-brand-600 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : isCurrent ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <span className="text-xs">{idx + 1}</span>
                          )}
                        </div>
                        {idx < STEPS.length - 1 && (
                          <div className={`w-0.5 h-8 ${isDone ? "bg-brand-600" : "bg-gray-100"}`} />
                        )}
                      </div>
                      <div className="pt-0.5 pb-6">
                        <p className={`text-sm font-medium ${isCurrent ? "text-brand-700" : isDone ? "text-gray-700" : "text-gray-400"}`}>
                          {step}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-gray-500 mt-0.5">{STEP_DESCRIPTIONS[step]}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
