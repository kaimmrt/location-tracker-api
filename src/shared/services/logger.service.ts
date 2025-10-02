import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'location-tracker-api' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, context?: string): void {
    this.logger.error(message, { context });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }

  logRequest(method: string, url: string): void {
    this.logger.info('Request received', {
      method,
      url,
      type: 'request',
    });
  }

  logResponse(method: string, url: string, statusCode: number): void {
    this.logger.info('Response sent', {
      method,
      url,
      statusCode,
      type: 'response',
    });
  }

  logError(error: Error, context: string): void {
    this.logger.error('Application error', {
      message: error.message,
      stack: error.stack,
      context,
      type: 'error',
    });
  }
}
