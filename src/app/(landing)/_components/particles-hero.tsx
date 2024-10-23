"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { FadeHeading } from "@/components/ui/fade-text";
import Particles from "@/components/ui/particles";
import SparklesText from "@/components/ui/sparkles-text";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";

export function ParticlesHero() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <div className="relative flex w-full flex-col justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <SparklesText duration={2} sparklesCount={6} text="Ship Kit" />
      <div className="z-10 flex min-h-64 items-center justify-center">
        <AnimatedGradientText>
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
          <span
            className={cn(
              `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
            )}
          >
            Introducing Ship Kit
          </span>
          <ChevronRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedGradientText>
      </div>

      <div className="relative mx-auto mt-32 max-w-[80rem] space-y-4 px-6 text-center md:px-8">
        <FadeHeading
          className="block text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-8xl"
          direction="down"
          framerProps={{
            show: { transition: { delay: 0.4 } },
          }}
          text="Launch your startup in days, not weeks."
        />

        <p className="animate-fade-in mb-12 translate-y-[-1rem] text-balance text-lg tracking-tight text-gray-400 [--animation-delay:400ms] md:text-xl">
          Beautifully designed, animated components and templates built with
          <br className="hidden md:block" /> Tailwind CSS, React, and Framer
          Motion.
        </p>
      </div>
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
}
