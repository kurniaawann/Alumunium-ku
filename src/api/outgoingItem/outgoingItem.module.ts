import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { TokenService } from 'src/jwt/jwt.service';
import { JwtMiddlewareAdmin } from 'src/middleware/jwt.middlewareAdmin';
import { OutgoingItemController } from './outgoingItem.controller';
import { OutgoingItemService } from './outgoingItem.service';

@Module({
  imports: [JwtAuthModule],
  providers: [OutgoingItemService, TokenService],
  controllers: [OutgoingItemController],
})
export class OutgoingItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddlewareAdmin).forRoutes('/outgoing-item*');
    consumer.apply(JwtMiddlewareAdmin).forRoutes('/outgoing-item/*');
  }
}
