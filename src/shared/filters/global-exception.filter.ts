import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponse } from '../base-response.dto';
import { LoggerService } from '../services/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    let userMessage: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        userMessage = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message =
          (responseObj.message as string) ||
          (responseObj.error as string) ||
          'An error occurred';
        userMessage = (responseObj.userMessage as string) || message;
      } else {
        message = 'An error occurred';
        userMessage = 'An error occurred';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      userMessage = 'Something went wrong. Please try again later.';
    }

    // Log the error using our custom logger
    if (exception instanceof Error) {
      this.logger.logError(exception, 'GlobalExceptionFilter');
    } else {
      this.logger.error(
        `Exception caught: ${message}`,
        'GlobalExceptionFilter',
      );
    }

    const errorResponse: BaseResponse<null> = {
      data: null,
      message,
      userMessage,
      isSuccess: false,
    };

    response.status(status).json(errorResponse);
  }
}
