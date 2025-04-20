import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { TokenService } from 'src/jwt/jwt.service';
import { JwtMiddlewareUser } from 'src/middleware/jwt.middleware';
import { OutgoingItemController } from './outgoingItem.controller';
import { OutgoingItemService } from './outgoingItem.service';

@Module({
  imports: [JwtAuthModule],
  providers: [OutgoingItemService, TokenService],
  controllers: [OutgoingItemController],
})
export class OutgoingItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddlewareUser).forRoutes('/outgoing-item*');
    consumer.apply(JwtMiddlewareUser).forRoutes('/outgoing-item/*');
  }
}
