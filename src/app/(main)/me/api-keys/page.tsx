'use client';

import { useUser } from '@stackframe/stack';
import { useEffect, useState } from 'react';

interface ApiKey {
  id: string;
  key: string;
  createdAt: string;
}

const ApiKeysPage = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!user) return;
      try {
        const response = await fetch('/api/api-keys');
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
      const response = await fetch('/api/api-keys', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to generate API key');
      const newKey = await response.json();
      setApiKeys([...apiKeys, newKey]);
    } catch (error) {
      console.error('Error generating API key:', error);
    }
  };

  if (isLoading) return <div>Loading API keys...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">API Keys</h1>
      <button
        onClick={generateApiKey}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Generate New API Key
      </button>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apiKeys.map((apiKey) => (
              <tr key={apiKey.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apiKey.key}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(apiKey.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiKeysPage;