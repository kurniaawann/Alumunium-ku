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
import { IncomingItemController } from './incomingItem.controller';
import { IncomingItemService } from './incomingItem.service';

@Module({
  imports: [JwtAuthModule],
  providers: [IncomingItemService, TokenService],
  controllers: [IncomingItemController],
})
export class IncomingItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddlewareUser)
      .forRoutes(
        { path: 'incoming-item/all', method: RequestMethod.GET },
        { path: 'incoming-item/:id/detail/item', method: RequestMethod.GET },
      );

    consumer
      .apply(JwtMiddlewareAdmin)
      .forRoutes(
        { path: 'incoming-item', method: RequestMethod.POST },
        { path: 'incoming-item/:id', method: RequestMethod.PUT },
        { path: 'incoming-item/:id', method: RequestMethod.DELETE },
      );
  }
}
