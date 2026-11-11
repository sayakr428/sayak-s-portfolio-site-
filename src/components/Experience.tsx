import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { finePointer, gsap, isPortrait, pauseScroll, prefersReduced } from "@/lib/motion";
import { HOPS, type Hop } from "@/data/profile";

// one room per stop, in % of the building image; the camera visits them in career order
const ROOMS: { hop: Hop; label: string; x: number; y: number; w: number; h: number; close: string; site: string }[] = [
  { hop: HOPS[1], label: "University lab", x: 17.1, y: 54.1, w: 31.9, h: 31.9, close: "/experience/room-srm.jpg", site: "https://www.srmist.edu.in/" },
  { hop: HOPS[2], label: "Consulting floor", x: 50.9, y: 54.1, w: 32, h: 31.9, close: "/experience/room-accenture.jpg", site: "https://www.accenture.com/in-en" },
  { hop: HOPS[3], label: "Network operations centre", x: 17.1, y: 18.4, w: 31.9, h: 32.5, close: "/experience/room-tata.jpg", site: "https://www.tatacommunications.com/" },
  { hop: HOPS[4], label: "Traffic operations room", x: 50.9, y: 18.4, w: 32, h: 32.5, close: "/experience/room-derq.jpg", site: "https://derq.com/" },
];
const IMG = "/experience/building.jpg";
const host = (u: string) => new URL(u).hostname.replace(/^www\./, "");

