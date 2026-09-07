import { Cinematic } from "@/components/cinematic";
import { Contact } from "@/components/cta";
import { Cursor } from "@/components/cursor";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/intro";
import { IntroOverlay } from "@/components/intro-overlay";
import { Process } from "@/components/process";
import { Projects } from "@/components/projects";
import { Services } from "@/components/services";
import { Studio } from "@/components/studio";

export default function Home() {
  return (
    <main>
      <IntroOverlay />
      <Cursor />
      <Hero />
      <Manifesto />
      <Cinematic />
      <Projects />
      <Studio />
      <Services />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
