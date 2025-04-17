import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenService } from 'src/jwt/jwt.service';
import { StringResource } from 'src/StringResource/string.resource';

@Injectable()
export class JwtMiddlewareUser implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_TOKEN,
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.tokenService.verifyAccessToken(token);
      next();
      return payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_OR_EXPIRED_TOKEN,
      );
    }
  }
}
