"use client";

import { ParticlesHero } from "@/app/(landing)/_components/particles-hero";
import { HeroSection } from "@/components/blocks/hero-section";
import { Header } from "@/components/headers/header";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import { FadeHeading } from "@/components/ui/fade-text";
import { MagicCard } from "@/components/ui/magic-card";
import SparklesText from "@/components/ui/sparkles-text";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  ClockIcon,
  GridIcon,
  InboxIcon,
  LayersIcon,
  MapIcon,
  Package2,
  RefreshCwIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

const features = [
  {
    icon: <LayersIcon />,
    title: "Issues",
    description: "Create new tasks and subtasks in seconds",
  },
  {
    icon: <RefreshCwIcon />,
    title: "Real-time Sync",
    description: "Synchronized instantly across all users",
  },
  {
    icon: <ClockIcon />,
    title: "Cycles",
    description: "Don't sprint - build momentum with Cycles",
  },
  {
    icon: <GridIcon />,
    title: "Projects",
    description: "Define larger initiatives and features",
  },
  {
    icon: <MapIcon />,
    title: "Roadmap",
    description: "Plan visually with live predictions",
  },
  {
    icon: <InboxIcon />,
    title: "Backlog",
    description: "A place for new issues and ideas",
  },
];

const navLinks = [
  { href: "#", label: "Dashboard" },
  { href: "#", label: "Orders" },
  { href: "#", label: "Products" },
  { href: "#", label: "Customers" },
  { href: "#", label: "Settings", isCurrent: true },
];

const userMenuItems = [
  {
    label: "Settings",
    action: () => {
      /* handle settings */
    },
  },
  {
    label: "Support",
    action: () => {
      /* handle support */
    },
  },
  {
    label: "Logout",
    action: () => {
      /* handle logout */
    },
  },
];

export default function Home() {
  const { theme } = useTheme();

  return (
    <>
      <Header
        navLinks={navLinks}
        logoHref="#"
        logoIcon={<Package2 className="h-6 w-6" />}
        logoText="Ship Kit"
        searchPlaceholder="Search documentation..."
        userMenuItems={userMenuItems}
      />

      <ParticlesHero>
        <SparklesText duration={2} sparklesCount={6} text="Ship Kit" />

        <div className="relative mx-auto mt-32 flex min-h-64 max-w-[80rem] flex-col items-center justify-center space-y-4 px-6 text-center md:px-8">
          <AnimatedGradientText>
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
          <div
            className={cn(
              "group w-auto cursor-pointer rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>🚀 Introducing Ship Kit</span>
              <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </div>
          <FadeHeading
            className="block text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-8xl"
            direction="down"
            framerProps={{
              show: { transition: { delay: 0.4 } },
            }}
            text="Launch your app in days, not weeks."
          />

          <p className="animate-fade-in mb-12 translate-y-[-1rem] text-balance text-lg tracking-tight text-gray-400 [--animation-delay:400ms] md:text-xl">
            Lift off your Next.js projects with Ship Kit.
            <br className="hidden md:block" /> Fast, flexible, and
            feature-packed for the modern web.
          </p>
        </div>
      </ParticlesHero>

      <HeroSection />

      <div className="grid grid-cols-3 gap-4">
        <MagicCard
          className="cursor-pointer flex-col items-center justify-center whitespace-nowrap text-4xl shadow-2xl"
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          Magic
        </MagicCard>
        <MagicCard
          className="cursor-pointer flex-col items-center justify-center whitespace-nowrap text-4xl shadow-2xl"
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          Card
        </MagicCard>
      </div>
    </>
  );
}
