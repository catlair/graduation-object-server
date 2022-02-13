import { StatusCodeEnum } from '@/enums/status-code-emum';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_ALLOW_UNLOGIN_KEY } from '../../decorators';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class LocalEmailAuthGuard extends AuthGuard('local-email') {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (info && info.message === 'jwt expired') {
      throw new UnauthorizedException({
        statusCode: StatusCodeEnum.LOGIN_EXPIRED,
        message: '登录已过期',
      });
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

// 为了在用户不登录的情况下通过
// 而登录的情况获取到 user 的信息
// 使用了下面不得已的办法，使用时在路由上加上 @AllowUnlogin

@Injectable()
export class JwtUnloginGuard extends AuthGuard('jwt') {
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
        return await super.canActivate(context);
      } catch {
        return true;
      }
    } else {
      return super.canActivate(context);
    }
  }
}
