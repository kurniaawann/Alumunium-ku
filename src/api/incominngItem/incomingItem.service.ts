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
import { calculateNextPage } from 'src/utils/PaginatedResponse/CalculateNextpage';
import { calculatePreviousPage } from 'src/utils/PaginatedResponse/CalculatePreviousPage';
import { calculateTotalPages } from 'src/utils/PaginatedResponse/CalculateTotalPages';
import { createPaginatedResponse } from 'src/utils/PaginatedResponse/PaginatedResponse';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
@Injectable()
export class IncomingItemService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}
  async createIncomingItemService(request: IncomingItemDto[], userId: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { userId },
      select: { userName: true },
    });

    if (!existingUser) {
      throw new NotFoundException(
        StringResource.GLOBAL_FAILURE_MESSAGE.USER_NOT_FOUND,
      );
    }

    // Normalize semua item name dari request
    const normalizedRequests = request.map((item) => ({
      ...item,
      normalizedItemName: item.itemName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' '),
    }));

    const normalizedNames = normalizedRequests.map(
      (item) => item.normalizedItemName,
    );

    // Ambil semua item yang sudah ada
    const existingItems = await this.prismaService.item.findMany({
      where: { itemName: { in: normalizedNames } },
    });

    // Buat Map untuk akses cepat
    const itemMap = new Map(
      existingItems.map((item) => [item.itemName.toLowerCase(), item]),
    );

    const incomingItemsData = [];
    const stockLogsData = [];
    const newItemsData = [];

    const updateItemPromises = [];

    normalizedRequests.forEach((item) => {
      const itemId = `item-id-${uuid()}`;
      const incomingItemId = `incoming-item-id-${uuid()}`;
      const stockLogId = `stock-log-id-${uuid()}`;

      const existingItem = itemMap.get(item.normalizedItemName);

      if (existingItem) {
        const beforeStock = existingItem.stock;
        const newStock = beforeStock + item.quantity;

        // Siapkan data update stok (jalan paralel)
        updateItemPromises.push(
          this.prismaService.item.update({
            where: { itemId: existingItem.itemId },
            data: {
              stock: { increment: item.quantity },
            },
          }),
        );

        // Tambah data incoming item
        incomingItemsData.push({
          priceIncomingItem: item.priceIncomingItem,
          incomingItemsId: incomingItemId,
          itemId: existingItem.itemId,
          quantity: item.quantity,
          receivedBy: existingUser.userName,
        });

        // Tambah data stock log
        stockLogsData.push({
          logId: stockLogId,
          userId,
          itemId: existingItem.itemId,
          changeType: 'IN',
          quantity: item.quantity,
          beforeStock: beforeStock,
          afterStock: newStock,
          description: `Barang masuk oleh dan deterima oleh ${existingUser.userName} dengan jumlah ${item.quantity}`,
        });
      } else {
        // Item belum ada, buat baru
        newItemsData.push({
          itemId,
          itemName: item.normalizedItemName,
          itemCode: item.itemCode,
          stock: item.quantity,
          width: item.width,
          height: item.height,
        });

        incomingItemsData.push({
          priceIncomingItem: item.priceIncomingItem,
          incomingItemsId: incomingItemId,
          itemId: itemId,
          quantity: item.quantity,
          receivedBy: existingUser.userName,
        });

        stockLogsData.push({
          logId: stockLogId,
          userId,
          itemId,
          changeType: 'IN',
          quantity: item.quantity,
          beforeStock: 0,
          afterStock: item.quantity,
          description: `Item baru dibuat dan barang masuk oleh ${existingUser.userName} dengan jumlah ${item.quantity}`,
        });
      }
    });

    // Eksekusi update stok item yang sudah ada
    if (updateItemPromises.length > 0) {
      await Promise.all(updateItemPromises);
    }

    // Insert item baru jika ada
    if (newItemsData.length > 0) {
      await this.prismaService.item.createMany({
        data: newItemsData,
      });
    }

    // Insert incoming items secara massal
    if (incomingItemsData.length > 0) {
      await this.prismaService.incomingItem.createMany({
        data: incomingItemsData,
      });
    }

    // Insert stock logs secara massal
    if (stockLogsData.length > 0) {
      await this.prismaService.stockLog.createMany({
        data: stockLogsData,
      });
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Barang masuk berhasil diproses.',
    };
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

    await this.prismaService.stockLog.create({
      data: {
        logId: `log-id-${uuid()}`,
        userId,
        itemId: existingIncomingItem.itemId,
        changeType: 'IN_EDIT',
        quantity: stockCorrection,
        beforeStock: currentStock,
        afterStock: updatedStock,
        description: `Edit data item barang ${existingIncomingItem.item.itemName}, perubahan jumlah: ${oldQuantity} → ${newQuantity}`,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Incoming item berhasil diupdate.',
    };
  }

  async deleteIncomingItemService(userId: string, id: string) {
    // Cek apakah user ada
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

    // Cek apakah incoming item ada
    const existingIncomingItem =
      await this.prismaService.incomingItem.findUnique({
        where: {
          incomingItemsId: id,
        },
        include: {
          item: true, // agar bisa akses stok saat ini
        },
      });

    if (!existingIncomingItem) {
      throw new NotFoundException('Incoming item tidak ditemukan.');
    }

    const quantityToRemove = existingIncomingItem.quantity;
    const currentStock = existingIncomingItem.item.stock;
    const updatedStock = currentStock - quantityToRemove;

    if (updatedStock < 0) {
      throw new BadRequestException(
        'Tidak dapat menghapus karena stok akan menjadi negatif.',
      );
    }

    // Update stok di tabel item
    await this.prismaService.item.update({
      where: {
        itemId: existingIncomingItem.itemId,
      },
      data: {
        stock: updatedStock,
      },
    });

    // Hapus incoming item
    await this.prismaService.incomingItem.delete({
      where: {
        incomingItemsId: id,
      },
    });

    await this.prismaService.stockLog.create({
      data: {
        logId: `log-id-${uuid()}`,
        userId,
        itemId: existingIncomingItem.itemId,
        changeType: 'IN_DELETE',
        quantity: -quantityToRemove, // negatif karena stok berkurang
        beforeStock: currentStock,
        afterStock: updatedStock,
        description: `Menghapus baarang yang datang ${existingIncomingItem.item.itemName} dengan jumlah ${quantityToRemove}`,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Incoming item berhasil dihapus dan stok diperbarui.',
    };
  }

  async getAllIncomingItemService(page: number, limit: number, name: string) {
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

    const totalData = await this.prismaService.incomingItem.count({
      where: whereCondition,
    });

    const items = await this.prismaService.incomingItem.findMany({
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
      totalPages,
      currentPage: validPageParams, // halaman saat ini
      nextPage,
      previousPage,
      limit: validLimitParams,
    });
  }

  async getDetailIncomingItemService(incomingItemId: string) {
    const result = await this.prismaService.incomingItem.findUnique({
      where: {
        incomingItemsId: incomingItemId,
      },
      include: {
        item: true, // agar bisa akses stok saat ini
      },
    });

    if (!result) {
      throw new NotFoundException('Data item masuk tidak ditemukan.');
    }

    return result;
  }
}
