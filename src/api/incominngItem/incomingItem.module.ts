import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { TokenService } from 'src/jwt/jwt.service';
import { JwtMiddlewareUser } from 'src/middleware/jwt.middleware';
import { IncomingItemController } from './incomingItem.controller';
import { IncomingItemService } from './incomingItem.service';

@Module({
  imports: [JwtAuthModule],
  providers: [IncomingItemService, TokenService],
  controllers: [IncomingItemController],
})
export class IncomingItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddlewareUser).forRoutes('/incoming-item*');
    consumer.apply(JwtMiddlewareUser).forRoutes('/incoming-item/*');
  }
}
