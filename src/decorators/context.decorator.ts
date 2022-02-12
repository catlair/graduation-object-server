/**
 * 为 gql 定义的，获取上下文的装饰器
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Headers = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers || {};
    return data ? headers[data] : headers;
  },
);
