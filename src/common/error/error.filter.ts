// filters/graphql-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();
    const response = ctx.res as any;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let messages = ['Internal server error'];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      if (typeof exceptionResponse === 'string') {
        messages = [exceptionResponse];
      } else if (Array.isArray(exceptionResponse.message)) {
        messages = exceptionResponse.message;
      } else if (exceptionResponse?.message) {
        messages = [exceptionResponse.message];
      }
    }

    if (response?.status)
      response.status(status).json({
        success: false,
        status: status,
        messages,
      });
  }
}
