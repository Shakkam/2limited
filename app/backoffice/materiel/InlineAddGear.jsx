"use client";

import { useState } from "react";
import { createGear } from "./actions";
import GearFormFields from "./GearFormFields";

// The "+" under each group's list — pre-fills whichever field the list is
// currently grouped by (category/owner/status) via GearFormFields'
// `lockedField`, so adding e.g. another mic under the "Micro" group never
// makes you re-pick "Micro" from the category dropdown.
export default function InlineAddGear({ field, value, groupBy }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 text-zinc-500 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors border border-zinc-800 hover:border-zinc-600 px-4 py-2"
      >
        + Ajouter
      </button>
    );
  }

  return (
    <form
      action={createGear}
      className="mt-3 flex flex-col gap-5 max-w-sm border border-zinc-800 bg-zinc-950 p-5"
    >
      <input type="hidden" name="_groupBy" value={groupBy} />
      <GearFormFields lockedField={{ field, value }} compact />
      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="border border-white text-white text-[10px] font-bold tracking-widest px-6 py-2.5 hover:bg-white hover:text-black transition-colors"
        >
          AJOUTER
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-zinc-600 hover:text-zinc-300 text-[10px] font-bold tracking-widest uppercase transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
