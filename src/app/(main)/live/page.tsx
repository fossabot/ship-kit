'use client';

import logger from '@/utils/logger';
import { useUser } from '@stackframe/stack';
import { useEffect, useState } from 'react';

interface Log {
  id: string;
  level: string;
  message: string;
  timestamp: string;
  metadata?: any;
}

/**
 * Component for displaying live logs from the SSE endpoint
 */
const LiveLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [apiKeyId, setApiKeyId] = useState<string>('');
  const user = useUser();

  useEffect(() => {
    if (!user || !apiKeyId) return;

    logger.info('Connecting to SSE for live logs');
    const eventSource = new EventSource(`/api/sse-logs?id=${apiKeyId}`);

    eventSource.onmessage = (event) => {
      const newLog = JSON.parse(event.data);
      setLogs((prevLogs) => [...prevLogs, newLog]);
    };

    eventSource.onerror = (error) => {
      logger.error('SSE error:', error);
      eventSource.close();
    };

    return () => {
      logger.info('Closing SSE connection');
      eventSource.close();
    };
  }, [user, apiKeyId]);

  const handleApiKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newApiKeyId = formData.get('apiKeyId') as string;
    setApiKeyId(newApiKeyId);
    setLogs([]); // Clear previous logs when changing API key
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Live Application Logs</h1>
      
      <form onSubmit={handleApiKeySubmit} className="mb-4">
        <input
          type="text"
          name="apiKeyId"
          placeholder="Enter API Key ID"
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Connect
        </button>
      </form>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metadata</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.level}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.message}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveLogs;