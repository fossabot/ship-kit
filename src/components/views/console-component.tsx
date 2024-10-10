'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ConsoleComponentComponent() {
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setLogs(prevLogs => [...prevLogs, `Log entry at ${new Date().toLocaleTimeString()}`])
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isRunning])

  const handleStart = () => {
    setIsRunning(true)
    setLogs([])
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        {/* Mac-style chrome */}
        <div className="bg-gray-700 px-4 py-2 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-4 text-sm text-gray-400">Console</div>
        </div>

        {/* Console content */}
        <div className="bg-gray-900 p-4 h-80 relative">
          {!isRunning ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button onClick={handleStart} variant="outline">
                Start Console
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <AnimatePresence initial={false}>
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-green-400 mb-2"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          )}

          {/* Sonar-like pulse animation */}
          {isRunning && (
            <motion.div
              className="absolute bottom-4 right-4 w-4 h-4 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0.3, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}