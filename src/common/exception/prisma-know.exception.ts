import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Catch(PrismaClientKnownRequestError)
export class PrismaKnownFilter implements GqlExceptionFilter {
  catch(exception: PrismaClientKnownRequestError) {
    return exception;
  }
}
