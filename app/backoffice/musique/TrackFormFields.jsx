const inputClass =
  "w-full bg-transparent border-b border-zinc-800 text-white text-sm py-2 focus:outline-none focus:border-white transition-colors";
const labelClass = "block text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-2";

export default function TrackFormFields({ track }) {
  return (
    <>
      <div>
        <label className={labelClass}>TITRE</label>
        <input type="text" name="title" required defaultValue={track?.title || ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>SOUS-TITRE (FR)</label>
        <input
          type="text"
          name="subtitle_fr"
          placeholder="Ex : Reprise de Radiohead"
          defaultValue={track?.subtitle_fr || ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>SOUS-TITRE (EN)</label>
        <input type="text" name="subtitle_en" defaultValue={track?.subtitle_en || ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>FICHIER AUDIO {track?.src && "(remplacer)"}</label>
        {track?.src && (
          <audio controls src={track.src} className="w-full mb-2 h-9" />
        )}
        <input
          type="file"
          name="audio"
          accept="audio/*"
          required={!track}
          className="w-full text-zinc-400 text-xs file:mr-4 file:border file:border-zinc-700 file:bg-transparent file:text-zinc-300 file:text-[10px] file:font-bold file:tracking-widest file:uppercase file:px-4 file:py-2 file:cursor-pointer hover:file:border-white hover:file:text-white file:transition-colors"
        />
      </div>
    </>
  );
}
