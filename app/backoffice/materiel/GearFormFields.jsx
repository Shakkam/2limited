const inputClass =
  "w-full bg-transparent border-b border-zinc-800 text-white text-sm py-2 focus:outline-none focus:border-white transition-colors";
const labelClass = "block text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-2";
const selectClass = `${inputClass} [&>option]:bg-zinc-950`;

const CATEGORIES = ["Ampli", "Guitare", "Basse", "Micro", "Percussion", "Câbles", "Sono", "Divers"];
const OWNERS = ["Cam", "Steph", "Groupe"];
const STATUSES = [
  { value: "ok", label: "OK" },
  { value: "a_reparer", label: "À réparer" },
  { value: "a_racheter", label: "À racheter" },
];

export default function GearFormFields({ gear }) {
  return (
    <>
      <div>
        <label className={labelClass}>NOM</label>
        <input type="text" name="name" required defaultValue={gear?.name || ""} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>CATÉGORIE</label>
          <select name="category" defaultValue={gear?.category || ""} className={selectClass}>
            <option value="">—</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>PROPRIÉTAIRE</label>
          <select name="owner" defaultValue={gear?.owner || ""} className={selectClass}>
            <option value="">—</option>
            {OWNERS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>ÉTAT</label>
          <select name="status" defaultValue={gear?.status || "ok"} className={selectClass}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>QUANTITÉ</label>
          <input
            type="number"
            name="quantity"
            min="1"
            defaultValue={gear?.quantity || 1}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>NOTES</label>
        <textarea name="notes" rows={3} defaultValue={gear?.notes || ""} className={`${inputClass} resize-none`} />
      </div>
    </>
  );
}
