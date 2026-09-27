"use client";

import { useRef, useState, useTransition } from "react";
import { createGear } from "./actions";
import GearFormFields from "./GearFormFields";

// Shared by the flat "Ajouter du matériel" form and each group's inline
// "+" — calls createGear directly (inside a transition) instead of using
// a plain <form action>, so it can reset the fields and, when embedded
// inline, collapse itself once the item is actually saved. `revalidatePath`
// inside createGear still refreshes the list underneath in place.
export default function AddGearForm({ lockedField, onDone, submitLabel = "AJOUTER" }) {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    startTransition(async () => {
      try {
        await createGear(formData);
        setError("");
        formRef.current?.reset();
        onDone?.();
      } catch (err) {
        setError(err.message || "Une erreur est survenue.");
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
      <GearFormFields lockedField={lockedField} compact={!!lockedField} />
      {error && <p className="text-red-500 text-xs tracking-wide">{error}</p>}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="self-start border border-white text-white text-[10px] font-bold tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-40"
        >
          {isPending ? "…" : submitLabel}
        </button>
        {lockedField && (
          <button
            type="button"
            onClick={() => onDone?.()}
            className="text-zinc-600 hover:text-zinc-300 text-[10px] font-bold tracking-widest uppercase transition-colors"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
