import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { TokenService } from 'src/jwt/jwt.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [JwtAuthModule],
  providers: [ProjectService, TokenService],
  controllers: [ProjectController],
})
export class ProjectModule {}
