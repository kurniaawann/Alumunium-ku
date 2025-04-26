import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { TokenService } from 'src/jwt/jwt.service';
import { JwtMiddlewareAdmin } from 'src/middleware/jwt.middlewareAdmin';
import { IncomingItemController } from './incomingItem.controller';
import { IncomingItemService } from './incomingItem.service';

@Module({
  imports: [JwtAuthModule],
  providers: [IncomingItemService, TokenService],
  controllers: [IncomingItemController],
})
export class IncomingItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddlewareAdmin).forRoutes('/incoming-item*');
    consumer.apply(JwtMiddlewareAdmin).forRoutes('/incoming-item/*');
  }
}
