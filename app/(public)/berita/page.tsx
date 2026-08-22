import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "@/components/public/NewsCard";
import { EmptyState } from "@/components/ui/States";
import { Newspaper } from "lucide-react";
import type { News } from "@/types/database";

export const metadata: Metadata = {
  title: "Berita",
  description: "Kumpulan berita dan artikel terbaru seputar PT Maju Bersama Indonesia.",
};

export const revalidate = 60;

async function getNews(): Promise<News[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return (data || []) as News[];
}

export default async function BeritaPage() {
  const news = await getNews();

  return (
    <div>
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="text-sm font-medium text-brand-600">Berita &amp; Artikel</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            Berita Terbaru Perusahaan
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Ikuti perkembangan dan informasi terkini seputar kegiatan
            perusahaan kami.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Newspaper className="h-7 w-7" />}
            title="Belum ada berita"
            description="Berita akan segera hadir di sini."
          />
        )}
      </section>
    </div>
  );
}
