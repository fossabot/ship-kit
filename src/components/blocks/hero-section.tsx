"use client";

import { Button } from "@/components/ui/button";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { useWindowScroll } from "@uidotdev/usehooks";
import { ArrowRight, Box, Code, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] absolute inset-0 bg-[bottom_1px_center] dark:border-b dark:border-slate-100/5 dark:bg-bottom" />
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="h-1 w-1 animate-pulse rounded-full bg-gray-500"
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export function HeroSection() {
  const [{ y }] = useWindowScroll();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) {
      setActive(y > 100);
    }
  }, [y]);

  return (
    <section className="relative w-full bg-background py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Ship Kit
                <br />
                The Next.js 15 Starter Kit
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Send your Next.js projects with Ship Kit. Fast, flexible, and
                feature-packed for the modern web.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/get-started">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  View Docs
                  <Code className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div
              className={`relative ${active ? "opacity-100 transition-opacity duration-1000 ease-in-out animate-in zoom-in-50" : "opacity-0"}`}
            >
              <NeonGradientCard className="max-w-sm items-center justify-center text-center">
                <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-6xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                  Ship your app <span className="font-bold">today</span>.
                </span>
              </NeonGradientCard>
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center space-x-3 rounded-lg bg-muted p-4">
            <Zap className="h-6 w-6 text-primary" />
            <p className="text-sm font-medium">Lightning-fast performance</p>
          </div>
          <div className="flex items-center space-x-3 rounded-lg bg-muted p-4">
            <Box className="h-6 w-6 text-primary" />
            <p className="text-sm font-medium">Pre-configured components</p>
          </div>
          <div className="flex items-center space-x-3 rounded-lg bg-muted p-4">
            <Code className="h-6 w-6 text-primary" />
            <p className="text-sm font-medium">TypeScript ready</p>
          </div>
        </div>
      </div>
    </section>
  );
}
