'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function HeroGraphic() {
  const [isBeautiful, setIsBeautiful] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsBeautiful((prev) => !prev)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const boringColors = {
    bg: "#f0f0f0",
    primary: "#cccccc",
    secondary: "#e0e0e0",
    accent: "#b0b0b0"
  }

  const beautifulColors = {
    bg: "#f8f9fa",
    primary: "#4a90e2",
    secondary: "#f39c12",
    accent: "#2ecc71"
  }

  const colors = isBeautiful ? beautifulColors : boringColors

  return (
    <div className="w-[600px] h-[400px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Mac window top bar */}
      <div className="h-8 bg-gray-200 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* App content */}
      <motion.div 
        className="h-[calc(400px-2rem)] p-6"
        animate={{ backgroundColor: colors.bg }}
        transition={{ duration: 1 }}
      >
        {/* Header */}
        <motion.div 
          className="h-8 mb-6 rounded"
          animate={{ backgroundColor: colors.primary }}
          transition={{ duration: 1 }}
        />

        {/* Main content */}
        <div className="flex space-x-6">
          {/* Sidebar */}
          <motion.div 
            className="w-1/4 space-y-4"
            animate={{ opacity: isBeautiful ? 1 : 0.7 }}
            transition={{ duration: 1 }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-8 rounded"
                animate={{ backgroundColor: i === 1 ? colors.accent : colors.secondary }}
                transition={{ duration: 1 }}
              />
            ))}
          </motion.div>

          {/* Content area */}
          <motion.div 
            className="flex-1 space-y-6"
            animate={{ opacity: isBeautiful ? 1 : 0.7 }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              className="h-32 rounded"
              animate={{ backgroundColor: colors.secondary }}
              transition={{ duration: 1 }}
            />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="h-24 rounded"
                  animate={{ 
                    backgroundColor: colors.primary,
                    scale: isBeautiful ? [1, 1.05, 1] : 1
                  }}
                  transition={{ 
                    duration: 1,
                    scale: {
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2,
                    }
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}