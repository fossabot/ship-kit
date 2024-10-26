"use client";

import { ParticlesHero } from "@/app/(landing)/_components/particles-hero";
import { HeroSection } from "@/components/blocks/hero-section";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { MagicCard } from "@/components/ui/magic-card";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { CustomerAvatars } from "@/app/(landing)/_components/customer-avatars";
import { FeaturesGrid } from "@/app/(landing)/_components/features-grid";
import { SocialDock } from "@/app/(landing)/_components/social-dock";
import { SocialMarquee } from "@/app/(landing)/_components/social-marquee";
import { FAQ } from "@/app/(landing)/faq";
import { PricingSection } from "@/components/blocks/pricing-section";
import ExampleMasonry from "@/components/primitives/masonry";
import BlurFade from "@/components/ui/blur-fade";
import { buttonVariants } from "@/components/ui/button";
import DotPattern from "@/components/ui/dot-pattern";
import Meteors from "@/components/ui/meteors";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import NumberTicker from "@/components/ui/number-ticker";
import { RainbowButton } from "@/components/ui/rainbow-button";
import ShinyButton from "@/components/ui/shiny-button";
import { routes } from "@/config/routes";
import {
  BoxesIcon,
  ChevronRightIcon,
  Code2Icon,
  CodeIcon,
  DatabaseIcon,
  KeyIcon,
  MailIcon,
  ServerIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

const features = [
  {
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    title: "Authentication",
    description: "Secure user authentication with Auth.js",
  },
  {
    icon: <DatabaseIcon className="h-6 w-6" />,
    title: "Database",
    description: "PostgreSQL integration for robust data storage",
  },
  {
    icon: <MailIcon className="h-6 w-6" />,
    title: "Email Service",
    description: "Seamless email integration with Resend",
  },
  {
    icon: <ServerIcon className="h-6 w-6" />,
    title: "CMS",
    description: "Flexible content management with Payload CMS",
  },
  {
    icon: <KeyIcon className="h-6 w-6" />,
    title: "API Routes",
    description: "Built-in API routes for backend functionality",
  },
  {
    icon: <CodeIcon className="h-6 w-6" />,
    title: "TypeScript",
    description: "Full TypeScript support for type-safe development",
  },
];

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

const SectionHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2 className={cn("mb-12 text-center text-3xl font-bold", className)}>
    {children}
  </h2>
);

export default function Home() {
  const { theme } = useTheme();

  return (
    <>
      <div className="flex flex-col gap-20">
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
          {/* todo */}
          <SectionHeader>$99 for the first 500 users (389 left)</SectionHeader>
          <CustomerAvatars />
          <ShinyButton>
            <span className="flex items-center gap-2">
              <BoxesIcon className="size-4" /> Get ShipKit
            </span>
          </ShinyButton>
        </Section>

        <HeroSection />

        <Section>
          <SectionHeader>ShipKit is your AI Product Architect.</SectionHeader>
          <p>
            ShipKit includes a suite of AI tools to help you build your product
            faster.
            <br />
            <Link href="#" className={buttonVariants({ variant: "link" })}>
              See it in action
            </Link>
          </p>
        </Section>

        <Section>
          <SectionHeader>
            Built by a solopreneur with{" "}
            <span className="font-bold underline">Hustle</span>
          </SectionHeader>
          <p>
            A lifelong web developer with a
            <span className="font-bold underline">passion</span>
            for clean, performant, and maintainable code.
          </p>
        </Section>

        <Section>
          <SectionHeader>Featured on</SectionHeader>
          <div className="flex flex-row gap-4">
            <img src="https://picsum.photos/600/400" alt="Border Beam" />
          </div>
        </Section>

        <Section>
          <SectionHeader>
            Trusted by more than <NumberTicker value={150} /> developers
          </SectionHeader>
          <SocialMarquee />
        </Section>

        <PricingSection />

        <Section>
          <style jsx>{`
            div::before {
              content: "";
              position: absolute;
              z-index: -1;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              display: block;
              background: linear-gradient(
                280.97deg,
                #c5ecfe,
                #298aff 50.81%,
                #eeb7e7
              );
              background-size: 200%;
              transition: all var(--btn-transition) var(--ease-1);
              filter: blur(16px);
              opacity: 0;
              animation: button_buttonGlow__4y3AT 4s linear infinite forwards;
            }
          `}</style>
          Tabs: designers, developers, founders
        </Section>

        <Section className="relative gap-40 py-2xl">
          <div className="container mx-auto px-4">
            <SectionHeader>What's Included</SectionHeader>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <MagicCard
                  key={index}
                  className="cursor-pointer flex-col items-start justify-start p-6 shadow-lg"
                  gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                >
                  <div className="mb-4 flex items-center space-x-2">
                    {feature.icon}
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </MagicCard>
              ))}
            </div>
          </div>

          <DotPattern className="-z-50 [mask-image:radial-gradient(70%_50%_at_center,#ffffff80,transparent)]" />
        </Section>

        <Section>
          <SectionHeader>Stop procrastinating and get building.</SectionHeader>
          <div className="flex flex-row gap-4">
            <Link href={routes.buy} className={buttonVariants({ size: "lg" })}>
              <BoxesIcon className="size-4" /> Get ShipKit
            </Link>
            <Link
              href={routes.docs}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <Code2Icon className="size-4" /> Documentation
            </Link>
          </div>
          <span className="text-sm text-gray-500">
            Not ready to buy?
            <Link
              href={routes.docs}
              className={buttonVariants({ variant: "link", size: "sm" })}
            >
              Subscribe for updates
            </Link>
          </span>
        </Section>

        <Section>
          <NeonGradientCard className="size-auto max-w-sm items-center justify-center text-center">
            <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-6xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
              Get <span className="underline">ShipKit</span>
            </span>
          </NeonGradientCard>
          <FeaturesGrid />
        </Section>

        <ExampleMasonry />

        <Section className="max-w-3xl">
          <SectionHeader>FAQ</SectionHeader>
          <FAQ />
          <p className="text-sm text-gray-500">
            need something else?{" "}
            <Link
              href={routes.external.email}
              className={buttonVariants({ variant: "link", size: "sm" })}
            >
              ping me
            </Link>
          </p>
        </Section>

        <SocialDock className="fixed bottom-12 left-0 right-0 z-50" />
      </div>
    </>
  );
}
