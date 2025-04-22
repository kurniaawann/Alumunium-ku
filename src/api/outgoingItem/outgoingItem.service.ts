import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { OutgoingItemDto } from 'src/DTO/dto.outgoingItem';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
@Injectable()
export class OutgoingItemService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createOutgoingItemService(request: OutgoingItemDto, itemId: string) {
    await this.prismaService.outgoingItem.create({
      data: {
        outgoingItemsId: `item-id-${uuid()}`,
        itemId: itemId,
        ...request,
      },
    });

    const existingItem = await this.prismaService.item.findUnique({
      where: {
        itemId: itemId,
      },
    });

    if (!existingItem) {
      throw new NotFoundException('Item tidak ditemukan.');
    }

    if (existingItem.stock < request.quantity) {
      throw new NotFoundException('Stok tidak mencukupi.');
    }

    await this.prismaService.item.update({
      where: {
        itemId: itemId,
      },
      data: {
        stock: existingItem.stock - request.quantity,
      },
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Item berhasil dikirim.',
    };
  }
}
