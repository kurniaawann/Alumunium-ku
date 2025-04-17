import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtAuthModule } from './jwt/jwt.module';
import { RabbitModule } from './rabbitMq/rabbitmq.module';

@Module({
  imports: [RabbitModule, JwtAuthModule, AuthenticationModule],
})
export class AppModule {}
