"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { reducedMotion } from "@/lib/media";

const lines = [
  { text: "We don't design", shift: -36 },
  { text: "around the house.", shift: 28 },
  { text: "We design", shift: -18 },
  { text: "how you live", shift: 42 },
  { text: "beyond it.", shift: -14 },
];

export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      const reduce = reducedMotion();
      const items = root.querySelectorAll<HTMLElement>("[data-line]");

      if (reduce) return;

      items.forEach((el, index) => {
        const inner = el.querySelector("[data-line-inner]");
        const shift = Number(el.dataset.shift || 0);
        const mobile = window.matchMedia("(max-width: 1023px)").matches;
        const travel = mobile ? shift * 0.42 : shift;

        gsap.fromTo(
          inner,
          { yPercent: 110 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: `top ${82 - index * 5}%`,
              end: `top ${32 - index * 4}%`,
              scrub: 0.55,
            },
          },
        );

        gsap.fromTo(
          el,
          { x: travel * 0.2 },
          {
            x: travel,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.85,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="intro"
      ref={rootRef}
      className="relative overflow-hidden px-6 py-[18vh] sm:px-10 lg:flex lg:min-h-dvh lg:items-center lg:px-14 lg:py-[12vh]"
    >
      <h2 className="w-full font-serif text-[clamp(2.8rem,8.6vw,8.75rem)] uppercase leading-[0.86] tracking-[-0.035em]">
        {lines.map((line) => (
          <span
            key={line.text}
            data-line
            data-shift={line.shift}
            className="block overflow-hidden"
          >
            <span data-line-inner className="block will-change-transform">
              {line.text}
            </span>
          </span>
        ))}
      </h2>
    </section>
  );
}
