"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PhotoScatter from "@/components/PhotoScatter";
import ui from "@/data/ui.json";
import { useLanguage } from "@/components/LanguageProvider";

const BAR_COUNT = 72;

// Deterministic pseudo-random waveform shape (same on server and client, no hydration mismatch).
const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const v =
    Math.sin(i * 0.35) * 0.5 + Math.sin(i * 0.13) * 0.3 + Math.sin(i * 0.7) * 0.2;
  return 22 + ((v + 1) / 2) * 68; // 22% - 90%
});

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function FeaturedTrack({ src, title, subtitle, label = "Latest Recording", photos = [] }) {
  const audioRef = useRef(null);
  const barRef = useRef(null);
  const rafRef = useRef(null);
  const containerRef = useRef(null);
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [frameHeight, setFrameHeight] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);

  const updateMouseFromPoint = useCallback((currentTarget, clientX, clientY) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setMouse({ x, y });
      rafRef.current = null;
    });
  }, []);

  const handleMouseMove = useCallback(
    (e) => updateMouseFromPoint(e.currentTarget, e.clientX, e.clientY),
    [updateMouseFromPoint]
  );

  const handleMouseLeave = useCallback(() => setMouse({ x: 0, y: 0 }), []);

  // Touch: same reaction as the mouse, but driven by a held finger dragging
  // across the section instead of hovering.
  const handleTouchMove = useCallback(
    (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      updateMouseFromPoint(e.currentTarget, touch.clientX, touch.clientY);
    },
    [updateMouseFromPoint]
  );

  const handleTouchEnd = useCallback(() => setMouse({ x: 0, y: 0 }), []);

  // PhotoScatter needs the section's real, current size — height for an exact
  // edge margin, width to tighten the spread on narrow (mobile) screens.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setFrameHeight(rect.height);
      setFrameWidth(rect.width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const seekToClientX = (clientX) => {
    const audio = audioRef.current;
    const bar = barRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * duration;
    setProgress(ratio);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-black h-full flex items-center"
      // Same reason as in PhotoScatter: overflow alone doesn't reliably clip
      // 3D-transformed descendants, which let photos spill past this section
      // and add phantom scroll height to the page.
      style={{ clipPath: "inset(0)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Background */}
      <PhotoScatter photos={photos} mouse={mouse} frameHeight={frameHeight} frameWidth={frameWidth} />

      {/* Content — text reads via its own drop shadow, not a black-out backdrop, so photos stay visible right behind it */}
      <div className="relative w-full px-6 md:px-10 py-6 md:py-10" style={{ textShadow: "0 2px 24px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.95)" }}>
        <p className="text-zinc-300 text-[10px] tracking-[0.5em] uppercase mb-2 text-center">
          {label}
        </p>
        <h2 className="text-white font-black tracking-tight text-center text-[13vw] leading-[0.9] md:text-6xl lg:text-7xl uppercase mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-zinc-300 text-xs md:text-sm tracking-[0.4em] uppercase text-center mb-6">
            {subtitle}
          </p>
        )}

        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center">
            {isPlaying && (
              <>
                <motion.span
                  className="absolute rounded-full border border-white/25"
                  style={{ width: 96, height: 96 }}
                  animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span
                  className="absolute rounded-full border border-white/25"
                  style={{ width: 96, height: 96 }}
                  animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.9 }}
                />
              </>
            )}
            <motion.button
              onClick={togglePlay}
              aria-label={isPlaying ? t(ui.music.pause) : t(ui.music.play)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.25)]"
            >
              {isPlaying ? (
                <svg width="26" height="26" viewBox="0 0 14 14" fill="black">
                  <rect x="1" width="4" height="14" rx="1" />
                  <rect x="9" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 14 14" fill="black" className="ml-1">
                  <path d="M2 0 L14 7 L2 14 Z" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>

        {/* Waveform */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={barRef}
            onClick={(e) => seekToClientX(e.clientX)}
            className="flex items-center gap-[2px] h-16 md:h-20 cursor-pointer"
          >
            {BAR_HEIGHTS.map((h, i) => {
              const active = i / BAR_COUNT <= progress;
              return (
                <motion.span
                  key={i}
                  className={`flex-1 rounded-full ${active ? "bg-white" : "bg-zinc-700/50"}`}
                  style={{ height: `${h}%` }}
                  animate={
                    isPlaying
                      ? { scaleY: [1, 1.15, 0.88, 1.05, 1] }
                      : { scaleY: 1 }
                  }
                  transition={
                    isPlaying
                      ? {
                          duration: 1.1 + (i % 5) * 0.15,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: (i % 7) * 0.06,
                        }
                      : { duration: 0.2 }
                  }
                />
              );
            })}
          </div>

          <div className="flex justify-between mt-3">
            <span className="text-zinc-300 text-[11px] tracking-widest tabular-nums">
              {formatTime(currentTime)}
            </span>
            <span className="text-zinc-300 text-[11px] tracking-widest tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
