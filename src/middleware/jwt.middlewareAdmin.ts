import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenService } from 'src/jwt/jwt.service';
import { StringResource } from 'src/StringResource/string.resource';

@Injectable()
export class JwtMiddlewareAdmin implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_TOKEN,
      );
    }

    const token = authHeader.split(' ')[1];

    let payload: any;
    try {
      payload = this.tokenService.verifyAccessToken(token);
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_OR_EXPIRED_TOKEN,
      );
    }

    req['user'] = payload;

    console.log(payload);

    console.log(req['user']);

    // 👉 Validasi role setelah token valid
    if (req['user'].role !== 'admin') {
      throw new ForbiddenException('Anda tidak bisa mengakses resource ini');
    }

    next();
  }
}
