import { useState } from "react";
import { openBrief } from "@/data/briefs";
import { AutoVideo } from "@/components/AutoVideo";

// hotspots in % of the frame (the still and its living loop share one framing); lab experiments only, nothing from Works
const SPOTS = [
  { key: "cloud-butler-infra", title: "Cloud Butler", line: "A chat message becomes Terraform on AWS.", x: 23.9, y: 21.7, w: 17.4, h: 18.5 },
  { key: "Job-Hunting-using-N8N", title: "AI job hunter", line: "n8n reads LinkedIn and drafts the cover letters.", x: 29.3, y: 39.1, w: 19.5, h: 28.2 },
  { key: "Implemented-BGP-monitoring-Protocol-to-get-graphical-representation-of-the-BGP-data-s", title: "BGP monitoring", line: "OpenBMP, Kafka and PostgreSQL watch every route change.", x: 43.4, y: 15.2, w: 9.8, h: 32.6 },
  { key: "leo-kpi-monitoring", title: "LEO satellite probes", line: "Raspberry Pi probes time satellite links into InfluxDB.", x: 53.2, y: 18.5, w: 11.9, h: 21.7 },
  { key: "snow", title: "Himalayan Snow Monitor", line: "Snow cover on a live map, with a public build beside it.", x: 61.9, y: 27.1, w: 17.4, h: 33.7 },
  { key: "Paraphrasing-Using-ollama", title: "Local LLM paraphrasing", line: "LLaMA 3.2 on Ollama rewrites medical datasets, offline.", x: 76.5, y: 32.6, w: 15.2, h: 34.8 },
] as const;

/** After hours: the study seen from above, filling the screen. Every object is an experiment; hover to light it, click for the brief. */
export function Lab() {
  const [on, setOn] = useState(-1);
  const s = on >= 0 ? SPOTS[on] : null;
  const cx = s ? s.x + s.w / 2 : 50, cy = s ? s.y + s.h / 2 : 50;
  return (
    <section id="lab" className="relative h-full w-full overflow-hidden bg-[#120d0a] text-[var(--bone)]" aria-labelledby="lab-h">
      <div className="absolute inset-0">
        <div className="lab-room absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ aspectRatio: "16 / 9" }} onMouseLeave={() => setOn(-1)}>
          <AutoVideo src="/lab/lab.mp4" poster="/lab/lab-still.jpg" className="absolute inset-0 h-full w-full object-cover" aria-label="A lamplit study seen from above: blueprint board, desk, server rack, satellite probe, drafting table and bookshelf" />
          <div aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-500" style={{ opacity: s ? 1 : 0, background: `radial-gradient(ellipse ${s ? s.w * .9 : 10}% ${s ? s.h * .9 : 10}% at ${cx}% ${cy}%, transparent 60%, rgba(8,8,10,.74) 100%)` }} />
          {SPOTS.map((p, i) => (
            <button key={p.key} type="button" onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onBlur={() => setOn(-1)} onClick={() => openBrief(p.key)}
              className="group absolute outline-none" data-cursor="brief" aria-label={`${p.title}: ${p.line}`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%` }}>
              <span aria-hidden className="absolute inset-0 transition-[box-shadow] duration-300" style={{ boxShadow: on === i ? "0 0 0 2px var(--signal), 0 0 50px rgba(255,90,31,.35)" : "none" }} />
              <span aria-hidden className="absolute left-1/2 top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--bone)] text-[11px] font-medium text-[var(--ink)] transition-transform duration-300 group-hover:scale-0" style={{ animation: "lpulse 2.4s ease-in-out infinite" }}>{i + 1}</span>
            </button>
          ))}
          {s && (
            <div className="pointer-events-none absolute z-20 w-[min(320px,30%)] bg-[var(--bone)] p-4 text-[var(--ink)]" style={{ left: `${Math.min(cx + s.w / 2 + 1, 64)}%`, top: `${Math.min(Math.max(cy - 8, 2), 60)}%` }}>
              <p className="mono text-[#5b5850]">0{on + 1} / Lab</p>
              <p className="display mt-1 text-[1.9rem]">{s.title}</p>
              <p className="mt-1 text-[1rem] leading-snug">{s.line}</p>
              <p className="mono mt-2 text-[#c2410c]">Click for the brief →</p>
            </div>
          )}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="wrap pointer-events-none absolute inset-x-0 top-[calc(var(--m)*1.1)] flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="mono text-[#d6cbb8]">After hours · {SPOTS.length} experiments</p>
          <h2 id="lab-h" className="display mt-2 text-[clamp(3.6rem,8vw,8rem)]">The lab</h2>
        </div>
        <p className="serif max-w-[24ch] text-[clamp(1.3rem,1rem+1vw,2rem)] leading-tight md:pt-8 md:text-right">Hover over anything in the room to light it. Click it for the brief.</p>
      </div>
      <ol className="wrap absolute inset-x-0 bottom-[calc(var(--m)*.9)] grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-6">
        {SPOTS.map((p, i) => (
          <li key={p.key}>
            <button type="button" onClick={() => openBrief(p.key)} onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(-1)} className={`group flex w-full items-baseline gap-2 border-b py-2 text-left ${on === i ? "border-[var(--signal)]" : "border-white/25"}`}>
              <span className="mono text-[#d6cbb8]">0{i + 1}</span><span className="truncate font-medium">{p.title}</span><span aria-hidden className="ml-auto">→</span>
            </button>
          </li>
        ))}
      </ol>
      <style>{`.lab-room{width:max(100vw,177.78svh)}@media (max-aspect-ratio: 1/1){.lab-room{width:100vw}}@keyframes lpulse{0%,100%{box-shadow:0 0 0 0 rgba(236,231,221,.5)}50%{box-shadow:0 0 0 10px rgba(236,231,221,0)}}`}</style>
    </section>
  );
}
