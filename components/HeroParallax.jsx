"use client";

import { useRef, useEffect } from "react";

const HIST = 24; // mouse history for displacement

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D u_img1;
uniform sampler2D u_img2;
uniform sampler2D u_mask;
uniform vec2 u_res;
uniform vec2 u_img1size;
uniform vec2 u_img2size;
uniform vec4 u_hist[${HIST}];
uniform vec2 u_vel[${HIST}];
varying vec2 v_uv;

vec2 coverUV(vec2 uv, vec2 res, vec2 imgSize) {
  float scale = max(res.x / imgSize.x, res.y / imgSize.y);
  vec2 offset = (res - imgSize * scale) / (2.0 * res);
  return (uv - offset) * res / (imgSize * scale);
}

void main() {
  vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
  float aspect = u_res.x / u_res.y;

  // Subtle displacement from mouse history
  vec2 disp = vec2(0.0);
  for (int i = 0; i < ${HIST}; i++) {
    float w = u_hist[i].z;
    if (w < 0.01) continue;
    vec2 diff = uv - u_hist[i].xy;
    diff.x *= aspect;
    float d = length(diff);
    float s = max(0.0, 1.0 - d / 0.18) * w;
    disp += u_vel[i] * s;
  }

  vec2 duv = uv - disp;
  vec4 c1 = texture2D(u_img1, clamp(coverUV(duv, u_res, u_img1size), 0.0, 1.0));
  vec4 c2 = texture2D(u_img2, clamp(coverUV(duv, u_res, u_img2size), 0.0, 1.0));
  float m  = texture2D(u_mask, uv).r;
  gl_FragColor = mix(c1, c2, m);
}`;

const BASE_R  = 0.18;
const OPACITY = 0.105;
const DECAY   = 0.92;

export default function HeroParallax() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouse     = useRef({ x: -1, y: -1 });
  const tempMask  = useRef(null);
  const permMask  = useRef(null);
  const maskW     = useRef(0);
  const maskH     = useRef(0);
  const histData  = useRef(new Float32Array(HIST * 4));
  const velData   = useRef(new Float32Array(HIST * 2));
  const histIdx   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const img1 = new window.Image();
    const img2 = new window.Image();
    img1.src = "/images/background.jpg";
    img2.src = "/images/background2.jpg";

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w   = Math.round(window.innerWidth  * dpr);
      const h   = Math.round(window.innerHeight * dpr);
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      const mw = Math.round(w / 2), mh = Math.round(h / 2);
      maskW.current = mw; maskH.current = mh;
      tempMask.current = new Float32Array(mw * mh);
      permMask.current = new Float32Array(mw * mh);
    };
    resize();
    window.addEventListener("resize", resize);

    const mkShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const mkTex = (unit) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return t;
    };
    const tex1 = mkTex(0), tex2 = mkTex(1), texMask = mkTex(2);
    gl.uniform1i(gl.getUniformLocation(prog, "u_img1"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "u_img2"), 1);
    gl.uniform1i(gl.getUniformLocation(prog, "u_mask"), 2);
    const uRes      = gl.getUniformLocation(prog, "u_res");
    const uImg1size = gl.getUniformLocation(prog, "u_img1size");
    const uImg2size = gl.getUniformLocation(prog, "u_img2size");
    const uHist     = gl.getUniformLocation(prog, "u_hist");
    const uVel      = gl.getUniformLocation(prog, "u_vel");

    const uploadImg = (tex, unit, img) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };
    let ready = 0;
    const onLoad = () => { if (++ready === 2) animRef.current = requestAnimationFrame(draw); };
    img1.onload = () => { uploadImg(tex1, 0, img1); gl.uniform2f(uImg1size, img1.naturalWidth, img1.naturalHeight); onLoad(); };
    img2.onload = () => { uploadImg(tex2, 1, img2); gl.uniform2f(uImg2size, img2.naturalWidth, img2.naturalHeight); onLoad(); };
    if (img1.complete) img1.onload();
    if (img2.complete) img2.onload();

    const paintStroke = (cx, cy, vx, vy, speed) => {
      const temp = tempMask.current, perm = permMask.current;
      const mw = maskW.current, mh = maskH.current;
      if (!temp) return;
      const r   = BASE_R * mw;
      const len = Math.min(speed * 1.8, r * 3);
      const ang = Math.atan2(vy, vx);
      const cos = Math.cos(-ang), sin = Math.sin(-ang);
      const rA = r + len, rB = r * 0.55;
      const cx2 = cx * mw, cy2 = cy * mh;
      const pad = rA + 2;

      for (let row = Math.max(0, Math.floor(cy2 - pad)); row <= Math.min(mh-1, Math.ceil(cy2 + pad)); row++) {
        for (let col = Math.max(0, Math.floor(cx2 - pad)); col <= Math.min(mw-1, Math.ceil(cx2 + pad)); col++) {
          const dx = col - cx2, dy = row - cy2;
          const lx = dx * cos - dy * sin;
          const ly = dx * sin + dy * cos;
          const d  = Math.sqrt((lx / rA) ** 2 + (ly / rB) ** 2);
          if (d > 1) continue;
          const falloff = Math.pow(1 - d, 1.2) * (0.85 + Math.random() * 0.15);
          const idx = row * mw + col;
          temp[idx] = Math.min(1, temp[idx] + falloff * OPACITY);
          perm[idx] = Math.min(1, perm[idx] + falloff * OPACITY * 0.06);
        }
      }

      const nDrops = Math.floor(speed * 0.4);
      for (let i = 0; i < nDrops; i++) {
        const t   = Math.random();
        const drx = cx2 - Math.cos(ang) * t * len + (Math.random() - 0.5) * r * 0.5;
        const dry = cy2 - Math.sin(ang) * t * len + (Math.random() - 0.5) * r * 0.5;
        const dr  = r * (0.15 + Math.random() * 0.25);
        for (let row = Math.max(0, Math.floor(dry - dr)); row <= Math.min(mh-1, Math.ceil(dry + dr)); row++) {
          for (let col = Math.max(0, Math.floor(drx - dr)); col <= Math.min(mw-1, Math.ceil(drx + dr)); col++) {
            const d2 = Math.sqrt((col - drx) ** 2 + (row - dry) ** 2) / dr;
            if (d2 > 1) continue;
            const idx = row * mw + col;
            temp[idx] = Math.min(1, temp[idx] + (1 - d2) * OPACITY * 0.6);
            perm[idx] = Math.min(1, perm[idx] + (1 - d2) * OPACITY * 0.04);
          }
        }
      }
    };

    const onMouseMove = (e) => {
      const dx = e.clientX - mouse.current.x;
      const dy = e.clientY - mouse.current.y;
      const speed = Math.sqrt(dx*dx + dy*dy);
      if (speed < 0.5) return;
      mouse.current = { x: e.clientX, y: e.clientY };

      // Add to displacement history
      const i = histIdx.current;
      histData.current[i*4]   = e.clientX / window.innerWidth;
      histData.current[i*4+1] = e.clientY / window.innerHeight;
      histData.current[i*4+2] = 1.0;
      histData.current[i*4+3] = 0.0;
      velData.current[i*2]   = (dx / window.innerWidth)  * 0.10;
      velData.current[i*2+1] = (dy / window.innerHeight) * 0.10;
      histIdx.current = (i + 1) % HIST;

      paintStroke(
        e.clientX / window.innerWidth,
        e.clientY / window.innerHeight,
        dx, dy, speed
      );
    };
    window.addEventListener("mousemove", onMouseMove);

    let texBytes = null;
    const draw = () => {
      const temp = tempMask.current, perm = permMask.current;
      const mw = maskW.current, mh = maskH.current;
      if (!temp) { animRef.current = requestAnimationFrame(draw); return; }

      // Decay temp mask and displacement weights
      for (let i = 0; i < temp.length; i++) temp[i] *= DECAY;
      const hist = histData.current;
      for (let i = 0; i < HIST; i++) hist[i*4+2] *= 0.84; // fast displacement decay

      if (!texBytes || texBytes.length !== mw * mh * 4) texBytes = new Uint8Array(mw * mh * 4);
      for (let i = 0; i < mw * mh; i++) {
        const v = Math.round(Math.min(1, temp[i] + perm[i]) * 255);
        texBytes[i*4] = v; texBytes[i*4+1] = v; texBytes[i*4+2] = v; texBytes[i*4+3] = 255;
      }

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texMask);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, mw, mh, 0, gl.RGBA, gl.UNSIGNED_BYTE, texBytes);

      gl.uniform4fv(uHist, hist);
      gl.uniform2fv(uVel, velData.current);
      const dpr = window.devicePixelRatio || 1;
      gl.uniform2f(uRes, canvas.width / dpr, canvas.height / dpr);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animRef.current = requestAnimationFrame(draw);
    };

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
