'use client'

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
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

type LogLevel = 'info' | 'warning' | 'error' | 'success'

interface Log {
  id: number
  message: string
  timestamp: string
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
      const timestamp = row.getValue("timestamp") as string
      return new Date(timestamp).toLocaleString()
    },
  },
]

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

interface AppLoggingDashboardComponentProps {
  apiKey: string | null;
}

export function AppLoggingDashboardComponent({ apiKey }: AppLoggingDashboardComponentProps) {
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    if (!apiKey) return;

    setIsLoading(true);
    const eventSource = new EventSource(`/api/sse-logs?key=${apiKey}`);

    eventSource.onmessage = (event) => {
      const newLog = JSON.parse(event.data);
      setLogs((prevLogs) => [...prevLogs, newLog]);
      setIsLoading(false);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
      setIsLoading(false);
    };

    return () => {
      eventSource.close();
    };
  }, [apiKey]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">App Logging Dashboard</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Total Logs: {logs.length}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 relative min-h-[500px]">
        {isLoading ? (
          <LoadingIndicator />
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