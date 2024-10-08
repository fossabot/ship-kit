// Client side logging provider
'use client';

import React, { useEffect } from 'react';

interface LogProviderProps {
  children: React.ReactNode;
  prefix?: string;
  logLevel?: 'info' | 'warn' | 'error';
}

/**
 * Provides consistent logging behavior on both client and server sides
 */
export const LogProvider: React.FC<LogProviderProps> = ({ children, prefix = '> ', logLevel = 'info' }) => {
  useEffect(() => {
    const originalConsole = { ...console };

    // Override console methods
    console.log = (...args) => originalConsole.log(prefix, ...args);
    console.info = (...args) => originalConsole.info(prefix, ...args);
    console.warn = (...args) => originalConsole.warn(prefix, ...args);
    console.error = (...args) => originalConsole.error(prefix, ...args);

    // Filter logs based on logLevel
    if (logLevel === 'warn') {
      console.log = console.info = () => {};
    } else if (logLevel === 'error') {
      console.log = console.info = console.warn = () => {};
    }

    return () => {
      // Restore original console methods on unmount
      Object.assign(console, originalConsole);
    };
  }, [prefix, logLevel]);

  return <>{children}</>;
};

export default LogProvider;