'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ConsoleComponentProps {
  onCreateTestKey: () => Promise<string>;
  apiKey: string | null;
}

export function ConsoleComponent({ onCreateTestKey, apiKey }: ConsoleComponentProps) {
  const [isRunning, setIsRunning] = useState(true)
  const [logs, setLogs] = useState<string[]>([])

  const isActive = isRunning && apiKey

  useEffect(() => {
    if (isActive) {
      const eventSource = new EventSource(`/api/sse-logs?key=${apiKey}`);

      eventSource.onmessage = (event) => {
        const newLog = JSON.parse(event.data);
        setLogs(prevLogs => [...prevLogs, `${new Date(newLog.timestamp).toLocaleTimeString()} - ${newLog.level.toUpperCase()}: ${newLog.message}`]);
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close();
        setIsRunning(false);
      };

      return () => {
        eventSource.close();
      };
    }
  }, [isActive]);

  const handleStart = async () => {
    if (!apiKey) {
      await onCreateTestKey();
    }
    setIsRunning(true);
    setLogs([]);
  }

  const sendTestLog = async () => {
    if (!apiKey) return;
    try {
      await fetch('/api/send-test-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });
    } catch (error) {
      console.error('Error sending test log:', error);
    }
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto mt-10 relative text-inherit">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        {/* Mac-style chrome */}
        <div className="bg-gray-700 px-4 py-2 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-sm text-gray-400">Console</div>
        </div>

        {/* Console content */}
        <div className="bg-gray-900 p-4 h-80 relative">
          {isActive ? (
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
          ): (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <Button onClick={handleStart} variant="outline">
                {apiKey ? 'Start Console' : 'Create API Key & Start Console'}
              </Button>
            </div>
          )}

          {/* Sonar-like pulse animation */}
                    {isActive && (
            <Button onClick={sendTestLog} variant="outline" size="sm" className="absolute bottom-4 left-4">
              Send Test Log
            </Button>
          )}
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