import { useEffect, useRef, useState } from "react";

/** A small record in the corner: click it to put the score from the film on, click again to lift the needle. */
export function SoundDisc() {
  const audio = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    // the film has its own sound; lift the needle while it plays
    const off = () => { audio.current?.pause(); setOn(false); };
    window.addEventListener("film-play", off);
    return () => window.removeEventListener("film-play", off);
  }, []);
  const toggle = () => {
    const a = audio.current; if (!a) return;
    if (on) { a.pause(); setOn(false); }
    else { a.volume = .5; a.play().then(() => setOn(true)).catch(() => setOn(false)); }
  };
  return (
    <>
      <audio ref={audio} src="/audio/score.mp3" loop preload="none" />
      <button type="button" onClick={toggle} aria-pressed={on} aria-label={on ? "Turn the music off" : "Turn the music on"} data-cursor={on ? "off" : "play"}
        className="fixed bottom-[calc(var(--m)*.7)] right-[calc(var(--m)*.7)] z-[80] grid h-14 w-14 place-items-center rounded-full shadow-[0_10px_30px_rgba(0,0,0,.35),inset_0_0_0_1.5px_rgba(236,231,221,.35)] transition-transform duration-300 hover:scale-110"
        style={{ background: "repeating-radial-gradient(circle at 50% 50%, #111 0 1.5px, #1d1d22 1.5px 3px)" }}>
        <span aria-hidden className="relative grid h-5 w-5 place-items-center rounded-full bg-[var(--signal)]" style={{ animation: "spin 2.4s linear infinite", animationPlayState: on ? "running" : "paused" }}>
          <span className="h-1 w-1 rounded-full bg-[var(--ink)]" /><span className="absolute left-1 top-1 h-1 w-1.5 rounded-full bg-white/70" />
        </span>
        <span className="sr-only">{on ? "Music on" : "Music off"}</span>
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
