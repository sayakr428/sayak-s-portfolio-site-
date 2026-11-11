import { useEffect, useRef, useState } from "react";
import { finePointer, gsap, isLite, prefersReduced } from "@/lib/motion";
import { AutoVideo } from "@/components/AutoVideo";
import { BUILDS, openProject } from "@/data/showcase";
import { DerqDiagram } from "@/components/DerqDiagram";

/**
 * WORKS in giant plaster letters, with a device standing in each one. Every screen plays the real project.
 * Hover lifts a device and dims the rest; click opens it, usable, in the project viewer.
 */
export function WorksScene() {
  const stage = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(-1);
  const [lite] = useState(isLite);
  // the room leans a little toward the pointer
  useEffect(() => {
    const el = stage.current; if (!el || !finePointer() || prefersReduced()) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 1, ease: "power3.out" }), ry = gsap.quickTo(el, "rotationY", { duration: 1, ease: "power3.out" });
    const mv = (e: PointerEvent) => { rx(-(e.clientY / innerHeight - .5) * 3); ry((e.clientX / innerWidth - .5) * 4); };
    window.addEventListener("pointermove", mv);
    return () => window.removeEventListener("pointermove", mv);
  }, []);

  return (
    <section id="work" aria-labelledby="wk-h" className="relative h-full w-full overflow-hidden bg-[linear-gradient(#c8b098,#e3d6c5)] text-[var(--ink)]">
      <div className="absolute inset-0 [perspective:1800px]">
        {/* centred by translate (a grid would push an over-wide child to one side); on portrait screens the whole scene shows, all six devices in view */}
        <div className="wk-pan absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div ref={stage} className="relative w-full [transform-style:preserve-3d]" style={{ aspectRatio: "2752 / 1536" }}>
          <img src="/work/works.jpg" alt="The word WORKS in giant hollow plaster letters, with a tablet, two phones, a laptop, a monitor and a portrait tablet standing in front of them" className="absolute inset-0 h-full w-full" />
          {BUILDS.map((b, i) => (
            <div key={b.id} aria-hidden className="absolute overflow-hidden bg-[#111216] transition-[transform,filter] duration-500 ease-[var(--ease-out)]"
              style={{ left: `${b.screen.x}%`, top: `${b.screen.y}%`, width: `${b.screen.w}%`, height: `${b.screen.h}%`, transform: on === i ? "translateY(-4%) scale(1.04)" : "none", filter: on >= 0 && on !== i ? "brightness(.55)" : "none" }}>
              {b.media.video ? (lite
                  // in lite mode the screens are a few dozen pixels wide: a still reads the same and costs nothing
                  ? <img src={b.media.poster} alt="" className="h-full w-full object-cover" />
                  : <AutoVideo src={b.media.video} poster={b.media.poster} className="h-full w-full object-cover" />)
                : b.media.img ? <img src={b.media.img} alt="" className="h-full w-full object-cover object-top" />
                : <div className="h-full w-full text-[5px]"><DerqDiagram /></div>}
            </div>
          ))}
          {/* dim everything except the hovered column */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#2b2118] transition-opacity duration-500" style={{ opacity: on >= 0 ? .28 : 0, clipPath: on >= 0 ? `polygon(evenodd,0 0,100% 0,100% 100%,0 100%,0 0,${BUILDS[on].hit.x}% ${BUILDS[on].hit.y}%,${BUILDS[on].hit.x}% ${BUILDS[on].hit.y + BUILDS[on].hit.h}%,${BUILDS[on].hit.x + BUILDS[on].hit.w}% ${BUILDS[on].hit.y + BUILDS[on].hit.h}%,${BUILDS[on].hit.x + BUILDS[on].hit.w}% ${BUILDS[on].hit.y}%,${BUILDS[on].hit.x}% ${BUILDS[on].hit.y}%)` : "none" }} />
          {BUILDS.map((b, i) => (
            <button key={b.id} type="button" onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(-1)} onFocus={() => setOn(i)} onBlur={() => setOn(-1)} onClick={() => openProject(b.id)}
              className="absolute outline-none" data-cursor="open" aria-label={`${b.name}, ${b.kind}: open it`}
              style={{ left: `${b.hit.x}%`, top: `${b.hit.y}%`, width: `${b.hit.w}%`, height: `${b.hit.h}%` }} />
          ))}
        </div>
        </div>
      </div>
      <style>{`.wk-pan{width:max(100vw,179.2svh)}@media (max-aspect-ratio: 1/1){.wk-pan{width:112vw;-webkit-mask-image:linear-gradient(transparent,#000 14%,#000 86%,transparent);mask-image:linear-gradient(transparent,#000 14%,#000 86%,transparent)}}`}</style>

      <div className="wrap pointer-events-none absolute inset-x-0 top-[calc(var(--m)*1.1)] flex flex-wrap items-start gap-x-8 gap-y-3">
        <h2 id="wk-h" className="display text-[clamp(3.6rem,7vw,7.5rem)]">Works.</h2>
        <p className="serif border-l border-[var(--ink)]/40 pl-6 text-[clamp(1.6rem,1rem+1.8vw,3.2rem)] leading-[1.02]">Six things I built.<br />Click a screen to use one.</p>
      </div>

      <ol className="wrap absolute inset-x-0 bottom-[calc(var(--m)*.9)] grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-6">
        {BUILDS.map((b, i) => (
          <li key={b.id}>
            <button type="button" onClick={() => openProject(b.id)} onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(-1)}
              className={`group flex w-full items-baseline gap-2 border-b py-2 text-left transition-colors ${on === i ? "border-[var(--ink)]" : "border-[var(--ink)]/25"}`}>
              <span className="mono text-[#6b5c4c]">0{i + 1}</span>
              <span className="font-medium">{b.name}</span>
              <span aria-hidden className="ml-auto transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
