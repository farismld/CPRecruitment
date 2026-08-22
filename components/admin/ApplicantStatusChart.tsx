"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const COLORS: Record<string, string> = {
  Baru: "#3380ff",
  "Seleksi Administrasi": "#f59e0b",
  Diproses: "#a855f7",
  Interview: "#6366f1",
  Lulus: "#10b981",
  "Tidak Lulus": "#ef4444",
};

export function ApplicantStatusChart({
  data,
}: {
  data: { status: string; total: number }[];
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-1">Pelamar per Status</h3>
      <p className="text-xs text-gray-500 mb-6">Distribusi status seluruh pelamar saat ini</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="status"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: "#f8fafc" }}
            contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }}
          />
          <Bar dataKey="total" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.status} fill={COLORS[entry.status] || "#3380ff"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
