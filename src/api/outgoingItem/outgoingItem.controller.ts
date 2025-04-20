import { Controller } from '@nestjs/common';
import { OutgoingItemService } from './outgoingItem.service';

@Controller('outgoing-item')
export class OutgoingItemController {
  constructor(private outgoingItemService: OutgoingItemService) {}
}
