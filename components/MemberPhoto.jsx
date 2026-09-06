"use client";

import { useRef } from "react";

// Shared hover mechanism: a static photo that swaps to a looping muted video
// on hover. Used both for the large member photos at the top of the Band
// page and for the small avatar thumbnails in the bio timeline below, so the
// toggle behavior (and the /videos/{name}.webm convention) lives in one place
// instead of being duplicated.
export default function MemberPhoto({ member, className = "", imgClassName = "", videoClassName = "" }) {
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
      className={`relative group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {member.photo && (
        <img
          src={member.photo}
          alt={member.name}
          className={`absolute inset-0 w-full h-full ${imgClassName}`}
        />
      )}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${videoClassName}`}
      />
    </div>
  );
}
