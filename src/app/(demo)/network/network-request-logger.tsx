"use client"

import { AnimatePresence, motion } from "framer-motion"
import { RefreshCw, Search, Settings, Wifi, WifiOff } from "lucide-react"
import { useEffect, useState } from "react"

// Define types for our network requests
type RequestType = "fetch" | "xmlhttprequest" | "other"
type RequestStatus = "pending" | "success" | "error"

interface NetworkRequest {
  id: string
  name: string
  status: RequestStatus
  type: RequestType
  size: string
  time: number
}

// Helper function to format bytes to a human-readable string
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Component to display the status indicator
const StatusIndicator = ({ status }: { status: RequestStatus }) => {
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

export const NetworkRequestLogger: React.FC = () => {
  const [requests, setRequests] = useState<NetworkRequest[]>([])
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Update online status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Use PerformanceObserver if supported
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const request: NetworkRequest = {
              id: Math.random().toString(36).substr(2, 9),
              name: entry.name,
              status: entry.duration > 0 ? 'success' : 'error',
              type: (entry as PerformanceResourceTiming).initiatorType as RequestType,
              size: formatBytes((entry as PerformanceResourceTiming).transferSize),
              time: Math.round(entry.duration)
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
      // Fallback to simulation if PerformanceObserver is not supported
      const interval = setInterval(() => {
        const simulatedRequest: NetworkRequest = {
          id: Math.random().toString(36).substr(2, 9),
          name: `/api/endpoint${Math.floor(Math.random() * 100)}`,
          status: Math.random() > 0.8 ? 'error' : 'success',
          type: Math.random() > 0.5 ? 'fetch' : 'xmlhttprequest',
          size: formatBytes(Math.floor(Math.random() * 1000000)),
          time: Math.floor(Math.random() * 1000)
        }
        setRequests((prev) => [simulatedRequest, ...prev.slice(0, 9)])
      }, 2000)

      return () => {
        clearInterval(interval)
        window.removeEventListener('online', updateOnlineStatus)
        window.removeEventListener('offline', updateOnlineStatus)
      }
    }
  }, [])

  return (
      <div className="w-full max-w-md bg-gray-900 bg-opacity-40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
        <div className="p-6 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Network Requests</h2>
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
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search requests..."
              className="w-full bg-gray-800 bg-opacity-50 text-white placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
        <div className="flex justify-center items-center py-4 bg-gray-800 bg-opacity-30">
          <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200">
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

  )
}