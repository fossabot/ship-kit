type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: any;
}

const createLog = (level: LogLevel, message: string, metadata?: any): LogEntry => ({
  level,
  message,
  timestamp: new Date().toISOString(),
  metadata,
});

class BufferedLogger {
  private buffer: LogEntry[] = [];
  private bufferSize: number;
  private flushInterval: number;

  constructor(bufferSize = 10, flushInterval = 5000) {
    this.bufferSize = bufferSize;
    this.flushInterval = flushInterval;

    if (typeof window !== 'undefined') {
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  private log(level: LogLevel, message: string, metadata?: any) {
    const logEntry = createLog(level, message, metadata);
    this.buffer.push(logEntry);

    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }
  }

  private flush() {
    if (this.buffer.length === 0) return;

    // In a real-world scenario, you might want to send this to a server
    // For now, we'll just console.log the buffered entries
    this.buffer.forEach(entry => {
      console[entry.level](`${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}`, entry.metadata);
    });

    this.buffer = [];
  }

  debug(message: string, metadata?: any) { this.log('debug', message, metadata); }
  info(message: string, metadata?: any) { this.log('info', message, metadata); }
  warn(message: string, metadata?: any) { this.log('warn', message, metadata); }
  error(message: string, metadata?: any) { this.log('error', message, metadata); }
}

const bufferedLogger = new BufferedLogger();

import { WebSocket, WebSocketServer } from 'ws';


const logger = {
  debug: (message: string, metadata?: any) => {
    const log = createLog('debug', message, metadata);
    bufferedLogger.debug(message, metadata);
    // sendLogToWebSocket(log);
  },
  info: (message: string, metadata?: any) => {
    const log = createLog('info', message, metadata);
    bufferedLogger.info(message, metadata);
    // sendLogToWebSocket(log);
  },
  warn: (message: string, metadata?: any) => {
    const log = createLog('warn', message, metadata);
    bufferedLogger.warn(message, metadata);
    // sendLogToWebSocket(log);
  },
  error: (message: string, metadata?: any) => {
    const log = createLog('error', message, metadata);
    bufferedLogger.error(message, metadata);
    // sendLogToWebSocket(log);
  },
};

/**
 * Returns an async iterable stream of logs for a given API key
 * @param apiKey - The API key to fetch logs for
 */
export const getLogStreamForApiKey = async function* (apiKey: string) {
  // This is a placeholder implementation. In a real-world scenario,
  // you would connect to your logging database or service and stream logs.
  while (true) {
    yield {
      level: ['info', 'warn', 'error'][Math.floor(Math.random() * 3)],
      message: `Log message for API key: ${apiKey}`,
      timestamp: new Date().toISOString(),
      metadata: { apiKey, randomData: Math.random() },
    };
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay between logs
  }
};

export default logger;
const sendLogToWebSocket = (log: LogEntry) => {
  if (typeof window === 'undefined') {
    const wss = (global as any).wss as WebSocketServer | undefined;
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(log));
        }
      });
    }
  }
};