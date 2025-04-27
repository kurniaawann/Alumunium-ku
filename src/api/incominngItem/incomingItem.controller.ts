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
import { IncomingItemDto } from 'src/DTO/dto.incomingItem';
import { IncomingItemService } from './incomingItem.service';

@Controller('incoming-item')
export class IncomingItemController {
  constructor(private incomingItemService: IncomingItemService) {}
  @Post('')
  async createIncomingItem(
    @Body('incomingItem') request: IncomingItemDto[],
    @Request() req,
  ) {
    const userId: string = req.user.user_id;
    const result = await this.incomingItemService.createIncomingItemService(
      request,
      userId,
    );
    return result;
  }

  @Put('/:id')
  async editIncomingItem(
    @Body() request: IncomingItemDto,
    @Request() req,
    @Param('id') id: string,
  ) {
    const userId: string = req.user.user_id;
    const result = await this.incomingItemService.editIncomingItemService(
      request,
      userId,
      id,
    );
    return result;
  }

  @Delete('/:id')
  async deleteIncomingItem(@Request() req, @Param('id') id: string) {
    const userId: string = req.user.user_id;
    const result = await this.incomingItemService.deleteIncomingItemService(
      userId,
      id,
    );
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
    const result = await this.incomingItemService.getAllIncomingItemService(
      pageInt,
      limitInt,
      name || '',
    );
    return result;
  }
  @Get('/:id/detail/item')
  async getDetailIncomingItem(@Param('id') incomingItemId: string) {
    return await this.incomingItemService.getDetailIncomingItemService(
      incomingItemId,
    );
  }
}
