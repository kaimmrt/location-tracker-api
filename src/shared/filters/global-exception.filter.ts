import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponse } from '../base-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

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

    this.logger.error(
      `Exception caught: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse: BaseResponse<null> = {
      data: null,
      message,
      userMessage,
      isSuccess: false,
    };

    response.status(status).json(errorResponse);
  }
}
