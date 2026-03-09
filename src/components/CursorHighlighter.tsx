"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function CursorHighlighter() {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const mousePos = React.useRef({ x: 0, y: 0 });
  const rafId = React.useRef<number>(null);

  React.useEffect(() => {
    setMounted(true);
    if (isMobile) return;

    const updatePosition = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const animate = () => {
      if (outerRef.current && innerRef.current) {
        outerRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
        innerRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isMobile, isVisible]);

  if (!mounted || isMobile) return null;

  return (
    <div className={isVisible ? "opacity-100" : "opacity-0 transition-opacity duration-300"}>
      {/* Outer Glow */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-12 h-12 bg-primary/15 rounded-full pointer-events-none z-[9999] blur-md will-change-transform transition-transform duration-150 ease-out"
      />
      {/* Inner Dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] shadow-[0_0_15px_rgba(var(--primary),0.5)] will-change-transform"
      />
    </div>
  );
}
