import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createGear, deleteGear } from "./actions";
import GearFormFields from "./GearFormFields";

export const metadata = { title: "Matériel — Backoffice" };

const STATUS_LABEL = { ok: "OK", a_reparer: "À réparer", a_racheter: "À racheter" };
const STATUS_COLOR = { ok: "text-zinc-400", a_reparer: "text-amber-400", a_racheter: "text-red-400" };

export default async function MaterielPage() {
  const supabase = await createClient();
  const { data: gear, error } = await supabase
    .from("gear")
    .select("*")
    .order("category")
    .order("name");

  return (
    <div className="px-6 md:px-10 py-12 max-w-4xl">
      <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Backoffice</p>
      <h1 className="text-white text-2xl font-black tracking-widest uppercase mb-10">Matériel</h1>

      {error && <p className="text-red-500 text-sm mb-6">{error.message}</p>}

      <div className="border-t border-zinc-900 mb-14 overflow-x-auto">
        {(gear || []).length === 0 && (
          <p className="text-zinc-600 text-sm py-6">Aucun matériel enregistré pour l'instant.</p>
        )}
        {(gear || []).length > 0 && (
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead>
              <tr className="text-zinc-600 text-[10px] tracking-widest uppercase">
                <th className="py-3 pr-4 font-bold">Nom</th>
                <th className="py-3 pr-4 font-bold">Catégorie</th>
                <th className="py-3 pr-4 font-bold">Propriétaire</th>
                <th className="py-3 pr-4 font-bold">État</th>
                <th className="py-3 pr-4 font-bold">Qté</th>
                <th className="py-3 pr-4 font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {gear.map((g) => (
                <tr key={g.id} className="border-t border-zinc-900">
                  <td className="py-3 pr-4 text-white">{g.name}</td>
                  <td className="py-3 pr-4 text-zinc-400">{g.category || "—"}</td>
                  <td className="py-3 pr-4 text-zinc-400">{g.owner || "—"}</td>
                  <td className={`py-3 pr-4 ${STATUS_COLOR[g.status] || "text-zinc-400"}`}>
                    {STATUS_LABEL[g.status] || g.status}
                  </td>
                  <td className="py-3 pr-4 text-zinc-400">{g.quantity}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <Link
                      href={`/backoffice/materiel/${g.id}`}
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
        )}
      </div>

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
    </div>
  );
}
