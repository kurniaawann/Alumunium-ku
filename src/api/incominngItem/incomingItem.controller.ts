import { Body, Controller, Post, Request } from '@nestjs/common';
import { IncomingItemDto } from 'src/DTO/dto.incomingItem';
import { IncomingItemService } from './incomingItem.service';

@Controller('incoming-item')
export class IncomingItemController {
  constructor(private incomingItemService: IncomingItemService) {}
  @Post('')
  async createIncomingItem(@Body() request: IncomingItemDto, @Request() req) {
    const userId: string = req.user.user_id;
    const result = await this.incomingItemService.createIncomingItemService(
      request,
      userId,
    );
    return result;
  }
}
