import data from "@/data/content.json";
import FadeUp from "@/components/FadeUp";
import MemberCard from "@/components/MemberCard";

export const metadata = { title: "Band | 2-LIMITED" };

export default function Band() {
  const { band } = data;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="h-64 pt-24 bg-zinc-950 relative flex items-end px-10 pb-8 border-b border-zinc-900">
        <FadeUp>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase mb-2">About</p>
          <h1 className="text-3xl font-black tracking-widest text-white">THE BAND</h1>
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
                  {section.heading}
                </h2>
              )}
              <p className="text-zinc-300 text-sm leading-relaxed">{section.text}</p>
            </FadeUp>
          ))}
        </div>
      )}
    </div>
  );
}
