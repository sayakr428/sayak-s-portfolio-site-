import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReduced, scrollToId, SplitText } from "@/lib/motion";
import { Crowd } from "@/components/Crowd";
import { PROFILE } from "@/data/profile";

/** The last screen is cobalt again: a sentence the size of the page, the address, and the résumé. */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const f = () => setTime(new Intl.DateTimeFormat("en-GB", { timeZone: PROFILE.timezone, hour: "2-digit", minute: "2-digit" }).format(new Date()));
    f(); const t = setInterval(f, 30000); return () => clearInterval(t);
  }, []);
  useGSAP(() => {
    if (prefersReduced()) return;
    const s = SplitText.create(".ct-big", { type: "chars", mask: "chars" });
    gsap.from(s.chars, { yPercent: 105, stagger: .03, duration: 1, ease: "power4.out", scrollTrigger: { trigger: ".ct-big", start: "top 85%" } });
    return () => s.revert();
  }, { scope: root });
  const copy = () => navigator.clipboard?.writeText(PROFILE.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  return (
    <footer ref={root} id="contact" className="relative overflow-hidden bg-[var(--field)] text-[var(--bone)]" aria-labelledby="ct-h">
      <div className="wrap pb-10 pt-[clamp(80px,10vw,160px)]">
        <p className="mono text-[#c9cff5]">(Contact)</p>
        <h2 id="ct-h" className="serif mt-5 max-w-[18ch] text-[clamp(2.4rem,1.4rem+3.4vw,5.2rem)] leading-[1.02]">Got work people do by hand every morning? Let's make it run itself.</h2>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a href={`mailto:${PROFILE.email}`} className="pill pill-solid" data-cursor="mail">Email Sayak <span aria-hidden>↗</span></a>
          <a href={PROFILE.resume} download className="pill" data-cursor="pdf">Download the résumé ↓</a>
          <button type="button" onClick={copy} className="pill" aria-live="polite">{copied ? "Copied ✓" : "Copy the address"}</button>
        </div>
      </div>
      {/* from the line down: a crowd walking behind everything (after adxy.dev), with the details and the name in front */}
      <div className="relative min-h-[clamp(620px,64vw,940px)] overflow-hidden border-t border-white/25">
        <div className="absolute inset-0 z-0"><Crowd /></div>
        <div className="wrap relative z-10 grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="justify-self-start rounded-[6px] bg-[var(--field)]/85 px-3 py-2 backdrop-blur-[2px]"><p className="mono text-[#c9cff5]">Email</p><a href={`mailto:${PROFILE.email}`} className="uline mt-1 inline-block text-[1.1rem]">{PROFILE.email}</a></div>
          <div className="justify-self-start rounded-[6px] bg-[var(--field)]/85 px-3 py-2 backdrop-blur-[2px]"><p className="mono text-[#c9cff5]">Elsewhere</p><p className="mt-1 flex gap-5 text-[1.1rem]"><a className="uline" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a className="uline" href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a></p></div>
          <div className="justify-self-start rounded-[6px] bg-[var(--field)]/85 px-3 py-2 backdrop-blur-[2px]"><p className="mono text-[#c9cff5]">Based in</p><p className="mt-1 text-[1.1rem]">{PROFILE.city}, {PROFILE.country} · working remotely · <span className="tnum">{time}</span> IST</p></div>
          <div className="justify-self-start rounded-[6px] bg-[var(--field)]/85 px-3 py-2 backdrop-blur-[2px]"><p className="mono text-[#c9cff5]">Status</p><p className="mt-1 flex items-center gap-2 text-[1.1rem]"><span className="h-2 w-2 rounded-full bg-[#7dffb0] shadow-[0_0_0_4px_rgba(125,255,176,.25)]" />Open to new work</p></div>
        </div>
        <p aria-hidden className="ct-big display relative z-10 mt-[clamp(28px,4vw,64px)] whitespace-nowrap px-[calc(var(--m)*.5)] text-center text-[clamp(5rem,23vw,24rem)] leading-[.78]" style={{ WebkitTextStroke: "clamp(4px,.6vw,10px) var(--field)", paintOrder: "stroke fill", filter: "drop-shadow(0 12px 30px rgba(14,14,17,.35))" }}>Sayak Roy</p>
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-[8px] bg-[#16161a]/90 px-5 py-2.5 text-[.95rem] text-[#c9c4ba] shadow-[0_10px_30px_rgba(0,0,0,.3)] backdrop-blur">
          <span>designed &amp; coded by Sayak Roy</span><span className="text-[#5b5850]">|</span>
          <a href="#top" onClick={(e) => { e.preventDefault(); scrollToId("top"); }} className="text-[var(--bone)] hover:text-[var(--signal)]">top ↑</a>
        </div>
      </div>
      <div className="wrap mono flex flex-wrap justify-between gap-3 bg-[#16161a] py-4 text-[#8d8a83]">
        <span>© {new Date().getFullYear()} Sayak Roy · Agartala, Tripura</span>
        <span>Crowd: Open Peeps by Pablo Stanley (CC0) · B-roll: Storyblocks · Film, rooms and scenes made with Google Flow from Sayak's own photos</span>
      </div>
    </footer>
  );
}
