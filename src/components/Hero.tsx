import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { finePointer, gsap, prefersReduced, scrollToId, ScrollTrigger, SplitText } from "@/lib/motion";
import { PROFILE } from "@/data/profile";
import { openBrief } from "@/data/briefs";

// what rides the film strip: real work, looping
const FRAMES: { label: string; src: string; video?: boolean; brief?: string }[] = [
  { label: "Derq Ops", src: "/broll/traffic.mp4", video: true, brief: "derq" },
  { label: "Shantiban City", src: "/live/walkthrough.mp4", video: true, brief: "shantiban" },
  { label: "MyChiffre", src: "/work/mc-dashboard.jpg", brief: "vitacount" },
  { label: "Handed On", src: "/film/handedon.mp4", video: true },
  { label: "WebGrow .AI", src: "/live/webgrow-ai.mp4", video: true, brief: "webgrow-ai" },
  { label: "The lab", src: "/lab/lab.mp4", video: true },
  { label: "Stellar", src: "/work/stellar.webp", brief: "stellar" },
  { label: "WebGrow360", src: "/live/webgrow.mp4", video: true, brief: "webgrow" },
  { label: "Data centre", src: "/broll/datacenter.mp4", video: true },
  { label: "Mrityika Estates", src: "/live/mrityika.mp4", video: true, brief: "shantiban" },
];

// behind the page: the same person at every age, with the technology of each year (three panels, nine figures)
const AGES = [["2001", "born", 8, 50.7], ["2004", "3", 18.8, 27.3], ["2007", "6", 26.3, 15.1], ["2010", "9", 40.6, 23.2], ["2013", "12", 49.9, 15.6], ["2016", "15", 58.7, 7.8], ["2019", "18", 73.4, 14.8], ["2022", "21", 83, 12], ["2025", "24", 92, 9.6]] as const;   // [year, age, head x %, head top %] measured on the image

/**
 * One continuous strip of film drawn on a canvas: the band is a single curved shape, the perforations run unbroken along it,
 * and every frame is drawn in thin slices, each turned to the curve, so pictures bend with the film.
 */
