import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createTrack, deleteTrack, moveTrack } from "./actions";
import TrackFormFields from "./TrackFormFields";

export const metadata = { title: "Musique — Backoffice" };

export default async function MusiquePage() {
  const supabase = await createClient();
  const { data: tracks, error } = await supabase.from("tracks").select("*").order("sort_order");

  return (
    <div className="px-6 md:px-10 py-12 max-w-4xl">
      <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Backoffice</p>
      <h1 className="text-white text-2xl font-black tracking-widest uppercase mb-2">Musique</h1>
      <p className="text-zinc-600 text-xs mb-10">
        Le premier morceau de la liste est celui mis en avant en plein écran sur la page Musique ; les
        autres apparaissent dans son menu déroulant.
      </p>

      {error && <p className="text-red-500 text-sm mb-6">{error.message}</p>}

      <div className="border-t border-zinc-900 mb-14">
        {(tracks || []).length === 0 && (
          <p className="text-zinc-600 text-sm py-6">Aucun morceau pour l'instant.</p>
        )}
        {(tracks || []).map((track, i) => (
          <div
            key={track.id}
            className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 border-b border-zinc-900 py-5"
          >
            <div className="flex items-center gap-2 md:w-16 md:shrink-0">
              <form action={moveTrack}>
                <input type="hidden" name="id" value={track.id} />
                <input type="hidden" name="direction" value="-1" />
                <button
                  type="submit"
                  disabled={i === 0}
                  className="text-zinc-500 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-500 text-xs"
                  aria-label="Monter"
                >
                  ▲
                </button>
              </form>
              <form action={moveTrack}>
                <input type="hidden" name="id" value={track.id} />
                <input type="hidden" name="direction" value="1" />
                <button
                  type="submit"
                  disabled={i === (tracks?.length || 0) - 1}
                  className="text-zinc-500 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-500 text-xs"
                  aria-label="Descendre"
                >
                  ▼
                </button>
              </form>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm tracking-wide">
                {track.title} {i === 0 && <span className="text-zinc-600 text-[10px] uppercase ml-2">— mis en avant</span>}
              </p>
              {track.subtitle_fr && <p className="text-zinc-500 text-xs">{track.subtitle_fr}</p>}
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link
                href={`/backoffice/musique/${track.id}`}
                className="text-zinc-400 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors"
              >
                Modifier
              </Link>
              <form action={deleteTrack}>
                <input type="hidden" name="id" value={track.id} />
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

      <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-6">Ajouter un morceau</p>
      <form action={createTrack} className="flex flex-col gap-5 max-w-lg">
        <TrackFormFields />
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
