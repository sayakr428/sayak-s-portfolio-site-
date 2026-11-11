/** The film's year counter: one typeface, digits roll only when they change. value may be fractional mid-roll. */
export function Odometer({ value, size, color }: { value: number; size: string; color?: string }) {
  const base = Math.floor(value), f = value - base;
  const A = String(base).padStart(4, "0"), B = String(base + 1).padStart(4, "0");
  return (
    <span className="inline-flex font-[Cinzel] tnum leading-none" style={{ fontSize: size, color, height: "1em" }} aria-label={String(Math.round(value))} role="img">
      {A.split("").map((d, k) => {
        const roll = A[k] !== B[k] ? f : 0;
        return (
          <span key={k} className="relative inline-block overflow-hidden" style={{ height: "1em", width: ".62em" }} aria-hidden>
            <span className="absolute left-0 top-0 block" style={{ transform: `translateY(${-roll}em)` }}>
              <span className="block h-[1em]">{d}</span>
              <span className="block h-[1em]">{B[k]}</span>
            </span>
          </span>
        );
      })}
    </span>
  );
}
