"use client";

import data from "@/data/content.json";
import ui from "@/data/ui.json";
import FadeUp from "@/components/FadeUp";
import MemberCard from "@/components/MemberCard";
import BioTimeline from "@/components/BioTimeline";
import { useLanguage } from "@/components/LanguageProvider";

// One member's bio paragraphs, as individual entries — paired row-by-row
// against the other member's, so Cam's column and Steph's column always
// line up (see timelineRows below).
function memberEntries(member) {
  if (!member) return [];
  const paragraphs = Array.isArray(member.bio) ? member.bio : member.bio ? [member.bio] : [];
  return paragraphs.map((text) => ({ type: "member", member, text }));
}

export default function BandClient() {
  const { band } = data;
  const { t } = useLanguage();

  const membersByName = Object.fromEntries(band.members.map((m) => [m.name, m]));
  const cam = membersByName.Cam ?? band.members[0];
  const steph = membersByName.Steph ?? band.members[1];
  const bandBio = Array.isArray(band.bio) ? band.bio : [];
  const [bandIntro, bandSound] = bandBio;

  // Cam always in the left column, Steph always in the right — paired
  // row-by-row rather than alternating, so nothing sits across from blank
  // space. Row 1 pairs the band's two blurbs (intro / sound); rows 2+ pair
  // each member's paragraphs in order.
  const camEntries = memberEntries(cam);
  const stephEntries = memberEntries(steph);
  const memberRowCount = Math.max(camEntries.length, stephEntries.length);

  const timelineRows = [
    (bandIntro || bandSound) && {
      left: bandIntro && { type: "band", heading: bandIntro.heading, text: bandIntro.text },
      right: bandSound && { type: "band", heading: bandSound.heading, text: bandSound.text },
    },
    ...Array.from({ length: memberRowCount }, (_, i) => ({
      left: camEntries[i],
      right: stephEntries[i],
    })),
  ].filter(Boolean);

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
            <MemberCard member={member} index={i} />
          </FadeUp>
        ))}
      </div>

      {/* Bio — single vertical timeline reusing the existing band + member copy */}
      <div className="relative px-6 md:px-10 py-20 md:py-28 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto">
          <BioTimeline rows={timelineRows} />
        </div>
      </div>
    </div>
  );
}
