/**
 * Centralized logging utility
 * Replaces console statements with consistent logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.isDevelopment && level === 'debug') return;

    const formattedMessage = this.formatMessage(level, message, context);

    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  // Specialized logging methods for common use cases
  apiCall(endpoint: string, method: string = 'GET', context?: LogContext): void {
    this.info(`API Call: ${method} ${endpoint}`, context);
  }

  apiSuccess(endpoint: string, duration?: number, context?: LogContext): void {
    const durationStr = duration ? ` (${duration}ms)` : '';
    this.info(`API Success: ${endpoint}${durationStr}`, context);
  }

  apiError(endpoint: string, error: string, context?: LogContext): void {
    this.error(`API Error: ${endpoint} - ${error}`, context);
  }

  imageGeneration(prompt: string, context?: LogContext): void {
    this.info(`Generating image: ${prompt.substring(0, 50)}...`, context);
  }

  fileUpload(filename: string, size: number, context?: LogContext): void {
    this.info(`File uploaded: ${filename} (${(size / 1024 / 1024).toFixed(2)}MB)`, context);
  }

  projectSaved(projectId: string, context?: LogContext): void {
    this.info(`Project saved: ${projectId}`, context);
  }

  canvasAction(action: string, layerId?: string, context?: LogContext): void {
    const layerStr = layerId ? ` on layer ${layerId}` : '';
    this.debug(`Canvas action: ${action}${layerStr}`, context);
  }
}

export const logger = new Logger();
