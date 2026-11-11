import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, pauseScroll, prefersReduced } from "@/lib/motion";
import { BUILDS, type Build } from "@/data/showcase";
import { briefFor } from "@/data/briefs";
import { DerqDiagram } from "@/components/DerqDiagram";

/** A live site rendered at a real viewport size and scaled into the frame, so it lays out exactly as it would in a browser. */
function Live({ url, vw }: { url: string; vw: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(.5);
  const [vh, setVh] = useState(900);
  const [loaded, setLoaded] = useState(false);
  useLayoutEffect(() => {
    const el = box.current; if (!el) return;
    // width is the real viewport; height follows the frame, so the site fills it top to bottom
    const fit = () => { const kk = el.clientWidth / vw; setK(kk); setVh(Math.round(el.clientHeight / kk)); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, [vw]);
  useEffect(() => setLoaded(false), [url, vw]);
  return (
    <div ref={box} className="relative h-full w-full overflow-hidden bg-white">
      {!loaded && <p className="mono absolute inset-0 grid place-items-center text-[#5b5850]">Loading the live site…</p>}
      <iframe key={url + vw} src={url} title="Live site" onLoad={() => setLoaded(true)} loading="lazy" referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
        className="absolute left-0 top-0 origin-top-left border-0" style={{ width: vw, height: vh, transform: `scale(${k})` }} />
    </div>
  );
}

/** Opens any of the six builds, usable: live sites in a browser or phone frame, MyChiffre as its real app screens, Derq Ops as its diagram. */
export function ProjectViewer() {
  const root = useRef<HTMLDivElement>(null);
  const [b, setB] = useState<Build | null>(null);
  const [phone, setPhone] = useState(false);
  const [screen, setScreen] = useState(0);
  const [side, setSide] = useState(true);

  useEffect(() => {
    const on = (e: Event) => { const x = BUILDS.find((y) => y.id === (e as CustomEvent<string>).detail); if (x) { setB(x); setScreen(0); setPhone(x.mode.kind === "live" && !!x.mode.phone && innerWidth < 900); setSide(innerWidth > 1100); } };
    window.addEventListener("project", on);
    return () => window.removeEventListener("project", on);
  }, []);
  useEffect(() => {
    if (!b) return;
    pauseScroll(true);
    window.dispatchEvent(new CustomEvent("motion", { detail: true }));
    const el = root.current;
    if (el && !prefersReduced()) {
      gsap.fromTo(el, { clipPath: "inset(40% 30% 40% 30%)", opacity: 0 }, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: .7, ease: "expo.out" });
      gsap.fromTo(el.querySelector(".pv-device"), { y: 60, rotateX: 14, scale: .92 }, { y: 0, rotateX: 0, scale: 1, duration: 1, ease: "expo.out" });
    }
    el?.querySelector<HTMLButtonElement>(".pv-close")?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setB(null);
    window.addEventListener("keydown", esc);
    return () => { pauseScroll(false); window.dispatchEvent(new CustomEvent("motion", { detail: false })); window.removeEventListener("keydown", esc); };
  }, [b]);
  if (!b) return null;
  const brief = briefFor(b.id);
  const m = b.mode;
  const i = BUILDS.indexOf(b);
  const go = (d: number) => { const n = BUILDS[(i + d + BUILDS.length) % BUILDS.length]; setB(n); setScreen(0); setPhone(false); };

  // the device: a browser window for sites and apps, a phone when asked
  const content = m.kind === "live" ? <Live url={m.url} vw={phone ? 390 : 1440} />
    : m.kind === "app" ? <img src={m.screens[screen].img} alt={`MyChiffre, ${m.screens[screen].label}`} className="h-full w-full object-cover object-left-top" />
    : m.kind === "still" ? <img src={m.img} alt={b.name} className="h-full w-full object-cover object-top" />
    : <div className="h-full w-full text-[15px]"><DerqDiagram /></div>;
  const addr = m.kind === "live" ? m.url.replace(/^https?:\/\//, "") : m.kind === "still" ? m.url.replace(/^https?:\/\//, "") : m.kind === "app" ? `MyChiffre · local build · ${m.screens[screen].label}` : "derq-ops.local";

  return (
    <div ref={root} className="fixed inset-0 z-[130] flex flex-col bg-[#1a1714] text-[var(--bone)]" role="dialog" aria-modal="true" aria-label={`${b.name}, open`} data-lenis-prevent>
      <header className="flex flex-wrap items-center gap-3 border-b border-white/10 px-[var(--m)] py-3">
        <span className="mono text-[var(--muted)]">0{i + 1} / 06</span>
        <h2 className="display text-[clamp(1.8rem,3vw,2.6rem)]">{b.name}</h2>
        <span className="mono hidden text-[var(--muted)] md:inline">{b.kind}</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {m.kind === "live" && (
            <div className="flex rounded-full p-1 shadow-[inset_0_0_0_1px_rgba(236,231,221,.3)]" role="group" aria-label="Device">
              {["Desktop", "Phone"].map((l, k) => <button key={l} type="button" aria-pressed={phone === (k === 1)} onClick={() => setPhone(k === 1)} className={`rounded-full px-4 py-1.5 text-[.95rem] transition-colors ${phone === (k === 1) ? "bg-[var(--bone)] text-[var(--ink)]" : "hover:text-white"}`}>{l}</button>)}
            </div>
          )}
          <button type="button" onClick={() => setSide((s) => !s)} className="pill !min-h-[40px]" aria-pressed={side}>{side ? "Hide brief" : "Read the brief"}</button>
          <button type="button" onClick={() => go(-1)} className="pill !min-h-[40px]" aria-label="Previous project">←</button>
          <button type="button" onClick={() => go(1)} className="pill !min-h-[40px]" aria-label="Next project">→</button>
          <button type="button" onClick={() => setB(null)} className="pv-close grid h-10 w-10 place-items-center rounded-full bg-[var(--bone)] text-[var(--ink)] transition-transform duration-300 hover:rotate-90" aria-label="Close">✕</button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="relative grid min-w-0 flex-1 place-items-center p-[clamp(12px,2.4vw,40px)] [perspective:1600px]">
          <div className={`pv-device relative flex flex-col overflow-hidden ${phone ? "aspect-[390/844] h-full max-h-[780px] rounded-[44px] border-[10px] border-[#0b0b0d] shadow-[0_0_0_2px_#3a3a40,0_40px_100px_rgba(0,0,0,.55)]" : "h-full w-full max-w-[1500px] rounded-[14px] shadow-[0_0_0_1px_rgba(255,255,255,.12),0_40px_100px_rgba(0,0,0,.55)]"}`}>
            {!phone && (
              <div className="flex shrink-0 items-center gap-3 bg-[#2a2622] px-4 py-2.5">
                <span className="flex gap-1.5" aria-hidden><i className="h-3 w-3 rounded-full bg-[#ff5f57]" /><i className="h-3 w-3 rounded-full bg-[#febc2e]" /><i className="h-3 w-3 rounded-full bg-[#28c840]" /></span>
                <span className="mono mx-auto max-w-[60%] truncate rounded-md bg-[#1a1714] px-4 py-1 text-[#c9c4ba]">{addr}</span>
                {(m.kind === "live" || m.kind === "still") && <a href={m.url} target="_blank" rel="noreferrer" className="mono text-[#c9c4ba] hover:text-white">Open in a tab ↗</a>}
              </div>
            )}
            {m.kind === "app" && (
              <nav className="flex shrink-0 gap-1 bg-[#0f1115] px-3 py-2" aria-label="MyChiffre screens">
                {m.screens.map((s, k) => <button key={s.label} type="button" onClick={() => setScreen(k)} aria-current={k === screen} className={`rounded-md px-3 py-1.5 text-[.9rem] transition-colors ${k === screen ? "bg-[#2563eb] text-white" : "text-[#aab1bd] hover:bg-white/10 hover:text-white"}`}>{s.label}</button>)}
              </nav>
            )}
            <div className="relative min-h-0 flex-1">{content}</div>
            {m.kind === "still" && <p className="mono absolute inset-x-0 bottom-0 bg-[#1a1714]/90 px-4 py-3 text-[#c9c4ba]">{m.note} <a href={m.url} target="_blank" rel="noreferrer" className="uline text-white">Open {b.name} ↗</a></p>}
          </div>
          {m.kind === "live" && <p className="mono absolute bottom-1 left-1/2 -translate-x-1/2 text-[var(--muted)]">Live site, fully usable here: scroll, click, type.</p>}
          {m.kind === "app" && <p className="mono absolute bottom-1 left-1/2 -translate-x-1/2 text-[var(--muted)]">Real screens from the app. Switch between them above.</p>}
        </div>

        {side && (
          <aside className="w-[min(420px,40vw)] shrink-0 overflow-y-auto border-l border-white/10 p-[clamp(16px,2vw,28px)]" aria-label="Brief">
            <p className="serif text-[1.5rem] leading-[1.15] pretty">{brief.what}</p>
            {brief.problem && <><h3 className="mono mt-6 text-[var(--muted)]">The problem</h3><p className="mt-2 leading-relaxed text-[#d6d1c7] pretty">{brief.problem}</p></>}
            {brief.built.length > 0 && <><h3 className="mono mt-6 text-[var(--muted)]">What I built</h3>
              <ol className="mt-2 space-y-3">{brief.built.map((x, k) => <li key={x} className="grid grid-cols-[1.8rem_1fr] text-[.98rem] leading-snug text-[#d6d1c7]"><span className="mono text-[var(--signal)]">{String(k + 1).padStart(2, "0")}</span>{x}</li>)}</ol></>}
            <h3 className="mono mt-6 text-[var(--muted)]">Built with</h3><p className="mt-2 text-[.98rem] text-[#d6d1c7]">{brief.stack.join(" · ")}</p>
            {brief.note && <p className="mt-5 text-[.95rem] italic text-[var(--muted)]">{brief.note}</p>}
            <div className="mt-6 flex flex-wrap gap-2">
              {[...brief.links.map((l) => ({ label: l.label, url: l.href })), ...(b.also ?? [])].filter((l, k, a) => a.findIndex((z) => z.url === l.url) === k).map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="pill !min-h-[40px]">{l.label} ↗</a>)}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
