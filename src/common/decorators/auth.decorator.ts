import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../enums/role.enums';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const ROLE_KEY = 'role';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLE_KEY, roles),
    UseGuards(GqlAuthGuard, RolesGuard),
  ); // 先使用 jwt，后者才能获取到 roles);
}
