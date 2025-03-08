import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.isAuthenticated()) {
      throw new Error(
        '@UserId can only be used when request is authenticated!',
      );
    }
    return request.user;
  },
);
