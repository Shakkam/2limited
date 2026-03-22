import data from "@/data/content.json";
import FadeUp from "@/components/FadeUp";

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

      {/* Bio */}
      <div className="px-10 py-12 max-w-2xl">
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

      {/* Members */}
      {band.members.length > 0 && (
        <div className="px-10 pb-16">
          <FadeUp delay={0.3}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-600 mb-8">Members</p>
            <div className="flex gap-8">
              {band.members.map((member, i) => (
                <div key={i}>
                  <div className="w-40 h-40 bg-zinc-900 mb-4 flex items-center justify-center">
                    <p className="text-zinc-700 text-xs tracking-widest">Photo</p>
                  </div>
                  <p className="text-white text-sm font-bold tracking-widest">{member.name}</p>
                  <p className="text-zinc-600 text-xs tracking-widest mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      )}
    </div>
  );
}
