/**
 * 为 gql 定义的，获取上下文的装饰器
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Req = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const req = GqlExecutionContext.create(context).getContext().req;
    return data ? req[data] : req;
  },
);

export const Request = Req;

export const Res = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const res = GqlExecutionContext.create(context).getContext().res;
    return data ? res[data] : res;
  },
);

export const Response = Res;

export const Headers = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const req = GqlExecutionContext.create(context).getContext().req || {};
    const headers = req.headers || {};
    return data ? headers[data] : headers;
  },
);

export const Ip = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const req = GqlExecutionContext.create(context).getContext().req || {};
    return req.ip;
  },
);
