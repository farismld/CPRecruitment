import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const [{ data: news }, { data: jobs }] = await Promise.all([
    supabase.from("news").select("slug, updated_at").eq("status", "published"),
    supabase.from("jobs").select("slug, updated_at").eq("status", "active"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tentang-kami`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/layanan`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/berita`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/karir`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/lamaran/lacak`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const newsRoutes: MetadataRoute.Sitemap = (news || []).map((n) => ({
    url: `${siteUrl}/berita/${n.slug}`,
    lastModified: n.updated_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const jobRoutes: MetadataRoute.Sitemap = (jobs || []).map((j) => ({
    url: `${siteUrl}/karir/${j.slug}`,
    lastModified: j.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...newsRoutes, ...jobRoutes];
}
