import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { StringResource } from 'src/StringResource/string.resource';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests: Map<string, { count: number; timestamp: number }> =
    new Map();
  private readonly limit = 3; // Batas permintaan
  private readonly ttl = 10 * 60 * 1000; // Rentang waktu dalam milidetik (10 menit)

  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'POST') {
      const email = req.body?.email;

      const currentTime = Date.now();
      const requestData = this.requests.get(email) || {
        count: 0,
        timestamp: currentTime,
      };

      if (currentTime - requestData.timestamp > this.ttl) {
        requestData.count = 0;
        requestData.timestamp = currentTime;
      }

      if (requestData.count >= this.limit) {
        const timeLeft = requestData.timestamp + this.ttl - currentTime;
        const secondsLeft = Math.ceil(timeLeft / 1000);

        let message = '';

        if (secondsLeft >= 60) {
          const minutes = Math.floor(secondsLeft / 60);
          const seconds = secondsLeft % 60;

          if (seconds > 0) {
            message = `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.MANY_REQUEST} ${minutes} menit ${seconds} detik.`;
          } else {
            message = `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.MANY_REQUEST} ${minutes} menit.`;
          }
        } else {
          message = `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.MANY_REQUEST} ${secondsLeft} detik.`;
        }

        throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
      }

      requestData.count++;
      this.requests.set(email, requestData);
    }

    next();
  }
}
