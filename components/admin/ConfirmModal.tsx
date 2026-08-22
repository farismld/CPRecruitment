"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Hapus",
  loading,
  danger = true,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Tutup"
        >
          <X className="h-4.5 w-4.5" />
        </button>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${danger ? "bg-red-50 text-red-500" : "bg-brand-50 text-brand-600"}`}>
          <AlertTriangle className="h-5.5 w-5.5" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{description}</p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
