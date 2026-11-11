import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { finePointer, gsap, prefersReduced } from "@/lib/motion";
import { ARCHIVE, INDEX_FEATURED, PLACED_COUNT } from "@/data/work";
import { byName, repoUrl, GH } from "@/data/projects";
import { openBrief } from "@/data/briefs";

/** A rolodex card: a link to the repository, or a plain card when the repository is private (its link would 404 for visitors). */
function Card({ href, className, style, children }: { href?: string; className: string; style: React.CSSProperties; children: React.ReactNode }) {
  return href ? <a href={href} target="_blank" rel="noreferrer" draggable={false} className={className} style={style}>{children}</a>
    : <div className={className} style={style}>{children}</div>;
}

/** A drum of index cards, one per remaining repository, turning on its own; scroll spins it faster, drag turns it by hand. */
function Rolodex() {
  const drum = useRef<HTMLDivElement>(null);
  const N = ARCHIVE.length, STEP = 360 / N, H = 92;
  const R = Math.round(H / 2 / Math.tan(Math.PI / N)) + 6;
  useEffect(() => {
    const el = drum.current; if (!el) return;
    if (prefersReduced()) return;
    const s = { a: 0, v: .12, drag: false, last: 0, boost: 0 };
    const tick = () => { if (!s.drag) s.a += s.v + s.boost; s.boost *= .92; el.style.transform = `translateZ(${-R}px) rotateX(${s.a}deg)`; };
    gsap.ticker.add(tick);
    const wheel = () => { s.boost = Math.min(4, s.boost + .6); };
    const down = (e: PointerEvent) => { s.drag = true; s.last = e.clientY; el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!s.drag) return; s.a += (e.clientY - s.last) * -.5; s.last = e.clientY; };
    const up = () => { s.drag = false; };
    window.addEventListener("wheel", wheel, { passive: true });
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    return () => { gsap.ticker.remove(tick); window.removeEventListener("wheel", wheel); el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); };
  }, [R]);
  return (
    <div className="relative h-[460px] select-none [perspective:1100px]" style={{ maskImage: "linear-gradient(transparent, #000 22%, #000 78%, transparent)", WebkitMaskImage: "linear-gradient(transparent, #000 22%, #000 78%, transparent)" }}>
      {/* the rod, behind the cards */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-[min(600px,96vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#9b968c] to-[#55524c] opacity-70" />
      <div className="absolute left-1/2 top-1/2 h-0 w-[min(520px,88vw)] -translate-x-1/2">
        <div ref={drum} className="relative cursor-grab [transform-style:preserve-3d] active:cursor-grabbing" style={{ transform: `translateZ(${-R}px)` }}>
          {ARCHIVE.map((n, i) => {
            const r = byName(n);
            return (
              <Card key={n} href={r.private ? undefined : repoUrl(r)}
                className="absolute left-0 flex w-full items-center gap-4 rounded-[10px] border border-[#cfc6b6] bg-[#f6f2ea] px-5 [backface-visibility:hidden] hover:border-[var(--field)]"
                style={{ height: H - 8, top: -(H - 8) / 2, transform: `rotateX(${-i * STEP}deg) translateZ(${R}px)`, boxShadow: "0 1px 0 #fff inset, 0 10px 20px rgba(14,14,17,.08)" }}>
                <span className="mono tnum text-[#8d8a83]">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[1.1rem] font-medium text-[var(--ink)]">{r.title}</span>
                  <span className="mono block truncate text-[#5b5850]">{n} · {r.lang ?? "Docs"} · {r.year}</span>
                </span>
                <span aria-hidden className={r.private ? "mono text-[#8d8a83]" : "text-[var(--field)]"}>{r.private ? "private · ask me" : "↗"}</span>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Four more projects as big rows: hover shows a picture that follows the cursor; click opens the brief. Everything else spins in the rolodex. */
export function Index() {
  const root = useRef<HTMLElement>(null);
  const pic = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(-1);

  useGSAP(() => {
    if (prefersReduced()) return;
    gsap.from(".ix-row", { y: 40, opacity: 0, stagger: .08, duration: .8, ease: "power3.out", scrollTrigger: { trigger: ".ix-list", start: "top 85%" } });
  }, { scope: root });

  // the picture trails the cursor and tilts with its speed
  useEffect(() => {
    const el = pic.current, sec = root.current; if (!el || !sec || !finePointer()) return;
    const qx = gsap.quickTo(el, "x", { duration: .5, ease: "power3.out" }), qy = gsap.quickTo(el, "y", { duration: .5, ease: "power3.out" }), qr = gsap.quickTo(el, "rotation", { duration: .6, ease: "power3.out" });
    let lx = 0;
    const move = (e: PointerEvent) => { qx(e.clientX + 24); qy(e.clientY - 120); qr(Math.max(-12, Math.min(12, (e.clientX - lx) * .6))); lx = e.clientX; };
    sec.addEventListener("pointermove", move);
    return () => sec.removeEventListener("pointermove", move);
  }, []);
  useEffect(() => { if (pic.current) gsap.to(pic.current, { scale: on >= 0 ? 1 : .6, autoAlpha: on >= 0 ? 1 : 0, duration: .35, ease: "power3.out" }); }, [on]);

  return (
    <section ref={root} id="index" className="relative bg-[var(--bone)] py-[clamp(80px,10vw,160px)] text-[var(--ink)]" aria-labelledby="ix-h">
      <div className="wrap flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mono text-[#5b5850]">[ Index ]</p>
          <h2 id="ix-h" className="mt-3 text-[clamp(2.6rem,1.6rem+3.4vw,5.6rem)] font-medium leading-[1] tracking-tight">Four more builds,<br />four different problems.</h2>
        </div>
        <p className="max-w-[34ch] text-[1.05rem] text-[#36342f]">Hover to preview, click for the brief. The rest of the {PLACED_COUNT} repositories turn in the archive below.</p>
      </div>

      <ol className="ix-list wrap mt-12">
        {INDEX_FEATURED.map((f, i) => {
          const r = byName(f.repos[0]);
          return (
            <li key={r.name} className="ix-row group relative border-t border-[#cfc6b6] last:border-b" onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(-1)}>
              <button type="button" onClick={() => openBrief(r.name)} onFocus={() => setOn(i)} onBlur={() => setOn(-1)} className="flex w-full items-baseline gap-5 py-[clamp(18px,2.4vw,34px)] text-left" data-cursor="brief">
                <span className="mono tnum w-8 shrink-0 text-[#8d8a83]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(2rem,1.2rem+3.2vw,4.6rem)] font-medium leading-[1] tracking-tight transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-3">{r.title}</span>
                <span className="ml-auto hidden text-right text-[#5b5850] md:block">{f.tags}</span>
              </button>
              <span className="absolute right-0 top-2 flex gap-3">
                {f.repos.map((n) => byName(n).private ? <span key={n} className="mono text-[#a8a398]" title={`${n} is a private repository`}>private repo</span> : <a key={n} href={repoUrl(byName(n))} target="_blank" rel="noreferrer" className="mono text-[#8d8a83] hover:text-[var(--field)]" title={n}>code ↗</a>)}
              </span>
            </li>
          );
        })}
      </ol>

      {/* the trailing picture */}
      <div ref={pic} aria-hidden className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[200px] w-[280px] overflow-hidden rounded-[6px] opacity-0 shadow-[0_30px_60px_rgba(14,14,17,.25)] md:block">
        {INDEX_FEATURED.map((f, i) => <img key={f.pic} src={f.pic} alt="" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300" style={{ opacity: on === i ? 1 : 0 }} />)}
      </div>

      <div className="wrap mt-[clamp(70px,9vw,140px)] grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <p className="mono text-[#5b5850]">[ The archive ]</p>
          <p className="mt-3 text-[clamp(2.2rem,1.4rem+2.6vw,4.4rem)] font-medium leading-[1] tracking-tight"><span className="display text-[var(--field)]">+{ARCHIVE.length}</span> more,<br />filed on GitHub.</p>
          <p className="mt-5 max-w-[42ch] text-[1.05rem] leading-relaxed text-[#36342f]">Coursework, experiments, scrapers, a DBMS, early portfolios. Spin the rolodex (drag it, or just scroll) and pull any card to open its repository.</p>
          <a href={`${GH}?tab=repositories`} target="_blank" rel="noreferrer" className="pill pill-solid mt-8 !bg-[var(--ink)] !text-[var(--bone)] hover:!bg-[var(--field)]">All repositories on GitHub ↗</a>
        </div>
        <Rolodex />
      </div>
    </section>
  );
}
