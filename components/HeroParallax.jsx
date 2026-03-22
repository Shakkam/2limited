"use client";

import { useRef, useEffect } from "react";

export default function HeroParallax() {
  const canvasRef = useRef(null);
  const maskRef = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img1 = new window.Image();
    const img2 = new window.Image();
    img1.src = "/images/background.jpg";
    img2.src = "/images/background2.jpg";

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      // Reset mask on resize
      maskRef.current = new OffscreenCanvas(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const RADIUS = 120;
    const OPACITY = 0.24; // low = need many passes to fully reveal

    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Paint onto the persistent mask with low opacity → progressive reveal
      const mask = maskRef.current;
      if (!mask) return;
      const mctx = mask.getContext("2d");
      const grad = mctx.createRadialGradient(e.clientX, e.clientY, 0, e.clientX, e.clientY, RADIUS);
      grad.addColorStop(0, `rgba(255,255,255,${OPACITY})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      mctx.fillStyle = grad;
      mctx.fillRect(0, 0, mask.width, mask.height);
    };

    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      if (!img1.complete || !img2.complete) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;

      // Draw base image
      ctx.drawImage(img1, 0, 0, w, h);

      // Build reveal layer: img2 masked by accumulated mask
      const off = new OffscreenCanvas(w, h);
      const octx = off.getContext("2d");
      octx.drawImage(img2, 0, 0, w, h);
      octx.globalCompositeOperation = "destination-in";
      octx.drawImage(maskRef.current, 0, 0);

      ctx.drawImage(off, 0, 0);


      animRef.current = requestAnimationFrame(draw);
    };

    const onLoad = () => {
      if (img1.complete && img2.complete) animRef.current = requestAnimationFrame(draw);
    };
    img1.onload = onLoad;
    img2.onload = onLoad;
    if (img1.complete && img2.complete) animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
