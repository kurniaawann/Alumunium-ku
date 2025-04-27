import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ItemDto } from 'src/DTO/dto.item';
import { ItemService } from './items.service';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}
  @Post('')
  async createItem(@Body('items') request: ItemDto[], @Request() req) {
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
  @Delete('/:id')
  async deleteItem(@Param('id') id: string, @Request() req) {
    const userId: string = req.user.user_id;
    const result = await this.itemService.deleteItemService(id, userId);
    return result;
  }

  @Get('all')
  async getAllItem(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') name?: string,
  ) {
    const pageInt: number = isNaN(parseInt(page ?? '1', 10))
      ? 1
      : parseInt(page ?? '1', 10);
    const limitInt: number = isNaN(parseInt(limit ?? '10', 10))
      ? 10
      : parseInt(limit ?? '10', 10);
    const result = await this.itemService.getAllItemService(
      pageInt,
      limitInt,
      name || '',
    );
    return result;
  }
}
