"use client";

import { Search, ChevronDown } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder = "Cari...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
    </div>
  );
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Semua",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-xl border border-gray-300 pl-4 pr-9 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
