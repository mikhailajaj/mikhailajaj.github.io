/**
 * Logging Integration Service
 *
 * Provides comprehensive logging capabilities for components
 * with performance tracking and error handling.
 */

import React from "react";

// ✅ Logging interfaces
export interface ComponentLogger {
  logUserInteraction: (
    action: string,
    component: string,
    metadata?: any,
  ) => void;
  logDebug: (message: string, metadata?: any) => void;
  logError: (message: string, error: Error, metadata?: any) => void;
  logPerformance: (metric: string, value: number, metadata?: any) => void;
  logWarning: (message: string, metadata?: any) => void;
}

export interface LogEntry {
  timestamp: number;
  level: "debug" | "info" | "warn" | "error" | "performance";
  component: string;
  message: string;
  metadata?: any;
}

// ✅ Logging configuration
interface LoggingConfig {
  enabled: boolean;
  level: "debug" | "info" | "warn" | "error";
  persistLogs: boolean;
  maxLogEntries: number;
}

const defaultConfig: LoggingConfig = {
  enabled: process.env.NODE_ENV === "development",
  level: "debug",
  persistLogs: false,
  maxLogEntries: 1000,
};

// ✅ Log storage
class LogStorage {
  private logs: LogEntry[] = [];
  private config: LoggingConfig;

  constructor(config: LoggingConfig = defaultConfig) {
    this.config = config;
  }

  addLog(entry: LogEntry): void {
    if (!this.config.enabled) return;

    this.logs.push(entry);

    // Maintain max log entries
    if (this.logs.length > this.config.maxLogEntries) {
      this.logs = this.logs.slice(-this.config.maxLogEntries);
    }

    // Console output
    this.outputToConsole(entry);

    // Persist if configured
    if (this.config.persistLogs) {
      this.persistLog(entry);
    }
  }

  private outputToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.component}]`;

    switch (entry.level) {
      case "debug":
        console.log(`${prefix} 🔍`, entry.message, entry.metadata || "");
        break;
      case "info":
        console.info(`${prefix} ℹ️`, entry.message, entry.metadata || "");
        break;
      case "warn":
        console.warn(`${prefix} ⚠️`, entry.message, entry.metadata || "");
        break;
      case "error":
        console.error(`${prefix} ❌`, entry.message, entry.metadata || "");
        break;
      case "performance":
        console.log(`${prefix} ⚡`, entry.message, entry.metadata || "");
        break;
    }
  }

  private persistLog(entry: LogEntry): void {
    try {
      const existingLogs = localStorage.getItem("component-logs");
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(entry);

      // Keep only recent logs
      const recentLogs = logs.slice(-this.config.maxLogEntries);
      localStorage.setItem("component-logs", JSON.stringify(recentLogs));
    } catch (error) {
      console.warn("Failed to persist log:", error);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    if (this.config.persistLogs) {
      try {
        localStorage.removeItem("component-logs");
      } catch (error) {
        console.warn("Failed to clear persisted logs:", error);
      }
    }
  }
}

// ✅ Global log storage instance
const logStorage = new LogStorage();

// ✅ Component logger hook
export const useComponentLogger = (componentName: string): ComponentLogger => {
  const logger = React.useMemo(
    () => ({
      logUserInteraction: (
        action: string,
        component: string,
        metadata?: any,
      ) => {
        logStorage.addLog({
          timestamp: Date.now(),
          level: "info",
          component: componentName,
          message: `User interaction: ${action} on ${component}`,
          metadata: { action, component, ...metadata },
        });
      },

      logDebug: (message: string, metadata?: any) => {
        logStorage.addLog({
          timestamp: Date.now(),
          level: "debug",
          component: componentName,
          message,
          metadata,
        });
      },

      logError: (message: string, error: Error, metadata?: any) => {
        logStorage.addLog({
          timestamp: Date.now(),
          level: "error",
          component: componentName,
          message,
          metadata: {
            error: error.message,
            stack: error.stack,
            ...metadata,
          },
        });
      },

      logPerformance: (metric: string, value: number, metadata?: any) => {
        logStorage.addLog({
          timestamp: Date.now(),
          level: "performance",
          component: componentName,
          message: `${metric}: ${value}ms`,
          metadata: { metric, value, ...metadata },
        });
      },

      logWarning: (message: string, metadata?: any) => {
        logStorage.addLog({
          timestamp: Date.now(),
          level: "warn",
          component: componentName,
          message,
          metadata,
        });
      },
    }),
    [componentName],
  );

  return logger;
};

// ✅ Performance tracking hook
export const usePerformanceLogger = (componentName: string) => {
  const logger = useComponentLogger(componentName);
  const startTime = React.useRef<number>();

  React.useEffect(() => {
    startTime.current = performance.now();

    return () => {
      if (startTime.current) {
        const renderTime = performance.now() - startTime.current;
        logger.logPerformance("render-time", renderTime);
      }
    };
  });

  const measureOperation = React.useCallback(
    (operationName: string, operation: () => void | Promise<void>) => {
      const start = performance.now();

      const result = operation();

      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start;
          logger.logPerformance(operationName, duration);
        });
      } else {
        const duration = performance.now() - start;
        logger.logPerformance(operationName, duration);
        return result;
      }
    },
    [logger],
  );

  return { measureOperation };
};

// ✅ Error logging utility
export const logComponentError = (
  componentName: string,
  error: Error,
  metadata?: any,
) => {
  logStorage.addLog({
    timestamp: Date.now(),
    level: "error",
    component: componentName,
    message: `Component error: ${error.message}`,
    metadata: {
      error: error.message,
      stack: error.stack,
      ...metadata,
    },
  });
};

// ✅ Log management utilities
export const LogManager = {
  getLogs: () => logStorage.getLogs(),
  clearLogs: () => logStorage.clearLogs(),
  exportLogs: () => JSON.stringify(logStorage.getLogs(), null, 2),
  getLogsByComponent: (componentName: string) =>
    logStorage.getLogs().filter((log) => log.component === componentName),
  getLogsByLevel: (level: LogEntry["level"]) =>
    logStorage.getLogs().filter((log) => log.level === level),
};

// ✅ Default export
const LoggingIntegration = {
  useComponentLogger,
  usePerformanceLogger,
  logComponentError,
  LogManager,
};

export default LoggingIntegration;
