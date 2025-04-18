import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './api/authentication/authentication.module';
import { ItemModule } from './api/items/items.module';
import { CommanModule } from './common/comman.module';
import { JwtAuthModule } from './jwt/jwt.module';
import { RabbitModule } from './rabbitMq/rabbitmq.module';

@Module({
  imports: [
    RabbitModule,
    JwtAuthModule,
    AuthenticationModule,
    CommanModule,
    ItemModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
