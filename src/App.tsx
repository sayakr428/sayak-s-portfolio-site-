import { useCallback, useEffect, useState } from "react";
import { Preloader } from "@/components/Preloader";
import { Hero } from "@/components/Hero";
import { Gate } from "@/components/Gate";
import { WorksScene } from "@/components/WorksScene";
import { Film } from "@/components/Film";
import { Experience } from "@/components/Experience";
import { Lab } from "@/components/Lab";
import { Index } from "@/components/Index";
import { Contact } from "@/components/Contact";
import { Menu } from "@/components/Menu";
import { SoundDisc } from "@/components/SoundDisc";
import { Cursor } from "@/components/Cursor";
import { BriefDialog } from "@/components/BriefDialog";
import { ProjectViewer } from "@/components/ProjectViewer";
import { ScrollTrigger, startSmoothScroll } from "@/lib/motion";
import { PROFILE } from "@/data/profile";

/** Past the giant HELLO: an open invitation, the address in big type. */
function ContactCover() {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden bg-[var(--field)] text-center text-[var(--bone)]">
      <div className="wrap">
        <p className="mono text-[#c9cff5]">The door's open</p>
        <p className="display mt-4 text-[clamp(5rem,17vw,17rem)]">Say hello</p>
        <a href={`mailto:${PROFILE.email}`} className="serif uline mt-4 inline-block text-[clamp(1.6rem,1rem+2vw,3.2rem)]">{PROFILE.email}</a>
      </div>
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const done = useCallback(() => setReady(true), []);
  const closeMenu = useCallback(() => setMenu(false), []);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return startSmoothScroll();
  }, []);

  // keep trigger positions honest as fonts, images and video metadata arrive
  useEffect(() => {
    let t = 0;
    const refresh = () => { clearTimeout(t); t = window.setTimeout(() => ScrollTrigger.refresh(), 200); };
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    // anything that changes the page's height after load (pictures, fonts, the crowd) re-measures every transition
    let h = 0;
    const ro = new ResizeObserver(() => { const nh = document.documentElement.scrollHeight; if (Math.abs(nh - h) > 2) { h = nh; refresh(); } });
    ro.observe(document.body);
    return () => { window.removeEventListener("load", refresh); clearTimeout(t); ro.disconnect(); };
  }, []);

  return (
    <>
      {!ready && <Preloader onDone={done} />}
      <a href="#gate-work" className="pill pill-solid sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200]">Skip to the work</a>
      <Cursor />
      <main>
        <Hero ready={ready} onMenu={() => setMenu(true)} />
        {/* every part has its own way in: doors, an iris, blinds, a lamp, a word */}
        <Gate id="work" kind="split" from="#2337c6" door="/doors/work.jpg" label="Works" tone="#d6c6b2"><WorksScene /></Gate>
        <Gate id="film" kind="iris" from="#e3d6c5" label="The film" tone="#000"><Film /></Gate>
        <Gate id="experience" kind="blinds" from="#000" label="Experience" />
        <Experience />
        <Gate id="lab" kind="lamp" from="#e4e4e2" label="After hours" tone="#120d0a"><Lab /></Gate>
        <Index />
        <Gate id="contact" kind="type" from="#ece7dd" label="Contact" tone="#2337c6"><ContactCover /></Gate>
      </main>
      <Contact />
      <Menu open={menu} onClose={closeMenu} />
      <SoundDisc />
      <BriefDialog />
      <ProjectViewer />
    </>
  );
}
