"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function registerGsapPlugins() {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
