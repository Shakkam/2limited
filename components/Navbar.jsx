"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import ui from "@/data/ui.json";

function LanguageSwitch({ lang, setLang, className = "" }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {["fr", "en"].map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-label={code === "fr" ? "Français" : "English"}
          aria-pressed={lang === code}
          className={`text-[10px] font-bold tracking-[0.2em] px-1.5 py-0.5 transition-colors ${
            lang === code ? "text-white" : "text-zinc-600 hover:text-zinc-300"
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

const navLinks = [
  { href: "/", key: "home" },
  { href: "/band", key: "band" },
  { href: "/music", key: "music" },
  { href: "/tour", key: "shows" },
  { href: "/media", key: "media" },
  { href: "/contact", key: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-zinc-900">
        <div className="flex items-center justify-between px-8 md:px-12 h-24">
          {/* Logo */}
          <Link href="/">
            <Image src="/images/logorond.svg" alt="2 LIMITED" width={80} height={80} className="" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className={`text-xs font-bold tracking-[0.3em] transition-colors duration-200 ${
                  isActive(href)
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {t(ui.nav[key])}
              </Link>
            ))}
            <LanguageSwitch lang={lang} setLang={setLang} className="ml-2 border-l border-zinc-800 pl-4" />
          </nav>

          {/* Mobile burger */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitch lang={lang} setLang={setLang} />
            <button
              className="flex flex-col gap-1.5"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span className={`block w-5 h-px bg-white transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-5 h-px bg-white transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-px bg-white transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div
          className="fixed inset-0 bg-black z-40 md:hidden flex flex-col px-10 pt-24 pb-12"
          onClick={() => setOpen(false)}
        >
          <nav className="flex flex-col gap-7">
            {navLinks.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className={`text-2xl font-bold tracking-widest transition-colors ${
                  isActive(href) ? "text-white" : "text-zinc-600"
                }`}
              >
                {t(ui.nav[key])}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
