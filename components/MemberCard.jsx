"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import MemberPhoto from "@/components/MemberPhoto";

const EASE = [0.25, 0.1, 0.25, 1];

export default function MemberCard({ member, index = 0 }) {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const mirrored = index % 2 === 1;
  const initial = member.name ? member.name.charAt(0).toUpperCase() : "";

  return (
    <div className="relative flex flex-col">
      <div className="w-[60%] mx-auto h-[480px] flex items-end relative">
        <MemberPhoto
          member={member}
          className="w-full h-full"
          imgClassName="object-contain object-bottom"
          videoClassName="object-contain object-bottom"
        />
      </div>

      <div className="relative px-8 md:px-10 py-8 md:py-10 bg-zinc-950 border-t border-zinc-900 overflow-hidden">
        {/* Giant outlined initial — pure typography, no color outside the palette */}
        <span
          aria-hidden="true"
          className={`pointer-events-none select-none absolute -top-6 md:-top-10 text-[6rem] md:text-[9rem] font-black leading-none text-transparent ${
            mirrored ? "-right-2 md:right-2" : "-left-2 md:left-2"
          }`}
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
        >
          {initial}
        </span>

        <div className={`relative z-10 ${mirrored ? "text-right" : ""}`}>
          <p className="text-white text-2xl md:text-3xl font-black tracking-widest">{member.name}</p>
          <div className={`flex items-center gap-3 mt-3 ${mirrored ? "flex-row-reverse" : ""}`}>
            <motion.span
              className="h-px bg-zinc-700 origin-left"
              style={{ width: 40 }}
              initial={shouldReduceMotion ? false : { scaleX: 0 }}
              whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
            <p className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase">{t(member.role)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
