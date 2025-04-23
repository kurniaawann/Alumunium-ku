import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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

  @Get('all')
  async getAllOutgoingItem(
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
    const result = await this.outgoingItemService.getAllOutgoingItemService(
      pageInt,
      limitInt,
      name || '',
    );
    return result;
  }
}
