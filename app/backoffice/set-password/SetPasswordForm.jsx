"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  // The invite link's session lives in the URL hash, which the browser
  // Supabase client parses automatically on load — but that happens async,
  // so the password form only appears once a session actually exists.
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("8 caractères minimum.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("idle");
      setError("Une erreur est survenue. Réessaie.");
      return;
    }
    router.replace("/backoffice");
    router.refresh();
  };

  if (!ready) {
    return <p className="text-zinc-600 text-xs tracking-widest text-center">Vérification du lien…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-2">
          NOUVEAU MOT DE PASSE
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-zinc-800 text-white text-sm py-2 focus:outline-none focus:border-white transition-colors"
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-2">
          CONFIRMER
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full bg-transparent border-b border-zinc-800 text-white text-sm py-2 focus:outline-none focus:border-white transition-colors"
        />
      </div>
      {error && <p className="text-red-500 text-xs tracking-wide">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 border border-white text-white text-[10px] font-bold tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-40"
      >
        {status === "loading" ? "ENREGISTREMENT…" : "VALIDER"}
      </button>
    </form>
  );
}
