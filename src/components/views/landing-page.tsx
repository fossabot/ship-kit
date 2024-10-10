'use client'

import { AppLoggingDashboardComponent } from '@/components/views/app-logging-dashboard'
import { ConsoleComponentComponent } from '@/components/views/console-component'
import { motion } from 'framer-motion'
import { Calendar, CheckSquare, FileText, Map, Mic, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export function LandingPageComponent() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a001f] text-white overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-opacity-90 bg-[#0a001f] backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-8 h-8 bg-purple-600 rounded-lg"
            animate={{ rotate: scrollY }}
          />
          <span className="text-xl font-bold">LogFlare</span>
        </div>
        <nav className="hidden md:flex space-x-4">
          <a href="#" className="hover:text-purple-400 transition-colors">Product</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Pricing</a>
        </nav>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm bg-transparent border border-purple-500 rounded-md hover:bg-purple-500 transition-colors">
            Login
          </button>
          <button className="px-4 py-2 text-sm bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">
            Start free trial
          </button>
        </div>
      </header>

      <ConsoleComponentComponent />
      <AppLoggingDashboardComponent />

      <main className="pt-20">
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Think better with Reflect</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">Never miss a note, idea or connection.</p>
          </motion.div>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500 rounded-full blur-3xl opacity-20" />
          </motion.div>
        </section>

        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto bg-[#1a0f2e] rounded-lg shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2 text-gray-400">
                <Search className="w-4 h-4" />
                <input type="text" placeholder="Search anything..." className="bg-transparent w-full focus:outline-none" />
                <Mic className="w-4 h-4" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 p-4">
              <div className="col-span-1 space-y-4">
                <div className="flex items-center space-x-2 text-purple-400">
                  <Calendar className="w-4 h-4" />
                  <span>Daily notes</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <FileText className="w-4 h-4" />
                  <span>All notes</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <CheckSquare className="w-4 h-4" />
                  <span>Tasks</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Map className="w-4 h-4" />
                  <span>Map</span>
                </div>
              </div>
              <div className="col-span-3 space-y-4">
                <h2 className="text-xl font-semibold">Sun, April 2nd, 2023</h2>
                <p className="text-gray-400">Today I started using Reflect</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>What is Reflect?</li>
                  <li>A note-taking tool designed to mirror the way we think</li>
                  <li>Our brains remember things through associations. Reflect mimics this by backlinking notes to each other</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}