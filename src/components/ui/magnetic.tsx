// From 21st.dev — ibelick/magnetic (motion/react), adapted: reduced-motion + touch guard.
import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, type SpringOptions } from "motion/react";

const SPRING_CONFIG = { stiffness: 26.7, damping: 4.1, mass: 0.2 };

export type MagneticProps = {
  children: React.ReactNode;
  intensity?: number;
  range?: number;
  springOptions?: SpringOptions;
  className?: string;
};

export function Magnetic({ children, intensity = 0.6, range = 100, springOptions = SPRING_CONFIG, className }: MagneticProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springOptions);
  const springY = useSpring(y, springOptions);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      if (isHovered && d <= range) {
        const s = 1 - d / range;
        x.set(dx * intensity * s);
        y.set(dy * intensity * s);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [isHovered, intensity, range, x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }}
      style={{ x: springX, y: springY, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}
