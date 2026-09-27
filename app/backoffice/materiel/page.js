import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createGear, deleteGear } from "./actions";
import GearFormFields from "./GearFormFields";
import GroupBySelect from "./GroupBySelect";
import InlineAddGear from "./InlineAddGear";

export const metadata = { title: "Matériel — Backoffice" };

const STATUS_LABEL = { ok: "OK", a_reparer: "À réparer", a_racheter: "À racheter" };
const STATUS_COLOR = { ok: "text-zinc-400", a_reparer: "text-amber-400", a_racheter: "text-red-400" };
const GROUP_FIELDS = ["category", "owner", "status"];
const COLUMN_LABEL = { category: "Catégorie", owner: "Propriétaire", status: "État" };

function groupLabel(field, rawValue) {
  if (!rawValue) {
    return field === "category" ? "Sans catégorie" : field === "owner" ? "Sans propriétaire" : "—";
  }
  return field === "status" ? STATUS_LABEL[rawValue] || rawValue : rawValue;
}

// Groups the flat gear list by the given field, alphabetically by group
// (locale-aware), with the "no value" bucket always last.
function groupGear(items, field) {
  const map = new Map();
  for (const g of items) {
    const key = g[field] || "";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(g);
  }
  return [...map.entries()]
    .sort(([a], [b]) => {
      if (a === "") return 1;
      if (b === "") return -1;
      return a.localeCompare(b, "fr");
    })
    .map(([key, groupItems]) => ({ key, label: groupLabel(field, key), items: groupItems }));
}

// Shared table for both the flat (ungrouped) view and each group's list —
// `hideField` drops whichever column the list is already grouped by
// (redundant once it's the group's own header).
function GearTable({ items, groupBy, hideField }) {
  const columns = GROUP_FIELDS.filter((f) => f !== hideField);

  return (
    <table className="w-full text-left text-sm min-w-[640px]">
      <thead>
        <tr className="text-zinc-600 text-[10px] tracking-widest uppercase">
          <th className="py-3 pr-4 font-bold">Nom</th>
          {columns.map((c) => (
            <th key={c} className="py-3 pr-4 font-bold">
              {COLUMN_LABEL[c]}
            </th>
          ))}
          <th className="py-3 pr-4 font-bold">Qté</th>
          <th className="py-3 pr-4 font-bold"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((g) => (
          <tr key={g.id} className="border-t border-zinc-900">
            <td className="py-3 pr-4 text-white">{g.name}</td>
            {columns.map((c) =>
              c === "status" ? (
                <td key={c} className={`py-3 pr-4 ${STATUS_COLOR[g.status] || "text-zinc-400"}`}>
                  {STATUS_LABEL[g.status] || g.status}
                </td>
              ) : (
                <td key={c} className="py-3 pr-4 text-zinc-400">
                  {g[c] || "—"}
                </td>
              )
            )}
            <td className="py-3 pr-4 text-zinc-400">{g.quantity}</td>
            <td className="py-3 pr-4 whitespace-nowrap">
              <Link
                href={`/backoffice/materiel/${g.id}${groupBy ? `?groupBy=${groupBy}` : ""}`}
                className="text-zinc-400 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors mr-4"
              >
                Modifier
              </Link>
              <form action={deleteGear} className="inline">
                <input type="hidden" name="id" value={g.id} />
                <button
                  type="submit"
                  className="text-zinc-600 hover:text-red-500 text-[10px] font-bold tracking-widest uppercase transition-colors"
                >
                  Supprimer
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function MaterielPage({ searchParams }) {
  const { groupBy: rawGroupBy } = await searchParams;
  const groupBy = GROUP_FIELDS.includes(rawGroupBy) ? rawGroupBy : "";

  const supabase = await createClient();
  const { data: gear, error } = await supabase.from("gear").select("*").order("category").order("name");

  const items = gear || [];
  const groups = groupBy ? groupGear(items, groupBy) : null;

  return (
    <div className="px-6 md:px-10 py-12 max-w-4xl">
      <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Backoffice</p>
      <h1 className="text-white text-2xl font-black tracking-widest uppercase mb-6">Matériel</h1>

      <GroupBySelect value={groupBy} />

      {error && <p className="text-red-500 text-sm mb-6">{error.message}</p>}

      {items.length === 0 && (
        <p className="text-zinc-600 text-sm py-6 border-t border-zinc-900">
          Aucun matériel enregistré pour l'instant.
        </p>
      )}

      {items.length > 0 && !groupBy && (
        <div className="border-t border-zinc-900 mb-14 overflow-x-auto">
          <GearTable items={items} groupBy="" />
        </div>
      )}

      {items.length > 0 && groupBy && (
        <div className="mb-14 flex flex-col gap-10">
          {groups.map((group) => (
            <div key={group.key || "__none__"}>
              <p className="text-white text-xs font-black tracking-widest uppercase mb-3">{group.label}</p>
              <div className="border-t border-zinc-900 overflow-x-auto">
                <GearTable items={group.items} groupBy={groupBy} hideField={groupBy} />
              </div>
              <InlineAddGear field={groupBy} value={group.key} groupBy={groupBy} />
            </div>
          ))}
        </div>
      )}

      {!groupBy && (
        <>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-6">Ajouter du matériel</p>
          <form action={createGear} className="flex flex-col gap-5 max-w-lg">
            <GearFormFields />
            <button
              type="submit"
              className="self-start mt-2 border border-white text-white text-[10px] font-bold tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors"
            >
              AJOUTER
            </button>
          </form>
        </>
      )}
    </div>
  );
}