function useFilmStrip(canvasRef: React.RefObject<HTMLCanvasElement | null>, speed: React.RefObject<{ v: number }>, paused: React.RefObject<boolean>) {
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const g = cv.getContext("2d")!;
    const reduce = prefersReduced();
    const media = FRAMES.map((f) => {
      if (f.video) { const v = document.createElement("video"); v.src = f.src; v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto"; v.play().catch(() => {}); return v; }
      const im = new Image(); im.src = f.src; return im;
    });
    let W = 0, H = 0, dpr = 1, off = 0, raf = 0, last = performance.now(), hover = -1;
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; };
    size();
    const ro = new ResizeObserver(size); ro.observe(cv);

    // geometry: a smile-shaped curve across the canvas, a little higher on the right
    const T = () => Math.min(H * .72, Math.max(160, W * .135));            // band thickness
    const IMG = () => T() - 64;                                             // picture height inside the band
    const FW = () => IMG() * 1.6;                                           // picture width (16:10)
    const GAP = 14;
    const yAt = (x: number) => { const u = (x - W / 2) / (W / 2); return H * .5 - T() * .1 + W * .065 * (1 - u * u) * .9 + W * .01 * u - W * .03; };
    const slope = (x: number) => { const u = (x - W / 2) / (W / 2); return (-2 * u * W * .065 * .9 / (W / 2)) + W * .01 / (W / 2); };
    const step = () => FW() + GAP, total = () => step() * FRAMES.length;
    const frameX = (i: number) => { const t = total(); return ((i * step() - off) % t + t) % t - step(); };

    const draw = () => {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      const t = T(), ih = IMG(), fw = FW();
      // the band: one polygon along the curve
      g.beginPath();
      for (let x = -40; x <= W + 40; x += 8) { const a = Math.atan(slope(x)); const y = yAt(x); g.lineTo(x + Math.sin(a) * t / 2, y - Math.cos(a) * t / 2); }
      for (let x = W + 40; x >= -40; x -= 8) { const a = Math.atan(slope(x)); const y = yAt(x); g.lineTo(x - Math.sin(a) * t / 2, y + Math.cos(a) * t / 2); }
      g.closePath(); g.fillStyle = "#121214"; g.fill();
      // perforations: an unbroken run on both edges, travelling with the film
      g.fillStyle = "#ece7dd";
      const pitch = 24, po = ((-off % pitch) + pitch) % pitch;
      for (let x = -40 + po; x < W + 40; x += pitch) {
        const a = Math.atan(slope(x)), y = yAt(x);
        for (const side of [-1, 1]) {
          g.save(); g.translate(x - Math.sin(a) * side * (t / 2 - 13), y + Math.cos(a) * side * (t / 2 - 13)); g.rotate(a);
          g.beginPath(); g.roundRect(-6, -5, 12, 10, 2.5); g.fill(); g.restore();
        }
      }
      // the frames, in slices that follow the curve
      const SL = 18;
      FRAMES.forEach((f, i) => {
        const x0 = frameX(i); if (x0 > W + 10 || x0 + fw < -10) return;
        const m = media[i] as HTMLVideoElement & HTMLImageElement;
        const sw = f.video ? m.videoWidth : m.naturalWidth, sh = f.video ? m.videoHeight : m.naturalHeight;
        const ok = sw > 0 && (!f.video || m.readyState >= 2);
        // object-fit: cover, top-aligned for screenshots
        let cx = 0, cy = 0, cw = sw, ch = sh;
        if (ok) { const k = Math.max(fw / sw, ih / sh); cw = fw / k; ch = ih / k; cx = (sw - cw) / 2; cy = f.video ? (sh - ch) / 2 : 0; }
        for (let s = 0; s < SL; s++) {
          const xs = x0 + (s + .5) * fw / SL, a = Math.atan(slope(xs)), y = yAt(xs);
          g.save(); g.translate(xs, y - 6); g.rotate(a);
          const dw = fw / SL + .8;
          if (ok) g.drawImage(m, cx + cw * s / SL, cy, cw / SL + .5, ch, -dw / 2, -ih / 2, dw, ih);
          else { g.fillStyle = "#26262b"; g.fillRect(-dw / 2, -ih / 2, dw, ih); }
          if (hover === i) { g.fillStyle = "rgba(255,90,31,.12)"; g.fillRect(-dw / 2, -ih / 2, dw, ih); }
          g.restore();
        }
        // caption on the band under the picture
        const lx = x0 + 6, a = Math.atan(slope(lx)), y = yAt(lx);
        g.save(); g.translate(lx, y - 6 + ih / 2 + 15); g.rotate(a);
        g.font = "500 11px 'Geist Mono', monospace"; g.fillStyle = "#cfc8ba"; g.textBaseline = "middle";
        g.fillText(`${String(i + 1).padStart(2, "0")} / ${f.label.toUpperCase()}`, 0, 0);
        g.fillStyle = "#ff5a1f"; g.fillText(f.brief ? "▶ OPEN" : "▶ LOOP", fw - 64, 0);
        g.restore();
      });
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - last); last = now;
      if (!paused.current && !reduce) off += dt * .055 * speed.current.v;
      draw();
    };
    raf = requestAnimationFrame(tick);

    // pointing: which frame is under the pointer, and is it inside the band?
    const hit = (e: PointerEvent | MouseEvent) => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (Math.abs(y - yAt(x)) > T() / 2) return -1;
      for (let i = 0; i < FRAMES.length; i++) { const x0 = frameX(i); if (x >= x0 && x <= x0 + FW()) return i; }
      return -1;
    };
    const move = (e: PointerEvent) => { hover = hit(e); cv.style.cursor = hover >= 0 && FRAMES[hover].brief ? "pointer" : "default"; };
    const leave = () => { hover = -1; };
    const click = (e: MouseEvent) => { const i = hit(e); if (i >= 0 && FRAMES[i].brief) openBrief(FRAMES[i].brief!); };
    cv.addEventListener("pointermove", move); cv.addEventListener("pointerleave", leave); cv.addEventListener("click", click);
    const onPause = (e: Event) => { const p = (e as CustomEvent<boolean>).detail; media.forEach((m) => { if (m instanceof HTMLVideoElement) { if (p) m.pause(); else m.play().catch(() => {}); } }); };
    window.addEventListener("motion", onPause);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.removeEventListener("pointermove", move); cv.removeEventListener("pointerleave", leave); cv.removeEventListener("click", click); window.removeEventListener("motion", onPause); media.forEach((m) => { if (m instanceof HTMLVideoElement) { m.pause(); m.removeAttribute("src"); m.load(); } }); };
  }, [canvasRef, speed, paused]);
}

