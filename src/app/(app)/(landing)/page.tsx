import { ParticlesHero } from "@/app/(app)/(landing)/_components/particles-hero";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { ExamplesNav } from "@/app/(app)/(demo)/examples/_components/examples-nav";
import MusicPage from "@/app/(app)/(demo)/examples/music/page";
import { CustomerAvatars } from "@/app/(app)/(landing)/_components/customer-avatars";
import { FeaturesGrid } from "@/app/(app)/(landing)/_components/features-grid";
import { SocialDock } from "@/app/(app)/(landing)/_components/social-dock";
import { SocialMarquee } from "@/app/(app)/(landing)/_components/social-marquee";
import { FAQ } from "@/app/(app)/(landing)/faq";
import { PricingSection } from "@/components/blocks/pricing-section";
import AnimatedButton from "@/components/buttons/animated-button/animated-button";
import { Icons } from "@/components/images/icons";
import ExampleMasonry from "@/components/primitives/masonry";
import BlurFade from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { buttonVariants } from "@/components/ui/button";
import Meteors from "@/components/ui/meteors";
import NumberTicker from "@/components/ui/number-ticker";
import { RainbowButton } from "@/components/ui/rainbow-button";
import ShinyButton from "@/components/ui/shiny-button";
import { routes } from "@/config/routes";
import { BoxesIcon, ChevronRightIcon } from "lucide-react";

const Section = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={cn(
      "container flex flex-col items-center justify-center gap-2xl",
      className,
    )}
  >
    {children}
  </section>
);

const SectionTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2 className={cn("font-bold uppercase text-accent-foreground", className)}>
    {children}
  </h2>
);

const SectionHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3
    className={cn(
      "font-heading text-balance text-3xl font-semibold tracking-tight sm:text-4xl",
      className,
    )}
  >
    {children}
  </h3>
);

const SectionCopy = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={cn(
      "max-w-2xl text-center text-lg text-muted-foreground",
      className,
    )}
  >
    {children}
  </p>
);

const SectionContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex w-full flex-col items-center justify-center gap-4",
      className,
    )}
  >
    {children}
  </div>
);

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-20 overflow-hidden">
        <ParticlesHero>
          <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="relative mx-auto flex min-h-64 max-w-[80rem] flex-col items-center justify-center gap-4 px-6 text-center md:px-8">
              <BlurFade delay={1} duration={1} inView>
                <Link href="/">
                  <AnimatedGradientText className="bg-blue">
                    🚀 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
                    <span
                      className={cn(
                        `inline animate-gradient bg-gradient-to-r from-[#ff8aab] via-[#9c40ff] to-[#ff8aab] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                      )}
                    >
                      Introducing Ship Kit
                    </span>
                    <ChevronRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                  </AnimatedGradientText>
                </Link>
              </BlurFade>
              <BlurFade delay={0.5} duration={0.5} inView>
                <h1 className="text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-8xl">
                  Launch your app at light speed.
                </h1>
              </BlurFade>

              <BlurFade delay={1} duration={1} inView>
                <p className="animate-fade-in mb-12 translate-y-[-1rem] text-balance text-lg tracking-tight text-gray-400 [--animation-delay:400ms] md:text-xl">
                  Ship Kit is a batteries-included Next.js starter kit for
                  building apps fast.
                  <br className="hidden md:block" />
                </p>
              </BlurFade>
            </div>

            <div className="mt-4 flex items-center justify-center gap-lg">
              <BlurFade delay={2.5} duration={1} inView>
                <RainbowButton className="flex items-center gap-2">
                  <BoxesIcon className="size-5" /> Get ShipKit
                </RainbowButton>
              </BlurFade>
            </div>
          </div>
          <Meteors number={4} />
        </ParticlesHero>

        <Section>
          <SectionHeader>Build apps like these</SectionHeader>
          <ExamplesNav />

          <div className="relative flex max-h-[400px] max-w-full flex-col overflow-hidden rounded-lg border bg-background [mask-image:linear-gradient(to_bottom,white,transparent)] md:shadow-xl lg:max-w-4xl">
            <MusicPage />
            <BorderBeam size={250} duration={12} delay={9} />
          </div>
        </Section>

        <Section>
          <SectionHeader>$99 for the first 500 users (389 left)</SectionHeader>
          <CustomerAvatars />
          <ShinyButton>
            <span className="flex items-center gap-2">
              <BoxesIcon className="size-4" /> Get ShipKit
            </span>
          </ShinyButton>
        </Section>

        <Section>
          <SectionTitle>AI Workflows</SectionTitle>
          <SectionHeader>Supercharged AI tools</SectionHeader>
          <SectionCopy>
            We ❤️ v0. <br />
            ShipKit includes a suite of AI tools to help you build your product
            faster.
            <br />
            <Link href="#" className={buttonVariants({ variant: "link" })}>
              See it in action
            </Link>
          </SectionCopy>
        </Section>

        <Section>
          <SectionHeader>
            Built by a solopreneur with{" "}
            <span className="font-bold underline">Hustle</span>
          </SectionHeader>
          <SectionCopy>
            A lifelong web developer with a
            <span className="font-bold underline">passion</span>
            for clean, performant, and maintainable code.
          </SectionCopy>
        </Section>

        <Section>
          <SectionHeader>
            Trusted by more than <NumberTicker value={150} /> developers
          </SectionHeader>
          <SectionContent className="">
            <SocialMarquee />
          </SectionContent>
        </Section>

        <PricingSection />

        <Section>Tabs: designers, developers, founders</Section>

        <Section>
          <SectionHeader>Stop procrastinating and get building.</SectionHeader>
          <SectionContent>
            <AnimatedButton size="lg">Get Started</AnimatedButton>
            <span className="text-sm text-gray-500">
              Not ready to buy?
              <Link
                href={routes.docs}
                className={buttonVariants({ variant: "link", size: "sm" })}
              >
                Subscribe for updates
              </Link>
            </span>
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>Made with you in mind</SectionHeader>
          <SectionCopy>
            ShipKit isn't just for Developers.
            <br />
            We include tools for Marketers, Designers, and Founders. Export
            Figma directly into React components, drag-and-drop code using
            Builder, and manage your documentation with Markdown.
          </SectionCopy>
          <SectionContent>
            <FeaturesGrid />
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>Built for developers</SectionHeader>
          <SectionCopy>
            ShipKit is built for developers by a developer.
          </SectionCopy>
          <SectionContent>
            <div className="mx-auto flex h-12 w-full max-w-md gap-4">
              <Icons.next />
              <Icons.react />
              <Icons.tailwind />
              <Icons.shadcn />
              <Icons.typescript />
            </div>
          </SectionContent>
        </Section>

        <Section className="max-w-3xl">
          <SectionTitle>FAQ</SectionTitle>
          <SectionHeader>Frequently Asked Questions</SectionHeader>
          <SectionCopy>
            For other questions, please contact me on{" "}
            <Link href={routes.external.email}>email</Link> or{" "}
            <Link href={routes.external.x_follow}>X</Link>
          </SectionCopy>
          <SectionContent>
            <FAQ />
          </SectionContent>
          <SectionCopy className="text-sm text-gray-500">
            need something else?{" "}
            <Link
              href={routes.external.email}
              className={buttonVariants({ variant: "link", size: "sm" })}
            >
              ping me
            </Link>
          </SectionCopy>
        </Section>

        <Section>
          <SectionTitle>Showcase</SectionTitle>
          <SectionHeader>We can't wait to see what you build</SectionHeader>
          <ExampleMasonry />
        </Section>

        <SocialDock className="fixed bottom-12 left-0 right-0 z-50" />
      </div>
    </>
  );
}
