'use client'

import { NetworkLog } from "@/app/(demo)/network/network-log"
import { Button, buttonVariants } from "@/components/ui/button"
import { ConsoleComponent } from "@/components/views/console-component"
import { routes } from "@/lib/routes"
import { useStackApp, useUser } from "@stackframe/stack"
import { AnimatePresence, motion } from 'framer-motion'
import Link from "next/link"
import { useEffect, useState } from 'react'

export function LandingPageComponent() {
  const user = useUser()
  const stackApp = useStackApp()
  const [scrollY, setScrollY] = useState(0)
  const [testApiKey, setTestApiKey] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const createTestApiKey = async () => {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isTestKey: true }),
      });
      if (response.ok) {
        const data = await response.json();
        setTestApiKey(data.key);
        return data.key;
      } else {
        console.error('Failed to create test API key');
        throw new Error('Failed to create test API key');
      }
    } catch (error) {
      console.error('Error creating test API key:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a001f] overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-opacity-80 bg-[#0a001f] text-white backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-8 h-8 bg-purple-600 rounded-lg"
            animate={{ rotate: scrollY/10 }}
          />
          <span className="text-xl font-bold">LogFlare</span>
        </div>
        {/* <nav className="hidden md:flex space-x-8">
          <a href="#" className="hover:text-purple-400 transition-colors">Product</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Pricing</a>
        </nav> */}
        <div className="flex space-x-2">
          <Link href={stackApp.urls.signIn} className="px-4 py-2 text-sm bg-transparent border border-purple-500 rounded-md hover:bg-purple-500 transition-colors">
            GitHub
          </Link>
          {user ? <Link href={routes.app.dashboard} className="px-4 py-2 text-sm bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">
            Dashboard
          </Link>: <Link href={stackApp.urls.signUp} className="px-4 py-2 text-sm bg-transparent border border-purple-500 rounded-md hover:bg-purple-500 transition-colors">
            Sign up
          </Link>}
        </div>
      </header>

      <main className="pt-20">
        <section className="relative min-h-[60vh] flex md:flex-row items-center justify-center text-center p-lg text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">LogFlare: Illuminate Your Logs</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">Real-time logging made simple.</p>
            <div className="flex space-x-4 justify-center">
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
                        <Button onClick={createTestApiKey}>
                          Create Live API Key
                      </Button>
                      <Link className={buttonVariants({ variant: "outline" })} href={user ? '/app' : stackApp.urls.signIn}>Dashboard</Link>
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
                      <div
                      className="bg-purple-800/20 backdrop-blur-sm text-muted rounded-lg p-3"
                    >
                      <p className="text-sm">Your Test API Key:</p>
                      <p className="font-mono text-lg">{testApiKey}</p>
                      </div>
                      
                      <h2 className="text-lg font-bold">To see it in action, copy your API key and paste it into your application.</h2>
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
          <ConsoleComponent onCreateTestKey={createTestApiKey} apiKey={testApiKey} />
        </motion.div>
        

        <section className="relative py-20 px-4 text-white">
          <NetworkLog />
        </section>
      </main>

    </div>
  )
}