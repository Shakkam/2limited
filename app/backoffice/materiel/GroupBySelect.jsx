"use client";

import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: "", label: "Aucun" },
  { value: "category", label: "Catégorie" },
  { value: "owner", label: "Propriétaire" },
  { value: "status", label: "État" },
];

// Drives the grouping via the URL (?groupBy=...) rather than local state —
// the server page reads it directly, so no client/server data duplication,
// and the grouped view survives a refresh or a direct link.
export default function GroupBySelect({ value }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mb-8">
      <label className="text-[10px] font-bold tracking-[0.3em] text-zinc-600">GROUPER PAR</label>
      <select
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          router.push(next ? `/backoffice/materiel?groupBy=${next}` : "/backoffice/materiel");
        }}
        className="bg-transparent border-b border-zinc-800 text-white text-sm py-1 focus:outline-none focus:border-white transition-colors [&>option]:bg-zinc-950"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
