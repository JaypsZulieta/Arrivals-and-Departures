import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from "quidquid-picker";
import { Response, Request } from 'express';
import path from 'path';

export class ValidationExceptionFilter
  implements ExceptionFilter<ValidationError>
{
  catch(exception: ValidationError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    response.status(400).json({
      statusCode: 400,
      message: exception.message,
      timeStamp: new Date().toISOString(),
      path: request.path
    });
  }
}
