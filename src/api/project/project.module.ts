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
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [JwtAuthModule],
  providers: [ProjectService, TokenService],
  controllers: [ProjectController],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddlewareUser)
      .forRoutes(
        { path: 'project/all', method: RequestMethod.GET },
        { path: 'project//:id/detail/item', method: RequestMethod.GET },
      );

    consumer
      .apply(JwtMiddlewareAdmin)
      .forRoutes(
        { path: 'project', method: RequestMethod.POST },
        { path: 'project/:id', method: RequestMethod.PUT },
        { path: 'project/:id', method: RequestMethod.DELETE },
        { path: 'project/:id/change-status', method: RequestMethod.PATCH },
      );
  }
}
