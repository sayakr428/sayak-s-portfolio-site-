// From 21st.dev — pacekit/scramble-text (GSAP ScrambleTextPlugin), adapted: span wrapper + reduced-motion guard.
import { type ComponentProps, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

type ScrambleTextProps = {
  random?: boolean;
  scrambleOnLoad?: boolean;
} & ComponentProps<"span">;

const defaultChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/.:";

export const ScrambleText = ({ scrambleOnLoad = false, random = true, ...props }: ScrambleTextProps) => {
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const { contextSafe } = useGSAP();

  const scramble = contextSafe(() => {
    const target = wrapperRef.current;
    if (!target || gsap.isTweening(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(target, {
      duration: 0.8,
      ease: "sine.in",
      scrambleText: {
        text: target.innerText,
        speed: 2,
        chars: random ? defaultChars : target.innerText.replace(/\s/g, ""),
      },
    });
  });

  useEffect(() => {
    if (scrambleOnLoad) scramble();
    const target = wrapperRef.current;
    target?.addEventListener("pointerenter", scramble);
    return () => target?.removeEventListener("pointerenter", scramble);
  }, [scramble, scrambleOnLoad]);

  return <span {...props} ref={wrapperRef} />;
};

export default ScrambleText;
