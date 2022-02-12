import { Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    Logger.warn(`${request.method} ${request.url}`, exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: exception?.code || -1,
      url: request.url,
      msg: '服务器异常',
    });
  }
}
