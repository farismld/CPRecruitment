import Link from "next/link";
import { MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/types/database";

export function JobCard({ job }: { job: Job }) {
  const isUrgent =
    new Date(job.deadline).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7;

  return (
    <Link
      href={`/karir/${job.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{job.department}</p>
        </div>
        {isUrgent && (
          <span className="shrink-0 rounded-full bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1 border border-red-100">
            Segera Tutup
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-gray-400" />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="h-4 w-4 text-gray-400" />
          {job.employment_type}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-gray-400" />
          Hingga {formatDate(job.deadline)}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-sm font-medium text-brand-600 flex items-center gap-1 group-hover:gap-2 transition-all">
          Lihat Detail
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
