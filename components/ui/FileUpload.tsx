"use client";

import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, File as FileIcon, X, CheckCircle2 } from "lucide-react";
import { formatFileSize, isValidFileType, isValidFileSize, ALLOWED_FILE_TYPES } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function FileUpload({
  label,
  required,
  file,
  onChange,
  error,
  accept = ".pdf,.jpg,.jpeg,.png",
  hint = "PDF, JPG, atau PNG. Maks. 2MB.",
}: {
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null, error?: string) => void;
  error?: string;
  accept?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(selected: File | null) {
    if (!selected) {
      onChange(null);
      return;
    }
    if (!isValidFileType(selected)) {
      onChange(null, "Tipe file tidak diizinkan. Gunakan PDF, JPG, atau PNG.");
      return;
    }
    if (!isValidFileSize(selected)) {
      onChange(null, "Ukuran file maksimal 2MB.");
      return;
    }
    onChange(selected);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0] || null;
    handleFile(dropped);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors",
            dragOver ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-gray-300 bg-gray-50",
            error && "border-red-300 bg-red-50"
          )}
        >
          <UploadCloud className={cn("h-6 w-6", error ? "text-red-400" : "text-gray-400")} />
          <p className="text-sm text-gray-600">
            <span className="text-brand-600 font-medium">Klik untuk upload</span> atau tarik file ke sini
          </p>
          <p className="text-xs text-gray-400">{hint}</p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileIcon className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
          </div>
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="text-gray-400 hover:text-red-500 shrink-0"
            aria-label="Hapus file"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}
