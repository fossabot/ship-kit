'use client';

import { useUser } from '@stackframe/stack';
import { useEffect, useState } from 'react';

interface Log {
  timestamp: string;
  level: string;
  message: string;
}

const LogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;
      try {
        const response = await fetch('/api/logs');
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

  if (isLoading) return <div>Loading logs...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Application Logs</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.level}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsPage;