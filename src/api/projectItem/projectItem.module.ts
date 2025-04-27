import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { TokenService } from 'src/jwt/jwt.service';
import { ProjectItemController } from './projectItem.controller';
import { ProjectItemService } from './projectItem.service';

@Module({
  imports: [JwtAuthModule],
  providers: [ProjectItemService, TokenService],
  controllers: [ProjectItemController],
})
export class projectItemModule {}
