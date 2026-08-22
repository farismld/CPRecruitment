import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewsForm } from "@/components/admin/NewsForm";
import type { News } from "@/types/database";

async function getNews(id: string): Promise<News | null> {
  const supabase = createClient();
  const { data } = await supabase.from("news").select("*").eq("id", id).single();
  return data as News | null;
}

export default async function EditNewsPage({
  params,
}: {
  params: { id: string };
}) {
  const news = await getNews(params.id);
  if (!news) notFound();

  return <NewsForm initialData={news} />;
}
