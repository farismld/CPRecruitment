import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JobForm } from "@/components/admin/JobForm";
import type { Job } from "@/types/database";

async function getJob(id: string): Promise<Job | null> {
  const supabase = createClient();
  const { data } = await supabase.from("jobs").select("*").eq("id", id).single();
  return data as Job | null;
}

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await getJob(params.id);
  if (!job) notFound();

  return <JobForm initialData={job} />;
}
