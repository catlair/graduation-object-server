import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { ResponseException } from '../exception';

@Catch(ResponseException)
export class ResponseExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const originRes: any = exception.getResponse();
    const status = exception.getStatus();
    const code = exception.getCode();

    // 错误码为 1
    const errorResponse = {
      msg: originRes,
      code: code || 1,
      url: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
