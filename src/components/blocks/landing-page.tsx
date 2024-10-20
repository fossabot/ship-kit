"use client";

import { NetworkLog } from "@/app/(demo)/network/network-log";
import { ConsoleComponent } from "@/components/blocks/console-component";
import AnimatedButton from "@/components/buttons/animated-button/animated-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useStackApp, useUser } from "@stackframe/stack";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingPageComponent() {
  const user = useUser();
  const stackApp = useStackApp();
  const [scrollY, setScrollY] = useState(0);
  const [testApiKey, setTestApiKey] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const createTestApiKey = async () => {
    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isTestKey: true }),
      });
      if (response.ok) {
        const data = await response.json();
        setTestApiKey(data.key);
        return data.key;
      } else {
        console.error("Failed to create test API key");
        throw new Error("Failed to create test API key");
      }
    } catch (error) {
      console.error("Error creating test API key:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0a001f]">
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[#0a001f] bg-opacity-80 p-4 text-white backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <motion.div
            className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#818cf8] to-[#ec4899]"
            animate={{ rotate: scrollY / 10 }}
          />
          <span className="text-xl font-bold">Lacy</span>
        </div>
        {/* <nav className="hidden md:flex space-x-8">
          <a href="#" className="hover:text-purple-400 transition-colors">Product</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Pricing</a>
        </nav> */}
        <div className="flex space-x-2">
          <Link
            href={routes.external.github}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "link" }),
              "duration-400 text-white/70 transition-all hover:text-white",
            )}
          >
            GitHub
          </Link>
          {user ? (
            <AnimatedButton href={routes.app.dashboard}>
              Dashboard
            </AnimatedButton>
          ) : (
            <AnimatedButton href={stackApp.urls.signUp}>Sign up</AnimatedButton>
          )}
        </div>
      </header>

      <main className="pt-20">
        <section className="p-lg relative flex min-h-[60vh] items-center justify-center text-center md:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
              LogFlare: Illuminate Your Logs
            </h1>
            <p className="mb-8 text-xl text-gray-300 text-white md:text-2xl">
              Real-time logging made simple.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="relative h-12">
                <AnimatePresence mode="wait">
                  {!testApiKey ? (
                    <motion.div
                      key="button"
                      initial={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex space-x-4">
                        <Button variant="outline" onClick={createTestApiKey}>
                          Create Live API Key
                        </Button>
                        <Link
                          className={buttonVariants()}
                          href={user ? "/app" : stackApp.urls.signIn}
                        >
                          Dashboard
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="apiKey"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <>
                        <div className="text-muted rounded-lg bg-purple-800/20 p-3 backdrop-blur-sm">
                          <p className="text-sm">Your Test API Key:</p>
                          <p className="font-mono text-lg">{testApiKey}</p>
                        </div>

                        <h2 className="text-lg font-bold">
                          To see it in action, copy your API key and paste it
                          into your application.
                        </h2>
                        <code className="text-muted-foreground text-left">
                          <pre>{`// ...in next.config.js
import { withLogFlare } from 'logflare'

// Replace \`export default nextConfig;\` with the following:
export default withLogFlare('${testApiKey}')(nextConfig);`}</pre>
                        </code>
                      </>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <ConsoleComponent
            onCreateTestKey={createTestApiKey}
            apiKey={testApiKey}
          />
        </motion.div>

        <section className="relative px-4 py-20 text-white">
          <NetworkLog />
        </section>
      </main>
    </div>
  );
}
