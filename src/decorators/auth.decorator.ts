import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../modules/auth/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../enums/role.enum';
import { AllowUnlogin } from './allow-unlogin.decorator';

export const ROLES_KEY = 'roles';

// 使用组合装饰器，简化鉴权过程

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard), // 先使用 jwt，后者才能获取到 roles
    ApiBearerAuth(),
  );
}

/**
 * 允许未登录用户访问, 但是登录的用户也获取用户信息
 */
export function AuthUnlogin() {
  return applyDecorators(
    AllowUnlogin(),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
  );
}
