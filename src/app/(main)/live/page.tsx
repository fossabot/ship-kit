'use client';

import logger from '@/utils/logger';
import { useUser } from '@stackframe/stack';
import { useEffect, useState } from 'react';

interface Log {
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
  const [apiKey, setApiKey] = useState<string>('');
  const user = useUser();

  useEffect(() => {
    if (!user || !apiKey) return;

    logger.info('Connecting to SSE for live logs');
    const eventSource = new EventSource(`/api/sse-logs?apiKey=${apiKey}`);

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
  }, [user, apiKey]);

  const handleApiKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newApiKey = formData.get('apiKey') as string;
    setApiKey(newApiKey);
    setLogs([]); // Clear previous logs when changing API key
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Live Application Logs</h1>
      
      <form onSubmit={handleApiKeySubmit} className="mb-4">
        <input
          type="text"
          name="apiKey"
          placeholder="Enter API Key"
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
            {logs.map((log, index) => (
              <tr key={index}>
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