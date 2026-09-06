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

function ShowRow({ show, lang, t, past }) {
  return (
    <div
      className={`flex flex-col gap-1 border-b border-zinc-900 py-5 md:flex-row md:items-baseline md:gap-8 ${
        past ? "opacity-50" : ""
      }`}
    >
      <p className="text-white text-xs font-bold tracking-[0.2em] uppercase md:w-56 md:shrink-0">
        {formatDate(show.date, lang)}
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
      <div className="px-10 py-12">
        <FadeUp>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-6">
            {t(ui.shows.upcoming)}
          </p>
        </FadeUp>
        {upcoming.length === 0 ? (
          <FadeUp delay={0.1}>
            <p className="text-zinc-500 text-base md:text-lg tracking-wide">{t(ui.shows.none)}</p>
          </FadeUp>
        ) : (
          <div className="max-w-3xl border-t border-zinc-900">
            {upcoming.map((show, i) => (
              <FadeUp key={`${show.date}-${i}`} delay={i * 0.06}>
                <ShowRow show={show} lang={lang} t={t} past={false} />
              </FadeUp>
            ))}
          </div>
        )}
      </div>

      {/* Past — only when there's history to show */}
      {past.length > 0 && (
        <div className="px-10 pb-16 border-t border-zinc-900 pt-12">
          <FadeUp>
            <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-6">
              {t(ui.shows.past)}
            </p>
          </FadeUp>
          <div className="max-w-3xl border-t border-zinc-900">
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
