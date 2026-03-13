import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, service, requestId, ...meta }) => {
  let log = `${timestamp} [${service || 'app'}] ${level}: ${message}`;
  if (requestId) {
    log = `${timestamp} [${service || 'app'}] [${requestId}] ${level}: ${message}`;
  }
  if (Object.keys(meta).length > 0) {
    log += ` ${JSON.stringify(meta)}`;
  }
  return log;
});

const createLogger = (serviceName: string) => {
  const defaultLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || defaultLevel,
    format: combine(
      errors({ stack: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.Console({
        format: combine(
          colorize({ all: true }),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          logFormat
        ),
      }),
    ],
  });

  // Add file transport in production
  if (process.env.NODE_ENV === 'production') {
    logger.add(
      new winston.transports.File({
        filename: `logs/${serviceName}-error.log`,
        level: 'error',
      })
    );
    logger.add(
      new winston.transports.File({
        filename: `logs/${serviceName}-combined.log`,
      })
    );
  }

  return logger;
};

export class Logger {
  private logger: winston.Logger;
  private requestId?: string;

  constructor(serviceName: string) {
    this.logger = createLogger(serviceName);
  }

  setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  private formatMeta(meta?: Record<string, unknown>): Record<string, unknown> {
    return {
      ...(this.requestId && { requestId: this.requestId }),
      ...meta,
    };
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, this.formatMeta(meta));
  }

  error(message: string, error?: Error | unknown, meta?: Record<string, unknown>): void {
    const errorMeta = error instanceof Error 
      ? { error: error.message, stack: error.stack }
      : { error };
    this.logger.error(message, { ...this.formatMeta(meta), ...errorMeta });
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, this.formatMeta(meta));
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, this.formatMeta(meta));
  }

  http(message: string, meta?: Record<string, unknown>): void {
    this.logger.http(message, this.formatMeta(meta));
  }

  child(meta: Record<string, unknown>): Logger {
    const childLogger = new Logger(this.logger.defaultMeta?.service || 'app');
    childLogger.logger = this.logger.child(meta);
    childLogger.requestId = this.requestId;
    return childLogger;
  }
}

export const createServiceLogger = (serviceName: string): Logger => {
  return new Logger(serviceName);
};

// Default logger instance for convenience imports
export const logger = createServiceLogger('app');
export default logger;
