"use client";

import { useEffect, useState } from "react";
import data from "@/data/content.json";
import FadeUp from "@/components/FadeUp";
import AudioPlayer from "@/components/AudioPlayer";
import FeaturedTrack from "@/components/FeaturedTrack";

export default function Music() {
  const { albums } = data;
  const tracks = data.tracks || [];
  const photos = data.photos || [];
  const [featured, ...moreTracks] = tracks;

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
            <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-1">Discography</p>
            <h1 className="text-2xl font-black tracking-widest text-white">MUSIC</h1>
          </div>
        </div>

        {/* Featured track — fills whatever space is left */}
        {featured && (
          <div className="flex-1 min-h-0">
            <FeaturedTrack
              src={featured.src}
              title={featured.title}
              subtitle={featured.subtitle}
              photos={photos}
            />
          </div>
        )}
      </div>

      {/* More recordings — outside the fitted block, so the page can scroll
          normally if this ever has content */}
      {moreTracks.length > 0 && (
        <div className="px-10 pt-12">
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-5">More Recordings</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            {moreTracks.map((track, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <AudioPlayer src={track.src} title={track.title} subtitle={track.subtitle} />
              </FadeUp>
            ))}
          </div>
        </div>
      )}

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
