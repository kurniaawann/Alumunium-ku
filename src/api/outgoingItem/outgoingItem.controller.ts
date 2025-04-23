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
import { OutgoingItemDto } from 'src/DTO/dto.outgoingItem';
import { OutgoingItemService } from './outgoingItem.service';

@Controller('outgoing-item')
export class OutgoingItemController {
  constructor(private outgoingItemService: OutgoingItemService) {}

  @Post('/:id')
  async createOutgoingItem(
    @Body() request: OutgoingItemDto,
    @Param('id') itemId: string,
    @Request() req,
  ) {
    const userId: string = req.user.user_id;
    const result = await this.outgoingItemService.createOutgoingItemService(
      request,
      itemId,
      userId,
    );
    return result;
  }

  @Put('/:id')
  async editOutgoingItem(
    @Body() request: OutgoingItemDto,
    @Param('id') outgoingItem: string,
    @Request() req,
  ) {
    const userId: string = req.user.user_id;
    const result = await this.outgoingItemService.editOutgoingItemService(
      request,
      outgoingItem,
      userId,
    );
    return result;
  }

  @Delete('/:id')
  async deleteOutgoingItem(@Param('id') id: string, @Request() req) {
    const userId: string = req.user.user_id;
    const result = await this.outgoingItemService.deleteOutgoingItemService(
      id,
      userId,
    );
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
