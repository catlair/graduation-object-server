import { Prisma } from '@prisma/client';
import { prismaLogger } from '../config/logging';

const Logger = prismaLogger();

export function PrismaLoggerMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    const result = await next(params);
    Logger.log(`took`, `${params.model}.${params.action}`);
    return result;
  };
}
