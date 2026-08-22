import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "@/components/public/NewsCard";
import { formatDate } from "@/lib/utils";
import { CalendarDays, User, Tag, ArrowLeft } from "lucide-react";
import type { News } from "@/types/database";

export const revalidate = 60;

async function getNewsBySlug(slug: string): Promise<News | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data as News | null;
}

async function getRelatedNews(currentId: string, category: string): Promise<News[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .neq("id", currentId)
    .limit(3);
  return (data || []) as News[];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const news = await getNewsBySlug(params.slug);
  if (!news) return { title: "Berita Tidak Ditemukan" };

  return {
    title: news.title,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: news.image_url ? [news.image_url] : [],
      type: "article",
    },
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const news = await getNewsBySlug(params.slug);
  if (!news) notFound();

  const related = await getRelatedNews(news.id, news.category);

  return (
    <article>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <Link
          href="/berita"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Berita
        </Link>
      </div>

      <header className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-8">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 text-brand-700 px-3 py-1 text-xs font-medium mb-4">
          <Tag className="h-3 w-3" />
          {news.category}
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {news.title}
        </h1>
        <div className="mt-4 flex items-center gap-5 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatDate(news.created_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {news.author}
          </span>
        </div>
      </header>

      {news.image_url && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={news.image_url}
              alt={news.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </div>

      {related.length > 0 && (
        <section className="bg-gray-50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
              Berita Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
