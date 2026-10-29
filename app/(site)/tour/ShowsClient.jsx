"use client";

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

// The single next show gets its own spotlight card with its poster up
// front — the rest of the list stays in the compact row style below. Without
// a poster, the big outlined numeral (MemberCard.jsx motif) fills the space.
function NextShowSpotlight({ show, lang, t }) {
  const date = new Date(show.date);
  const locale = LOCALES[lang] ?? LOCALES.en;
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
  const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
  const year = new Intl.DateTimeFormat(locale, { year: "numeric" }).format(date);
  const location = [t(show.city), show.venue && t(show.venue)].filter(Boolean).join(" — ");

  return (
    <div className="relative border border-zinc-800 bg-zinc-950 p-6 md:p-10 overflow-hidden">
      {!show.posterSrc && (
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-4 -bottom-10 md:-right-6 md:-bottom-16 text-[9rem] md:text-[15rem] font-black leading-none text-transparent"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
        >
          {day}
        </span>
      )}

      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:gap-12">
        {show.posterSrc && (
          <a
            href={show.posterSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full max-w-[16rem] shrink-0 self-center overflow-hidden border border-zinc-800 md:self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            aria-label={`${t(ui.shows.poster)} — ${location}`}
          >
            <img
              src={show.posterSrc}
              alt={`${location} — ${formatDate(show.date, lang)}`}
              className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
            />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-3 pt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
              {t(ui.shows.poster)}
              <span aria-hidden="true">↗</span>
            </span>
          </a>
        )}

        <div className="flex flex-1 flex-col justify-center gap-8">
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

          <div className="border-t border-zinc-800 pt-6">
            <p className="text-white text-xl md:text-2xl font-black tracking-widest">{t(show.city)}</p>
            {show.venue && (
              <p className="text-zinc-400 text-sm tracking-[0.25em] uppercase mt-1">{t(show.venue)}</p>
            )}
            {show.note && (
              <p className="mt-4 border-l-2 border-lime-300 pl-3 text-sm leading-relaxed text-zinc-300">
                {t(show.note)}
              </p>
            )}
            {show.ticketUrl && (
              <a
                href={show.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 border border-zinc-700 text-zinc-300 text-[10px] font-bold tracking-widest px-6 py-3 hover:border-white hover:text-white transition-colors"
              >
                {t(ui.shows.tickets)}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowRow({ show, lang, t, past }) {
  return (
    <div
      className="flex flex-col gap-4 border-b border-zinc-900 py-5 md:flex-row md:items-center md:gap-8"
    >
      {show.posterSrc && (
        <a
          href={show.posterSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="group block w-20 shrink-0 overflow-hidden border border-zinc-800"
          aria-label={`${t(ui.shows.poster)} — ${t(show.city)}`}
        >
          <img
            src={show.posterSrc}
            alt={`${t(show.city)}${show.venue ? ` — ${t(show.venue)}` : ""}`}
            className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        </a>
      )}
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

function PastShowCard({ show, lang, t }) {
  const date = new Date(show.date);
  const day = new Intl.DateTimeFormat(LOCALES[lang] ?? LOCALES.en, { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat(LOCALES[lang] ?? LOCALES.en, { month: "short" }).format(date);
  const year = new Intl.DateTimeFormat(LOCALES[lang] ?? LOCALES.en, { year: "numeric" }).format(date);
  const location = [t(show.city), show.venue && t(show.venue)].filter(Boolean).join(" — ");

  return (
    <article className="group flex h-full min-w-0 flex-col">
      {show.posterSrc ? (
        <a
          href={show.posterSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-[3/4] overflow-hidden border border-zinc-800 bg-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-label={`${t(ui.shows.poster)} — ${location}`}
        >
          <img
            src={show.posterSrc}
            alt={`${location} — ${formatDate(show.date, lang)}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
          <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-4 pt-12 text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none">
            {t(ui.shows.poster)}
            <span aria-hidden="true">↗</span>
          </span>
        </a>
      ) : (
        <div className="flex aspect-[3/4] flex-col justify-between border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-600">2-LIMITED</p>
          <div>
            <p className="text-5xl font-black leading-none text-white">{day}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">{month} {year}</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col border-b border-zinc-800 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          {formatDate(show.date, lang)}
          {show.time && <span className="font-normal tracking-normal text-zinc-500"> — {show.time}</span>}
        </p>
        <p className="mt-2 text-base font-black uppercase leading-tight tracking-[0.08em] text-white">
          {t(show.city)}
        </p>
        {show.venue && <p className="mt-1 text-xs text-zinc-400">{t(show.venue)}</p>}
        {show.note && (
          <p className="mt-3 border-l-2 border-lime-300 pl-3 text-xs leading-relaxed text-zinc-300">
            {t(show.note)}
          </p>
        )}
      </div>
    </article>
  );
}

export default function ShowsClient({ shows = [] }) {
  const { lang, t } = useLanguage();

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
          <h1 className="text-2xl font-black tracking-widest text-white">{t(ui.shows.title)}</h1>
        </FadeUp>
      </div>

      {/* Stage lights span both the next show and the archive */}
      <div className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="concert-beam concert-beam--lime absolute -top-8 left-[8%] h-[80%] w-40 md:left-[18%] md:w-64" />
          <span className="concert-beam concert-beam--violet absolute -top-8 right-[8%] h-[78%] w-40 md:right-[18%] md:w-64" />
          <span className="concert-glow concert-glow--lime absolute -left-20 top-[28%] h-56 w-56 md:h-80 md:w-80" />
          <span className="concert-glow concert-glow--violet absolute -right-20 top-[38%] h-56 w-56 md:h-80 md:w-80" />
          {[
            ["4%", "12%", "-18px", "5.2s", "0s", "3px"],
            ["9%", "70%", "16px", "6.4s", "1.1s", "2px"],
            ["15%", "34%", "-24px", "5.8s", "2.2s", "4px"],
            ["21%", "88%", "20px", "7s", "0.6s", "2px"],
            ["27%", "20%", "-14px", "5.5s", "2.8s", "3px"],
            ["33%", "56%", "24px", "6.7s", "1.7s", "2px"],
            ["39%", "8%", "-20px", "5.9s", "3.4s", "4px"],
            ["45%", "78%", "18px", "6.2s", "0.9s", "2px"],
            ["51%", "42%", "-22px", "7.1s", "2.5s", "3px"],
            ["57%", "94%", "16px", "5.4s", "1.3s", "2px"],
            ["63%", "26%", "-18px", "6.6s", "3.1s", "4px"],
            ["69%", "64%", "22px", "5.7s", "0.4s", "2px"],
            ["75%", "16%", "-16px", "6.9s", "2s", "3px"],
            ["81%", "84%", "20px", "5.3s", "3.7s", "2px"],
            ["87%", "48%", "-24px", "6.1s", "1.5s", "4px"],
            ["93%", "30%", "18px", "7.2s", "2.9s", "2px"],
            ["98%", "72%", "-16px", "5.6s", "0.8s", "3px"],
          ].map(([left, top, drift, duration, delay, size], i) => (
            <span
              key={i}
              className={`concert-particle concert-particle--${i % 3 === 0 ? "lime" : i % 3 === 1 ? "violet" : "white"} absolute rounded-full`}
              style={{ left, top, width: size, height: size, "--drift-x": drift, animationDuration: duration, animationDelay: delay }}
            />
          ))}
        </div>

        {/* Upcoming */}
        <div className={`relative z-10 px-6 md:px-10 ${past.length > 0 ? "py-7" : "py-12"}`}>
          {!nextShow ? (
            <FadeUp delay={0.1} className="mx-auto max-w-5xl border-l border-zinc-700 py-1 pl-4">
              <p className="text-sm tracking-wide text-zinc-400">{t(ui.shows.none)}</p>
            </FadeUp>
          ) : (
            <div className="mx-auto max-w-5xl">
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
          <section className="relative border-t border-zinc-900 px-6 pb-16 pt-10 md:px-10 md:pt-12">
            <div className="relative z-10 mx-auto max-w-5xl">
              <FadeUp>
                <div className="mb-8 flex items-end justify-between gap-4 border-b border-zinc-800 pb-4">
                  <div>
                    <h2 className="text-3xl font-black uppercase leading-none tracking-[0.06em] text-white md:text-5xl">
                      {t(ui.shows.past)}
                    </h2>
                  </div>
                  <span className="pb-1 text-xs font-black tracking-[0.2em] text-violet-400">
                    {String(past.length).padStart(2, "0")}
                  </span>
                </div>
              </FadeUp>
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                {past.map((show, i) => (
                  <FadeUp key={`${show.date}-${i}`} delay={i * 0.06}>
                    <PastShowCard show={show} lang={lang} t={t} />
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
