import {
  BadRequestException,
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
    const generateStockLogId = `stock-log-id-${uuid()}`;

    // Normalize nama barang
    const normalizedItemName = request.itemName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    const existingUser = await this.prismaService.user.findUnique({
      where: { userId },
      select: { userName: true },
    });

    if (!existingUser) {
      throw new NotFoundException(
        StringResource.GLOBAL_FAILURE_MESSAGE.USER_NOT_FOUND,
      );
    }

    const existingItem = await this.prismaService.item.findFirst({
      where: { itemName: { equals: normalizedItemName } },
    });

    if (existingItem) {
      // Stok sebelum
      const beforeStock = existingItem.stock;

      // Create incoming item
      await this.prismaService.incomingItem.create({
        data: {
          priceIncomingItem: request.priceIncomingItem,
          incomingItemsId: generateIncomingItemId,
          itemId: existingItem.itemId,
          quantity: request.quantity,
          receivedBy: existingUser.userName,
        },
      });

      // Update stok item
      const updatedItem = await this.prismaService.item.update({
        where: { itemId: existingItem.itemId },
        data: {
          stock: { increment: request.quantity },
        },
      });

      // Buat StockLog
      await this.prismaService.stockLog.create({
        data: {
          logId: generateStockLogId,
          userId: userId,
          itemId: existingItem.itemId,
          changeType: 'IN',
          quantity: request.quantity,
          beforeStock: beforeStock,
          afterStock: updatedItem.stock,
          description: `Barang masuk oleh ${existingUser.userName} (dari IncomingItem)`,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message:
          'Barang masuk ditambahkan ke item yang sudah ada, stok diperbarui.',
      };
    } else {
      // Buat item baru
      await this.prismaService.item.create({
        data: {
          itemId: generateItemId,
          itemName: normalizedItemName,
          itemCode: request.itemCode,
          stock: request.quantity,
          width: request.width,
          height: request.height,
        },
      });

      // Create incoming item
      await this.prismaService.incomingItem.create({
        data: {
          priceIncomingItem: request.priceIncomingItem,
          incomingItemsId: generateIncomingItemId,
          itemId: generateItemId,
          quantity: request.quantity,
          receivedBy: existingUser.userName,
        },
      });

      // Buat StockLog (stok sebelumnya = 0)
      await this.prismaService.stockLog.create({
        data: {
          logId: generateStockLogId,
          userId: userId,
          itemId: generateItemId,
          changeType: 'IN',
          quantity: request.quantity,
          beforeStock: 0,
          afterStock: request.quantity,
          description: `Item baru dibuat dan barang masuk oleh ${existingUser.userName}`,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Item baru berhasil dibuat dan barang masuk dicatat.',
      };
    }
  }

  async editIncomingItemService(
    request: IncomingItemDto,
    userId: string,
    id: string,
  ) {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userName: true,
      },
    });

    const existingIncomingItem =
      await this.prismaService.incomingItem.findUnique({
        where: {
          incomingItemsId: id,
        },
        include: {
          item: true, // penting agar bisa akses item.stock
        },
      });

    if (!existingUser) {
      throw new NotFoundException(
        StringResource.GLOBAL_FAILURE_MESSAGE.USER_NOT_FOUND,
      );
    }

    if (!existingIncomingItem) {
      throw new NotFoundException('Id incoming item tidak ditemukan.');
    }

    const oldQuantity = existingIncomingItem.quantity;
    const newQuantity = request.quantity;
    const stockCorrection = newQuantity - oldQuantity;

    const currentStock = existingIncomingItem.item.stock;
    const updatedStock = currentStock + stockCorrection;

    if (updatedStock < 0) {
      throw new BadRequestException('Stok tidak boleh kurang dari 0.');
    }

    // Update master: Item
    await this.prismaService.item.update({
      where: { itemId: existingIncomingItem.itemId },
      data: {
        itemName: request.itemName,
        itemCode: request.itemCode,
        stock: {
          increment: stockCorrection,
        },
        width: request.width,
        height: request.height,
      },
    });

    // Update quantity incoming item
    await this.prismaService.incomingItem.update({
      where: {
        incomingItemsId: id,
      },
      data: {
        quantity: newQuantity,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Incoming item berhasil diupdate.',
    };
  }
}
