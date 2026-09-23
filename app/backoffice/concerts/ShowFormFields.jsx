const inputClass =
  "w-full bg-transparent border-b border-zinc-800 text-white text-sm py-2 focus:outline-none focus:border-white transition-colors";
const labelClass = "block text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-2";

// Shared fields for both the "add" and "edit" show forms — a plain server-
// rendered fragment (no client JS needed for basic inputs) so it can be
// reused from either form without duplicating markup.
export default function ShowFormFields({ show }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>DATE</label>
          <input type="date" name="date" required defaultValue={show?.date} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>HEURE</label>
          <input type="time" name="time" defaultValue={show?.time || ""} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>VILLE</label>
        <input type="text" name="city" required defaultValue={show?.city || ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>LIEU</label>
        <input type="text" name="venue" defaultValue={show?.venue || ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>NOTE (FR)</label>
        <input
          type="text"
          name="note_fr"
          placeholder="Ex : Restauration sur place"
          defaultValue={show?.note_fr || ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>NOTE (EN)</label>
        <input type="text" name="note_en" defaultValue={show?.note_en || ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>LIEN BILLETTERIE</label>
        <input type="url" name="ticket_url" defaultValue={show?.ticket_url || ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>AFFICHE {show?.poster_src && "(remplacer)"}</label>
        {show?.poster_src && (
          <a
            href={show.poster_src}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-zinc-500 text-xs underline mb-2"
          >
            Voir l'affiche actuelle
          </a>
        )}
        <input
          type="file"
          name="poster"
          accept="image/*"
          className="w-full text-zinc-400 text-xs file:mr-4 file:border file:border-zinc-700 file:bg-transparent file:text-zinc-300 file:text-[10px] file:font-bold file:tracking-widest file:uppercase file:px-4 file:py-2 file:cursor-pointer hover:file:border-white hover:file:text-white file:transition-colors"
        />
      </div>
    </>
  );
}
