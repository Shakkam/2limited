import AnimatedTitle from "@/components/AnimatedTitle";
import FadeUp from "@/components/FadeUp";
import HeroParallax from "@/components/HeroParallax";

export const metadata = { title: "2-LIMITED — Electro acoustic vibe" };

export default function Home() {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {/* Background with mouse parallax */}
      <HeroParallax />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-14 left-10 right-10">
        <AnimatedTitle
          text="2 LIMITED"
          className="text-5xl md:text-7xl font-black tracking-[0.15em] text-white leading-none block mb-3"
        />
        <FadeUp delay={0.8}>
          <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase">Electro acoustic vibe</p>
        </FadeUp>
      </div>
    </div>
  );
}