/** The opening: a giant split name, one continuous strip of film carrying the work, and a lens that looks through the page at the years behind it. */
export function Hero({ ready, onMenu }: { ready: boolean; onMenu: () => void }) {
  const root = useRef<HTMLElement>(null);
  const face = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const paused = useRef(false);
  const speed = useRef({ v: 1 });
  useFilmStrip(canvas, speed, paused);

  useEffect(() => {
    const st = ScrollTrigger.create({ onUpdate: (s) => { speed.current.v = 1 + Math.min(6, Math.abs(s.getVelocity()) / 400); gsap.to(speed.current, { v: 1, duration: 1.2, overwrite: true }); } });
    const onPause = (e: Event) => { paused.current = (e as CustomEvent<boolean>).detail; };
    window.addEventListener("motion", onPause);
    return () => { st.kill(); window.removeEventListener("motion", onPause); };
  }, []);

  // the lens: a hole through the whole hero that follows the pointer (on touch screens it drifts on its own)
  useEffect(() => {
    const el = face.current, rg = ring.current, sec = root.current; if (!el || !rg || !sec) return;
    const p = { x: innerWidth * .62, y: innerHeight * .45, r: 0 };
    const apply = () => { el.style.setProperty("--lx", `${p.x}px`); el.style.setProperty("--ly", `${p.y}px`); el.style.setProperty("--lr", `${p.r}px`); rg.style.transform = `translate(${p.x - p.r}px, ${p.y - p.r}px)`; rg.style.width = rg.style.height = `${p.r * 2}px`; rg.style.opacity = p.r > 4 ? "1" : "0"; };
    const R = () => Math.max(120, Math.min(innerWidth, innerHeight) * .26);
    apply();
    if (prefersReduced()) return;
    if (!finePointer()) {
      gsap.to(p, { r: R() * .8, duration: 1.2, delay: 2, onUpdate: apply });
      const tw = gsap.to(p, { keyframes: [{ x: innerWidth * .25, y: innerHeight * .55 }, { x: innerWidth * .75, y: innerHeight * .4 }, { x: innerWidth * .5, y: innerHeight * .6 }], duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut", onUpdate: apply });
      return () => { tw.kill(); };
    }
    const qx = gsap.quickTo(p, "x", { duration: .45, ease: "power3.out", onUpdate: apply }), qy = gsap.quickTo(p, "y", { duration: .45, ease: "power3.out", onUpdate: apply });
    const move = (e: PointerEvent) => { const r = sec.getBoundingClientRect(); qx(e.clientX - r.left); qy(e.clientY - r.top); };
    const enter = () => gsap.to(p, { r: R(), duration: .7, ease: "back.out(1.6)", onUpdate: apply, overwrite: "auto" });
    const leave = () => gsap.to(p, { r: 0, duration: .45, ease: "power3.in", onUpdate: apply, overwrite: "auto" });
    sec.addEventListener("pointermove", move); sec.addEventListener("pointerenter", enter); sec.addEventListener("pointerleave", leave);
    return () => { sec.removeEventListener("pointermove", move); sec.removeEventListener("pointerenter", enter); sec.removeEventListener("pointerleave", leave); };
  }, []);

  useGSAP(() => {
    if (!ready || prefersReduced()) return;
    const a = SplitText.create(".h-first", { type: "chars", mask: "chars" }), b = SplitText.create(".h-last", { type: "chars", mask: "chars" });
    gsap.from([...a.chars, ...b.chars], { yPercent: 105, duration: 1.2, ease: "power4.out", stagger: .045 });
    gsap.from(".h-strip", { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out", delay: .25 });
    gsap.from(".h-in", { y: 22, opacity: 0, duration: .9, ease: "power3.out", stagger: .07, delay: .5 });
    const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
    gsap.to(".h-first", { xPercent: -12, ease: "none", scrollTrigger: st });
    gsap.to(".h-last", { xPercent: 10, ease: "none", scrollTrigger: st });
    gsap.to(".h-strip", { yPercent: -20, ease: "none", scrollTrigger: st });
    return () => { a.revert(); b.revert(); };
  }, { scope: root, dependencies: [ready] });

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToId(id); };
  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[680px] overflow-hidden bg-[#ece7dd] text-[var(--bone)]" aria-labelledby="h-name">
      {/* behind the page: the years, panning past (seen only through the lens) */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="hero-years absolute left-0 top-1/2 flex h-[58%] w-max " style={{ translate: "0 -42%" }}>
          {[0, 1].map((k) => (
            <div key={k} className="relative h-full" style={{ aspectRatio: "48 / 9" }}>
              <img src="/me/evolution.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
              {AGES.map(([y, a, x, top]) => (
                <p key={y} className="mono absolute text-center leading-tight text-[var(--ink)]" style={{ left: `${x}%`, top: `${top}%`, translate: "-50% calc(-100% - 10px)" }}>
                  <span className="display block text-[clamp(2rem,3.4vw,3.4rem)] leading-none">{y}</span>{a === "born" ? "born in Agartala" : `age ${a}`}
                </p>
              ))}
            </div>
          ))}
        </div>
        <style>{`.hero-years{animation:years 70s linear infinite}@keyframes years{to{translate:-50% -42%}}@media (prefers-reduced-motion: reduce){.hero-years{animation:none}}`}</style>
      </div>

      {/* the page itself, with a hole cut where the lens is */}
      <div ref={face} className="hero-face absolute inset-0 bg-[var(--field)]" style={{ ["--lx" as string]: "60%", ["--ly" as string]: "45%", ["--lr" as string]: "0px", WebkitMaskImage: "radial-gradient(circle at var(--lx) var(--ly), transparent calc(var(--lr) - 1px), #000 var(--lr))", maskImage: "radial-gradient(circle at var(--lx) var(--ly), transparent calc(var(--lr) - 1px), #000 var(--lr))" }}>
        <header className="h-in wrap relative z-30 flex items-center justify-between pt-[calc(var(--m)*.8)]">
          <a href="#top" className="text-[1.15rem] font-medium tracking-tight">Sayak Roy</a>
          <div className="flex items-center gap-3">
            <a href="#contact" onClick={go("contact")} className="pill hidden sm:inline-flex">Contact me <span aria-hidden>→</span></a>
            <button type="button" onClick={onMenu} className="group flex items-center gap-3" aria-label="Open the menu">
              <span className="hidden sm:inline">Menu</span>
              <span className="grid h-12 w-12 place-items-center rounded-full shadow-[inset_0_0_0_1.5px_currentColor] transition-colors group-hover:bg-[var(--bone)] group-hover:text-[var(--field)]"><span className="block h-[1.5px] w-5 bg-current shadow-[0_6px_0_currentColor]" /></span>
            </button>
          </div>
        </header>

        <h1 id="h-name" className="sr-only">Sayak Roy, AI Automation and Platform Engineer</h1>
        <p aria-hidden className="h-first display absolute left-[calc(var(--m)*.6)] top-[9%] z-0 text-[clamp(7rem,25vw,26rem)] text-[var(--bone)]">Sayak</p>

        <div className="h-strip absolute inset-x-0 top-[calc(42%-clamp(220px,29vh,330px))] z-10 h-[clamp(440px,58vh,660px)]">
          <canvas ref={canvas} className="block h-full w-full" aria-hidden />
          <ul className="sr-only">{FRAMES.filter((f) => f.brief).map((f) => <li key={f.label}><button type="button" onClick={() => openBrief(f.brief!)}>{f.label}: open the brief</button></li>)}</ul>
        </div>

        <p aria-hidden className="h-last display absolute top-[calc(34%+clamp(150px,20vw,250px))] md:top-auto md:bottom-[calc(var(--m)*1.6)] right-[calc(var(--m)*.6)] z-20 text-[clamp(7rem,25vw,26rem)] text-[var(--bone)]">Roy</p>

        <p className="h-in serif absolute right-[var(--m)] top-[12%] z-20 hidden text-right text-[clamp(2rem,1.2rem+2.4vw,3.8rem)] leading-[1.02] md:block">Automation by trade.<br />Builder by habit.</p>

        <div id="about" className="h-in absolute bottom-[calc(var(--m)*2.4)] left-[calc(var(--m)-16px)] z-30 max-w-[462px] rounded-[14px] bg-[rgba(35,55,198,.72)] p-4 shadow-[0_10px_40px_rgba(14,14,17,.18)] backdrop-blur-md [-webkit-backdrop-filter:blur(12px)]">
          <p className="text-[1.35rem] font-medium tracking-tight">AI Automation &amp; Platform Engineer</p>
          <p className="mt-2 text-[1.02rem] leading-snug text-[#dcd7f5] pretty">I'm Sayak, from Agartala. I turn the work people repeat every morning (router configs, site checks, bookkeeping) into software that does it for them.</p>
          <p className="mono mt-3 hidden text-[#c9cff5] [@media(min-height:760px)]:md:block">◎ Move your cursor to look behind the page · 2001 → 2025</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[1rem]">
            <a href={`mailto:${PROFILE.email}`} className="uline">Email Sayak ↗</a>
            <a href={PROFILE.resume} download className="uline">Résumé ↓</a>
            <a href="#film" onClick={go("film")} className="uline">Watch the film</a>
          </div>
        </div>
        <div className="h-in mono wrap absolute inset-x-0 bottom-[calc(var(--m)*.7)] z-30 flex justify-between pr-[calc(var(--m)+64px)] text-[#d5d0ee]">
          <span>Available for new work</span><span className="hidden sm:inline">Based in Agartala, India · Working remotely</span>
        </div>
      </div>

      {/* the lens rim: a thin edge and an inner shadow, so the hole reads as depth */}
      <div ref={ring} aria-hidden className="pointer-events-none absolute left-0 top-0 z-40 rounded-full opacity-0" style={{ boxShadow: "0 0 0 2px rgba(236,231,221,.85), 0 0 0 5px rgba(14,14,17,.25), inset 0 0 0 1px rgba(14,14,17,.4), inset 0 18px 40px rgba(14,14,17,.45), inset 0 -10px 30px rgba(255,255,255,.25)" }} />
    </section>
  );
}
