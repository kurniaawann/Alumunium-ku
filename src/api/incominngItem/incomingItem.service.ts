import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { IncomingItemDto } from 'src/DTO/dto.incomingItem';
import { StringResource } from 'src/StringResource/string.resource';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
@Injectable()
export class IncomingItemService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}
  async createIncomingItemService(request: IncomingItemDto, userId: string) {
    const generateItemId = `item-id-${uuid()}`;
    const generateIncomingItemId = `incoming-item-id-${uuid()}`;

    // Normalize nama barang
    const normalizedItemName = request.itemName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userName: true,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(
        StringResource.GLOBAL_FAILURE_MESSAGE.USER_NOT_FOUND,
      );
    }

    // Cek apakah item sudah ada dengan nama yang sudah dinormalisasi
    const existingItem = await this.prismaService.item.findFirst({
      where: {
        itemName: {
          equals: normalizedItemName,
        },
      },
    });

    if (existingItem) {
      // Jika item sudah ada, tinggal update stock dan buat incoming
      await this.prismaService.incomingItem.create({
        data: {
          incomingItemsId: generateIncomingItemId,
          itemId: existingItem.itemId,
          quantity: request.quantity,
          receivedBy: existingUser.userName,
        },
      });

      await this.prismaService.item.update({
        where: { itemId: existingItem.itemId },
        data: {
          stock: { increment: request.quantity },
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message:
          'Barang masuk ditambahkan ke item yang sudah ada, stok diperbarui.',
      };
    } else {
      // Buat item baru dengan nama yang sudah dinormalisasi
      await this.prismaService.item.create({
        data: {
          itemId: generateItemId,
          itemName: normalizedItemName,
          itemCode: request.itemCode,
          stock: request.quantity,
        },
      });

      await this.prismaService.incomingItem.create({
        data: {
          incomingItemsId: generateIncomingItemId,
          itemId: generateItemId,
          quantity: request.quantity,
          receivedBy: existingUser.userName,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Item baru berhasil dibuat dan barang masuk dicatat.',
      };
    }
  }
}
