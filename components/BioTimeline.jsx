"use client";

import { motion, useReducedMotion } from "framer-motion";
import MemberPhoto from "@/components/MemberPhoto";
import { useLanguage } from "@/components/LanguageProvider";

const EASE = [0.25, 0.1, 0.25, 1];

// A block's content: either a band-level entry (small uppercase label +
// paragraph) or a member entry (avatar thumbnail — photo swaps to video on
// hover, same mechanism as the big photos above — + name/role + paragraph).
function EntryContent({ item }) {
  const { t } = useLanguage();

  return (
    <div>
      {item.type === "member" ? (
        <div className="flex items-center gap-3 mb-4">
          <MemberPhoto
            member={item.member}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 border border-zinc-800"
            imgClassName="object-cover object-top"
            videoClassName="object-cover object-top"
          />
          <div>
            <p className="text-white text-sm font-black tracking-widest">{item.member.name}</p>
            <p className="text-zinc-600 text-[9px] tracking-[0.25em] uppercase">{t(item.member.role)}</p>
          </div>
        </div>
      ) : (
        item.heading && (
          <p className="text-zinc-600 text-[10px] font-black tracking-[0.3em] uppercase mb-4">
            {t(item.heading)}
          </p>
        )
      )}
      <p className="text-zinc-400 text-sm md:text-[15px] leading-loose first-letter:text-white first-letter:font-black first-letter:text-3xl md:first-letter:text-4xl first-letter:leading-[0.65] first-letter:float-left first-letter:pr-2 first-letter:pt-1">
        {t(item.text)}
      </p>
    </div>
  );
}

function Column({ item, reduceMotion, delay }) {
  if (!item) return <div />;
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      <EntryContent item={item} />
    </motion.div>
  );
}

// Two side-by-side columns (Cam always left, Steph always right, the band's
// own two blurbs paired at the top) sharing one central divider with a small
// node marking the start of each row — every row has content on both sides,
// nothing sits across from blank space.
export default function BioTimeline({ rows }) {
  const reduceMotion = useReducedMotion();

  if (!rows || rows.length === 0) return null;

  return (
    <div className="relative">
      <div className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />

      <div className="space-y-14 md:space-y-16">
        {rows.map((row, i) => (
          <div key={i} className="relative grid grid-cols-2 gap-x-6 md:gap-x-16">
            <span
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-2.5 h-2.5 rounded-full bg-white ring-[6px] ring-black z-10"
            />
            <Column item={row.left} reduceMotion={reduceMotion} delay={0} />
            <Column item={row.right} reduceMotion={reduceMotion} delay={reduceMotion ? 0 : 0.1} />
          </div>
        ))}
      </div>
    </div>
  );
}
