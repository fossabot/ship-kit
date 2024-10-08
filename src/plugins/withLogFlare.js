/* eslint-env node */
import fs from 'fs';
import path from 'path';
import util from 'util';

/**
 * @typedef {Object} LoggerOptions
 * @property {string} [prefix='> '] - Prefix for log messages
 * @property {('debug'|'info'|'warn'|'error')} [logLevel='info'] - Minimum log level to display
 * @property {boolean} [logToFile=process.env.NODE_ENV === 'production'] - Whether to log to a file
 * @property {string} [logFilePath] - Path to the log file
 * @property {boolean} [useColors=true] - Whether to use colors in console output
 * @property {boolean} [useEmoji=true] - Whether to use emojis in console output
 * @property {Object} [colors] - Custom colors for each log level
 * @property {Object} [emojis] - Custom emojis for each log level
 */

/**
 * Default settings for the logger
 */
const defaultSettings = {
  colors: {
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m',  // Green
    warn: '\x1b[33m',  // Yellow
    error: '\x1b[31m', // Red
  },
  emojis: {
    debug: '🐛',
    info: 'ℹ️ ',
    warn: '⚠️ ',
    error: '🚨',
  },
};

/**
 * Wraps the Next.js config to add logging functionality
 * @param {LoggerOptions} options - Configuration options for the logger
 * @returns {function} A function that takes and returns a NextConfig
 */
export const withLogFlare = (options = {}) => {
  return (nextConfig) => {
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

    const logLevels = ['debug', 'info', 'warn', 'error'];
    const currentLogLevelIndex = logLevels.indexOf(logLevel);

    const originalConsole = { ...console };

    const mergedColors = { ...defaultSettings.colors, ...colors };
    const mergedEmojis = { ...defaultSettings.emojis, ...emojis };

    const logger = (level) => (...args) => {
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