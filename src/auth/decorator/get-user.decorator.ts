import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const Getusers = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ) => {
    const request: Express.Request = ctx
      .switchToHttp()
      .getRequest();
    if (data) {
      return request.users[data];
    }
    return request.users;
  },
);
