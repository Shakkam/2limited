import { createClient } from "@/lib/supabase/server";
import { uploadPhotos, updatePhotoAlt, deletePhoto } from "./actions";

export const metadata = { title: "Photos — Backoffice" };

export default async function PhotosPage() {
  const supabase = await createClient();
  const { data: photos, error } = await supabase.from("photos").select("*").order("sort_order");

  return (
    <div className="px-6 md:px-10 py-12">
      <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">Backoffice</p>
      <h1 className="text-white text-2xl font-black tracking-widest uppercase mb-2">Photos</h1>
      <p className="text-zinc-600 text-xs mb-10">
        Utilisées dans la galerie de la page Médias et le fond animé de la page Musique.
      </p>

      <form action={uploadPhotos} className="flex flex-wrap items-center gap-4 mb-14 border border-zinc-800 p-6 max-w-xl">
        <input
          type="file"
          name="photos"
          accept="image/*"
          multiple
          required
          className="flex-1 min-w-[14rem] text-zinc-400 text-xs file:mr-4 file:border file:border-zinc-700 file:bg-transparent file:text-zinc-300 file:text-[10px] file:font-bold file:tracking-widest file:uppercase file:px-4 file:py-2 file:cursor-pointer hover:file:border-white hover:file:text-white file:transition-colors"
        />
        <button
          type="submit"
          className="border border-white text-white text-[10px] font-bold tracking-widest px-6 py-3 hover:bg-white hover:text-black transition-colors"
        >
          AJOUTER
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-6">{error.message}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {(photos || []).map((photo) => (
          <div key={photo.id} className="border border-zinc-900 bg-zinc-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt || ""} className="w-full aspect-square object-cover" />
            <div className="p-3">
              <form action={updatePhotoAlt} className="flex items-center gap-2 mb-2">
                <input type="hidden" name="id" value={photo.id} />
                <input
                  type="text"
                  name="alt"
                  defaultValue={photo.alt || ""}
                  placeholder="Texte alternatif"
                  className="flex-1 min-w-0 bg-transparent border-b border-zinc-800 text-white text-xs py-1 focus:outline-none focus:border-white"
                />
                <button type="submit" className="text-zinc-500 hover:text-white text-[10px] uppercase shrink-0">
                  OK
                </button>
              </form>
              <form action={deletePhoto}>
                <input type="hidden" name="id" value={photo.id} />
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
    </div>
  );
}
