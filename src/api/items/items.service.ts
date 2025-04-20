import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      stock: item.stock,
      createdBy: existingUser.userName,
    }));

    await this.prismaService.item.createMany({
      data: itemsToCreate,
      skipDuplicates: false, // opsional
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
        StringResource.GLOBAL_FAILURE_MESSAGE.USER_NOT_FOUND,
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
        StringResource.GLOBAL_FAILURE_MESSAGE.USER_NOT_FOUND,
      );
    }

    if (!existingUser) {
      throw new NotFoundException(
        StringResource.GLOBAL_FAILURE_MESSAGE.USER_NOT_FOUND,
      );
    }

    await this.prismaService.item.update({
      where: { itemId: id },
      data: {
        isDelete: true,
        deleteAt: new Date(),
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Item berhasil dihapus',
    };
  }

  async getAllItemService(
    page: number,
    limit: number,
    isDeleted: boolean,
    isUpdate: boolean,
  ) {
    const validPageParams = Math.max(1, page);
    const validLimitParams = Math.max(1, limit);
    const skip = (validPageParams - 1) * validLimitParams;

    console.log(isUpdate);

    const items = await this.prismaService.item.findMany({
      where: {
        isDelete: isDeleted, // hanya ambil item yang belum dihapus
      },
      skip,
      take: validLimitParams,
      orderBy: {
        createdAt: 'desc', // opsional: urutkan dari yang terbaru
      },
    });

    const totalPages = calculateTotalPages(items.length, validLimitParams);
    const nextPage = calculateNextPage(validPageParams, totalPages);
    const previousPage = calculatePreviousPage(validPageParams);

    return createPaginatedResponse({
      data: items,
      totalData: items.length,
      previousPage,
      nextPage,
      totalPages,
      currentPage: validPageParams,
      limit: validLimitParams,
    });
  }
}
