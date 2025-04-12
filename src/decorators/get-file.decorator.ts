import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetFile = createParamDecorator(
  (data: never, context: ExecutionContext): Express.Multer.File => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request.file;
  },
);
