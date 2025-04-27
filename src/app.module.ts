import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './api/authentication/authentication.module';
import { IncomingItemModule } from './api/incominngItem/incomingItem.module';
import { ItemModule } from './api/items/items.module';
import { OutgoingItemModule } from './api/outgoingItem/outgoingItem.module';
import { ProjectModule } from './api/project/project.module';
import { projectItemModule } from './api/projectItem/projectItem.module';
import { CommanModule } from './common/comman.module';
import { OtpModule } from './cornJobOtp/cronjob.module';
import { JwtAuthModule } from './jwt/jwt.module';
import { RabbitModule } from './rabbitMq/rabbitmq.module';

@Module({
  imports: [
    RabbitModule,
    JwtAuthModule,
    AuthenticationModule,
    CommanModule,
    ItemModule,
    IncomingItemModule,
    OutgoingItemModule,
    OtpModule,
    ProjectModule,
    projectItemModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
