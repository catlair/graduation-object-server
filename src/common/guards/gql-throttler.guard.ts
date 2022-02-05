import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);

    if (gqlCtx) {
      const ctx = gqlCtx.getContext();
      return { req: ctx.req, res: ctx.res };
    }
    // 兼容 restful
    const ctx = context.switchToHttp();
    return {
      req: ctx.getRequest(),
      res: ctx.getResponse(),
    };
  }
}
