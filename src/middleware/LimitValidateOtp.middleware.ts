import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { StringResource } from 'src/StringResource/string.resource';

@Injectable()
export class OtpVerificationRateLimitMiddleware implements NestMiddleware {
  // Mengubah Map untuk menyimpan path dan email sebagai key
  private otpAttempts: Map<
    string,
    { count: number; timestamp: number; blocked: boolean }
  > = new Map();
  private readonly maxAttempts = 3;
  // private readonly blockDuration = 10 * 60 * 1000;
  private readonly blockDuration = 60 * 1000; // 1 menit

  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'POST') {
      const email = req.body?.email;
      const path = req.path; // Mendapatkan path dari request

      // Membuat unique key dari kombinasi path dan email
      const attemptKey = `${path}:${email}`;

      const currentTime = Date.now();
      const attemptData = this.otpAttempts.get(attemptKey) || {
        count: 0,
        timestamp: currentTime,
        blocked: false,
      };

      // Cek apakah user sedang diblokir untuk path ini
      if (attemptData.blocked) {
        const timeLeft =
          attemptData.timestamp + this.blockDuration - currentTime;
        const secondsLeft = Math.ceil(timeLeft / 1000);

        if (timeLeft <= 0) {
          attemptData.blocked = false;
          attemptData.count = 0;
          attemptData.timestamp = currentTime;
        } else {
          let message = '';

          if (secondsLeft >= 60) {
            const minutes = Math.floor(secondsLeft / 60);
            const seconds = secondsLeft % 60;

            if (seconds > 0) {
              message = `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.MANY_INPUT_OTP} ${minutes} menit ${seconds} detik.`;
            } else {
              message = `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.MANY_INPUT_OTP} ${minutes} menit.`;
            }
          } else {
            message = `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.MANY_INPUT_OTP} ${secondsLeft} detik.`;
          }

          throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
        }
      }

      if (attemptData.count >= this.maxAttempts) {
        attemptData.blocked = true;
        attemptData.timestamp = currentTime;
        this.otpAttempts.set(attemptKey, attemptData);

        throw new HttpException(
          StringResource.FAILURE_MESSAGES_AUTHENTICATION.OTP_ATTEMPT_LIMIT_REACHED,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      attemptData.count++;
      this.otpAttempts.set(attemptKey, attemptData);
    }

    next();
  }

  // Method untuk reset attempts sekarang membutuhkan path dan email
  resetAttempts(path: string, email: string) {
    const attemptKey = `${path}:${email}`;
    this.otpAttempts.delete(attemptKey);
  }
}
