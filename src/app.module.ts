import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { CommanModule } from './common/comman.module';
import { JwtAuthModule } from './jwt/jwt.module';
import { RabbitModule } from './rabbitMq/rabbitmq.module';

@Module({
  imports: [
    RabbitModule,
    JwtAuthModule,
    AuthenticationModule,
    CommanModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
