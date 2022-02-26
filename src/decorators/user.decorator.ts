import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export const UserReq = createParamDecorator(
  async (data: string | boolean, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user: jwtDto } = request;
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { id: jwtDto.id } });
    if (data === true) {
      return user;
    }
    delete user.password;
    return data ? user?.[data] : user;
  },
);

/**
 * 好处是不用获取数据库
 */
export const UserJwt = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
