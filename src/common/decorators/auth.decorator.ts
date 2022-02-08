import { Role } from '@/user/models/user.model';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/auth.guard';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const ROLE_KEY = 'role';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLE_KEY, roles),
    UseGuards(GqlAuthGuard, RolesGuard),
  ); // 先使用 jwt，后者才能获取到 roles);
}

export function RestAuth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLE_KEY, roles),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
  ); // 先使用 jwt，后者才能获取到 roles);
}
