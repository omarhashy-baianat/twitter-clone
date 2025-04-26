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
    try {
      let gqlHost = GqlArgumentsHost.create(host);
      let ctx = gqlHost.getContext();
      let response = ctx.res as any;
      if (!response) {
        ctx = host.switchToHttp();
        response = ctx.getResponse();
      }
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

      response.status(status).json({
        success: false,
        status: status,
        messages,
      });
    } catch (err) {}
  }
}
