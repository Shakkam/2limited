"use client";

import data from "@/data/content.json";
import ui from "@/data/ui.json";
import FadeUp from "@/components/FadeUp";
import PhotoGallery from "@/components/PhotoGallery";
import { useLanguage } from "@/components/LanguageProvider";

export default function MediaClient() {
  const { videos, photos } = data;
  const { t } = useLanguage();

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/images/background-media.jpg')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Hero */}
      <div className="h-48 pt-24 bg-zinc-950 relative flex items-end px-10 pb-6 border-b border-zinc-900">
        <FadeUp>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-1">
            {t(ui.media.eyebrow)}
          </p>
          <h1 className="text-2xl font-black tracking-widest text-white">{t(ui.media.title)}</h1>
        </FadeUp>
      </div>

      {/* Videos */}
      <div className="px-10 py-12 border-b border-zinc-900">
        <FadeUp>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-8">
            {t(ui.media.videos)}
          </p>
        </FadeUp>
        {videos.length === 0 ? (
          <p className="text-zinc-700 text-xs tracking-widest uppercase">{t(ui.media.videosSoon)}</p>
        ) : (
          <div className="flex flex-col gap-12 max-w-3xl mx-auto">
            {videos.map((video, i) => (
              <FadeUp key={video.id} delay={i * 0.1}>
                <div className="aspect-video w-full bg-zinc-900">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={t(video.title)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <p className="text-white text-sm font-bold tracking-widest mt-4">{t(video.title)}</p>
                <p className="text-zinc-600 text-xs tracking-widest mt-1">{video.year}</p>
              </FadeUp>
            ))}
          </div>
        )}
      </div>

      {/* Photos */}
      <div className="px-10 py-12">
        <FadeUp>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-8">
            {t(ui.media.photos)}
          </p>
        </FadeUp>
        {photos.length === 0 ? (
          <p className="text-zinc-700 text-xs tracking-widest uppercase">{t(ui.media.photosSoon)}</p>
        ) : (
          <PhotoGallery photos={photos} />
        )}
      </div>
    </div>
  );
}
