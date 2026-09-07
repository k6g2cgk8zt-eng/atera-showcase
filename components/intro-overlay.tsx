"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { reducedMotion } from "@/lib/media";

const SESSION_KEY = "aterra-intro";

function shouldSkipIntro() {
  if (typeof window === "undefined") return false;
  return reducedMotion() || sessionStorage.getItem(SESSION_KEY) === "1";
}

export function IntroOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useLayoutEffect(() => {
    const root = rootRef.current;

    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShow(false);
    };

    const signalReady = () => {
      window.dispatchEvent(new Event("aterra:ready"));
    };

    if (shouldSkipIntro()) {
      signalReady();
      finish();
      return;
    }

    if (!root) return;

    const mark = root.querySelector("[data-intro-mark]");
    const word = root.querySelector("[data-intro-word]");
    const ctx = gsap.context(() => {
      gsap.set(word, { yPercent: 120 });
      gsap.set(mark, { scaleX: 0 });

      gsap
        .timeline({
          defaults: { ease: "power4.out" },
          onComplete: finish,
        })
        .to(word, { yPercent: 0, duration: 0.85 }, 0.08)
        .to(mark, { scaleX: 1, duration: 0.7, ease: "power3.out" }, 0.35)
        .to(
          root,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.95,
            ease: "power4.inOut",
            onStart: signalReady,
          },
          1.15,
        );
    }, root);

    return () => ctx.revert();
  }, []);

  if (!show) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-background [clip-path:inset(0)]"
      aria-hidden="true"
    >
      <div className="text-center">
        <p className="overflow-hidden">
          <span
            data-intro-word
            className="block text-[13px] tracking-[0.42em]"
          >
            ATERRA
          </span>
        </p>
        <span
          data-intro-mark
          className="mx-auto mt-5 block h-px w-16 origin-center bg-foreground"
        />
      </div>
    </div>
  );
}
