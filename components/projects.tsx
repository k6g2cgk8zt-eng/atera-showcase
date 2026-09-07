"use client";

import { useLayoutEffect, useRef } from "react";
import { MediaImage } from "@/components/media-image";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { images, isFinePointer, reducedMotion } from "@/lib/media";

const projects = [
  {
    id: "01",
    name: "Casa Alma",
    place: "Palm Beach",
    meta: "2026  ·  Residential  ·  Landscape",
    src: images.casaAlma,
    alt: "Twilight pool terrace of Casa Alma in Palm Beach",
    layout: "full" as const,
    pan: true,
  },
  {
    id: "02",
    name: "Desert House",
    place: "Scottsdale",
    meta: "2025  ·  Residential  ·  Outdoor Architecture",
    src: images.desertHouse,
    alt: "Desert House, a contemporary residence in Scottsdale",
    layout: "offset" as const,
    pan: false,
  },
  {
    id: "03",
    name: "Villa Norte",
    place: "Miami",
    meta: "2025  ·  Residential  ·  Courtyard Living",
    src: images.villaNorte,
    alt: "Villa Norte, a Miami residence ordered around outdoor rooms",
    layout: "bleed" as const,
    pan: true,
  },
];

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerGsapPlugins();
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const reduce = reducedMotion();
      const articles = gsap.utils.toArray<HTMLElement>("[data-project]");

      if (!reduce) {
        articles.forEach((article) => {
          const media = article.querySelector<HTMLElement>("[data-media]");
          if (!media) return;
          gsap.fromTo(
            media,
            { scale: 1.08 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: article,
                start: "top 90%",
                end: "top 30%",
                scrub: 0.7,
              },
            },
          );
        });
      }

      mm.add("(max-width: 1023px)", () => {
        if (reduce) return;

        articles.forEach((article) => {
          const hover = article.querySelector<HTMLElement>("[data-hover]");
          if (!hover || article.dataset.pan !== "true") return;

          gsap.fromTo(
            hover,
            { xPercent: 6 },
            {
              xPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: article,
                start: "top 85%",
                end: "bottom 35%",
                scrub: 0.9,
              },
            },
          );
        });
      });

      if (reduce || !isFinePointer()) return;

      articles.forEach((article) => {
        const hover = article.querySelector<HTMLElement>("[data-hover]");
        const title = article.querySelector<HTMLElement>("[data-title]");
        if (!hover) return;

        const onMove = (event: MouseEvent) => {
          const rect = hover.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
          gsap.to(hover, {
            x,
            y,
            duration: 0.7,
            ease: "power3.out",
            overwrite: "auto",
          });
          if (title) {
            gsap.to(title, {
              x: x * 0.12,
              duration: 0.7,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        const onLeave = () => {
          gsap.to(hover, { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
          if (title) {
            gsap.to(title, { x: 0, duration: 0.8, ease: "power3.out" });
          }
        };

        hover.addEventListener("mousemove", onMove);
        hover.addEventListener("mouseleave", onLeave);
      });
    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section id="projects" ref={rootRef} className="px-6 py-[12vh] sm:px-10 lg:px-14">
      <p className="text-[10px] uppercase tracking-[0.28em] text-foreground/55">
        Selected work
      </p>

      <div className="mt-16 space-y-[18vh] max-lg:space-y-[14vh]">
        {projects.map((project) => (
          <article
            key={project.name}
            data-project
            data-pan={project.pan ? "true" : "false"}
          >
            {project.layout === "full" && (
              <div>
                <figure
                  data-cursor="view"
                  data-cursor-label="View"
                  className="relative h-[72vh] overflow-hidden lg:h-auto lg:aspect-[16/10]"
                >
                  <div data-media className="absolute inset-[-5%] max-lg:inset-[-8%_-22%]">
                    <div data-hover className="absolute inset-0 will-change-transform">
                      <MediaImage
                        src={project.src}
                        alt={project.alt}
                        sizes="100vw"
                        className="object-cover object-[58%_46%] lg:object-center"
                      />
                    </div>
                  </div>
                </figure>
                <div className="mt-8 max-w-[36rem]">
                  <p className="text-[11px] tracking-[0.22em] text-foreground/45">
                    {project.id}
                  </p>
                  <h2
                    data-title
                    className="mt-3 font-serif text-[clamp(2.4rem,11vw,5.5rem)] uppercase leading-[0.86] tracking-[-0.03em] lg:text-[clamp(2.4rem,6vw,5.5rem)]"
                  >
                    {project.name}
                  </h2>
                  <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-foreground/70">
                    {project.place}
                  </p>
                  <p className="mt-2 text-[11px] tracking-[0.16em] text-foreground/50">
                    {project.meta}
                  </p>
                </div>
              </div>
            )}

            {project.layout === "offset" && (
              <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
                <div className="max-lg:max-w-[22rem] lg:col-span-4 lg:pb-4">
                  <p className="text-[11px] tracking-[0.22em] text-foreground/45">
                    {project.id}
                  </p>
                  <h2
                    data-title
                    className="mt-3 font-serif text-[clamp(2.2rem,10vw,4.5rem)] uppercase leading-[0.86] tracking-[-0.03em] lg:text-[clamp(2.2rem,5vw,4.5rem)]"
                  >
                    {project.name}
                  </h2>
                  <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-foreground/70">
                    {project.place}
                  </p>
                  <p className="mt-2 text-[11px] tracking-[0.16em] text-foreground/50">
                    {project.meta}
                  </p>
                </div>
                <figure
                  data-cursor="view"
                  data-cursor-label="View"
                  className="relative aspect-[4/5] overflow-hidden max-lg:-mx-6 max-lg:aspect-[3/4] sm:max-lg:-mx-10 lg:col-span-7 lg:col-start-6 lg:mx-0 lg:aspect-[5/6]"
                >
                  <div data-media className="absolute inset-[-5%]">
                    <div data-hover className="absolute inset-0">
                      <MediaImage
                        src={project.src}
                        alt={project.alt}
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover object-[72%_46%] lg:object-center"
                      />
                    </div>
                  </div>
                </figure>
              </div>
            )}

            {project.layout === "bleed" && (
              <div className="-mx-6 sm:-mx-10 lg:-mx-14">
                <figure
                  data-cursor="view"
                  data-cursor-label="View"
                  className="relative h-[86vh] min-h-[34rem] overflow-hidden lg:h-[72vh] lg:min-h-[28rem]"
                >
                  <div data-media className="absolute inset-[-5%] max-lg:inset-[-6%_-16%]">
                    <div data-hover className="absolute inset-0 will-change-transform">
                      <MediaImage
                        src={project.src}
                        alt={project.alt}
                        sizes="100vw"
                        className="object-cover object-[46%_58%] lg:object-center"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 px-6 py-10 sm:px-10 lg:px-14">
                    <p className="text-[11px] tracking-[0.22em] text-background/80">
                      {project.id}
                    </p>
                    <h2
                      data-title
                      className="mt-3 font-serif text-[clamp(2.4rem,11vw,5.5rem)] uppercase leading-[0.86] tracking-[-0.03em] text-background [text-shadow:0_8px_40px_rgba(26,22,18,0.35)] lg:text-[clamp(2.4rem,6vw,5.5rem)]"
                    >
                      {project.name}
                    </h2>
                    <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-background/80">
                      {project.place}
                      <span className="mt-2 block text-[11px] tracking-[0.16em] text-background/65">
                        {project.meta}
                      </span>
                    </p>
                  </div>
                </figure>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
