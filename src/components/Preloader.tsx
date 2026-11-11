import { useEffect, useRef, useState } from "react";
import { gsap, prefersReduced } from "@/lib/motion";

/** A cobalt sheet that counts to 100 while the first assets arrive, then lifts away. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = root.current; if (!el) return;
    if (prefersReduced()) { onDone(); return; }
    const c = { v: 0 };
    let loaded = document.readyState === "complete";
    const onLoad = () => { loaded = true; };
    window.addEventListener("load", onLoad);
    const tl = gsap.timeline();
    tl.to(c, { v: 86, duration: 1.4, ease: "power2.inOut", onUpdate: () => setN(Math.round(c.v)) })
      .add(() => { if (!loaded) tl.pause(); const t = setInterval(() => { if (loaded || performance.now() > 6000) { clearInterval(t); tl.play(); } }, 80); })
      .to(c, { v: 100, duration: .45, ease: "power1.out", onUpdate: () => setN(Math.round(c.v)) })
      .to(el.querySelector(".pl-count"), { yPercent: -110, duration: .5, ease: "power3.in" }, "+=.1")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: .9, ease: "expo.inOut" }, "-=.15")
      .add(onDone, "-=.55");
    return () => { tl.kill(); window.removeEventListener("load", onLoad); };
  }, [onDone]);
  return (
    <div ref={root} className="fixed inset-0 z-[150] flex flex-col justify-between bg-[var(--field)] p-[var(--m)] text-[var(--bone)]" style={{ clipPath: "inset(0 0 0% 0)" }} role="status" aria-label="Loading">
      <div className="mono flex justify-between"><span>Sayak Roy — Portfolio</span><span>Agartala · IST</span></div>
      <div className="flex items-end justify-between gap-6">
        <p className="serif max-w-[16ch] text-[clamp(1.6rem,1rem+2vw,2.6rem)] leading-tight">Opening the portfolio</p>
        <div className="overflow-hidden"><p className="pl-count display tnum text-[clamp(6rem,22vw,20rem)]">{String(n).padStart(2, "0")}</p></div>
      </div>
    </div>
  );
}
