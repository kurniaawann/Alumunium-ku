import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isObject, snakeCase } from 'lodash';
import { map, Observable } from 'rxjs';

@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
  private toSnakeCase(obj: object): object {
    // Handle null or undefined
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item) => this.toSnakeCase(item));
    }

    // Handle non-object types (string, number, boolean)
    if (!isObject(obj)) {
      return obj;
    }

    // Handle Date objects
    if (obj instanceof Date) {
      return obj;
    }

    // Transform object keys to snake_case
    return Object.keys(obj).reduce((result, key) => {
      const snakeCaseKey = snakeCase(key);
      result[snakeCaseKey] = this.toSnakeCase(obj[key]);
      return result;
    }, {} as object);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<object> {
    return next.handle().pipe(map((data) => this.toSnakeCase(data)));
  }
}
