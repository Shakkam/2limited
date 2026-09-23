"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmForm({ tokenHash, type }) {
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  if (!tokenHash || !type) {
    return <p className="text-red-500 text-sm">Lien invalide ou incomplet.</p>;
  }

  const handleConfirm = async () => {
    setStatus("loading");
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) {
      setStatus("idle");
      setError(
        error.message.includes("expired") || error.message.includes("invalid")
          ? "Ce lien a expiré ou a déjà été utilisé. Redemande-en un."
          : "Une erreur est survenue. Réessaie."
      );
      return;
    }
    router.replace("/backoffice/set-password");
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-zinc-500 text-sm tracking-wide">
        Clique ci-dessous pour confirmer que c'est bien toi.
      </p>
      {error && <p className="text-red-500 text-xs tracking-wide">{error}</p>}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={status === "loading"}
        className="border border-white text-white text-[10px] font-bold tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-40"
      >
        {status === "loading" ? "CONFIRMATION…" : "CONFIRMER"}
      </button>
    </div>
  );
}
