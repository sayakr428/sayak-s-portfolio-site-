import { useEffect, useRef } from "react";
import { gsap, prefersReduced } from "@/lib/motion";

/**
 * A crowd walking across the foot of the page, after adxy's footer (github.com/adxy/minima, crowd.js).
 * The people are Open Peeps by Pablo Stanley (CC0), one 15 × 7 sprite sheet, self-hosted.
 * It only animates while it's on screen.
 */
export function Crowd({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const ROWS = 15, COLS = 7;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    type Peep = { rect: number[]; w: number; h: number; x: number; y: number; anchorY: number; sx: number; walk: gsap.core.Timeline | null };
    const stage = { w: 0, h: 0 };
    const all: Peep[] = [], free: Peep[] = [], crowd: Peep[] = [];
    const img = new Image(); img.src = "/footer/peeps.webp";
    let live = false;

    // depth fills the whole stage: people further back stand higher and smaller, those in front are larger and lower
    const baseScale = () => (stage.w < 480 ? .46 : stage.w < 960 ? .6 : .8);
    const reset = (p: Peep) => {
      const d = Math.random();                                         // 0 = back row, 1 = front, evenly spread
      const s = baseScale() * (.62 + .5 * d);
      const dir = Math.random() > .5 ? 1 : -1;
      const ground = stage.h * (.34 + .78 * d);                       // where this row's shoulders sit; the front rows run off the bottom (peeps have no legs)
      const startY = ground - p.h * s * .78;
      p.sx = dir * s; p.y = p.anchorY = startY;
      p.x = dir === 1 ? -p.w * s : stage.w + p.w * s;
      return { startY, endX: dir === 1 ? stage.w : -p.w * s };
    };
    const add = (): Peep => {
      const p = free.splice((Math.random() * free.length) | 0, 1)[0];
      const { startY, endX } = reset(p);
      const tl = gsap.timeline({ paused: !live, onComplete: () => { crowd.splice(crowd.indexOf(p), 1); free.push(p); add(); } });
      tl.timeScale(rand(.5, 1.5));
      tl.to(p, { duration: 10, x: endX, ease: "none" }, 0).to(p, { duration: .25, repeat: 40, yoyo: true, y: startY - 10 }, 0);
      p.walk = tl; crowd.push(p); crowd.sort((a, b) => a.anchorY - b.anchorY);
      return p;
    };
    const resize = () => {
      stage.w = canvas.clientWidth; stage.h = canvas.clientHeight;
      canvas.width = stage.w * devicePixelRatio; canvas.height = stage.h * devicePixelRatio;
      crowd.forEach((p) => p.walk?.kill()); crowd.length = 0; free.length = 0; free.push(...all);
      // a smaller crowd on small screens
      const n = stage.w < 600 ? 70 : all.length;
      for (let i = 0; i < n && free.length; i++) add().walk!.progress(Math.random());
    };
    const render = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      for (const p of crowd) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.scale(p.sx, Math.abs(p.sx));
        ctx.drawImage(img, p.rect[0], p.rect[1], p.rect[2], p.rect[3], 0, 0, p.w, p.h); ctx.restore();
      }
    };
    const setLive = (v: boolean) => { live = v; crowd.forEach((p) => (v ? p.walk?.play() : p.walk?.pause())); if (v) gsap.ticker.add(render); else gsap.ticker.remove(render); };

    let io: IntersectionObserver | null = null;
    img.onload = () => {
      const w = img.naturalWidth / ROWS, h = img.naturalHeight / COLS;
      for (let k = 0; k < 2; k++) for (let i = 0; i < ROWS * COLS; i++) all.push({ rect: [(i % ROWS) * w, ((i / ROWS) | 0) * h, w, h], w, h, x: 0, y: 0, anchorY: 0, sx: 1, walk: null });
      resize(); render();
      if (prefersReduced()) return;
      io = new IntersectionObserver(([e]) => setLive(e.isIntersecting)); io.observe(canvas);
      addEventListener("resize", resize);
    };
    return () => { io?.disconnect(); removeEventListener("resize", resize); gsap.ticker.remove(render); crowd.forEach((p) => p.walk?.kill()); };
  }, []);
  return <canvas ref={ref} aria-hidden className={`block h-full w-full ${className}`} />;
}
