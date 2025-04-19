import { Body, Controller, Param, Post, Put, Request } from '@nestjs/common';
import { ItemDto } from 'src/DTO/dto.item';
import { ItemService } from './items.service';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}
  @Post('')
  async createItem(@Body() request: ItemDto, @Request() req) {
    const userId: string = req.user.user_id;
    console.log(userId);
    const result = await this.itemService.createItemService(request, userId);
    return result;
  }

  @Put('/:id')
  async editItem(
    @Body() request: ItemDto,
    @Param('id') id: string,
    @Request() req,
  ) {
    const userId: string = req.user.user_id;
    const result = await this.itemService.editItemService(request, id, userId);
    return result;
  }
}
