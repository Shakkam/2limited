import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createShow, deleteShow } from "./actions";
import ShowFormFields from "./ShowFormFields";

export const metadata = { title: "Concerts — Backoffice" };

export default async function ConcertsPage() {
  const supabase = await createClient();
  const { data: shows, error } = await supabase.from("shows").select("*").order("date", { ascending: false });

  return (
    <div className="px-6 md:px-10 py-12 max-w-4xl">
      <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Backoffice</p>
      <h1 className="text-white text-2xl font-black tracking-widest uppercase mb-10">Concerts</h1>

      {error && <p className="text-red-500 text-sm mb-6">{error.message}</p>}

      {/* Existing shows */}
      <div className="border-t border-zinc-900 mb-14">
        {(shows || []).length === 0 && (
          <p className="text-zinc-600 text-sm py-6">Aucun concert pour l'instant.</p>
        )}
        {(shows || []).map((show) => (
          <div
            key={show.id}
            className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 border-b border-zinc-900 py-5"
          >
            <p className="text-white text-xs font-bold tracking-widest uppercase md:w-40 md:shrink-0">
              {new Date(show.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
              {show.time && <span className="text-zinc-500 normal-case"> — {show.time}</span>}
            </p>
            <div className="flex-1">
              <p className="text-white text-sm tracking-wide">{show.city}</p>
              {show.venue && <p className="text-zinc-500 text-xs">{show.venue}</p>}
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link
                href={`/backoffice/concerts/${show.id}`}
                className="text-zinc-400 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors"
              >
                Modifier
              </Link>
              <form action={deleteShow}>
                <input type="hidden" name="id" value={show.id} />
                <button
                  type="submit"
                  className="text-zinc-600 hover:text-red-500 text-[10px] font-bold tracking-widest uppercase transition-colors"
                >
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Add form */}
      <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-6">Ajouter un concert</p>
      <form action={createShow} className="flex flex-col gap-5 max-w-lg">
        <ShowFormFields />
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
