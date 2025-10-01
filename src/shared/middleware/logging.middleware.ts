import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    this.logger.logRequest(req.method, req.url);

    res.on('finish', () => {
      this.logger.logResponse(req.method, req.url, res.statusCode);
    });

    next();
  }
}
