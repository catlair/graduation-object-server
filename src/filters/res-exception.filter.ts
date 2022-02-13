import { ErrorInfoStructure } from '@/types';
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { ResponseException } from '../exception';

@Catch(ResponseException)
export class ResponseExceptionFilter extends BaseExceptionFilter {
  catch(exception: ResponseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const originRes: any = exception.getResponse();
    const status = exception.getStatus();
    const code = exception.getCode();

    response.status(status).json({
      success: false,
      errorCode: code || '1',
      errorMessage: originRes,
      host: request.hostname,
      data: null,
    } as ErrorInfoStructure);
  }
}
