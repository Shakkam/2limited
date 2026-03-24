"use client";

import { useRef } from "react";

export default function MemberCard({ member }) {
  const videoRef = useRef(null);

  const videoSrc = `/videos/${member.name.toLowerCase()}.webm`;

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="relative flex flex-col group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-[60%] mx-auto h-[480px] flex items-end relative">
        {/* Photo statique */}
        {member.photo && (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-contain object-bottom absolute inset-0"
          />
        )}
        {/* Vidéo au survol */}
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          className="w-full h-full object-contain object-bottom absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      <div className="px-8 py-8 bg-zinc-950 border-t border-zinc-900">
        <p className="text-white text-xl font-black tracking-widest mb-1">{member.name}</p>
        <p className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase mb-4">{member.role}</p>
        {member.bio && (
          <p className="text-zinc-400 text-sm leading-relaxed">{member.bio}</p>
        )}
      </div>
    </div>
  );
}
