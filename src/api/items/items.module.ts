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
import { ItemController } from './items.controller';
import { ItemService } from './items.service';

@Module({
  imports: [JwtAuthModule],
  providers: [ItemService, TokenService],
  controllers: [ItemController],
})
export class ItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddlewareUser)
      .forRoutes({ path: 'item/all', method: RequestMethod.GET });

    consumer
      .apply(JwtMiddlewareAdmin)
      .forRoutes(
        { path: 'item', method: RequestMethod.POST },
        { path: 'item/:id', method: RequestMethod.PUT },
        { path: 'item/:id', method: RequestMethod.DELETE },
      );
  }
}
