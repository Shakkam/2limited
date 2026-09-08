"use client";

// Next.js renders this in place of the ENTIRE root layout (nav/footer
// included) when an error escapes every nested boundary — so, unlike a
// normal error.js, it must supply its own <html>/<body>. Without this file
// any uncaught client exception (most commonly a stale JS chunk reference
// right after a deploy — see the reload button below) fell through to
// Next's default unstyled "Application error: a client-side exception has
// occurred" page.
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex items-center justify-center px-8">
        <div className="text-center max-w-sm">
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-4">
            2-LIMITED
          </p>
          <p className="text-white text-lg font-black tracking-widest uppercase mb-3">
            Un problème est survenu
          </p>
          <p className="text-zinc-500 text-sm tracking-wide mb-8">
            Une nouvelle version du site vient peut-être d'être publiée.
            Rechargez la page pour continuer.
          </p>
          <button
            onClick={() => reset()}
            className="border border-zinc-700 text-zinc-300 text-[10px] font-bold tracking-widest px-6 py-3 hover:border-white hover:text-white transition-colors"
          >
            RECHARGER
          </button>
        </div>
      </body>
    </html>
  );
}
