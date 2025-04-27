import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { TokenService } from 'src/jwt/jwt.service';
import { JwtMiddlewareAdmin } from 'src/middleware/jwt.middlewareAdmin';
import { JwtMiddlewareUser } from 'src/middleware/jwt.middlewareUser';
import { OutgoingItemController } from './outgoingItem.controller';
import { OutgoingItemService } from './outgoingItem.service';

@Module({
  imports: [JwtAuthModule],
  providers: [OutgoingItemService, TokenService],
  controllers: [OutgoingItemController],
})
export class OutgoingItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddlewareUser)
      .forRoutes(
        { path: 'outgoing-item/all', method: RequestMethod.GET },
        { path: 'outgoing-item/:id/detail/item', method: RequestMethod.GET },
      );

    consumer
      .apply(JwtMiddlewareAdmin)
      .forRoutes(
        { path: 'outgoing-item/:id', method: RequestMethod.POST },
        { path: 'outgoing-item/:id', method: RequestMethod.PUT },
        { path: 'outgoing-item/:id', method: RequestMethod.DELETE },
      );
  }
}