/** A realistic cutaway of one building with a room for every job. Scroll moves the camera room to room; hover lights a room, click walks in. */
export function Experience() {
  const root = useRef<HTMLElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(-1);
  const [hover, setHover] = useState(-1);
  const [open, setOpen] = useState(-1);

  useGSAP(() => {
    const cam = root.current?.querySelector<HTMLElement>(".ex-cam"); if (!cam) return;
    const at = (r?: (typeof ROOMS)[number]) => {
      if (!r) return { scale: 1, xPercent: 0, yPercent: 0 };
      // on portrait screens the whole building is shown, so the camera goes further in to fill the width with a room
      const s = isPortrait() ? 100 / r.w : Math.min(1.9, 100 / Math.max(r.w, r.h * 1.05));
      return { scale: s, xPercent: (50 - (r.x + r.w / 2)) * s, yPercent: (50 - (r.y + r.h / 2)) * s };
    };
    if (prefersReduced()) return;
    // the caption follows the camera itself (not the scrollbar), so it names the room actually on screen
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 1 }, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: .8 },
      onUpdate: () => { const k = (tl.time() - 1.1) / 1.5; setCur(k < 0 || k >= ROOMS.length ? -1 : Math.floor(k)); } });
    tl.fromTo(cam, { ...at(), scale: 1.08 }, { ...at(), duration: .6 });
    ROOMS.forEach((r) => tl.to(cam, { ...at(r) }).to(cam, { ...at(r), duration: .5 }));
    tl.to(cam, { ...at() });
  }, { scope: root });

  // the building leans a few degrees toward the pointer
  useEffect(() => {
    const el = tilt.current; if (!el || !finePointer() || prefersReduced()) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: .8, ease: "power3.out" }), ry = gsap.quickTo(el, "rotationY", { duration: .8, ease: "power3.out" });
    const move = (e: PointerEvent) => { rx(-(e.clientY / innerHeight - .5) * 6); ry((e.clientX / innerWidth - .5) * 8); };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    if (open < 0) return;
    pauseScroll(true);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(-1);
    window.addEventListener("keydown", esc);
    return () => { pauseScroll(false); window.removeEventListener("keydown", esc); };
  }, [open]);

  const lit = hover >= 0 ? hover : cur;
  const r = lit >= 0 ? ROOMS[lit] : null;
  const room = open >= 0 ? ROOMS[open] : null;
  return (
    <section ref={root} id="experience" data-zoom={cur >= 0} className="relative -mt-[100svh] bg-[#e4e4e2] text-[var(--ink)]" style={{ height: prefersReduced() ? "auto" : `${(ROOMS.length + 2) * 100}svh` }} aria-labelledby="ex-h">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 [perspective:1600px]">
          <div className="ex-bld absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div ref={tilt} className="relative w-full [transform-style:preserve-3d]" style={{ aspectRatio: "16 / 9" }}>
            <div className="ex-cam absolute inset-0 origin-center will-change-transform">
              <img src={IMG} alt="A cutaway of one building with four rooms: a university lab, a consulting floor, a network operations centre and a traffic operations room" className="absolute inset-0 h-full w-full object-cover" />
              <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity: r ? 1 : 0 }}>
                <defs><mask id="ex-m"><rect width="100" height="100" fill="#fff" />{r && <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="#000" />}</mask></defs>
                <rect width="100" height="100" fill="rgba(20,20,24,.55)" mask="url(#ex-m)" />
              </svg>
              {ROOMS.map((x, i) => (
                <button key={x.label} type="button" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)} onFocus={() => setHover(i)} onBlur={() => setHover(-1)} onClick={() => setOpen(i)}
                  className="group absolute outline-none" data-cursor="enter" aria-label={`${x.hop.org}, ${x.hop.span}: walk into the ${x.label}`}
                  style={{ left: `${x.x}%`, top: `${x.y}%`, width: `${x.w}%`, height: `${x.h}%` }}>
                  <span aria-hidden className="absolute inset-0 transition-[box-shadow] duration-300" style={{ boxShadow: lit === i ? "inset 0 0 0 2px var(--signal)" : "none" }} />
                  <span className="ex-tag mono absolute left-3 top-3 bg-[var(--ink)]/85 px-2 py-1 text-[var(--bone)] transition-[background-color,opacity] group-hover:bg-[var(--signal)]">{x.hop.span.split("–")[0].trim()} · {x.hop.org}</span>
                </button>
              ))}
            </div>
          </div>
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#e4e4e2] to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#e4e4e2] via-[#e4e4e2]/75 to-transparent" />
        <div className="wrap pointer-events-none absolute inset-x-0 top-[calc(var(--m)*1.2)] flex items-start justify-between gap-6">
          <h2 id="ex-h" className="display text-[clamp(3.4rem,8vw,8rem)]">Experience</h2>
          <p className="mono tnum pt-3 text-right text-[#5b5850]">{cur >= 0 ? <><span className="text-[var(--ink)]">0{cur + 1}</span> / 0{ROOMS.length}</> : "Scroll to walk the building"}</p>
        </div>
        <div className="wrap pointer-events-none absolute inset-x-0 bottom-[calc(var(--m)*1.2)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end" aria-live="polite">
          {r ? (
            <>
              <div key={r.hop.org}>
                <p className="mono text-[#c2410c]">{r.hop.span} · {r.hop.place}</p>
                <p className="display mt-2 text-[clamp(2.6rem,5vw,5rem)]">{r.hop.org}</p>
                <p className="serif mt-1 text-[clamp(1.3rem,1rem+.8vw,1.9rem)] leading-tight">{r.hop.role}</p>
              </div>
              <div className="md:justify-self-end md:text-right">
                <p className="max-w-[46ch] text-[1.02rem] leading-snug text-[#36342f] md:ml-auto">{r.hop.points[r.hop.points.length > 1 ? r.hop.points.length - 1 : 0]}</p>
                <p className="mono mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[#5b5850] md:justify-end"><span>Click the room to walk in →</span><a href={r.site} target="_blank" rel="noreferrer" className="uline pointer-events-auto text-[var(--ink)]">Visit {host(r.site)} ↗</a></p>
              </div>
            </>
          ) : (
            <p className="serif max-w-[30ch] text-[clamp(1.4rem,1rem+1vw,2rem)] leading-tight">One building, four rooms: every place I've worked, in the order I walked through them.</p>
          )}
        </div>
      </div>

      {room && (
        <div className="fixed inset-0 z-[110] overflow-y-auto bg-[var(--ink)] text-[var(--bone)]" role="dialog" aria-modal="true" aria-label={`${room.hop.org}, inside the ${room.label}`} data-lenis-prevent>
          <div className="relative h-[62svh] overflow-hidden">
            <img src={room.close} onError={(e) => { e.currentTarget.src = IMG; e.currentTarget.style.objectPosition = `${room.x + room.w / 2}% ${room.y + room.h / 2}%`; e.currentTarget.style.transform = "scale(2)"; }} alt={`Inside the ${room.label}`} className="h-full w-full object-cover" style={{ animation: "exin 1.2s var(--ease-out) both" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] to-transparent" />
            <button type="button" onClick={() => setOpen(-1)} className="group absolute right-[var(--m)] top-[var(--m)] flex items-center gap-3" aria-label="Step back out">
              <span>Step back</span><span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--bone)] text-[var(--ink)] transition-transform duration-300 group-hover:rotate-90">✕</span>
            </button>
          </div>
          <div className="wrap -mt-28 relative grid gap-10 pb-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div>
              <p className="mono text-[var(--signal)]">{room.hop.span} · {room.hop.place}{room.hop.ms !== "now" && ` · ${room.hop.ms}`}</p>
              <h3 className="display mt-3 text-[clamp(3.6rem,8vw,8rem)]">{room.hop.org}</h3>
              <p className="serif mt-2 text-[clamp(1.5rem,1rem+1.2vw,2.4rem)] leading-tight">{room.hop.role}</p>
              <a href={room.site} target="_blank" rel="noreferrer" className="pill pill-solid mt-6">Visit {host(room.site)} ↗</a>
            </div>
            <ol className="space-y-4 md:pt-24">
              {room.hop.points.map((p, i) => <li key={p} className="grid grid-cols-[2.4rem_1fr] border-t border-white/15 pt-4 text-[1.05rem] leading-snug text-[#d6d1c7]"><span className="mono tnum text-[var(--muted)]">{String(i + 1).padStart(2, "0")}</span>{p}</li>)}
            </ol>
          </div>
          <div className="wrap flex flex-wrap items-center gap-3 pb-16">
            <button type="button" onClick={() => setOpen((open + ROOMS.length - 1) % ROOMS.length)} className="pill">← Previous room</button>
            <button type="button" onClick={() => setOpen((open + 1) % ROOMS.length)} className="pill">Next room →</button>
            <span className="mono ml-2 text-[var(--muted)]">Websites:</span>
            {ROOMS.map((x) => <a key={x.label} href={x.site} target="_blank" rel="noreferrer" className="uline text-[var(--bone)]">{x.hop.org} ↗</a>)}
          </div>
        </div>
      )}
      <style>{`.ex-bld{width:max(100vw,177.78svh)}@media (max-aspect-ratio: 1/1){.ex-bld{width:100vw}.ex-tag{font-size:8px;left:4px;top:4px;padding:1px 4px;white-space:nowrap}[data-zoom=true] .ex-tag{opacity:0}}@keyframes exin{from{transform:scale(1.25);filter:brightness(.5)}to{transform:scale(1);filter:none}}`}</style>
    </section>
  );
}
