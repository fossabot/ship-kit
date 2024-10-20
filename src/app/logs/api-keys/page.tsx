'use client';

import { DynamicDataTable } from "@/components/blocks/dynamic-data-table";
import { SuspenseFallback } from "@/components/primitives/suspense-fallback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { routes } from '@/lib/routes';
import { useUser } from '@stackframe/stack';
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from 'react';

interface ApiKey {
  id: string;
  key: string;
  createdAt: string;
}

const columns: ColumnDef<ApiKey>[] = [
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
    accessorKey: "key",
    header: "API Key",
    cell: ({ row }) => (
      <div className="truncate" title={row.getValue("key")}>
        {row.getValue("key")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="truncate" title={new Date(row.getValue("createdAt")).toLocaleString()}>
        {new Date(row.getValue("createdAt")).toLocaleString()}
      </div>
    ),
  },
];

const ApiKeysPage = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!user) return;
      try {
        const response = await fetch(routes.api.apiKeys);
        if (!response.ok) throw new Error('Failed to fetch API keys');
        const data = await response.json();
        setApiKeys(data);
      } catch (error) {
        console.error('Error fetching API keys:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, [user]);

  const generateApiKey = async () => {
    try {
      const response = await fetch(routes.api.apiKeys, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to generate API key');
      const newKey = await response.json();
      setApiKeys([...apiKeys, newKey]);
    } catch (error) {
      console.error('Error generating API key:', error);
    }
  };

  const handleRowAction = (action: string, apiKey: ApiKey) => {
    switch (action) {
      case 'view':
        console.log('View details for:', apiKey);
        break;
      case 'edit':
        console.log('Edit:', apiKey);
        break;
      case 'delete':
        console.log('Delete:', apiKey);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  if (isLoading) return <SuspenseFallback />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">API Keys</h1>
      <Button
        onClick={generateApiKey}
        className="mb-4"
      >
        Generate New API Key
      </Button>
      <DynamicDataTable
        columns={columns}
        data={apiKeys}
        filterColumn="key"
        onRowAction={handleRowAction}
      />
    </div>
  );
};

export default ApiKeysPage;