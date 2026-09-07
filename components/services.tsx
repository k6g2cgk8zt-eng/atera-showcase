"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/media-image";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { images, isFinePointer, reducedMotion } from "@/lib/media";

const services = [
  {
    name: "Landscape Design",
    copy: "Site, planting and the ground plane — from arrival to the last terrace.",
    src: images.practiceLandscape,
    alt: "Landscape planting as structure",
    object: "object-[50%_58%]",
    aspect: "aspect-[4/3]",
  },
  {
    name: "Outdoor Architecture",
    copy: "Pavilions, walls, stairs and shade structures with the discipline of the house.",
    src: images.practiceArchitecture,
    alt: "Contemporary outdoor architecture at dusk",
    object: "object-[48%_40%]",
    aspect: "aspect-[5/6]",
  },
  {
    name: "Pool Environments",
    copy: "Water as a room: edge, depth, reflection and the way the body meets it.",
    src: images.practicePool,
    alt: "A still swimming pool as an outdoor room",
    object: "object-[50%_55%]",
    aspect: "aspect-[4/3]",
  },
  {
    name: "Outdoor Kitchens",
    copy: "Cooking, dining and lingering, composed as one sequence of use.",
    src: images.practiceKitchen,
    alt: "A refined kitchen opening to the garden",
    object: "object-[52%_48%]",
    aspect: "aspect-[5/4]",
  },
  {
    name: "Lighting + Material Direction",
    copy: "Surfaces and light that hold through the day and into the evening.",
    src: images.practiceLight,
    alt: "Warm interior light looking toward the landscape",
    object: "object-[50%_42%]",
    aspect: "aspect-[5/4]",
  },
];

export function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string>(services[0].src);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const preview = previewRef.current;
    if (!root) return;

    registerGsapPlugins();
    const mm = gsap.matchMedia();
    const reduce = reducedMotion();

    mm.add("(max-width: 1023px)", () => {
      if (reduce) return;

      const figures = root.querySelectorAll<HTMLElement>("[data-practice-media]");
      figures.forEach((figure) => {
        const media = figure.querySelector<HTMLElement>("[data-practice-inner]");
        gsap.set(figure, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(media, { scale: 1.08 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: figure,
              start: "top 88%",
              end: "top 52%",
              scrub: 0.65,
            },
          })
          .to(figure, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
          .to(media, { scale: 1, ease: "none" }, 0);
      });
    });

    if (!preview || !isFinePointer() || reduce) {
      return () => mm.revert();
    }

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
      mm.revert();
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
              <figure
                data-practice-media
                className={`relative col-span-2 mt-2 overflow-hidden md:col-span-3 lg:hidden ${service.aspect}`}
              >
                <div
                  data-practice-inner
                  className="absolute inset-0 origin-center will-change-transform"
                >
                  <MediaImage
                    src={service.src}
                    alt={service.alt}
                    sizes="100vw"
                    className={`object-cover ${service.object}`}
                  />
                </div>
              </figure>
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
