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

      const build = (desktop: boolean) => {
        gsap.set(frame, {
          clipPath: desktop
            ? "inset(14% 12% 16% 12%)"
            : "inset(8% 9% 11% 9%)",
        });
        gsap.set(media, {
          scale: desktop ? 1.08 : 1.16,
          yPercent: desktop ? -2 : 0,
          xPercent: desktop ? 0 : 9,
        });
        gsap.set(copy, { autoAlpha: 0, y: desktop ? 24 : 18 });

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
            yPercent: desktop ? 4 : 3,
            xPercent: desktop ? 0 : -11,
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
      className="relative bg-foreground max-lg:h-[220vh] lg:h-[260vh]"
    >
      <div data-pin className="relative h-dvh overflow-hidden bg-foreground">
        <figure data-frame className="absolute inset-0 overflow-hidden">
          <div
            data-media
            className="absolute inset-[-4%] origin-[52%_42%] will-change-transform max-lg:inset-[-8%_-26%] max-lg:origin-[42%_40%]"
          >
            <Image
              src={images.cinematic}
              alt="The residence across the pool at dusk: stone, glass, water and landscape as one composition"
              fill
              preload
              sizes="100vw"
              quality={85}
              className="object-cover max-lg:object-[42%_40%]"
            />
          </div>
        </figure>

        <h2 className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-12 sm:px-10 lg:px-14 lg:pb-16">
          {lines.map((line) => (
            <span
              key={line}
              data-line
              className="block font-serif text-[clamp(2.05rem,9vw,3.4rem)] uppercase leading-[0.9] tracking-[-0.03em] text-background lg:text-[clamp(1.85rem,4.6vw,4.25rem)]"
            >
              {line}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
