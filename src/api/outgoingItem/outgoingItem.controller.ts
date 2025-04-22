import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
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

  @Put('/:id')
  async editOutgoingItem(
    @Body() request: OutgoingItemDto,
    @Param('id') outgoingItem: string,
  ) {
    const result = await this.outgoingItemService.editOutgoingItemService(
      request,
      outgoingItem,
    );
    return result;
  }

  @Delete('/:id')
  async deleteOutgoingItem(@Param('id') id: string) {
    const result = await this.outgoingItemService.deleteOutgoingItemService(id);
    return result;
  }
}
