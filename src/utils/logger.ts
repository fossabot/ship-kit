/**
 * This module provides a buffered logging system for use throughout the application.
 * It includes a BufferedLogger class and a main logger object.
 */

import { LogData, LogLevel } from "@/lib/withLogFlare";

const createLog = (level: LogLevel, message: string, metadata?: any): LogData => ({
  level,
  message,
  timestamp: new Date().toISOString(),
  metadata,
});

class BufferedLogger {
  private buffer: LogData[] = [];
  private bufferSize: number;
  private flushInterval: number;
  private flushIntervalId?: NodeJS.Timeout;

  constructor(bufferSize = 10, flushInterval = 5000) {
    this.bufferSize = bufferSize;
    this.flushInterval = flushInterval;

    if (typeof window !== 'undefined') {
      this.flushIntervalId = setInterval(() => this.flush(), this.flushInterval);
    }
  }

  private log = (level: LogLevel, message: string, metadata?: any) => {
    const logEntry = createLog(level, message, metadata);
    this.buffer.push(logEntry);

    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }
  }

  private flush = () => {
    console.log('Flushing buffer', this.buffer);
    if (this.buffer.length === 0) return;

    this.buffer.forEach(entry => {
      console[entry.level](`${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}`, entry.metadata);
    });

    this.buffer = [];
  }

  debug = (message: string, metadata?: any) => this.log('debug', message, metadata);
  info = (message: string, metadata?: any) => this.log('info', message, metadata);
  warn = (message: string, metadata?: any) => this.log('warn', message, metadata);
  error = (message: string, metadata?: any) => this.log('error', message, metadata);

  stop = () => {
    if (this.flushIntervalId) {
      clearInterval(this.flushIntervalId);
    }
  }
}

const bufferedLogger = new BufferedLogger();

const logger = {
  debug: (message: string, metadata?: any) => bufferedLogger.debug(message, metadata),
  info: (message: string, metadata?: any) => bufferedLogger.info(message, metadata),
  warn: (message: string, metadata?: any) => bufferedLogger.warn(message, metadata),
  error: (message: string, metadata?: any) => bufferedLogger.error(message, metadata),
};

export default logger;