"use client";

import { useEffect, useState } from "react";
import data from "@/data/content.json";
import ui from "@/data/ui.json";
import FeaturedTrack from "@/components/FeaturedTrack";
import { useLanguage } from "@/components/LanguageProvider";

export default function Music() {
  const { albums } = data;
  const { t } = useLanguage();
  const tracks = data.tracks || [];
  const photos = data.photos || [];

  // Every track gets the same full-screen featured treatment — switching is
  // a dropdown in the title (FeaturedTrack's own picker) rather than a
  // separate "more recordings" list below, so the page stays a single
  // viewport with no scroll regardless of how many tracks exist.
  const [activeIndex, setActiveIndex] = useState(0);
  const featured = tracks[activeIndex];
  const translatedTracks = tracks.map((track) => ({
    title: t(track.title),
    subtitle: t(track.subtitle),
  }));

  // Fit header + photo wall exactly into the viewport, above the shared
  // footer — no page scroll for the single-track case. Measured live since
  // the footer's own height changes (it stacks taller on mobile).
  const [fitHeight, setFitHeight] = useState(null);

  useEffect(() => {
    const footer = document.querySelector("footer");
    const measure = () => {
      const footerHeight = footer ? footer.getBoundingClientRect().height : 0;
      setFitHeight(window.innerHeight - footerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    // Also watch the footer itself — its height can change after mount
    // (web font swap, locale text wrapping differently) independent of any
    // window resize, which would otherwise leave a stale, slightly-off fit.
    const observer = footer ? new ResizeObserver(measure) : null;
    observer?.observe(footer);
    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, []);

  return (
    <div>
      <div
        className="flex flex-col overflow-hidden"
        style={{ height: fitHeight ? `${fitHeight}px` : "100vh" }}
      >
        {/* Hero — shorter than the other pages' so the photo wall gets more room right below it */}
        <div className="shrink-0 h-48 pt-24 bg-zinc-950 relative flex items-end px-10 pb-6 border-b border-zinc-900">
          <div>
            <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-1">
              {t(ui.music.eyebrow)}
            </p>
            <h1 className="text-2xl font-black tracking-widest text-white">{t(ui.music.title)}</h1>
          </div>
        </div>

        {/* Featured track — fills whatever space is left */}
        {featured && (
          <div className="flex-1 min-h-0">
            <FeaturedTrack
              src={featured.src}
              title={t(featured.title)}
              subtitle={t(featured.subtitle)}
              label={t(ui.music.latestRecording)}
              photos={photos}
              tracks={translatedTracks}
              activeIndex={activeIndex}
              onSelectTrack={setActiveIndex}
            />
          </div>
        )}
      </div>

      {/* Albums — hidden entirely until there's something to show */}
      {albums.length > 0 && (
        <div className="px-10 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <div key={album.id} className="group">
                <div className="aspect-square bg-zinc-900 mb-4 overflow-hidden relative">
                  {album.cover ? (
                    <img src={album.cover} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-zinc-700 text-xs tracking-widest">Cover</p>
                    </div>
                  )}
                </div>
                <p className="text-white text-sm font-bold tracking-widest">{album.title}</p>
                <p className="text-zinc-600 text-xs tracking-widest mt-1">{album.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
