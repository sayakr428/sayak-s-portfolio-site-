import { useEffect, useRef, useState } from "react";
import { gsap, pauseScroll, prefersReduced } from "@/lib/motion";
import { briefFor, type Brief } from "@/data/briefs";

/** A bone sheet that slides in from the right with the brief for whichever project was clicked. */
export function BriefDialog() {
  const dlg = useRef<HTMLDialogElement>(null);
  const [b, setB] = useState<Brief | null>(null);

  useEffect(() => {
    const on = (e: Event) => setB(briefFor((e as CustomEvent<string>).detail));
    window.addEventListener("brief", on);
    return () => window.removeEventListener("brief", on);
  }, []);
  useEffect(() => {
    const d = dlg.current; if (!d || !b) return;
    if (!d.open) { d.showModal(); pauseScroll(true); }
    if (!prefersReduced()) {
      gsap.fromTo(d.querySelector(".sheet"), { xPercent: 100 }, { xPercent: 0, duration: .75, ease: "expo.out" });
      gsap.fromTo(d.querySelectorAll(".bf-in"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .05, duration: .6, ease: "power3.out", delay: .2 });
    }
    d.querySelector(".sheet")?.scrollTo(0, 0);
  }, [b]);
  const close = () => {
    const d = dlg.current; if (!d) return;
    if (prefersReduced()) return d.close();
    gsap.to(d.querySelector(".sheet"), { xPercent: 100, duration: .45, ease: "power3.in", onComplete: () => d.close() });
  };

  return (
    <dialog ref={dlg} onClose={() => { pauseScroll(false); setB(null); }} onCancel={(e) => { e.preventDefault(); close(); }} onClick={(e) => { if (e.target === dlg.current) close(); }}
      className="m-0 ml-auto h-[100svh] max-h-none w-[min(860px,100vw)] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-[rgba(14,14,17,.7)]" aria-label={b ? `${b.title}, project brief` : "Project brief"}>
      {b && (
        <article className="sheet h-full overflow-y-auto overscroll-contain bg-[var(--bone)] text-[var(--ink)]" data-lenis-prevent>
          <div className="sticky top-0 z-10 flex items-center justify-between bg-[var(--bone)] px-[clamp(20px,4vw,56px)] py-4">
            <p className="mono text-[#5b5850]">Project brief</p>
            <button type="button" onClick={close} className="group flex items-center gap-3" aria-label="Close the brief">
              <span>Close</span><span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--ink)] text-[var(--bone)] transition-transform duration-300 group-hover:rotate-90">✕</span>
            </button>
          </div>
          <div className="px-[clamp(20px,4vw,56px)] pb-16">
            <p className="bf-in mono text-[var(--field)]">{b.kind}</p>
            <h2 className="bf-in display mt-3 text-[clamp(3.4rem,2rem+5vw,7rem)]">{b.title}</h2>
            <p className="bf-in serif mt-5 text-[clamp(1.5rem,1.1rem+1vw,2.2rem)] leading-[1.15] pretty">{b.what}</p>
            {b.image && <img src={b.image} alt="" className="bf-in mt-8 aspect-[16/9] w-full object-cover object-top" />}
            {b.problem && <section className="bf-in mt-10 grid gap-3 border-t border-[var(--ink)] pt-4 md:grid-cols-[10rem_1fr]"><h3 className="mono text-[#5b5850]">The problem</h3><p className="text-[1.08rem] leading-relaxed pretty">{b.problem}</p></section>}
            {b.built.length > 0 && (
              <section className="bf-in mt-10 grid gap-3 border-t border-[var(--ink)] pt-4 md:grid-cols-[10rem_1fr]">
                <h3 className="mono text-[#5b5850]">What I built</h3>
                <ol className="space-y-4">{b.built.map((x, i) => <li key={x} className="grid grid-cols-[2rem_1fr] text-[1.05rem] leading-snug pretty"><span className="mono tnum pt-[2px] text-[var(--field)]">{String(i + 1).padStart(2, "0")}</span><span>{x}</span></li>)}</ol>
              </section>
            )}
            <section className="bf-in mt-10 grid gap-3 border-t border-[var(--ink)] pt-4 md:grid-cols-[10rem_1fr]">
              <h3 className="mono text-[#5b5850]">Built with</h3>
              <p className="text-[1.05rem] leading-relaxed">{b.stack.join(" · ")}</p>
            </section>
            {b.note && <p className="bf-in mt-8 text-[.98rem] italic text-[#5b5850]">{b.note}</p>}
            {b.links.length > 0 && <div className="bf-in mt-10 flex flex-wrap gap-3">{b.links.map((l, i) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={`pill ${i === 0 ? "pill-solid !bg-[var(--ink)] !text-[var(--bone)] hover:!bg-[var(--signal)]" : ""}`} data-cursor="visit">{l.label} ↗</a>)}</div>}
          </div>
        </article>
      )}
    </dialog>
  );
}
