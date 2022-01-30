import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  code: number;
  msg: string;
}

function transformRESTful<T>(data): Response<T> {
  if (data.code && data.msg) {
    return data;
  }
  return {
    code: 0,
    msg: 'success',
    data,
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // 这里不是 res 而是 req
    const restfulRequest = context.switchToHttp().getRequest();
    if (restfulRequest) {
      return next.handle().pipe(map((data) => transformRESTful(data)));
    }

    // 如果是 graphql 请求，则直接返回
    // const qraphqlRequest = GqlExecutionContext.create(context).getContext().req;
    // if (qraphqlRequest) {
    //   return next.handle().pipe(tap());
    // }

    return next.handle().pipe(tap());
  }
}
