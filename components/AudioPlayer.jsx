"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function Equalizer({ playing }) {
  return (
    <div className="flex items-end gap-[3px] h-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] bg-zinc-500 rounded-full"
          animate={
            playing
              ? { height: ["30%", "100%", "45%", "80%", "30%"] }
              : { height: "20%" }
          }
          transition={
            playing
              ? { duration: 0.9 + i * 0.15, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}

export default function AudioPlayer({ src, title, subtitle }) {
  const audioRef = useRef(null);
  const barRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

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
      className={`group/card flex items-center gap-5 rounded-2xl border px-6 py-5 bg-gradient-to-br from-zinc-900/60 to-black transition-colors duration-300 ${
        isPlaying ? "border-zinc-700" : "border-zinc-900 hover:border-zinc-800"
      }`}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <motion.button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="shrink-0 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
      >
        {isPlaying ? (
          <svg width="16" height="16" viewBox="0 0 14 14" fill="black">
            <rect x="1" width="4" height="14" rx="1" />
            <rect x="9" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 14 14" fill="black" className="ml-0.5">
            <path d="M2 0 L14 7 L2 14 Z" />
          </svg>
        )}
      </motion.button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <p className="text-white text-sm font-bold tracking-widest truncate">{title}</p>
          <Equalizer playing={isPlaying} />
        </div>
        {subtitle && (
          <p className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase mt-1">{subtitle}</p>
        )}

        <div
          ref={barRef}
          onClick={(e) => seekToClientX(e.clientX)}
          className="mt-3.5 h-1.5 rounded-full bg-zinc-800 cursor-pointer relative group"
        >
          <div
            className="h-full rounded-full bg-white transition-[width] duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            style={{ left: `calc(${progress * 100}% - 6px)` }}
          />
        </div>

        <div className="flex justify-between mt-1.5">
          <span className="text-zinc-600 text-[10px] tracking-widest tabular-nums">
            {formatTime(currentTime)}
          </span>
          <span className="text-zinc-600 text-[10px] tracking-widest tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
