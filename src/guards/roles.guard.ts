import { JwtDto } from '@/modules/auth/dto/jwt.dto';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const user: JwtDto = context.switchToHttp().getRequest().user;

    return (
      requiredRoles.some((role) => user.roles?.includes(role)) ||
      (user.roles as Role[]).some((role) => role === Role.ADMIN)
    );
  }
}
