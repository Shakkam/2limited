"use client";

import data from "@/data/content.json";
import ui from "@/data/ui.json";
import FadeUp from "@/components/FadeUp";
import MemberCard from "@/components/MemberCard";
import { useLanguage } from "@/components/LanguageProvider";

export default function BandClient() {
  const { band } = data;
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="h-48 pt-24 bg-zinc-950 relative flex items-end px-10 pb-6 border-b border-zinc-900">
        <FadeUp>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-1">
            {t(ui.band.eyebrow)}
          </p>
          <h1 className="text-2xl font-black tracking-widest text-white">{t(ui.band.title)}</h1>
        </FadeUp>
      </div>

      {/* Members — 2 photos côte à côte */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {band.members.map((member, i) => (
          <FadeUp key={i} delay={i * 0.15}>
            <MemberCard member={member} />
          </FadeUp>
        ))}
      </div>

      {/* Bio */}
      {band.bio.length > 0 && (
        <div className="px-10 py-12 max-w-2xl border-t border-zinc-900">
          {band.bio.map((section, i) => (
            <FadeUp key={i} delay={0.1 + i * 0.1} className="mb-10">
              {section.heading && (
                <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-500 mb-3">
                  {t(section.heading)}
                </h2>
              )}
              <p className="text-zinc-300 text-sm leading-relaxed">{t(section.text)}</p>
            </FadeUp>
          ))}
        </div>
      )}
    </div>
  );
}
