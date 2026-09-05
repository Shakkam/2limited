"use client";

import { useEffect, useRef, useState } from "react";

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
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
    <div className="flex items-center gap-5 bg-zinc-950 border border-zinc-900 px-6 py-5">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="shrink-0 w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center hover:border-white transition-colors"
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
            <rect x="1" width="4" height="14" />
            <rect x="9" width="4" height="14" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
            <path d="M2 0 L14 7 L2 14 Z" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-bold tracking-widest truncate">{title}</p>
        {subtitle && (
          <p className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase mt-1">{subtitle}</p>
        )}

        <div
          ref={barRef}
          onClick={(e) => seekToClientX(e.clientX)}
          className="mt-3 h-1 bg-zinc-800 cursor-pointer relative group"
        >
          <div className="h-full bg-white" style={{ width: `${progress * 100}%` }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress * 100}% - 5px)` }}
          />
        </div>

        <div className="flex justify-between mt-1.5">
          <span className="text-zinc-600 text-[10px] tracking-widest">{formatTime(currentTime)}</span>
          <span className="text-zinc-600 text-[10px] tracking-widest">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
