"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, ZoomIn, ZoomOut, RotateCw, Check, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, formatFileSize } from "@/lib/utils";
import { toast } from "sonner";

interface ImageEditorProps {
  label: string;
  currentUrl?: string;
  folder?: string;
  onUploadComplete: (url: string) => void;
  aspectRatio?: "free" | "16:9" | "1:1" | "4:3";
  hint?: string;
}

export function ImageEditor({
  label,
  currentUrl,
  folder = "general",
  onUploadComplete,
  aspectRatio = "free",
  hint,
}: ImageEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [showEditor, setShowEditor] = useState(false);

  function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setOriginalFile(file);
    setShowEditor(true);
    setZoom(1);
    setRotation(0);
    setBrightness(100);
  }

  function applyEditsToCanvas(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!preview) return reject("No preview");
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        // Tentukan ukuran output berdasarkan aspect ratio
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        if (aspectRatio === "16:9") { w = 1280; h = 720; }
        else if (aspectRatio === "1:1") { w = 800; h = 800; }
        else if (aspectRatio === "4:3") { w = 800; h = 600; }
        else {
          // Free: maksimal 1280px di sisi terpanjang
          const max = 1280;
          if (w > max || h > max) {
            if (w > h) { h = Math.round(h * max / w); w = max; }
            else { w = Math.round(w * max / h); h = max; }
          }
        }

        canvas.width = w;
        canvas.height = h;

        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.filter = `brightness(${brightness}%)`;
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject("Canvas toBlob failed");
          },
          "image/jpeg",
          0.9
        );
      };
      img.onerror = reject;
      img.src = preview;
    });
  }

  async function handleUpload() {
    if (!originalFile) return;
    setUploading(true);
    try {
      const blob = await applyEditsToCanvas();
      const editedFile = new File([blob], originalFile.name.replace(/\.[^.]+$/, ".jpg"), {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("file", editedFile);
      formData.append("folder", folder);

      const res = await fetch("/api/settings/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (res.ok) {
        onUploadComplete(json.url);
        setShowEditor(false);
        setPreview(null);
        toast.success("Gambar berhasil diupload");
      } else {
        toast.error(json.error || "Gagal mengupload gambar");
      }
    } catch {
      toast.error("Gagal memproses gambar");
    } finally {
      setUploading(false);
    }
  }

  function handleCancel() {
    setShowEditor(false);
    setPreview(null);
    setOriginalFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {/* Preview gambar saat ini */}
      {currentUrl && !showEditor && (
        <div className="mb-3 relative group inline-block">
          <img
            src={currentUrl}
            alt={label}
            className="h-24 w-auto rounded-xl border border-gray-200 object-contain bg-gray-50"
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-white text-xs font-medium"
          >
            Ganti Gambar
          </button>
        </div>
      )}

      {/* Drop zone */}
      {!showEditor && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-5 px-4 cursor-pointer hover:border-brand-300 hover:bg-brand-50/50 transition-colors"
        >
          <ImageIcon className="h-6 w-6 text-gray-400" />
          <p className="text-sm text-gray-500">
            <span className="text-brand-600 font-medium">Klik</span> atau tarik gambar ke sini
          </p>
          {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      {/* Editor panel */}
      {showEditor && preview && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
          {/* Preview canvas */}
          <div className="flex items-center justify-center bg-gray-900 p-4 min-h-[200px]">
            <img
              src={preview}
              alt="Preview"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                filter: `brightness(${brightness}%)`,
                transition: "transform 0.15s ease",
                maxHeight: 240,
                maxWidth: "100%",
                objectFit: "contain",
              }}
              className="rounded"
            />
          </div>

          {/* Kontrol editor */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                  <ZoomIn className="h-3.5 w-3.5" /> Zoom ({Math.round(zoom * 100)}%)
                </label>
                <input
                  type="range" min="0.5" max="2" step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                  <RotateCw className="h-3.5 w-3.5" /> Rotasi ({rotation}°)
                </label>
                <input
                  type="range" min="-180" max="180" step="1"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  ☀ Kecerahan ({brightness}%)
                </label>
                <input
                  type="range" min="50" max="150" step="1"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setZoom(1); setRotation(0); setBrightness(100); }}
              >
                Reset
              </Button>
              <div className="flex-1" />
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" /> Batal
              </Button>
              <Button size="sm" loading={uploading} onClick={handleUpload}>
                <Check className="h-4 w-4" /> {uploading ? "Mengupload..." : "Simpan Gambar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas tersembunyi untuk render */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
