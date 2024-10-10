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
 * while preserving the original stack trace
 */
export const LogProvider: React.FC<LogProviderProps> = ({ children, prefix = '> ', logLevel = 'info' }) => {
  useEffect(() => {
    const originalConsole = { ...console };

    // Helper function to create a wrapped console method
    const createWrappedMethod = (originalMethod: (...args: any[]) => void) => {
      return (...args: any[]) => {
        const error = new Error();
        const stack = error.stack?.split('\n').slice(2).join('\n');
        originalMethod(prefix, ...args, '\n', stack);
      };
    };

    // Override console methods
    console.log = createWrappedMethod(originalConsole.log);
    console.info = createWrappedMethod(originalConsole.info);
    console.warn = createWrappedMethod(originalConsole.warn);
    console.error = createWrappedMethod(originalConsole.error);

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