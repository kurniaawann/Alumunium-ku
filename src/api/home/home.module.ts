import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { TokenService } from 'src/jwt/jwt.service';
import { JwtMiddlewareUser } from 'src/middleware/jwt.middlewareUser';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [JwtAuthModule],
  providers: [HomeService, TokenService],
  controllers: [HomeController],
  exports: [],
})
export class HomeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddlewareUser).forRoutes({
      path: 'home',
      method: RequestMethod.GET,
    });
  }
}
