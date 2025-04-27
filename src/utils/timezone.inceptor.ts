import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class TimezoneInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.convertDatesToJakarta(data)));
  }

  private convertDatesToJakarta(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }
    if (obj instanceof Date) {
      // Gunakan T untuk memisahkan tanggal dan waktu
      return dayjs(obj).tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss');
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertDatesToJakarta(item));
    }
    if (typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        newObj[key] = this.convertDatesToJakarta(obj[key]);
      }
      return newObj;
    }
    return obj;
  }
}
