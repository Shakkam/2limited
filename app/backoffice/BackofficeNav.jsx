"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "./auth-actions";

const links = [
  { href: "/backoffice", label: "Accueil" },
  { href: "/backoffice/concerts", label: "Concerts" },
  { href: "/backoffice/musique", label: "Musique" },
  { href: "/backoffice/photos", label: "Photos" },
  { href: "/backoffice/materiel", label: "Matériel" },
];

export default function BackofficeNav({ email }) {
  const pathname = usePathname();
  const isActive = (href) => (href === "/backoffice" ? pathname === href : pathname.startsWith(href));

  return (
    <header className="border-b border-zinc-900 bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-white text-xs font-black tracking-[0.3em] uppercase">
            2-LIMITED
          </Link>
          <nav className="flex flex-wrap items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-xs font-bold tracking-widest uppercase transition-colors ${
                  isActive(l.href) ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-zinc-600 text-[10px] tracking-widest hidden sm:block">{email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="text-zinc-500 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors border border-zinc-800 hover:border-zinc-600 px-4 py-2"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
