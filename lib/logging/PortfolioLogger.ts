/**
 * Portfolio Logger - Structured Logging System
 * Following "The Clean Code Cookbook" principle: "Logs Are Not Noise — They're Breadcrumbs"
 */

// ✅ Principle 6: Logs Are Not Noise — They're Breadcrumbs

/**
 * Log Level Configuration - Data-driven approach
 */
export const LOG_LEVELS = {
  ERROR: { value: 0, label: "ERROR", color: "\x1b[31m", emoji: "❌" },
  WARN: { value: 1, label: "WARN", color: "\x1b[33m", emoji: "⚠️" },
  INFO: { value: 2, label: "INFO", color: "\x1b[36m", emoji: "ℹ️" },
  DEBUG: { value: 3, label: "DEBUG", color: "\x1b[37m", emoji: "🔍" },
  TRACE: { value: 4, label: "TRACE", color: "\x1b[90m", emoji: "🔬" },
} as const;

/**
 * Context Categories - Organized logging contexts
 */
export const LOG_CONTEXTS = {
  // Data & API contexts
  DATA_SERVICE: "DataService",
  PROJECT_CONTEXT: "ProjectContext",
  TESTIMONIAL_CONTEXT: "TestimonialContext",
  CACHE_SERVICE: "CacheService",

  // UI & Component contexts
  COMPONENT_RENDER: "ComponentRender",
  ANIMATION_SYSTEM: "AnimationSystem",
  USER_INTERACTION: "UserInteraction",
  NAVIGATION: "Navigation",

  // Performance contexts
  PERFORMANCE_MONITOR: "PerformanceMonitor",
  MEMORY_USAGE: "MemoryUsage",
  RENDER_PERFORMANCE: "RenderPerformance",

  // Error & Security contexts
  ERROR_BOUNDARY: "ErrorBoundary",
  SECURITY: "Security",
  VALIDATION: "Validation",

  // Business Logic contexts
  PORTFOLIO_ANALYTICS: "PortfolioAnalytics",
  CONTACT_FORM: "ContactForm",
  PROJECT_SHOWCASE: "ProjectShowcase",
} as const;

/**
 * Log Entry Interface - Structured log format
 */
interface LogEntry {
  timestamp: string;
  level: keyof typeof LOG_LEVELS;
  context: string;
  message: string;
  data?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  performance?: {
    duration?: number;
    memoryUsage?: number;
    renderCount?: number;
  };
  user?: {
    sessionId?: string;
    userAgent?: string;
    location?: string;
  };
}

/**
 * Portfolio Logger Class - Context-rich, meaningful logging
 */
export class PortfolioLogger {
  private context: string;
  private sessionId: string;
  private isProduction: boolean;
  private logLevel: keyof typeof LOG_LEVELS;

  constructor(context: string) {
    this.context = context;
    this.sessionId = this.generateSessionId();
    this.isProduction = process.env.NODE_ENV === "production";
    this.logLevel = this.getLogLevel();
  }

  /**
   * ✅ Focused function: Error logging with full context
   */
  error(
    message: string,
    error?: Error,
    additionalData?: Record<string, any>,
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "ERROR",
      context: this.context,
      message: this.formatMessage(message),
      data: additionalData,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    this.writeLog(logEntry);
    this.sendToErrorTracking(logEntry);
  }

