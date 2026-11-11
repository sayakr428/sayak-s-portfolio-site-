import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let lenis: Lenis | null = null;

/** Lenis on GSAP's ticker, so ScrollTrigger and smooth scroll share one clock. */
export function startSmoothScroll() {
  if (prefersReduced() || lenis) return () => {};
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  // adopt jumps Lenis didn't make (scrollbar drag, find-in-page, scripts) instead of pulling back
  const onForeign = () => {
    if (!lenis || lenis.isScrolling !== "smooth") return;
    if (Math.abs(window.scrollY - lenis.animatedScroll) > 120) lenis.scrollTo(window.scrollY, { immediate: true, force: true });
  };
  window.addEventListener("scroll", onForeign, { passive: true });
  return () => {
    window.removeEventListener("scroll", onForeign);
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToId(id: string) {
  // a section that lives behind a gate is reached by scrolling to the point where its doors stand open
  const el = document.querySelector<HTMLElement>(`[data-gate="${id}"]`) ?? document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + (el.dataset.gate ? (el.offsetHeight - window.innerHeight) * .86 : 0);
  if (lenis) lenis.scrollTo(top, { duration: 1.8 });
  else window.scrollTo({ top, behavior: prefersReduced() ? "auto" : "smooth" });
}
export const pauseScroll = (p: boolean) => (p ? lenis?.stop() : lenis?.start());

/** The era the reader is in: chapters announce it, the year rail and cursor listen. */
export type EraSignal = { year: number; ink: string; accent: string; bg: string };
export const emitEra = (s: EraSignal) => window.dispatchEvent(new CustomEvent<EraSignal>("era", { detail: s }));

/**
 * Scroll-scrubbed video, per scroll-craft: never write currentTime straight from scroll; lerp toward the
 * target each frame with a small deadband so seeks coalesce. Returns setTarget(progress 0..1) and a stop().
 */
export function scrubVideo(v: HTMLVideoElement) {
  let target = 0, cur = 0, raf = 0, running = false;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const d = v.duration;
    if (!d || !isFinite(d)) return;
    const goal = target * (d - 0.05);
    cur += (goal - cur) * 0.18;
    if (Math.abs(v.currentTime - cur) > 0.012 && !v.seeking) v.currentTime = cur;
  };
  return {
    set: (p: number) => { target = Math.min(1, Math.max(0, p)); if (!running) { running = true; loop(); } },
    stop: () => { cancelAnimationFrame(raf); running = false; },
  };
}

export { gsap, ScrollTrigger, SplitText };
