import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReduced, ScrollTrigger } from "@/lib/motion";

export type GateKind = "split" | "iris" | "blinds" | "lamp" | "type";

/**
 * The passage from one part of the page to the next, scrubbed by scroll. Each part has its own:
 *  split  — steel doors slide shut, then part down the middle with light in the seam (Works)
 *  iris   — a cinema iris closes, a film-leader countdown runs, the iris opens (the film)
 *  blinds — office blinds drop over the page, then tilt open onto the building (Experience; no cover, the next part slides in underneath)
 *  lamp   — lights out, then a pool of lamplight spreads across the room (the Lab)
 *  type   — a giant HELLO rises and grows until you pass through its H (Contact)
 * Phase 1 holds the part you're leaving still while it recedes; phase 2 reveals what comes next.
 */
export function Gate({ id, kind, label, tone = "#0e0e11", from = "#0e0e11", door, children }: { id: string; kind: GateKind; label: string; tone?: string; from?: string; door?: string; children?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const hasCover = !!children;

  useGSAP(() => {
    const el = root.current; if (!el) return;
    const q = (s: string) => el.querySelectorAll(s);
    const prev = el.previousElementSibling as HTMLElement | null;
    const cover = el.querySelector(".g-cover");
    if (prefersReduced()) { gsap.set(q(".g-fx"), { autoAlpha: 0 }); if (cover) gsap.set(cover, { autoAlpha: 1 }); return; }
    // transforms on the old part exist only while this gate is running; above it they're cleared, so tall sections never carry a giant layer
    const clear = () => { if (prev) gsap.set(prev, { clearProps: "transform,visibility,opacity" }); };
    // while a gate runs, the page behind it takes the colour of the part being left, so a sub-pixel gap never shows black
    const paint = (on: boolean) => { document.documentElement.style.background = document.body.style.background = on ? from : ""; };
    // phase 1: the old part is held exactly where it is and pushed back a little (short parts only; Experience is six screens and HELLO needs it flat).
    // This is computed from the scroll position on every update rather than tweened, so a ScrollTrigger refresh can never re-record a stale value.
    const hold = kind === "type" ? .7 : .3;
    const holdPrev = (p: number, st: ScrollTrigger) => {
      if (!prev) return;
      if (p <= 0) { clear(); return; }
      const k = Math.min(p, hold) / hold;
      const flat = kind === "type" || prev.offsetHeight > innerHeight * 2.2;
      gsap.set(prev, { y: Math.min(p, hold) * (st.end - st.start), scale: flat ? 1 : 1 - .1 * k * k, transformOrigin: `50% ${prev.offsetHeight - innerHeight / 2}px`, autoAlpha: p > hold ? 0 : 1 });
    };
    // the cover is shown from the scroll position too, so it is always right in both directions (HELLO fades it in over .6–.68)
    const showCover = (p: number) => {
      if (!cover) return;
      const a = kind === "type" ? Math.min(1, Math.max(0, (p - .6) / .08)) : p >= hold ? 1 : 0;
      gsap.set(cover, { autoAlpha: a });
    };
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true,
      onUpdate: (st) => { holdPrev(st.progress, st); showCover(st.progress); }, onRefresh: (st) => { holdPrev(st.progress, st); showCover(st.progress); },
      onLeaveBack: () => { clear(); paint(false); }, onEnter: () => paint(true), onEnterBack: () => paint(true), onLeave: () => paint(false) } });
    tl.fromTo(q(".g-dim"), { opacity: 0 }, { opacity: kind === "type" ? .25 : .6, duration: hold, immediateRender: false }, 0).set(q(".g-dim"), { opacity: 0 }, hold + .01);
    const tag = q(".g-tag");
    tl.fromTo(tag, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .06 }, .24).to(tag, { autoAlpha: 0, duration: .05 }, .4);

    if (kind === "split") {
      const [L, R] = [q(".g-l"), q(".g-r")];
      tl.fromTo(L, { xPercent: -101 }, { xPercent: 0, duration: .3, ease: "power2.in" }, 0)
        .fromTo(R, { xPercent: 101 }, { xPercent: 0, duration: .3, ease: "power2.in" }, 0)
        .fromTo(q(".g-seam"), { opacity: 0, scaleX: .2 }, { opacity: 1, scaleX: 1, duration: .08 }, .36)
        .to(L, { xPercent: -101, duration: .38, ease: "power2.inOut" }, .42)
        .to(R, { xPercent: 101, duration: .38, ease: "power2.inOut" }, .42)
        .to(q(".g-seam"), { opacity: 0, scaleX: 6, duration: .25 }, .44);
    }
    if (kind === "iris") {
      const ir = q(".g-iris");
      tl.fromTo(ir, { "--r": "110vmax" }, { "--r": "0vmax", duration: .28, ease: "power2.in" }, 0)
        .fromTo(q(".g-leader"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .02 }, .28)
        .fromTo(q(".g-sweep"), { rotation: 0 }, { rotation: 1080, duration: .3, svgOrigin: "200 200" }, .3)
        .set(q(".g-n3"), { autoAlpha: 1 }, .3).set(q(".g-n3"), { autoAlpha: 0 }, .4)
        .set(q(".g-n2"), { autoAlpha: 1 }, .4).set(q(".g-n2"), { autoAlpha: 0 }, .5)
        .set(q(".g-n1"), { autoAlpha: 1 }, .5).set(q(".g-n1"), { autoAlpha: 0 }, .6)
        .to(q(".g-leader"), { autoAlpha: 0, duration: .02 }, .6)
        .to(ir, { "--r": "120vmax", duration: .26, ease: "power2.out" }, .6);
      if (cover) tl.fromTo(cover, { scale: 1.12 }, { scale: 1, duration: .3, ease: "power2.out" }, .6);
    }
    if (kind === "blinds") {
      const slats = q(".g-slat");
      tl.fromTo(slats, { scaleY: 0 }, { scaleY: 1, duration: .08, stagger: .016, ease: "power2.out" }, 0)
        .to(slats, { rotationX: 86, duration: .1, stagger: .005, ease: "power2.inOut" }, .84)
        .to(slats, { autoAlpha: 0, duration: .02 }, .98);
    }
    if (kind === "lamp") {
      const dark = q(".g-dark");
      tl.fromTo(dark, { opacity: 0, "--r": "0vmax" }, { opacity: 1, duration: .28, ease: "power2.in" }, 0)
        .to(dark, { "--r": "4vmax", duration: .03 }, .4).to(dark, { "--r": "2vmax", duration: .02 }, .43).to(dark, { "--r": "6vmax", duration: .03 }, .45)   // the bulb catches
        .to(dark, { "--r": "150vmax", duration: .35, ease: "power2.in" }, .5)
        .set(dark, { autoAlpha: 0 }, .86);
      if (cover) tl.fromTo(cover, { scale: 1.08 }, { scale: 1, duration: .4, ease: "power2.out" }, .45);
    }
    if (kind === "type") {
      const w = q(".g-word");
      tl.fromTo(w, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .22, ease: "power3.out" }, .04)
        // grow only until the H's stem fills the screen (a 70× word made a layer so large that Chrome dropped tiles elsewhere),
        // then the cobalt cover, the same blue, fades in over it
        .to(w, { scale: 12, duration: .38, ease: "power2.in" }, .3)
        .set(w, { autoAlpha: 0 }, .7);
      if (cover) tl.fromTo(cover.firstElementChild, { scale: .9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .12, ease: "power2.out", immediateRender: false }, .72);
    }
    return () => { clear(); paint(false); };
  }, { scope: root });

  const SLATS = 14;   // venetian blinds
  return (
    <div ref={root} id={`gate-${id}`} data-gate={hasCover ? id : undefined} className={`relative z-20 -mt-[100svh] ${hasCover ? "h-[300svh]" : "h-[230svh]"}`} style={{ pointerEvents: "none" }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div aria-hidden className="g-dim pointer-events-none absolute inset-0 bg-black opacity-0" />
        {hasCover && <div className="g-cover pointer-events-auto invisible absolute inset-0 origin-center will-change-transform" style={{ background: tone }}>{children}</div>}

        {kind === "split" && (
          <>
            <div aria-hidden className="g-seam g-fx pointer-events-none absolute inset-y-0 left-1/2 w-[18vw] -translate-x-1/2 opacity-0" style={{ background: "linear-gradient(90deg, transparent, rgba(160,190,255,.9), #fff, rgba(160,190,255,.9), transparent)", filter: "blur(18px)" }} />
            {[0, 1].map((k) => (
              <div key={k} aria-hidden className={`g-fx ${k ? "g-r right-0" : "g-l left-0"} absolute inset-y-0 w-1/2 will-change-transform`}
                style={{ backgroundImage: `url(${door})`, backgroundSize: "max(100vw, 177.78svh) auto", backgroundRepeat: "no-repeat", backgroundPosition: k ? "calc(max(100vw, 177.78svh) / -2) 50%" : "calc(50vw - max(100vw, 177.78svh) / 2) 50%", boxShadow: k ? "inset 10px 0 24px rgba(0,0,0,.45)" : "inset -10px 0 24px rgba(0,0,0,.45)" }} />
            ))}
          </>
        )}

        {kind === "iris" && (
          <>
            <div aria-hidden className="g-iris g-fx absolute inset-0" style={{ background: "#050505", ["--r" as string]: "110vmax", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent var(--r), #000 calc(var(--r) + 2px))", maskImage: "radial-gradient(circle at 50% 50%, transparent var(--r), #000 calc(var(--r) + 2px))" }} />
            <div aria-hidden className="g-leader g-fx invisible absolute inset-0 grid place-items-center" style={{ backgroundImage: "radial-gradient(ellipse at center, #3a3832, #121110 70%)" }}>
              <svg viewBox="0 0 400 400" className="h-[min(70svh,70vw)] w-[min(70svh,70vw)] text-[#d8d2c4]">
                <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="2" /><line x1="200" y1="0" x2="200" y2="400" stroke="currentColor" strokeWidth="2" />
                <g className="g-sweep"><path d="M200 200 L200 20 A180 180 0 0 1 380 200 Z" fill="currentColor" opacity=".18" /></g>
                {["3", "2", "1"].map((n) => <text key={n} className={`g-n${n} invisible`} x="200" y="262" textAnchor="middle" fontSize="190" fill="currentColor" style={{ fontFamily: "var(--font-display)" }}>{n}</text>)}
              </svg>
              <span className="mono absolute bottom-6 left-6 text-[#8d8a83]">HANDED ON · REEL 1 · 1908–2026</span>
            </div>
          </>
        )}

        {kind === "blinds" && (
          <div aria-hidden className="g-fx absolute inset-0 flex flex-col [perspective:1200px]">
            {Array.from({ length: SLATS }, (_, k) => (
              <div key={k} className="g-slat flex-1 origin-top" style={{ transform: "scaleY(0)", background: "linear-gradient(180deg,#f4f4f1 0%,#d9d9d4 55%,#b9b9b3 92%,#8e8e88 100%)", boxShadow: "0 2px 3px rgba(0,0,0,.18)" }} />
            ))}
          </div>
        )}

        {kind === "lamp" && (
          <div aria-hidden className="g-dark g-fx absolute inset-0 opacity-0" style={{ ["--r" as string]: "0vmax", background: "#030303", WebkitMaskImage: "radial-gradient(circle at 46% 42%, transparent var(--r), rgba(0,0,0,.6) calc(var(--r) * 1.15 + 1px), #000 calc(var(--r) * 1.6 + 2px))", maskImage: "radial-gradient(circle at 46% 42%, transparent var(--r), rgba(0,0,0,.6) calc(var(--r) * 1.15 + 1px), #000 calc(var(--r) * 1.6 + 2px))" }} />
        )}

        {kind === "type" && (
          <div aria-hidden className="g-fx pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
            <p className="g-word display invisible whitespace-nowrap text-[30vw] leading-[.8] text-[var(--field)]" style={{ transformOrigin: "9% 50%" }}>Hello</p>
          </div>
        )}

        <p className="g-tag g-fx mono pointer-events-none absolute bottom-[calc(var(--m)*1.2)] left-1/2 -translate-x-1/2 rounded-full bg-[var(--ink)]/80 px-4 py-2 text-[var(--bone)] opacity-0 backdrop-blur">{label} · keep scrolling</p>
      </div>
    </div>
  );
}
