"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const COLS = 3;
const ROWS = 3;
const GAP = 4;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.every((v, i) => v === i)) return shuffle(arr);
  return a;
}

function PuzzleModal({ photo, onClose }) {
  const total = COLS * ROWS;
  const [slots, setSlots] = useState(() =>
    shuffle(Array.from({ length: total }, (_, i) => i))
  );
  const [dragging, setDragging] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const [imgSize, setImgSize] = useState(null);
  const [puzzleSize, setPuzzleSize] = useState(null);

  // Detect real image dimensions, then compute puzzle size = same as object-contain full view
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      const iw = img.naturalWidth, ih = img.naturalHeight;
      setImgSize({ w: iw, h: ih });
      const aspect = iw / ih;
      const availW = Math.min(window.innerWidth - 64, 1024); // max-w-5xl - mx-8
      const availH = window.innerHeight * 0.9;
      let pw, ph;
      if (availW / aspect <= availH) { pw = availW; ph = availW / aspect; }
      else                           { ph = availH; pw = ph * aspect; }
      setPuzzleSize({ w: pw, h: ph });
    };
    img.src = photo.src;
  }, [photo.src]);

  const PUZZLE_W = puzzleSize?.w ?? 480;
  const PUZZLE_H = puzzleSize?.h ?? 270;
  const CELL_W = PUZZLE_W / COLS;
  const CELL_H = PUZZLE_H / ROWS;

  const isSolved = slots.every((p, i) => p === i);

  const swap = (a, b) => {
    setSelected(null);
    if (a === b) return;
    setSlots((prev) => {
      const next = [...prev];
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
  };

  const handleClick = (slotIdx) => {
    if (isSolved) return;
    if (selected === null) {
      setSelected(slotIdx);
    } else {
      swap(selected, slotIdx);
    }
  };

  const getPieceStyle = (pieceId) => {
    const col = pieceId % COLS;
    const row = Math.floor(pieceId / COLS);
    return {
      backgroundImage: `url(${photo.src})`,
      backgroundSize: `${PUZZLE_W}px ${PUZZLE_H}px`,
      backgroundPosition: `-${col * CELL_W}px -${row * CELL_H}px`,
      width: `${CELL_W}px`,
      height: `${CELL_H}px`,
    };
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { if (showFull) setShowFull(false); else onClose(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, showFull]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center gap-8"
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full image overlay */}
        {showFull && (
          <div
            className="fixed inset-0 z-10 bg-black/95 flex items-center justify-center"
            onClick={() => setShowFull(false)}
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full mx-8">
              <Image
                src={photo.src}
                alt={photo.alt || "2-LIMITED"}
                fill
                className="object-contain"
              />
            </div>
            <p className="absolute bottom-6 text-zinc-600 text-[10px] tracking-[0.3em] uppercase">
              Cliquer pour fermer
            </p>
          </div>
        )}

        {/* Hint */}
        <p className="text-zinc-300 text-[10px] tracking-[0.3em] uppercase">
          {isSolved ? "✓ Puzzle terminé !" : "Glisse ou clique pour échanger les pièces"}
        </p>

        {/* Puzzle grid */}
        {!puzzleSize ? (
          <div style={{ width: PUZZLE_W, height: 200 }} className="flex items-center justify-center">
            <p className="text-zinc-700 text-xs tracking-widest">Chargement…</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, ${CELL_W}px)`,
              gap: `${GAP}px`,
            }}
          >
            {slots.map((pieceId, slotIdx) => (
              <div
                key={slotIdx}
                draggable={!isSolved}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  setDragging(slotIdx);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragging !== null) { swap(dragging, slotIdx); setDragging(null); }
                }}
                onDragEnd={() => setDragging(null)}
                onClick={() => handleClick(slotIdx)}
                style={{
                  ...getPieceStyle(pieceId),
                  cursor: isSolved ? "default" : "grab",
                  opacity: dragging === slotIdx ? 0.4 : 1,
                  outline:
                    selected === slotIdx
                      ? "3px solid rgba(255,255,255,0.9)"
                      : pieceId === slotIdx && !isSolved
                      ? "3px solid rgba(255,255,255,0.12)"
                      : isSolved
                      ? "3px solid rgba(255,255,255,0.2)"
                      : "none",
                  transition: "opacity 0.15s, outline 0.1s",
                }}
              />
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-8">
          <button
            onClick={() => setShowFull(true)}
            className="text-zinc-300 text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors"
          >
            Voir en grand
          </button>
          {!isSolved && (
            <button
              onClick={() => {
                setSlots(shuffle(Array.from({ length: total }, (_, i) => i)));
                setSelected(null);
              }}
              className="text-zinc-300 text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors"
            >
              Mélanger
            </button>
          )}
          <button
            onClick={onClose}
            className="text-zinc-300 text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PhotoGallery({ photos }) {
  const [puzzle, setPuzzle] = useState(null);

  return (
    <>
      {/* Masonry columns */}
      <div className="columns-2 md:columns-3 gap-[40px]">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="relative overflow-hidden cursor-pointer mb-[40px] break-inside-avoid bg-zinc-900 group"
            onClick={() => setPuzzle(i)}
          >
            <Image
              src={photo.src}
              alt={photo.alt || "2-LIMITED"}
              width={0}
              height={0}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
          </div>
        ))}
      </div>

      {/* Puzzle modal */}
      {puzzle !== null && (
        <PuzzleModal photo={photos[puzzle]} onClose={() => setPuzzle(null)} />
      )}
    </>
  );
}
