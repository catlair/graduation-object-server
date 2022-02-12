import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_ALLOW_UNLOGIN_KEY } from '../../decorators';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

// 为了在用户不登录的情况下通过
// 而登录的情况获取到 user 的信息
// 使用了下面不得已的办法，使用时在路由上加上 @AllowUnlogin

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async canActivate(context: ExecutionContext) {
    const isAllowUnlogin = this.reflector.getAllAndOverride<boolean>(
      IS_ALLOW_UNLOGIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isAllowUnlogin) {
      try {
        const user = await super.canActivate(context);
        return user;
      } catch {
        return true;
      }
    } else {
      return super.canActivate(context);
    }
  }
}
