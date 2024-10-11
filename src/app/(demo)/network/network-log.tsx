"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Settings, Wifi, WifiOff } from "lucide-react"
import { useEffect, useState } from "react"

type LogLevel = "info" | "warning" | "error" | "success"

interface NetworkRequest {
  id: string
  name: string
  status: "pending" | "success" | "error"
  type: string
  size: string
  time: number
  level: LogLevel
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const StatusIndicator = ({ status }: { status: "pending" | "success" | "error" }) => {
  const baseClasses = "h-2 w-2 rounded-full"
  const statusClasses = {
    pending: "bg-blue-400",
    success: "bg-green-400",
    error: "bg-red-400"
  }

  return (
    <motion.div
      className={`${baseClasses} ${statusClasses[status]}`}
      animate={status === "pending" ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
    />
  )
}

export function NetworkLog() {
  const [requests, setRequests] = useState<NetworkRequest[]>([])
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const request: NetworkRequest = {
              id: Math.random().toString(36).substr(2, 9),
              name: entry.name,
              status: entry.duration > 0 ? 'success' : 'error',
              type: (entry as PerformanceResourceTiming).initiatorType,
              size: formatBytes((entry as PerformanceResourceTiming).transferSize),
              time: Math.round(entry.duration),
              level: entry.duration > 1000 ? 'warning' : 'info'
            }
            setRequests((prev) => [request, ...prev.slice(0, 9)])
          }
        })
      })

      observer.observe({ entryTypes: ['resource'] })

      return () => {
        observer.disconnect()
        window.removeEventListener('online', updateOnlineStatus)
        window.removeEventListener('offline', updateOnlineStatus)
      }
    } else {
      console.warn('PerformanceObserver is not supported in this browser')
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto bg-[#1a0f2e] rounded-lg shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <h2 className="">Network Activity</h2>
        </div>
        <div className="flex items-center space-x-4">
          {isOnline ? (
            <Wifi className="text-green-400 w-5 h-5" />
          ) : (
            <WifiOff className="text-red-400 w-5 h-5" />
          )}
          <Settings className="text-gray-400 w-5 h-5" />
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {requests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 bg-opacity-50 rounded-lg p-3 text-sm text-gray-300 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <StatusIndicator status={request.status} />
                  <span className="font-medium truncate max-w-[150px]">{request.name}</span>
                </div>
                <div className="flex space-x-4 text-xs text-gray-400">
                  <span>{request.type}</span>
                  <span>{request.size}</span>
                  <span>{request.time}ms</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}