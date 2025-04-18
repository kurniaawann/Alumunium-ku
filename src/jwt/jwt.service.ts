import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './utils/InterfaceToken';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateAccessToken(payload: TokenPayload) {
    // Remove exp from the payload before generating new token
    const { ...tokenPayload } = payload;

    return this.jwtService.sign(tokenPayload, {
      secret: this.configService.get<string>('ACCESS_TOKEN'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN'),
      });
    } catch {
      throw new UnauthorizedException(
        'Akses token tidak valid atau telah kedaluwarsa',
      );
    }
  }
}
