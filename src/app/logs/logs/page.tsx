'use client';

import { DynamicDataTable } from "@/components/blocks/dynamic-data-table";
import { LoadingIndicator } from "@/components/primitives/loading-indicator";
import { Checkbox } from "@/components/ui/checkbox";
import { routes } from '@/lib/routes';
import { useUser } from '@stackframe/stack';
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from 'react';

interface Log {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  prefix: string;
  emoji: string;
  metadata: string; // JSON string
  apiKeyId: string;
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
    accessorKey: "emoji",
    // header: "Emoji",
    cell: ({ row }) => <div className="truncate">{row.getValue("emoji")}</div>,
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => (
      <div className="truncate" title={new Date(row.getValue("timestamp")).toLocaleString()}>
        {new Date(row.getValue("timestamp")).toLocaleString('en-US', { hour12: false })}
      </div>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => <div className="truncate">{row.getValue("level")}</div>,
  },
  {
    accessorKey: "prefix",
    header: "Prefix",
    cell: ({ row }) => <div className="truncate">{row.getValue("prefix")}</div>,
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
      const parsedMetadata = JSON.parse(metadata as string);
      const stringifiedMetadata = JSON.stringify(parsedMetadata);
      return (
        <div className="truncate" title={stringifiedMetadata}>
          {stringifiedMetadata}
        </div>
      );
    },
  },
  {
    accessorKey: "apiKeyId",
    header: "API Key ID",
    cell: ({ row }) => <div className="truncate">{row.getValue("apiKeyId")}</div>,
  },
];

const LogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;
      try {
        const response = await fetch(routes.api.logs);
        if (!response.ok) throw new Error('Failed to fetch logs');
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Application Logs</h1>
      <DynamicDataTable
        columns={columns}
        data={logs}
        filterColumn="message"
      />
    </div>
  );
};

export default LogsPage;