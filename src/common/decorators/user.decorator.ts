import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserEntity = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlReq = GqlExecutionContext.create(context).getContext().req;
    if (gqlReq) {
      return gqlReq.user;
    }
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);

export const BearerTokenEntity = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlReq = GqlExecutionContext.create(context).getContext().req;
    const bearerToken = gqlReq.header('authorization');
    return bearerToken.split(' ')[1];
  },
);
