"use client";

import { routes } from '@/lib/routes';
import logger from '@/utils/logger';
import { useUser } from '@stackframe/stack';
import { useEffect, useState } from 'react';

interface Log {
  level: string;
  message: string;
  timestamp: string;
  metadata?: any;
}

const LiveLogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const user = useUser();

  useEffect(() => {
    if (!user) return;

    logger.info('Connecting to WebSocket for live logs');
    const socket = new WebSocket(`ws://${window.location.host}${routes.api.live}`);

    socket.onopen = () => {
      logger.info('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const newLog = JSON.parse(event.data);
      setLogs((prevLogs) => [...prevLogs, newLog]);
    };

    socket.onerror = (error) => {
      logger.error('WebSocket error:', error);
    };

    return () => {
      logger.info('Closing WebSocket connection');
      socket.close();
    };
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Live Application Logs</h1>
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

export default LiveLogsPage;
