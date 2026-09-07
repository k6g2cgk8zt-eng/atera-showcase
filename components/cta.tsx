"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { isFinePointer, reducedMotion } from "@/lib/media";

const lines = ["Let's shape", "something", "timeless."];

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      const reduce = reducedMotion();
      const items = root.querySelectorAll("[data-cta-line]");
      const headline = root.querySelector("[data-cta-headline]");

      if (reduce) return;

      gsap.fromTo(
        items,
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "top 32%",
            scrub: 0.55,
          },
        },
      );

      gsap.fromTo(
        headline,
        { scale: 1.04 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            end: "top 20%",
            scrub: 0.6,
          },
        },
      );

      gsap.from("[data-cta-rest]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: root,
          start: "top 55%",
          once: true,
        },
      });

      gsap.to(root.querySelector("[data-end-mark]"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 20%",
          once: true,
        },
      });
    }, root);

    const cta = ctaRef.current;
    const reduce = reducedMotion();
    let onMove: ((event: MouseEvent) => void) | undefined;
    let onLeave: (() => void) | undefined;

    if (cta && isFinePointer() && !reduce) {
      onMove = (event: MouseEvent) => {
        const rect = cta.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        gsap.to(cta, {
          x: x * 0.18,
          y: y * 0.22,
          duration: 0.45,
          ease: "power3.out",
        });
      };
      onLeave = () => {
        gsap.to(cta, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
      };
      cta.addEventListener("mousemove", onMove);
      cta.addEventListener("mouseleave", onLeave);
    }

    return () => {
      if (cta && onMove && onLeave) {
        cta.removeEventListener("mousemove", onMove);
        cta.removeEventListener("mouseleave", onLeave);
      }
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="contact"
      ref={rootRef}
      className="px-6 pt-[22vh] pb-[12vh] sm:px-10 lg:px-14 lg:pt-[28vh] lg:pb-[14vh]"
    >
      <h2
        data-cta-headline
        className="origin-left font-serif text-[clamp(3.2rem,11vw,9.5rem)] uppercase leading-[0.84] tracking-[-0.035em]"
      >
        {lines.map((line) => (
          <span key={line} className="block overflow-hidden">
            <span data-cta-line className="block">
              {line}
            </span>
          </span>
        ))}
      </h2>
      <p
        data-cta-rest
        className="mt-10 max-w-[22rem] text-[15px] leading-8 text-foreground/70"
      >
        Tell us about your space, your vision and the way you want to live
        outdoors.
      </p>
      <p data-cta-rest className="mt-14">
        <a
          ref={ctaRef}
          href="mailto:studio@aterra.com"
          className="inline-block text-[13px] uppercase tracking-[0.28em] underline decoration-foreground/30 underline-offset-[0.45em] transition-colors duration-300 hover:decoration-foreground"
        >
          Start a project
        </a>
      </p>
      <p
        data-end-mark
        className="mt-[22vh] text-[13px] tracking-[0.32em] opacity-0"
      >
        ATERRA
      </p>
    </section>
  );
}
