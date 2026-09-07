"use client";

import { useLayoutEffect, useRef } from "react";
import { MediaImage } from "@/components/media-image";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { images, reducedMotion } from "@/lib/media";

const principles = [
  {
    title: "Architecture",
    copy: "Outdoor rooms held with the same proportion as the house — walls of air, stone and shade.",
  },
  {
    title: "Landscape",
    copy: "Planting as structure, not ornament. Ground, canopy and water in a single composition.",
  },
  {
    title: "Materiality",
    copy: "Limestone, timber, plaster and metal, chosen to weather and to hold the light.",
  },
  {
    title: "Atmosphere",
    copy: "Quiet heat, long shadows, the sound of water. Places meant to be inhabited slowly.",
  },
];

export function Studio() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerGsapPlugins();

    const ctx = gsap.context(() => {
      if (reducedMotion()) return;

      gsap.from(root.querySelectorAll("[data-principle]"), {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          once: true,
        },
      });

      gsap.fromTo(
        mediaRef.current,
        { yPercent: -4, scale: 1.08 },
        {
          yPercent: 5,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: mediaRef.current,
            start: "top 90%",
            end: "top 20%",
            scrub: 0.7,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="studio"
      ref={rootRef}
      className="px-6 py-[16vh] sm:px-10 lg:px-14"
    >
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 lg:pt-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-foreground/55">
            Philosophy
          </p>
          <h2 className="mt-6 max-w-[12ch] font-serif text-[clamp(2.4rem,5vw,4.75rem)] leading-[0.92] tracking-[-0.03em]">
            Built for the way you live outdoors.
          </h2>
          <p className="mt-8 max-w-[28rem] text-[15px] leading-8 text-foreground/70">
            We do not decorate the edge of a building. We design the ground
            plane, the water, the shade and the sequence between them.
          </p>

          <ul className="mt-16 space-y-10">
            {principles.map((item) => (
              <li
                key={item.title}
                data-principle
                className="grid gap-3 border-t border-foreground/15 pt-6 sm:grid-cols-[8rem_1fr] sm:gap-8"
              >
                <p className="text-[11px] uppercase tracking-[0.2em]">
                  {item.title}
                </p>
                <p className="max-w-[28rem] text-[14px] leading-7 text-foreground/70">
                  {item.copy}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative aspect-[5/6] overflow-hidden max-lg:-mx-6 sm:max-lg:-mx-10 lg:col-span-5 lg:col-start-8 lg:mx-0 lg:mt-[20vh] lg:aspect-[4/5]">
          <div ref={mediaRef} className="absolute inset-0 max-lg:inset-[-4%]">
            <MediaImage
              src={images.studio}
              alt="Evening facade of a contemporary house in timber, stone and glass"
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-[48%_38%] lg:object-center"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
