import { Module } from '@nestjs/common';
import { ItemController } from './items.controller';
import { ItemService } from './items.service';

@Module({
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
