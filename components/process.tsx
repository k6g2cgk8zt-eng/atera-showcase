"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { reducedMotion } from "@/lib/media";

const steps = [
  {
    n: "01",
    title: "Discover",
    copy: "The land, the light, and how the house is already lived in.",
  },
  {
    n: "02",
    title: "Design",
    copy: "Form, water, planting and the sequence of rooms outdoors.",
  },
  {
    n: "03",
    title: "Refine",
    copy: "Proportion, material junctions, and the atmosphere of each hour.",
  },
  {
    n: "04",
    title: "Build",
    copy: "Close direction through construction, until the place is quiet and complete.",
  },
];

export function Process() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      if (reducedMotion()) return;

      gsap.from(root.querySelectorAll("[data-step]"), {
        y: 20,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 72%",
          once: true,
        },
      });

      gsap.fromTo(
        root.querySelector("[data-progress]"),
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            end: "bottom 40%",
            scrub: 0.5,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="px-6 py-[12vh] sm:px-10 lg:px-14">
      <p className="text-[10px] uppercase tracking-[0.28em] text-foreground/55">
        Method
      </p>
      <h2 className="mt-6 font-serif text-[clamp(2.2rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.03em]">
        Process
      </h2>

      <div className="relative mt-16">
        <span
          data-progress
          className="absolute top-0 left-0 hidden h-px w-full origin-left bg-foreground/35 md:block"
        />
        <ol className="grid gap-0 border-t border-foreground/15 md:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.n}
              data-step
              className="border-b border-foreground/15 py-10 md:border-b-0 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <p className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] leading-none tracking-[-0.04em] text-foreground/25">
                {step.n}
              </p>
              <h3 className="mt-8 text-[13px] uppercase tracking-[0.22em]">
                {step.title}
              </h3>
              <p className="mt-4 max-w-[16rem] text-[13px] leading-7 text-foreground/65">
                {step.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
