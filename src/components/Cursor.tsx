import { useEffect, useRef, useState } from "react";
import { finePointer, gsap, prefersReduced } from "@/lib/motion";

/** A ring that follows the pointer in the current era's accent, and names what a click will do. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (!finePointer() || prefersReduced() || !ring.current) return;
    const el = ring.current;
    const x = gsap.quickTo(el, "x", { duration: .35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: .35, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX); y(e.clientY);
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const l = t?.dataset.cursor ?? (t ? "" : "");
      setLabel(l);
      gsap.to(el, { scale: t ? (l ? 2.6 : 1.6) : 1, duration: .3, overwrite: "auto" });
    };
    window.addEventListener("pointermove", move);
    el.style.opacity = "1";
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90] -ml-4 -mt-4 grid h-8 w-8 place-items-center rounded-full opacity-0 mix-blend-difference" style={{ boxShadow: "inset 0 0 0 2px #fff" }}>
      <span className="text-[5px] font-medium uppercase tracking-wider text-white">{label}</span>
    </div>
  );
}
