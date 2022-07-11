import { AuthorizedUser } from './../types/user.d';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthorizedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const AuthToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthorizedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.tokens;
  },
);