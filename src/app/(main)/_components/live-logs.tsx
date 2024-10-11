'use client';

import { DynamicDataTable } from "@/components/dynamic-data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { routes } from "@/lib/routes";
import logger from '@/utils/logger';
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from 'react';

interface Log {
  id: string;
  level: string;
  message: string;
  timestamp: string;
  metadata?: any;
}

const columns: ColumnDef<Log>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => (
      <div className="truncate" title={new Date(row.getValue("timestamp")).toLocaleString()}>
        {new Date(row.getValue("timestamp")).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => <div className="truncate">{row.getValue("level")}</div>,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <div className="truncate" title={row.getValue("message")}>
        {row.getValue("message")}
      </div>
    ),
  },
  {
    accessorKey: "metadata",
    header: "Metadata",
    cell: ({ row }) => {
      const metadata = row.getValue("metadata");
      const stringifiedMetadata = JSON.stringify(metadata);
      return (
        <div className="truncate" title={stringifiedMetadata}>
          {stringifiedMetadata}
        </div>
      );
    },
  },
];

export const LiveLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isSendingTestLog, setIsSendingTestLog] = useState<boolean>(false);

  useEffect(() => {
    if (!apiKey || !isConnected) return;

    logger.info('Connecting to SSE for live logs');
    const eventSource = new EventSource(`${routes.api.sse}?key=${apiKey}`);

    eventSource.onmessage = (event) => {
      const newLog = JSON.parse(event.data);
      setLogs((prevLogs) => [...prevLogs, newLog]);
    };

    eventSource.onerror = (error) => {
      logger.error('SSE error:', error);
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      logger.info('Closing SSE connection');
      setIsConnected(false);
      eventSource.close();
    };
  }, [apiKey, isConnected]);

  const handleApiKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newApiKey = formData.get('apiKey') as string;
    setApiKey(newApiKey);
    setLogs([]); // Clear previous logs when changing API key
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setLogs([]);
  };

const handleSendTestLog = async () => {
  if (!apiKey) return;

  setIsSendingTestLog(true);
  try {
    const response = await fetch(routes.api.sendTestLog, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey }),
    });

      if (!response.ok) {
        throw new Error('Failed to send test log');
      }

      logger.info('Test log sent successfully');
    } catch (error) {
      logger.error('Error sending test log:', error);
    } finally {
      setIsSendingTestLog(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Live Application Logs</h1>
      
      <form onSubmit={handleApiKeySubmit} className="mb-4">
        <Input
          type="text"
          name="apiKey"
          placeholder="Enter API Key"
          className="mr-2"
          required
          disabled={isConnected}
        />
        {!isConnected ? (
          <Button type="submit">
            Connect
          </Button>
        ) : (
          <Button onClick={handleDisconnect} variant="destructive">
            Disconnect
          </Button>
        )}
      </form>

      {isConnected && (
        <Button
          onClick={handleSendTestLog}
          disabled={isSendingTestLog}
          className="mb-4"
        >
          {isSendingTestLog ? 'Sending...' : 'Send Test Log'}
        </Button>
      )}

      <DynamicDataTable
        columns={columns}
        data={logs}
        filterColumn="message"
      />
    </div>
  );
};