import { ErrorInfoStructure } from '@/types';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isArray } from 'lodash';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionMessage = exception.message;
    const originRes: any = exception.getResponse();

    Logger.log(`${request.method} ${request.url}`, exceptionMessage);

    const { message, statusCode } = originRes;
    // 如果是数组，则转换成字符串
    const resMsg = message ? (isArray(message) ? message[0] : message) : '';

    response.status(status || HttpStatus.OK).json({
      success: false,
      errorCode: statusCode || status?.toString() || '1',
      errorMessage: resMsg || exceptionMessage,
      host: request.hostname,
      data: null,
    } as ErrorInfoStructure);
  }
}
