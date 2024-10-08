import fs from 'fs';
import type { NextConfig } from 'next';
import path from 'path';
import util from 'util';

interface LogFlareOptions {
  prefix?: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  logToFile?: boolean;
  logFilePath?: string;
  useColors?: boolean;
  useEmoji?: boolean;
  colors?: Record<string, string>;
  emojis?: Record<string, string>;
}

const defaultSettings = {
  colors: {
    debug: '\x1b[36m',
    info: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
  },
  emojis: {
    debug: '🐛',
    info: 'ℹ️ ',
    warn: '⚠️ ',
    error: '🚨',
  },
};

export const withLogFlare = (options: LogFlareOptions = {}) => {
  return (nextConfig: NextConfig): NextConfig => {
    const {
      prefix = '> ',
      logLevel = 'info',
      logToFile = process.env.NODE_ENV === 'production',
      logFilePath = path.join(process.cwd(), 'logs', 'app.log'),
      useColors = true,
      useEmoji = true,
      colors = {},
      emojis = {},
    } = options;

    const logLevels = ['debug', 'info', 'warn', 'error'] as const;
    type LogLevel = typeof logLevels[number];
    const currentLogLevelIndex = logLevels.indexOf(logLevel as LogLevel);

    const originalConsole = { ...console };

    const mergedColors = { ...defaultSettings.colors, ...colors };
    const mergedEmojis = { ...defaultSettings.emojis, ...emojis };

    const logger = (level: LogLevel) => (...args: any[]) => {
      const timestamp = new Date().toISOString();
      const formattedArgs = args.map(arg => 
        typeof arg === 'object' ? util.inspect(arg, { depth: null, colors: true }) : arg
      );

      let logMessage = `${timestamp} [${level.toUpperCase()}] ${prefix}${formattedArgs.join(' ')}`;

      if (useEmoji) {
        logMessage = `${mergedEmojis[level]} ${logMessage}`;
      }

      if (logLevels.indexOf(level) >= currentLogLevelIndex) {
        if (useColors) {
          const colorCode = mergedColors[level];
          const coloredMessage = `${colorCode}${logMessage}\x1b[0m`;
          originalConsole[level](coloredMessage);
        } else {
          originalConsole[level](logMessage);
        }

        if (logToFile) {
          fs.appendFileSync(logFilePath, logMessage + '\n');
        }

        // Send log to the API
        if (process.env.NEXT_PUBLIC_API_KEY) {
          fetch('/api/logs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            },
            body: JSON.stringify({ level, message: logMessage })
          }).catch(error => {
            originalConsole.error('Failed to send log to API:', error);
          });
        }
      }
    };

    console.log = logger('debug');
    console.info = logger('info');
    console.warn = logger('warn');
    console.error = logger('error');

    return {
      ...nextConfig,
      experimental: {
        ...nextConfig.experimental,
        instrumentationHook: true,
      },
    };
  };
};

export default withLogFlare;