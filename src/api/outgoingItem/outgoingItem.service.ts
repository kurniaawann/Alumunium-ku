import {
  BadRequestException,
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

    await this.prismaService.outgoingItem.create({
      data: {
        outgoingItemsId: `outgoing-item-id-${uuid()}`,
        itemId: itemId,
        ...request,
      },
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Item berhasil dikirim.',
    };
  }

  async editOutgoingItemService(
    request: OutgoingItemDto,
    outgoingItemId: string,
  ) {
    const existingOutgoingItem =
      await this.prismaService.outgoingItem.findUnique({
        where: { outgoingItemsId: outgoingItemId },
      });

    if (!existingOutgoingItem) {
      throw new NotFoundException('Data item keluar tidak ditemukan.');
    }

    const item = await this.prismaService.item.findUnique({
      where: { itemId: existingOutgoingItem.itemId },
    });

    if (!item) {
      throw new NotFoundException('Item tidak ditemukan.');
    }

    // Hitung stok yang tersedia setelah mengembalikan quantity lama
    const restoredStock = item.stock + existingOutgoingItem.quantity;

    if (restoredStock < request.quantity) {
      throw new BadRequestException(
        'Stok tidak mencukupi untuk jumlah yang diperbarui.',
      );
    }

    // Update stok dengan quantity baru
    await this.prismaService.item.update({
      where: { itemId: existingOutgoingItem.itemId },
      data: {
        stock: restoredStock - request.quantity,
      },
    });

    // Update data outgoingItem
    await this.prismaService.outgoingItem.update({
      where: { outgoingItemsId: outgoingItemId },
      data: {
        ...request,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Item keluar berhasil diperbarui.',
    };
  }

  async deleteOutgoingItemService(outgoingItemId: string) {
    const existingOutgoingItem =
      await this.prismaService.outgoingItem.findUnique({
        where: { outgoingItemsId: outgoingItemId },
      });

    if (!existingOutgoingItem) {
      throw new NotFoundException('Data item keluar tidak ditemukan.');
    }

    const item = await this.prismaService.item.findUnique({
      where: { itemId: existingOutgoingItem.itemId },
    });

    if (!item) {
      throw new NotFoundException('Item tidak ditemukan.');
    }

    // Hitung stok yang tersedia setelah mengembalikan quantity lama
    const restoredStock = item.stock + existingOutgoingItem.quantity;

    await this.prismaService.item.update({
      where: { itemId: existingOutgoingItem.itemId },
      data: {
        stock: restoredStock,
      },
    });

    await this.prismaService.outgoingItem.delete({
      where: { outgoingItemsId: outgoingItemId },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Item keluar berhasil dihapus.',
    };
  }
}
