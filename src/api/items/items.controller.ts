import { Body, Controller, Param, Post, Put, Request } from '@nestjs/common';
import { CreateItemDto, CreateItemIncomingDto } from 'src/DTO/dto.item';
import { ItemService } from './items.service';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}
  @Post('')
  async createItem(@Body() request: CreateItemDto) {
    const result = await this.itemService.createItemService(request);
    return result;
  }

  @Put('/:id')
  async editItem(@Body() request: CreateItemDto, @Param('id') id: string) {
    const result = await this.itemService.editItemService(request, id);
    return result;
  }
  @Post('incoming')
  async createIncomingItem(
    @Body() request: CreateItemIncomingDto,
    @Request() req,
  ) {
    const userId: string = req.user.user_id;
    console.log(userId);
    const result = await this.itemService.createIncomingItemService(
      request,
      userId,
    );
    return result;
  }
}
