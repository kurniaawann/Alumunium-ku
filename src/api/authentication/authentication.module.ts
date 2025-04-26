import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { TokenService } from 'src/jwt/jwt.service';
import { JwtMiddlewareUser } from 'src/middleware/jwt.middlewareUser';
import { RateLimitMiddleware } from 'src/middleware/LimitSendEmail.middleware';
import { OtpVerificationRateLimitMiddleware } from 'src/middleware/LimitValidateOtp.middleware';
import { RabbitModule } from 'src/rabbitMq/rabbitmq.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [RabbitModule, JwtAuthModule],
  providers: [
    AuthenticationService,
    OtpVerificationRateLimitMiddleware,
    TokenService,
  ],
  controllers: [AuthenticationController],
})
// export class AuthenticationModule {}
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({
        path: '/authentication/send/otp',
        method: RequestMethod.POST,
      })
      .apply(OtpVerificationRateLimitMiddleware)
      .forRoutes(
        {
          path: '/authentication/user/verification',
          method: RequestMethod.POST,
        },

        {
          path: '/authentication/user/forgot-password/verification',
          method: RequestMethod.POST,
        },
      )
      .apply(JwtMiddlewareUser)
      .forRoutes({
        path: '/authentication/forgot/password',
        method: RequestMethod.POST,
      })
      .apply(JwtMiddlewareUser)
      .forRoutes({
        path: '/authentication/logout',
        method: RequestMethod.DELETE,
      });
  }
}
