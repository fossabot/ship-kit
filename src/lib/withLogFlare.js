/* eslint-env node */
import fs from 'fs';
import path from 'path';
import util from 'util';
import { routes } from './routes.js';
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? (process.env.URL ?? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    : typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:" + process.env.PORT;


/**
 * @typedef {'debug' | 'info' | 'warn' | 'error'} LogLevel
 */

/**
 * @typedef {Object} LogFlareOptions
 * @property {string} [prefix='> '] - Prefix for log messages
 * @property {LogLevel} [logLevel='info'] - Minimum log level to display
 * @property {boolean} [logToFile=process.env.NODE_ENV === 'production'] - Whether to log to a file
 * @property {string} [logFilePath] - Path to the log file
 * @property {boolean} [useColors=true] - Whether to use colors in console output
 * @property {boolean} [useEmoji=true] - Whether to use emojis in console output
 * @property {Object.<LogLevel, string>} [colors] - Custom colors for each log level
 * @property {Object.<LogLevel, string>} [emojis] - Custom emojis for each log level
 */

 /**
 * @typedef {Object} LogData
 * @property {string} timestamp - Timestamp of the log
 * @property {string} emoji - Emoji for the log level
 * @property {LogLevel} level - Log level
 * @property {string} prefix - Prefix for the log message
 * @property {string} message - Log message
 * @property {Object} metadata - Metadata for the log
 */


/**
 * Default settings for the logger
 * @type {Object.<string, Object.<LogLevel, string>>}
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
 * @param {LogFlareOptions} options - Configuration options for the logger
 * @returns {function(import('next').NextConfig): import('next').NextConfig}
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

    /** @type {LogLevel[]} */
    const logLevels = ['debug', 'info', 'warn', 'error'];
    const currentLogLevelIndex = logLevels.indexOf(logLevel);

    const originalConsole = { ...console };

    const mergedColors = { ...defaultSettings.colors, ...colors };
    const mergedEmojis = { ...defaultSettings.emojis, ...emojis };

    let isApiKeyValid = false;
    let apiKeyChecked = false;
    let invalidKeyErrorShown = false;

    originalConsole.debug(`Initializing LogFlare with key: ${process.env.NEXT_PUBLIC_LOGFLARE_KEY}`);

    /**
     * Checks if the API key is valid (only once)
     * @returns {Promise<boolean>}
     */
    const checkApiKey = async () => {
      if (apiKeyChecked) return isApiKeyValid;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || BASE_URL; // TODO: Change to HARDCODED URL
      try {
        const response = await fetch(`${apiUrl}/api/api-keys/${process.env.NEXT_PUBLIC_LOGFLARE_KEY}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        isApiKeyValid = data.isValid;
      } catch (error) {
        console.error('Failed to check API key:', error);
        isApiKeyValid = false;
      }
      apiKeyChecked = true;
      return isApiKeyValid;
    };

    /**
     * Creates a logger function for a specific log level
     * @param {LogLevel} level - The log level
     * @returns {function(...any): Promise<void>}
     */
    const logger = (level) => async (...args) => {
      const timestamp = new Date().toISOString();
      const emoji = mergedEmojis[level];
      const formattedArgs = args.map(arg => 
        typeof arg === 'object' ? util.inspect(arg, { depth: null, colors: false }) : arg
      );

      const logMessage = formattedArgs.join(' ');

      /** @type {LogData} */
      const logData = {
        timestamp,
        emoji,
        level,
        prefix,
        message: logMessage,
        metadata: {},
      };

      if (logLevels.indexOf(level) >= currentLogLevelIndex) {
        // Console output with colors and emojis
        let consoleMessage = `${timestamp} [${logData.level}] ${prefix}${logMessage}`;
        if (useEmoji) {
          consoleMessage = `${emoji} ${consoleMessage}`;
        }
        if (useColors) {
          const colorCode = mergedColors[level];
          consoleMessage = `${colorCode}${consoleMessage}\x1b[0m`;
        }

        // Log to console
        originalConsole[level](consoleMessage);

        if (logToFile) {
          fs.appendFileSync(logFilePath, `${timestamp} [${logData.level}] ${prefix}${logMessage}\n`);
        }

        // Send log to the API without colors or emojis
        if (process.env.NEXT_PUBLIC_LOGFLARE_KEY) {
          const isValid = await checkApiKey();
          if (isValid) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            fetch(`${apiUrl}${routes.api.logs}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...logData,
                api_key: process.env.NEXT_PUBLIC_LOGFLARE_KEY
              })
            }).catch(error => {
              originalConsole.error('Failed to send log to API:', error);
            });
          } else if (!invalidKeyErrorShown) {
            originalConsole.error('Invalid API key. Logs will not be sent to API.');
            invalidKeyErrorShown = true;
          }
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
      // webpack: (config, context) => {
      //   // Handle the webpack configuration here
      //   if (!context.isServer) {
      //     config.resolve.fallback = {
      //       ...config.resolve.fallback,
      //       ws: false, // Set to false instead of using require.resolve
      //     };
      //   }

      //   // Call the original webpack function if it exists
      //   if (typeof nextConfig.webpack === 'function') {
      //     return nextConfig.webpack(config, context);
      //   }

      //   return config;
      // },
    };
  };
};

export default withLogFlare;