  /**
   * ✅ Focused function: Warning logging for potential issues
   */
  warn(message: string, data?: Record<string, any>): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "WARN",
      context: this.context,
      message: this.formatMessage(message),
      data,
    };

    this.writeLog(logEntry);
  }

  /**
   * ✅ Focused function: Info logging for important events
   */
  info(message: string, data?: Record<string, any>): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "INFO",
      context: this.context,
      message: this.formatMessage(message),
      data,
    };

    this.writeLog(logEntry);
  }

  /**
   * ✅ Focused function: Debug logging for development
   */
  debug(message: string, data?: Record<string, any>): void {
    if (this.shouldLog("DEBUG")) {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "DEBUG",
        context: this.context,
        message: this.formatMessage(message),
        data,
      };

      this.writeLog(logEntry);
    }
  }

  /**
   * ✅ Focused function: Performance logging with metrics
   */
  performance(
    message: string,
    metrics: {
      duration?: number;
      memoryUsage?: number;
      renderCount?: number;
    },
    data?: Record<string, any>,
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "INFO",
      context: this.context,
      message: this.formatMessage(message),
      data,
      performance: metrics,
    };

    this.writeLog(logEntry);
    this.trackPerformanceMetrics(metrics);
  }

  /**
   * ✅ Focused function: User interaction logging
   */
  userInteraction(
    action: string,
    element: string,
    data?: Record<string, any>,
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "INFO",
      context: "UserInteraction",
      message: `User ${action} on ${element}`,
      data: {
        action,
        element,
        ...data,
      },
      user: {
        sessionId: this.sessionId,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        location:
          typeof window !== "undefined" ? window.location.pathname : undefined,
      },
    };

    this.writeLog(logEntry);
    this.trackUserBehavior(logEntry);
  }

  /**
   * ✅ Focused function: API call logging
   */
  apiCall(
    method: string,
    endpoint: string,
    status: number,
    duration: number,
    data?: Record<string, any>,
  ): void {
    const level = status >= 400 ? "ERROR" : status >= 300 ? "WARN" : "INFO";

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: "DataService",
      message: `${method} ${endpoint} - ${status} (${duration}ms)`,
      data: {
        method,
        endpoint,
        status,
        duration,
        ...data,
      },
      performance: {
        duration,
      },
    };

    this.writeLog(logEntry);
  }

  /**
   * ✅ Focused function: Cache operation logging
   */
  cacheOperation(
    operation: "hit" | "miss" | "set" | "clear",
    key: string,
    data?: Record<string, any>,
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "DEBUG",
      context: "CacheService",
      message: `Cache ${operation}: ${key}`,
      data: {
        operation,
        key,
        ...data,
      },
    };

    this.writeLog(logEntry);
  }

  /**
   * ✅ Focused function: Component lifecycle logging
   */
  componentLifecycle(
    component: string,
    lifecycle: "mount" | "unmount" | "update",
    data?: Record<string, any>,
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "DEBUG",
      context: "ComponentRender",
      message: `${component} ${lifecycle}`,
      data: {
        component,
        lifecycle,
        ...data,
      },
    };

    this.writeLog(logEntry);
  }

  /**
   * ✅ Private helper functions
   */
  private formatMessage(message: string): string {
    return `[${this.context}] ${message}`;
  }

  private shouldLog(level: keyof typeof LOG_LEVELS): boolean {
    return LOG_LEVELS[level].value <= LOG_LEVELS[this.logLevel].value;
  }

  private getLogLevel(): keyof typeof LOG_LEVELS {
    if (this.isProduction) return "WARN";
    return (process.env.LOG_LEVEL as keyof typeof LOG_LEVELS) || "DEBUG";
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private writeLog(logEntry: LogEntry): void {
    if (!this.shouldLog(logEntry.level)) return;

    const levelConfig = LOG_LEVELS[logEntry.level];
    const coloredLevel = `${levelConfig.color}${levelConfig.emoji} ${levelConfig.label}\x1b[0m`;

    const logMessage = `${logEntry.timestamp} ${coloredLevel} ${logEntry.message}`;

    // Console output with appropriate method
    switch (logEntry.level) {
      case "ERROR":
        console.error(logMessage, logEntry.data || "", logEntry.error || "");
        break;
      case "WARN":
        console.warn(logMessage, logEntry.data || "");
        break;
      case "INFO":
        console.info(logMessage, logEntry.data || "");
        break;
      case "DEBUG":
      case "TRACE":
        console.debug(logMessage, logEntry.data || "");
        break;
    }

    // Send to external logging service in production
    if (this.isProduction) {
      this.sendToLoggingService(logEntry);
    }
  }

  private sendToErrorTracking(logEntry: LogEntry): void {
    if (this.isProduction && logEntry.error) {
      // Integration with error tracking service (Sentry, LogRocket, etc.)
      // Example: Sentry.captureException(logEntry.error, { extra: logEntry.data });
    }
  }

  private sendToLoggingService(logEntry: LogEntry): void {
    if (this.isProduction) {
      // Integration with logging service (DataDog, LogDNA, etc.)
      // Example: logService.send(logEntry);
    }
  }

  private trackPerformanceMetrics(metrics: LogEntry["performance"]): void {
    if (this.isProduction && metrics) {
      // Integration with performance monitoring (New Relic, DataDog, etc.)
      // Example: performanceMonitor.track(metrics);
    }
  }

  private trackUserBehavior(logEntry: LogEntry): void {
    if (this.isProduction) {
      // Integration with analytics (Google Analytics, Mixpanel, etc.)
      // Example: analytics.track(logEntry.data);
    }
  }
}

/**
 * ✅ Logger Factory - Create context-specific loggers
 */
export class LoggerFactory {
  private static loggers = new Map<string, PortfolioLogger>();

  static getLogger(context: string): PortfolioLogger {
    if (!this.loggers.has(context)) {
      this.loggers.set(context, new PortfolioLogger(context));
    }
    return this.loggers.get(context)!;
  }

  static createLogger(context: keyof typeof LOG_CONTEXTS): PortfolioLogger {
    return this.getLogger(LOG_CONTEXTS[context]);
  }
}

/**
 * ✅ Convenience exports for common loggers
 */
export const dataServiceLogger = LoggerFactory.createLogger("DATA_SERVICE");
export const projectContextLogger =
  LoggerFactory.createLogger("PROJECT_CONTEXT");
export const performanceLogger = LoggerFactory.createLogger(
  "PERFORMANCE_MONITOR",
);
export const errorBoundaryLogger = LoggerFactory.createLogger("ERROR_BOUNDARY");
export const userInteractionLogger =
  LoggerFactory.createLogger("USER_INTERACTION");

/**
 * ✅ Global error handler with logging
 */
export function setupGlobalErrorLogging(): void {
  // Unhandled promise rejections
  if (typeof window !== "undefined") {
    window.addEventListener("unhandledrejection", (event) => {
      errorBoundaryLogger.error("Unhandled promise rejection", event.reason, {
        promise: event.promise,
        url: window.location.href,
      });
    });

    // Global error handler
    window.addEventListener("error", (event) => {
      errorBoundaryLogger.error("Global error caught", event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        url: window.location.href,
      });
    });
  }
}

/**
 * ✅ Type exports
 */
export type LogLevel = keyof typeof LOG_LEVELS;
export type LogContext = keyof typeof LOG_CONTEXTS;
