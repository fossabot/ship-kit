type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
}

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

  private log(level: LogLevel, ...args: any[]) {
    const message = args.join(' ');
    const timestamp = new Date().toISOString();

    this.buffer.push({ level, message, timestamp });

    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }
  }

  private flush() {
    if (this.buffer.length === 0) return;

    // In a real-world scenario, you might want to send this to a server
    // For now, we'll just console.log the buffered entries
    this.buffer.forEach(entry => {
      console[entry.level](`${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}`);
    });

    this.buffer = [];
  }

  debug(...args: any[]) { this.log('debug', ...args); }
  info(...args: any[]) { this.log('info', ...args); }
  warn(...args: any[]) { this.log('warn', ...args); }
  error(...args: any[]) { this.log('error', ...args); }
}

const logger = new BufferedLogger();

export default logger;