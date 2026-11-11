/** How Derq Ops works, at a glance: what it reads, what it checks, what it produces. Animated wires carry the data. */
const IN = ["Slack · QA post", "DERQ dashboard", "Site database", "Edge units (SSH)", "Cameras (RTSP)"];
const CORE = ["Backlog report", "P1 · site down", "P2 · camera offline", "P3 · services stopped", "Low memory", "Camera moved?", "AI agent · chat + voice"];
const OUT = ["Excel / CSV reports", "Slack post", "Service restart", "Alerts & history"];

export function DerqDiagram() {
  const row = (i: number, n: number) => 8 + (84 / (n - 1)) * i;
  return (
    <div data-ui className="relative h-full w-full overflow-hidden bg-[#0f1115] text-[#e6e8ec]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <style>{`@keyframes flow{from{stroke-dashoffset:24}to{stroke-dashoffset:0}} .wire{stroke-dasharray:3 9;animation:flow 1.1s linear infinite}`}</style>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {IN.map((_, i) => <path key={"i" + i} className="wire" d={`M 25 ${row(i, IN.length)} C 33 ${row(i, IN.length)}, 33 50, 38 50`} fill="none" stroke="#ff5a1f" strokeWidth=".5" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 1.4 }} />)}
        {OUT.map((_, i) => <path key={"o" + i} className="wire" d={`M 66 50 C 71 50, 71 ${row(i, OUT.length)}, 76 ${row(i, OUT.length)}`} fill="none" stroke="#5fd39a" strokeWidth=".5" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 1.4, animationDelay: ".4s" }} />)}
      </svg>
      <div className="absolute left-[2%] top-0 flex h-full w-[23%] flex-col justify-around py-[3%]">
        <p className="text-[.6em] uppercase tracking-[.18em] text-[#9aa3b2]" style={{ fontSize: "clamp(7px,.8vw,11px)" }}>Reads</p>
        {IN.map((x) => <span key={x} className="rounded-md border border-[#2a2f3b] bg-[#141822] px-[6%] py-[4%] text-[clamp(7px,.85vw,12px)]">{x}</span>)}
      </div>
      <div className="absolute left-[38%] top-[6%] flex h-[88%] w-[28%] flex-col rounded-xl border border-[#ff5a1f]/60 bg-[#151a24] p-[2%] shadow-[0_0_40px_rgba(201,162,75,.15)]">
        <p className="text-center font-semibold text-white" style={{ fontSize: "clamp(9px,1.1vw,15px)" }}>Derq Ops</p>
        <p className="text-center text-[#9aa3b2]" style={{ fontSize: "clamp(6px,.7vw,10px)" }}>FastAPI · Playwright · SSH · OpenCV</p>
        <div className="mt-[4%] flex flex-1 flex-col justify-around gap-[2%]">
          {CORE.map((x, i) => <span key={x} className="rounded px-[5%] py-[2.5%] text-[clamp(7px,.8vw,11px)]" style={{ background: i === 6 ? "#2a1d3a" : "#1d2330", color: i === 6 ? "#e2c9ff" : "#e6e8ec" }}>{x}</span>)}
        </div>
        <p className="mt-[3%] text-center text-[#5fd39a]" style={{ fontSize: "clamp(6px,.7vw,10px)" }}>● 230 tests passing</p>
      </div>
      <div className="absolute right-[2%] top-0 flex h-full w-[22%] flex-col justify-around py-[8%]">
        <p className="text-[.6em] uppercase tracking-[.18em] text-[#9aa3b2]" style={{ fontSize: "clamp(7px,.8vw,11px)" }}>Produces</p>
        {OUT.map((x) => <span key={x} className="rounded-md border border-[#1f4a36] bg-[#11201a] px-[6%] py-[5%] text-[clamp(7px,.85vw,12px)] text-[#bff0d6]">{x}</span>)}
      </div>
    </div>
  );
}
