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
const STATUS_LABEL = Object.fromEntries(STATUSES.map((s) => [s.value, s.label]));

// A locked field still needs to be visible (so it's clear what value is
// about to be saved) but shouldn't invite editing — shown as a disabled
// text input (grayed out) alongside a hidden input carrying the real
// value, since a disabled control is excluded from form submission.
function LockedField({ label, field, value }) {
  const display = field === "status" ? STATUS_LABEL[value] || value : value || "—";
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input type="text" value={display} disabled readOnly className={`${inputClass} opacity-40 cursor-not-allowed`} />
      <input type="hidden" name={field} value={value} />
    </div>
  );
}

// `lockedField` lets a caller fix one of category/owner/status to a given
// value — used by the inline "+" under a group header, which pre-fills
// whichever field the list is currently grouped by instead of making the
// user re-pick something already implied by the group.
export default function GearFormFields({ gear, lockedField, compact = false }) {
  const isLocked = (field) => lockedField?.field === field;

  return (
    <>
      <div>
        <label className={labelClass}>NOM</label>
        <input type="text" name="name" required defaultValue={gear?.name || ""} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        {isLocked("category") ? (
          <LockedField label="CATÉGORIE" field="category" value={lockedField.value} />
        ) : (
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
        )}
        {isLocked("owner") ? (
          <LockedField label="PROPRIÉTAIRE" field="owner" value={lockedField.value} />
        ) : (
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
        )}
      </div>
      <div className="grid grid-cols-2 gap-5">
        {isLocked("status") ? (
          <LockedField label="ÉTAT" field="status" value={lockedField.value} />
        ) : (
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
        )}
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
      {!compact && (
        <div>
          <label className={labelClass}>NOTES</label>
          <textarea name="notes" rows={3} defaultValue={gear?.notes || ""} className={`${inputClass} resize-none`} />
        </div>
      )}
    </>
  );
}
