import { Body, Controller, Param, Post } from '@nestjs/common';
import { OutgoingItemDto } from 'src/DTO/dto.outgoingItem';
import { OutgoingItemService } from './outgoingItem.service';

@Controller('outgoing-item')
export class OutgoingItemController {
  constructor(private outgoingItemService: OutgoingItemService) {}

  @Post('/:id')
  async createOutgoingItem(
    @Body() request: OutgoingItemDto,
    @Param('id') itemId: string,
  ) {
    const result = await this.outgoingItemService.createOutgoingItemService(
      request,
      itemId,
    );
    return result;
  }
}
