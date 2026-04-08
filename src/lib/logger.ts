/**
 * Centralized logging utility for the application.
 *
 * In development: logs to console for debugging.
 * In production: logs to analytics service (or silent for sensitive info).
 *
 * This prevents console.log leakage and provides a single point to configure
 * logging behavior, integrate with analytics services, and control log levels.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

// Configuration
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Log level hierarchy
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Minimum log level (can be configured via environment)
const MIN_LOG_LEVEL: LogLevel =
  (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) ||
  (IS_PRODUCTION ? 'warn' : 'debug');

/**
 * Formats a log entry with timestamp and structured data.
 */
function formatLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
}

/**
 * Sends log to analytics/monitoring service (placeholder for integration).
 * In production, integrate with services like Sentry, LogRocket, etc.
 */
async function sendToAnalytics(entry: LogEntry): Promise<void> {
  // TODO: Integrate with your preferred analytics service
  // Example: Sentry.captureException for errors
  // Example: LogRocket.log for general logging

  // For now, this is a placeholder that can be extended
  if (IS_PRODUCTION && entry.level === 'error') {
    // In production, you might want to send errors to a monitoring service
    // Example implementation:
    // await fetch('/api/log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(entry),
    // });
  }
}

/**
 * Core logging function.
 */
function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  // Skip logs below minimum level
  if (LOG_LEVELS[level] < LOG_LEVELS[MIN_LOG_LEVEL]) {
    return;
  }

  const entry = formatLogEntry(level, message, context);

  // Development: log to console with formatting
  if (IS_DEVELOPMENT) {
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, context || '');
        break;
      case 'info':
        console.info(prefix, message, context || '');
        break;
      case 'warn':
        console.warn(prefix, message, context || '');
        break;
      case 'error':
        console.error(prefix, message, context || '');
        break;
    }
  }

  // Production: send to analytics for errors and warnings
  if (IS_PRODUCTION && (level === 'error' || level === 'warn')) {
    sendToAnalytics(entry).catch((err) => {
      // Silently fail - don't log logging errors
    });
  }
}

// Export typed logging functions
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    log('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) =>
    log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) =>
    log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) =>
    log('error', message, context),
};

/**
 * Error-specific logging that includes stack traces.
 */
export function logError(error: Error | unknown, context?: Record<string, unknown>): void {
  if (error instanceof Error) {
    logger.error(error.message, {
      ...context,
      stack: error.stack,
      name: error.name,
    });
  } else {
    logger.error(String(error), context);
  }
}
