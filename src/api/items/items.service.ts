import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChangeType } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ItemDto } from 'src/DTO/dto.item';
import { StringResource } from 'src/StringResource/string.resource';
import { calculateNextPage } from 'src/utils/PaginatedResponse/CalculateNextpage';
import { calculatePreviousPage } from 'src/utils/PaginatedResponse/CalculatePreviousPage';
import { calculateTotalPages } from 'src/utils/PaginatedResponse/CalculateTotalPages';
import { createPaginatedResponse } from 'src/utils/PaginatedResponse/PaginatedResponse';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';

@Injectable()
export class ItemService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createItemService(request: ItemDto[], userId: string) {
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

    const itemsToCreate = request.map((item) => ({
      itemId: `item-id-${uuid()}`,
      itemName: item.itemName,
      itemCode: item.itemCode,
      width: item.width,
      height: item.height,
      stock: item.stock,
    }));

    await this.prismaService.item.createMany({
      data: itemsToCreate,
    });

    const stockLogsToCreate = itemsToCreate.map((item) => ({
      logId: `stock-log-id-${uuid()}`,
      userId: userId,
      itemId: item.itemId,
      beforeStock: 0,
      afterStock: item.stock,
      changeType: ChangeType.IN,
      quantity: item.stock,
      description: `Item '${item.itemName}' dibuat oleh ${existingUser.userName}`,
    }));

    await this.prismaService.stockLog.createMany({
      data: stockLogsToCreate,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Item stok berhasil dibuat',
    };
  }

  async editItemService(request: ItemDto, id: string, userId: string) {
    const existingId = await this.prismaService.item.findUnique({
      where: {
        itemId: id,
      },
    });
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userName: true,
      },
    });

    if (!existingId) {
      throw new NotFoundException(
        StringResource.GLOBAL_FAILURE_MESSAGE.ITEM_NOT_FOUND,
      );
    }

    if (!existingUser) {
      throw new NotFoundException(
        StringResource.GLOBAL_FAILURE_MESSAGE.USER_NOT_FOUND,
      );
    }
    await this.prismaService.item.update({
      where: { itemId: existingId.itemId },
      data: {
        ...request,
      },
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Item berhasil diperbaharui',
    };
  }

  async deleteItemService(id: string, userId: string) {
    const existingId = await this.prismaService.item.findUnique({
      where: {
        itemId: id,
      },
    });
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userName: true,
      },
    });

    if (!existingId) {
      throw new NotFoundException(
        StringResource.GLOBAL_FAILURE_MESSAGE.ITEM_NOT_FOUND,
      );
    }

    if (!existingUser) {
      throw new NotFoundException(
        StringResource.GLOBAL_FAILURE_MESSAGE.USER_NOT_FOUND,
      );
    }

    await this.prismaService.item.delete({
      where: { itemId: id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Item berhasil dihapus',
    };
  }

  async getAllItemService(page: number, limit: number, name: string) {
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

    const totalData = await this.prismaService.item.count({
      where: whereCondition,
    });

    const items = await this.prismaService.item.findMany({
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
}
