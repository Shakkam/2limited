"use client";

import data from "@/data/content.json";
import ui from "@/data/ui.json";
import FadeUp from "@/components/FadeUp";
import { useLanguage } from "@/components/LanguageProvider";

const LOCALES = { fr: "fr-FR", en: "en-GB" };

function formatDate(iso, lang) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALES[lang] ?? LOCALES.en, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// The single next show gets its own oversized spotlight card — the rest of
// the list stays in the compact row style below. Mirrors the big-outlined-
// numeral motif already used for members (MemberCard.jsx) so the two pages
// share a visual language.
function NextShowSpotlight({ show, lang, t }) {
  const date = new Date(show.date);
  const locale = LOCALES[lang] ?? LOCALES.en;
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
  const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
  const year = new Intl.DateTimeFormat(locale, { year: "numeric" }).format(date);

  return (
    <div className="relative border border-zinc-800 bg-zinc-950 px-8 py-10 md:px-14 md:py-16 overflow-hidden">
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-4 -top-10 md:-right-6 md:-top-16 text-[9rem] md:text-[15rem] font-black leading-none text-transparent"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
      >
        {day}
      </span>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
        <div>
          <p className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">
            {t(ui.shows.next)}
          </p>
          <p className="text-white text-lg md:text-xl font-black tracking-widest uppercase">{weekday}</p>
          <p className="text-white text-5xl md:text-7xl font-black tracking-tight leading-none mt-2">
            {day}
            <span className="text-zinc-500 text-xl md:text-2xl font-bold tracking-widest uppercase align-middle ml-4">
              {month} {year}
            </span>
          </p>
          {show.time && (
            <p className="text-zinc-500 text-sm tracking-[0.3em] uppercase mt-4">{show.time}</p>
          )}
        </div>

        <div className="md:text-right shrink-0">
          <p className="text-white text-xl md:text-2xl font-black tracking-widest">{t(show.city)}</p>
          {show.venue && (
            <p className="text-zinc-400 text-sm tracking-[0.25em] uppercase mt-1">{t(show.venue)}</p>
          )}
          {show.note && (
            <p className="text-zinc-600 text-[10px] tracking-[0.2em] uppercase mt-4 max-w-[16rem] md:ml-auto leading-relaxed">
              {t(show.note)}
            </p>
          )}
          {(show.ticketUrl || show.posterSrc) && (
            <div className="flex flex-wrap items-center gap-4 mt-6 md:justify-end">
              {show.ticketUrl && (
                <a
                  href={show.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-zinc-700 text-zinc-300 text-[10px] font-bold tracking-widest px-6 py-3 hover:border-white hover:text-white transition-colors"
                >
                  {t(ui.shows.tickets)}
                </a>
              )}
              {show.posterSrc && (
                <a
                  href={show.posterSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 text-[10px] font-bold tracking-widest underline underline-offset-4 decoration-zinc-700 hover:text-white hover:decoration-white transition-colors"
                >
                  {t(ui.shows.poster)}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShowRow({ show, lang, t, past }) {
  return (
    <div
      className={`flex flex-col gap-1 border-b border-zinc-900 py-5 md:flex-row md:items-baseline md:gap-8 ${
        past ? "opacity-50" : ""
      }`}
    >
      <p className="text-white text-xs font-bold tracking-[0.2em] uppercase md:w-56 md:shrink-0">
        {formatDate(show.date, lang)}
        {show.time && <span className="text-zinc-500 normal-case tracking-normal"> — {show.time}</span>}
      </p>
      <div className="flex-1">
        <p className="text-white text-sm tracking-widest">{t(show.city)}</p>
        {show.venue && (
          <p className="text-zinc-500 text-xs tracking-widest mt-1">{t(show.venue)}</p>
        )}
        {show.note && (
          <p className="text-zinc-600 text-[10px] tracking-[0.2em] uppercase mt-2">{t(show.note)}</p>
        )}
      </div>
      {!past && show.ticketUrl && (
        <a
          href={show.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start border border-zinc-700 text-zinc-300 text-[10px] font-bold tracking-widest px-5 py-2 hover:border-white hover:text-white transition-colors"
        >
          {t(ui.shows.tickets)}
        </a>
      )}
    </div>
  );
}

export default function ShowsClient() {
  const { lang, t } = useLanguage();
  const shows = data.shows || [];

  // Upcoming vs past is derived from the date, so a played show moves to the
  // archive on its own — no manual editing after each gig.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const upcoming = shows
    .filter((s) => new Date(s.date) >= startOfToday)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = shows
    .filter((s) => new Date(s.date) < startOfToday)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const [nextShow, ...restUpcoming] = upcoming;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="h-48 pt-24 bg-zinc-950 relative flex items-end px-10 pb-6 border-b border-zinc-900">
        <FadeUp>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-1">
            {t(ui.shows.eyebrow)}
          </p>
          <h1 className="text-2xl font-black tracking-widest text-white">{t(ui.shows.title)}</h1>
        </FadeUp>
      </div>

      {/* Upcoming */}
      <div className="px-6 md:px-10 py-12">
        {!nextShow ? (
          <FadeUp delay={0.1}>
            <p className="text-zinc-500 text-base md:text-lg tracking-wide">{t(ui.shows.none)}</p>
          </FadeUp>
        ) : (
          <div className="max-w-4xl">
            <FadeUp>
              <NextShowSpotlight show={nextShow} lang={lang} t={t} />
            </FadeUp>

            {restUpcoming.length > 0 && (
              <div className="mt-14">
                <FadeUp>
                  <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-6">
                    {t(ui.shows.alsoUpcoming)}
                  </p>
                </FadeUp>
                <div className="border-t border-zinc-900">
                  {restUpcoming.map((show, i) => (
                    <FadeUp key={`${show.date}-${i}`} delay={i * 0.06}>
                      <ShowRow show={show} lang={lang} t={t} past={false} />
                    </FadeUp>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Past — only when there's history to show */}
      {past.length > 0 && (
        <div className="px-6 md:px-10 pb-16 border-t border-zinc-900 pt-12">
          <FadeUp>
            <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-6">
              {t(ui.shows.past)}
            </p>
          </FadeUp>
          <div className="max-w-4xl border-t border-zinc-900">
            {past.map((show, i) => (
              <FadeUp key={`${show.date}-${i}`} delay={i * 0.04}>
                <ShowRow show={show} lang={lang} t={t} past />
              </FadeUp>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
