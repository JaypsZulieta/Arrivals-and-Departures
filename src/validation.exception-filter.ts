import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from 'quidquid-picker';
import { Response } from 'express';

export class ValidationExceptionFilter
  implements ExceptionFilter<ValidationError>
{
  catch(exception: ValidationError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    response.status(400).json({
      message: exception.message,
      error: 'bad request',
      statusCode: 400,
    });
  }
}
