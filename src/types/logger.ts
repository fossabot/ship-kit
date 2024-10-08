/**
 * Type definitions for the logger service.
 */

export type LogLevel = "info" | "warn" | "error" | "debug" | "log";

export interface LogData {
  level: LogLevel;
  message: string;
  timestamp: string;
  url: string;
  userAgent: string;
}
