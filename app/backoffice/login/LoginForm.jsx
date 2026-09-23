"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("idle");
      setError(
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : "Une erreur est survenue. Réessaie."
      );
      return;
    }
    router.replace("/backoffice");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-2">EMAIL</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border-b border-zinc-800 text-white text-sm py-2 focus:outline-none focus:border-white transition-colors"
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold tracking-[0.3em] text-zinc-600 mb-2">MOT DE PASSE</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-zinc-800 text-white text-sm py-2 focus:outline-none focus:border-white transition-colors"
        />
      </div>
      {error && <p className="text-red-500 text-xs tracking-wide">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 border border-white text-white text-[10px] font-bold tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-40"
      >
        {status === "loading" ? "CONNEXION…" : "SE CONNECTER"}
      </button>
    </form>
  );
}
