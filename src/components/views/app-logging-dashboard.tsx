'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

type LogLevel = 'info' | 'warning' | 'error' | 'success'

interface Log {
  id: number
  message: string
  timestamp: Date
  level: LogLevel
}

const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => {
      const level = row.getValue("level") as LogLevel
      return (
        <div className="flex items-center">
          <LogIcon level={level} />
          <span className="ml-2 capitalize">{level}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as Date
      return timestamp.toLocaleString()
    },
  },
]

const getRandomLogLevel = (): LogLevel => {
  const levels: LogLevel[] = ['info', 'warning', 'error', 'success']
  return levels[Math.floor(Math.random() * levels.length)]
}

const getRandomLogMessage = (level: LogLevel): string => {
  const messages = {
    info: [
      "User logged in successfully",
      "Data sync completed",
      "Configuration updated",
      "New user registered"
    ],
    warning: [
      "High CPU usage detected",
      "Low disk space warning",
      "API rate limit approaching",
      "Outdated dependency found"
    ],
    error: [
      "Database connection failed",
      "API request timeout",
      "Uncaught exception in module",
      "Authentication error"
    ],
    success: [
      "Backup completed successfully",
      "Payment processed",
      "Email sent successfully",
      "Task completed ahead of schedule"
    ]
  }
  return messages[level][Math.floor(Math.random() * messages[level].length)]
}

const LogIcon = ({ level }: { level: LogLevel }) => {
  switch (level) {
    case 'info':
      return <Info className="w-5 h-5 text-blue-300" />
    case 'warning':
      return <AlertCircle className="w-5 h-5 text-yellow-300" />
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-300" />
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-300" />
  }
}

export function AppLoggingDashboardComponent() {
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    // Simulate initial loading
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      addLog()
      addLog()
      addLog()
    }, 1500)
  }, [])

  const addLog = () => {
    const level = getRandomLogLevel()
    const newLog: Log = {
      id: Date.now(),
      message: getRandomLogMessage(level),
      timestamp: new Date(),
      level: level
    }
    setLogs(prevLogs => [...prevLogs, newLog])
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">App Logging Dashboard</h1>
      <div className="mb-4 flex justify-between items-center">
        <Button onClick={addLog} size="sm">
          Add Log
        </Button>
        <div className="text-sm text-gray-500">
          Total Logs: {logs.length}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 relative min-h-[500px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                <AnimatePresence initial={false}>
                  {table.getRowModel().rows.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}