import { useRef, useState } from "react";

/** The short film as one full screen: the opening frame fills it, the title sits over it, one button plays it with sound. */
export function Film() {
  const vid = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    const v = vid.current; if (!v) return;
    v.muted = false; v.play();
    window.dispatchEvent(new CustomEvent("film-play"));
  };
  return (
    <section id="film" className="relative h-full w-full overflow-hidden bg-black text-[var(--bone)]" aria-labelledby="fm-h">
      <video ref={vid} src="/film/handedon.mp4" poster="/film/handedon-poster.jpg" playsInline preload="metadata" controls={playing}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover" aria-label="Handed On, a short film about Sayak Roy" />
      {!playing && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.15),rgba(0,0,0,.7))]" />
          <div className="wrap pointer-events-none absolute inset-x-0 top-[calc(var(--m)*1.2)] flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="mono text-[#c9c4ba]">A short film · 59 seconds · sound on</p>
              <h2 id="fm-h" className="display mt-3 text-[clamp(4rem,11vw,11rem)]">Handed on</h2>
            </div>
            <p className="serif max-w-[28ch] text-[clamp(1.3rem,1rem+1vw,2rem)] leading-tight md:pt-8 md:text-right">A century of people doing the work by hand, and the boy born in 2001 who decided the machines should do it.</p>
          </div>
          <button type="button" onClick={play} className="group absolute left-1/2 top-1/2 grid h-[clamp(110px,12vw,170px)] w-[clamp(110px,12vw,170px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--bone)] text-[var(--ink)] transition-transform duration-500 ease-[var(--ease-out)] hover:scale-110" data-cursor="play" aria-label="Play the film with sound">
            <span className="mono uppercase">Play ▶</span>
          </button>
          <p className="mono absolute bottom-[calc(var(--m)*1)] left-[var(--m)] text-[#c9c4ba]">Narrated · Sayak's scenes generated from his own photos</p>
        </>
      )}
    </section>
  );
}
