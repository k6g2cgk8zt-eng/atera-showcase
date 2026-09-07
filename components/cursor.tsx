"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { isFinePointer, reducedMotion } from "@/lib/media";

export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer() || reducedMotion()) return;

    const root = rootRef.current;
    const label = labelRef.current;
    if (!root || !label) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set(label, { autoAlpha: 0 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const setX = gsap.quickTo(root, "x", { duration: 0.35, ease: "power3.out" });
    const setY = gsap.quickTo(root, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (event: MouseEvent) => {
      pos.x = event.clientX;
      pos.y = event.clientY;
      setX(pos.x);
      setY(pos.y);
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const view = target?.closest("[data-cursor='view']");
      const link = target?.closest("a, button");

      if (view) {
        label.textContent = view.getAttribute("data-cursor-label") || "View";
        gsap.to(root, { width: 88, height: 88, duration: 0.45, ease: "power3.out" });
        gsap.to(label, { autoAlpha: 1, duration: 0.25 });
      } else if (link) {
        label.textContent = "";
        gsap.to(root, { width: 22, height: 22, duration: 0.35, ease: "power3.out" });
        gsap.to(label, { autoAlpha: 0, duration: 0.2 });
      } else {
        label.textContent = "";
        gsap.to(root, { width: 10, height: 10, duration: 0.35, ease: "power3.out" });
        gsap.to(label, { autoAlpha: 0, duration: 0.2 });
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-foreground mix-blend-difference text-[9px] uppercase tracking-[0.22em] text-background lg:flex"
      aria-hidden="true"
    >
      <span ref={labelRef} className="opacity-0">
        View
      </span>
    </div>
  );
}
