import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicantForm } from "@/components/public/ApplicantForm";
import type { Job } from "@/types/database";

export const metadata: Metadata = {
  title: "Formulir Pendaftaran",
  robots: { index: false, follow: false },
};

async function getJobBySlug(slug: string): Promise<Job | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  return data as Job | null;
}

export default async function LamarPage({
  params,
}: {
  params: { slug: string };
}) {
  const job = await getJobBySlug(params.slug);
  if (!job) notFound();

  const isExpired = new Date(job.deadline) < new Date();
  if (isExpired) notFound();

  return <ApplicantForm job={job} />;
}
