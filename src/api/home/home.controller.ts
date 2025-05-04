import { Controller, Get, Request } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('')
  async getHome(@Request() req) {
    const userId: string = req.user.user_id;
    const result = await this.homeService.getHomeService(userId);
    return result;
  }
}
