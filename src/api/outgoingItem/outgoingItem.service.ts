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
import { StringResource } from 'src/StringResource/string.resource';
import { calculateNextPage } from 'src/utils/PaginatedResponse/CalculateNextpage';
import { calculatePreviousPage } from 'src/utils/PaginatedResponse/CalculatePreviousPage';
import { calculateTotalPages } from 'src/utils/PaginatedResponse/CalculateTotalPages';
import { createPaginatedResponse } from 'src/utils/PaginatedResponse/PaginatedResponse';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
@Injectable()
export class OutgoingItemService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createOutgoingItemService(
    request: OutgoingItemDto,
    itemId: string,
    userId: string,
  ) {
    const existingItem = await this.prismaService.item.findUnique({
      where: {
        itemId: itemId,
      },
    });

    const existingUserId = await this.prismaService.user.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!existingItem) {
      throw new NotFoundException('Item tidak ditemukan.');
    }

    if (existingItem.stock < request.quantity) {
      throw new NotFoundException('Stok tidak mencukupi.');
    }

    if (!existingUserId) {
      throw new NotFoundException(
        StringResource.GLOBAL_FAILURE_MESSAGE.USER_NOT_FOUND,
      );
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

    await this.prismaService.stockLog.create({
      data: {
        logId: `log-id-${uuid()}`,
        userId,
        itemId,
        changeType: 'OUT',
        quantity: request.quantity,
        beforeStock: existingItem.stock,
        afterStock: existingItem.stock - request.quantity,
        description: `Barang yang keluar ${existingItem.itemName} dengan jumlah ${request.quantity}`,
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
    userId: string,
  ) {
    const existingOutgoingItem =
      await this.prismaService.outgoingItem.findUnique({
        where: { outgoingItemsId: outgoingItemId },
      });

    if (!existingOutgoingItem) {
      throw new NotFoundException('Data item keluar tidak ditemukan.');
    }

    if (!userId) {
      throw new NotFoundException(
        StringResource.GLOBAL_FAILURE_MESSAGE.USER_NOT_FOUND,
      );
    }

    const item = await this.prismaService.item.findUnique({
      where: { itemId: existingOutgoingItem.itemId },
    });

    if (!item) {
      throw new NotFoundException('Item tidak ditemukan.');
    }

    // Hitung stok yang tersedia setelah mengembalikan quantity lama
    const restoredStock = item.stock + existingOutgoingItem.quantity;
    const updatedStock = restoredStock - request.quantity;

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

    await this.prismaService.stockLog.create({
      data: {
        logId: `log-id-${uuid()}`,
        userId: userId,
        itemId: existingOutgoingItem.itemId,
        changeType: 'OUT_EDIT',
        quantity: request.quantity,
        beforeStock: restoredStock,
        afterStock: updatedStock,
        description: `Perubahan item keluar untuk ${item.itemName}, jumlah diubah dari ${existingOutgoingItem.quantity} menjadi ${request.quantity}`,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Item keluar berhasil diperbarui.',
    };
  }

  async deleteOutgoingItemService(outgoingItemId: string, userId: string) {
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

    await this.prismaService.stockLog.create({
      data: {
        logId: `log-id-${uuid()}`,
        userId,
        itemId: item.itemId,
        changeType: 'OUT_DELETE',
        quantity: existingOutgoingItem.quantity,
        beforeStock: item.stock,
        afterStock: restoredStock,
        description: `Penghapusan item keluar ${item.itemName}, stok dikembalikan sebanyak ${existingOutgoingItem.quantity}`,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Item keluar berhasil dihapus.',
    };
  }

  async getAllOutgoingItemService(page: number, limit: number, name: string) {
    const validPageParams = Math.max(1, page);
    const validLimitParams = Math.max(1, limit);
    const skip = (validPageParams - 1) * validLimitParams;

    const whereCondition: any = {};

    // Tambahkan filter pencarian berdasarkan itemName hanya jika name tidak kosong
    if (name && name.trim() !== '') {
      whereCondition.itemName = {
        contains: name,
        // mode: 'insensitive', // tidak case-sensitive
      };
    }

    const totalData = await this.prismaService.outgoingItem.count({
      where: whereCondition,
    });

    const items = await this.prismaService.outgoingItem.findMany({
      where: whereCondition,
      skip,
      take: validLimitParams,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalPages = calculateTotalPages(totalData, validLimitParams);
    const nextPage = calculateNextPage(validPageParams, totalPages);
    const previousPage = calculatePreviousPage(validPageParams);

    return createPaginatedResponse({
      data: items,
      totalData,
      previousPage,
      nextPage,
      totalPages,
      currentPage: validPageParams,
      limit: validLimitParams,
    });
  }

  async getDetailOutgoingItemService(outgoingItemId: string) {
    const result = await this.prismaService.outgoingItem.findUnique({
      where: { outgoingItemsId: outgoingItemId },
      include: {
        item: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Data item keluar tidak ditemukan.');
    }

    return result;
  }
}
