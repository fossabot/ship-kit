"use client";

import { ParticlesHero } from "@/app/(landing)/_components/particles-hero";
import { HeroSection } from "@/components/blocks/hero-section";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { FadeHeading } from "@/components/ui/fade-text";
import { MagicCard } from "@/components/ui/magic-card";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { CustomerAvatars } from "@/app/(landing)/_components/customer-avatars";
import { FeaturesGrid } from "@/app/(landing)/_components/features-grid";
import { SocialDock } from "@/app/(landing)/_components/social-dock";
import DotPattern from "@/components/ui/dot-pattern";
import Meteors from "@/components/ui/meteors";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import {
  ChevronRightIcon,
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

export default function Home() {
  const { theme } = useTheme();

  return (
    <>
      <ParticlesHero>
        <div className="relative mx-auto mt-32 flex min-h-64 max-w-[80rem] flex-col items-center justify-center space-y-4 px-6 text-center md:px-8">
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

          <FadeHeading
            className="block text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-8xl"
            direction="down"
            framerProps={{
              show: { transition: { delay: 0.4 } },
            }}
            text="Launch your app in days, not weeks."
          />

          <p className="animate-fade-in mb-12 translate-y-[-1rem] text-balance text-lg tracking-tight text-gray-400 [--animation-delay:400ms] md:text-xl">
            Ship Kit is a batteries-included Next.js starter kit for building
            apps fast.
            <br className="hidden md:block" />
            Only <span className="font-bold">$20</span> for the first{" "}
            <span className="">100</span> customers{" "}
            <span className="sup">(90% off)</span>
          </p>

          <CustomerAvatars />
        </div>
        <Meteors number={4} />
      </ParticlesHero>

      <section className="container flex items-start justify-between gap-2xl">
        <NeonGradientCard className="max-w-sm items-center justify-center text-center">
          <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-6xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            Batteries <span className="underline">included</span>.
          </span>
        </NeonGradientCard>
        <FeaturesGrid />
      </section>

      <HeroSection />

      <section className="container relative flex flex-col items-center justify-center gap-40 py-2xl">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            What's Included
          </h2>
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
      </section>
      <SocialDock className="fixed bottom-12 left-0 right-0 z-50" />
    </>
  );
}
