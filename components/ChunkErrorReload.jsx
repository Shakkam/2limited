"use client";

import { useEffect } from "react";

const RELOAD_FLAG = "2limited:chunk-reload-at";
const RELOAD_COOLDOWN_MS = 10_000; // don't loop-reload if the deploy is broken, not just stale

const isChunkError = (message = "") =>
  /loading chunk|failed to fetch dynamically imported module|importing a module script failed/i.test(
    message
  );

// Once a client-side navigation is holding JS built before the latest
// Vercel deploy, its chunk references 404 (the old build's files are gone)
// and React surfaces that as an uncaught exception — reaching the user as
// the generic "client-side exception" screen (see app/global-error.js) even
// though nothing is actually broken. A hard reload always fixes it, so do
// that automatically instead of leaving the visitor stuck. Guarded by a
// short cooldown so a genuinely broken deploy reloads once, not forever.
export default function ChunkErrorReload() {
  useEffect(() => {
    const maybeReload = (message) => {
      if (!isChunkError(message)) return;
      let last = 0;
      try {
        last = Number(window.sessionStorage.getItem(RELOAD_FLAG)) || 0;
      } catch {
        // storage blocked — reload once, no loop protection possible
      }
      if (Date.now() - last < RELOAD_COOLDOWN_MS) return;
      try {
        window.sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
      } catch {}
      window.location.reload();
    };

    const onError = (event) => maybeReload(event?.message);
    const onRejection = (event) => maybeReload(event?.reason?.message || String(event?.reason ?? ""));

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
