import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ActiveDevice = createParamDecorator(
  (data: never, context: ExecutionContext): string | void => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request.activeDeviceId;
  },
);
