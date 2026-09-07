"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { images, reducedMotion } from "@/lib/media";

const lines = ["A place", "between", "architecture", "and landscape."];

export function Cinematic() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerGsapPlugins();
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const frame = root.querySelector<HTMLElement>("[data-frame]");
      const media = root.querySelector<HTMLElement>("[data-media]");
      const copy = root.querySelectorAll("[data-line]");

      if (reducedMotion()) {
        gsap.set(frame, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(media, { scale: 1 });
        gsap.set(copy, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(frame, { clipPath: "inset(14% 12% 16% 12%)" });
      gsap.set(media, { scale: 1.08, yPercent: -2 });
      gsap.set(copy, { autoAlpha: 0, y: 24 });

      const build = (desktop: boolean) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            pin: "[data-pin]",
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          frame,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.15,
          },
          0,
        );
        tl.to(
          media,
          {
            scale: 1,
            yPercent: desktop ? 4 : 2,
            duration: 1.35,
          },
          0,
        );
        tl.to(
          copy,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.06,
          },
          0.38,
        );
        tl.to(
          copy,
          {
            autoAlpha: 0,
            y: -16,
            duration: 0.28,
            stagger: 0.04,
          },
          1.05,
        );
      };

      mm.add("(min-width: 1024px)", () => build(true));
      mm.add("(max-width: 1023px)", () => build(false));
    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative bg-foreground lg:h-[260vh] max-lg:h-[180vh]"
    >
      <div data-pin className="relative h-dvh overflow-hidden bg-foreground">
        <figure data-frame className="absolute inset-0 overflow-hidden">
          <div
            data-media
            className="absolute inset-[-4%] origin-[52%_42%] will-change-transform"
          >
            <Image
              src={images.cinematic}
              alt="The residence across the pool at dusk: stone, glass, water and landscape as one composition"
              fill
              preload
              sizes="100vw"
              quality={85}
              className="object-cover"
            />
          </div>
        </figure>

        <h2 className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-12 sm:px-10 lg:px-14 lg:pb-16">
          {lines.map((line) => (
            <span
              key={line}
              data-line
              className="block font-serif text-[clamp(1.85rem,4.6vw,4.25rem)] uppercase leading-[0.9] tracking-[-0.03em] text-background"
            >
              {line}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
