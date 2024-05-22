import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch(JsonWebTokenError)
export class JsonWebtokenExceptionFilter implements ExceptionFilter<JsonWebTokenError> {
  catch(exception: JsonWebTokenError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    response.status(403).json({
      statusCode: 403,
      message: exception.message,
      timeStamp: new Date().toISOString(),
      path: request.path,
    });
  }
}
