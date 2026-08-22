import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Tag } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import type { News } from "@/types/database";

export function NewsCard({ news }: { news: News }) {
  return (
    <Link
      href={`/berita/${news.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {news.image_url ? (
          <Image
            src={news.image_url}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300 text-sm">
            Tidak ada gambar
          </div>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-brand-700">
          <Tag className="h-3 w-3" />
          {news.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(news.created_at)}
        </div>
        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-700 transition-colors">
          {news.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">
          {truncate(news.excerpt, 110)}
        </p>
        <span className="mt-4 text-sm font-medium text-brand-600 group-hover:translate-x-0.5 transition-transform inline-block w-fit">
          Baca Selengkapnya →
        </span>
      </div>
    </Link>
  );
}
