"use client";

import { useState } from "react";
import AddGearForm from "./AddGearForm";

// The "+" under each group's list — pre-fills whichever field the list is
// currently grouped by (category/owner/status) via AddGearForm's
// `lockedField`, so adding e.g. another mic under the "Micro" group never
// makes you re-pick "Micro" from the category dropdown. Collapses itself
// back to the "+" button once the item is actually saved (or on cancel).
export default function InlineAddGear({ field, value }) {
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
    <div className="mt-3 max-w-sm border border-zinc-800 bg-zinc-950 p-5">
      <AddGearForm lockedField={{ field, value }} onDone={() => setOpen(false)} />
    </div>
  );
}
