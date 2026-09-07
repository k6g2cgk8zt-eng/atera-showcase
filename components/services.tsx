"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { images, isFinePointer, reducedMotion } from "@/lib/media";

const services = [
  {
    name: "Landscape Design",
    copy: "Site, planting and the ground plane — from arrival to the last terrace.",
    src: images.practiceLandscape,
    alt: "Landscape planting as structure",
  },
  {
    name: "Outdoor Architecture",
    copy: "Pavilions, walls, stairs and shade structures with the discipline of the house.",
    src: images.practiceArchitecture,
    alt: "Contemporary outdoor architecture at dusk",
  },
  {
    name: "Pool Environments",
    copy: "Water as a room: edge, depth, reflection and the way the body meets it.",
    src: images.practicePool,
    alt: "A still swimming pool as an outdoor room",
  },
  {
    name: "Outdoor Kitchens",
    copy: "Cooking, dining and lingering, composed as one sequence of use.",
    src: images.practiceKitchen,
    alt: "A refined kitchen opening to the garden",
  },
  {
    name: "Lighting + Material Direction",
    copy: "Surfaces and light that hold through the day and into the evening.",
    src: images.practiceLight,
    alt: "Warm interior light looking toward the landscape",
  },
];

export function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string>(services[0].src);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const preview = previewRef.current;
    if (!root || !preview) return;
    if (!isFinePointer() || reducedMotion()) return;

    gsap.set(preview, { autoAlpha: 0, x: 0, y: 0 });

    const onEnter = (event: Event) => {
      const row = event.currentTarget as HTMLElement;
      const src = row.dataset.image;
      if (src) setPreviewSrc(src);
      gsap.to(preview, { autoAlpha: 1, duration: 0.35, ease: "power3.out" });
    };
    const onMove = (event: MouseEvent) => {
      gsap.to(preview, {
        x: event.clientX + 28,
        y: event.clientY - 96,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      gsap.to(preview, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
    };

    const rows = root.querySelectorAll<HTMLElement>("[data-service]");
    rows.forEach((row) => {
      row.addEventListener("mouseenter", onEnter);
      row.addEventListener("mousemove", onMove);
      row.addEventListener("mouseleave", onLeave);
    });

    return () => {
      rows.forEach((row) => {
        row.removeEventListener("mouseenter", onEnter);
        row.removeEventListener("mousemove", onMove);
        row.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <section className="relative px-6 py-[12vh] sm:px-10 lg:px-14" ref={rootRef}>
      <p className="text-[10px] uppercase tracking-[0.28em] text-foreground/55">
        Capabilities
      </p>
      <h2 className="mt-6 font-serif text-[clamp(2.2rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.03em]">
        Practice
      </h2>

      <ul className="mt-16 border-t border-foreground/15">
        {services.map((service, index) => (
          <li key={service.name}>
            <div
              data-service
              data-image={service.src}
              className="group grid cursor-default grid-cols-[3rem_1fr] gap-4 border-b border-foreground/15 py-7 md:grid-cols-[4.5rem_minmax(0,0.42fr)_1fr] md:items-baseline md:gap-8 md:py-9"
            >
              <span className="text-[11px] tracking-[0.18em] text-foreground/45">
                0{index + 1}
              </span>
              <h3 className="font-serif text-[clamp(1.6rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.02em] transition-transform duration-500 ease-out group-hover:translate-x-2">
                {service.name}
              </h3>
              <p className="col-span-2 max-w-[26rem] text-[13px] leading-7 text-foreground/65 transition-transform duration-500 ease-out md:col-span-1 md:justify-self-end md:text-right md:opacity-70 md:group-hover:translate-x-[-6px] md:group-hover:opacity-100">
                {service.copy}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        className="pointer-events-none fixed top-0 left-0 z-40 hidden h-44 w-32 overflow-hidden lg:block"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewSrc}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
