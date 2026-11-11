import { useEffect, useRef } from "react";
import { gsap, pauseScroll, prefersReduced, scrollToId } from "@/lib/motion";
import { PROFILE } from "@/data/profile";

const LINKS = [
  { id: "work", label: "Work", note: "Six projects, start to finish" },
  { id: "film", label: "The film", note: "Handed On · 59 seconds" },
  { id: "experience", label: "Experience", note: "Four rooms, 2019 to now" },
  { id: "lab", label: "The lab", note: "Experiments after hours" },
  { id: "index", label: "Index", note: "Everything else on GitHub" },
  { id: "contact", label: "Contact", note: "Say hello" },
];

/** Full-screen menu: big words that slide in, each with a one-line note. */
export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current; if (!el) return;
    pauseScroll(open);
    if (open) {
      el.style.visibility = "visible";
      if (!prefersReduced()) {
        gsap.fromTo(el, { clipPath: "circle(0% at calc(100% - 60px) 50px)" }, { clipPath: "circle(150% at calc(100% - 60px) 50px)", duration: .9, ease: "expo.inOut" });
        gsap.fromTo(el.querySelectorAll(".mn-l"), { yPercent: 110 }, { yPercent: 0, stagger: .05, duration: .8, ease: "power4.out", delay: .25 });
      } else el.style.clipPath = "none";
      el.querySelector<HTMLButtonElement>("button")?.focus();
      const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", esc);
      return () => window.removeEventListener("keydown", esc);
    }
    if (el.style.visibility === "visible") gsap.to(el, { clipPath: "circle(0% at calc(100% - 60px) 50px)", duration: .6, ease: "expo.in", onComplete: () => { el.style.visibility = "hidden"; } });
  }, [open, onClose]);
  const go = (id: string) => { onClose(); setTimeout(() => scrollToId(id), 350); };
  return (
    <div ref={root} className="fixed inset-0 z-[120] flex flex-col bg-[var(--ink)] text-[var(--bone)]" style={{ visibility: "hidden" }} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
      <div className="wrap flex items-center justify-between pt-[calc(var(--m)*.8)]">
        <span className="text-[1.15rem] font-medium">Sayak Roy</span>
        <button type="button" onClick={onClose} className="group flex items-center gap-3" aria-label="Close the menu">
          <span>Close</span>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--bone)] text-[var(--ink)] transition-transform duration-300 group-hover:rotate-90">✕</span>
        </button>
      </div>
      <nav className="wrap mt-auto pb-6" aria-label="Sections">
        <ol>
          {LINKS.map((l, i) => (
            <li key={l.id} className="border-b border-white/10">
              <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); go(l.id); }} className="group flex items-baseline gap-5 overflow-hidden py-1">
                <span className="mono w-8 text-[var(--muted)]">0{i + 1}</span>
                <span className="mn-l display block text-[clamp(2.8rem,8vw,7.5rem)] transition-[color,transform] duration-500 group-hover:translate-x-4 group-hover:text-[var(--signal)]">{l.label}</span>
                <span className="ml-auto hidden text-right text-[var(--muted)] transition-colors group-hover:text-[var(--bone)] md:block">{l.note}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="wrap mono flex flex-wrap justify-between gap-3 pb-[calc(var(--m)*.8)] text-[var(--muted)]">
        <a href={`mailto:${PROFILE.email}`} className="uline text-[var(--bone)]">{PROFILE.email}</a>
        <span className="flex gap-5"><a className="uline" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a className="uline" href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a><a className="uline" href={PROFILE.resume} download>Résumé</a></span>
      </div>
    </div>
  );
}
