import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { TokenService } from 'src/jwt/jwt.service';
import { JwtMiddlewareUser } from 'src/middleware/jwt.middleware';
import { ItemController } from './items.controller';
import { ItemService } from './items.service';

@Module({
  imports: [JwtAuthModule],
  providers: [ItemService, TokenService],
  controllers: [ItemController],
})
export class ItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddlewareUser).forRoutes('/item/*');
  }
}
