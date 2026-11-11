import { useEffect, useRef, type VideoHTMLAttributes } from "react";
import { playWhenVisible } from "@/lib/motion";

/**
 * A muted looping video that only loads and plays while it is on screen.
 * Looks exactly like an autoplaying <video>, but nothing decodes out of sight, which is what makes phones slow.
 */
export function AutoVideo(props: VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { const v = ref.current; if (!v) return; return playWhenVisible(v); }, [props.src]);
  return <video ref={ref} muted loop playsInline preload="none" {...props} />;
}
