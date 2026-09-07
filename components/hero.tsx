"use client";

import { useLayoutEffect, useRef } from "react";
import { MediaImage } from "@/components/media-image";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { images, reducedMotion } from "@/lib/media";

const CLIP_HIDDEN = "inset(100% 0% 0% 0%)";
const CLIP_FRAMED = "inset(12% 6% 28% 24%)";
const CLIP_CINEMATIC = "inset(0% 0% 22% 0%)";
const CLIP_FRAMED_MOBILE = "inset(10% 8% 22% 8%)";
const CLIP_OPEN_MOBILE = "inset(0% 0% 0% 0%)";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lineOneRef = useRef<HTMLSpanElement>(null);
  const lineTwoRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const exploreRef = useRef<HTMLAnchorElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    registerGsapPlugins();
    const mm = gsap.matchMedia();
    let onReady: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const navItems = navRef.current?.children;
      const reduce = reducedMotion();
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const framed = desktop ? CLIP_FRAMED : CLIP_FRAMED_MOBILE;

      let scrollBound = false;
      const bindScrollMotion = () => {
        if (scrollBound) return;
        scrollBound = true;
        mm.add("(min-width: 1024px)", () => {
          if (reduce) return;

          gsap
            .timeline({
              scrollTrigger: {
                trigger: pin,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.75,
              },
            })
            .to(
              frameRef.current,
              { clipPath: CLIP_CINEMATIC, duration: 1, ease: "none" },
              0,
            )
            .to(mediaRef.current, { scale: 1.1, yPercent: 5, duration: 1, ease: "none" }, 0)
            .to(headlineRef.current, { y: 28, duration: 1, ease: "none" }, 0)
            .to(copyRef.current, { autoAlpha: 0, y: -24, duration: 0.45, ease: "none" }, 0)
            .to(exploreRef.current, { autoAlpha: 0, duration: 0.3, ease: "none" }, 0);
        });

        mm.add("(max-width: 1023px)", () => {
          if (reduce) return;

          gsap
            .timeline({
              scrollTrigger: {
                trigger: pin,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.8,
              },
            })
            .to(
              frameRef.current,
              { clipPath: CLIP_OPEN_MOBILE, duration: 1, ease: "none" },
              0,
            )
            .to(
              mediaRef.current,
              { scale: 1.08, yPercent: 4, duration: 1, ease: "none" },
              0,
            )
            .to(copyRef.current, { autoAlpha: 0, y: -12, duration: 0.4, ease: "none" }, 0)
            .to(exploreRef.current, { autoAlpha: 0, duration: 0.3, ease: "none" }, 0);
        });
      };

      const returning = sessionStorage.getItem("aterra-intro") === "1";

      const playEntrance = (revealClip: boolean) => {
        if (reduce) {
          gsap.set(
            [
              logoRef.current,
              navItems,
              copyRef.current,
              exploreRef.current,
              lineOneRef.current,
              lineTwoRef.current,
            ],
            { clearProps: "all" },
          );
          gsap.set(frameRef.current, { clipPath: framed });
          bindScrollMotion();
          return;
        }

        gsap.set(frameRef.current, {
          clipPath: revealClip ? CLIP_HIDDEN : framed,
        });
        gsap.set(mediaRef.current, { scale: revealClip ? 1.12 : 1 });
        gsap.set([lineOneRef.current, lineTwoRef.current], { yPercent: 115 });
        gsap.set(
          [logoRef.current, navItems, copyRef.current, exploreRef.current],
          { autoAlpha: 0, y: 14 },
        );

        if (!revealClip) bindScrollMotion();

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            onComplete: revealClip ? bindScrollMotion : undefined,
          })
          .to(
            frameRef.current,
            { clipPath: framed, duration: revealClip ? 1.45 : 0.01, ease: "power4.out" },
            0,
          )
          .to(mediaRef.current, { scale: 1, duration: revealClip ? 1.7 : 0.01, ease: "power3.out" }, 0)
          .to(lineOneRef.current, { yPercent: 0, duration: 1, ease: "power4.out" }, 0.38)
          .to(lineTwoRef.current, { yPercent: 0, duration: 1, ease: "power4.out" }, 0.54)
          .to(logoRef.current, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.95)
          .to(navItems ?? [], { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.05 }, 1.02)
          .to(copyRef.current, { autoAlpha: 1, y: 0, duration: 0.75 }, 1.28)
          .to(exploreRef.current, { autoAlpha: 1, y: 0, duration: 0.75 }, 1.38);
      };

      if (returning || reduce) {
        playEntrance(false);
      } else {
        onReady = () => playEntrance(true);
        window.addEventListener("aterra:ready", onReady, { once: true });
      }

      gsap.to(headerRef.current, {
        paddingTop: 18,
        paddingBottom: 12,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=240",
          scrub: true,
        },
      });
    }, root);

    return () => {
      if (onReady) window.removeEventListener("aterra:ready", onReady);
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <div id="top" ref={rootRef}>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 bg-background px-6 pt-7 pb-4 sm:px-10 lg:px-14"
      >
        <div className="flex items-baseline justify-between gap-8">
          <a
            ref={logoRef}
            href="#top"
            className="shrink-0 text-[13px] tracking-[0.32em]"
          >
            ATERRA
          </a>
          <nav aria-label="Primary">
            <ul
              ref={navRef}
              className="flex items-baseline gap-7 text-[10px] uppercase tracking-[0.22em] sm:gap-10 sm:text-[11px]"
            >
              {["Projects", "Studio", "Contact"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="nav-link">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <section ref={pinRef} className="relative h-[180vh] lg:h-[220vh]">
        <div className="sticky top-0 h-dvh overflow-hidden">
          <figure
            ref={frameRef}
            className="absolute inset-0 z-0 overflow-hidden [clip-path:inset(100%_0_0_0)]"
          >
            <div ref={mediaRef} className="absolute inset-0 origin-center will-change-transform">
              <MediaImage
                src={images.hero}
                alt="Contemporary residence with timber soffits, landscaping and a swimming pool"
                priority
                sizes="100vw"
                className="object-cover object-[46%_40%] lg:object-[52%_36%]"
              />
            </div>
          </figure>

          <div className="relative z-10 flex h-full flex-col px-6 pb-6 pt-[4.5rem] sm:px-10 lg:px-14 lg:pb-0">
            <p
              ref={copyRef}
              className="mt-6 ml-auto max-w-[13.5rem] text-[12px] leading-[1.7] text-foreground/70 lg:absolute lg:top-[18%] lg:left-14 lg:ml-0 lg:mt-0 lg:max-w-[15rem] lg:text-[13px]"
            >
              Outdoor environments shaped by architecture, landscape and the way
              you live.
            </p>

            <h1
              ref={headlineRef}
              className="mt-auto font-serif text-[clamp(3.2rem,10.8vw,9.25rem)] uppercase leading-[0.86] tracking-[-0.025em] lg:mb-[7vh]"
            >
              <span className="block overflow-hidden">
                <span ref={lineOneRef} className="block">
                  Spaces made
                </span>
              </span>
              <span className="block overflow-hidden">
                <span ref={lineTwoRef} className="block">
                  To be lived.
                </span>
              </span>
            </h1>

            <a
              ref={exploreRef}
              href="#intro"
              className="nav-link w-fit pt-6 text-[10px] uppercase tracking-[0.28em] lg:pt-0 lg:pb-7"
            >
              Explore ↓
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
