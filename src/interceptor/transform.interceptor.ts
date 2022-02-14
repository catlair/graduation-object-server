import { ErrorInfoStructure } from '@/types';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T = any> extends ErrorInfoStructure {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return null;
        }
        if (data.code && data.msg) {
          return data;
        } else {
          return { data, success: true } as Response<T>;
        }
      }),
    );
  }
}
