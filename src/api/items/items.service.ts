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
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';

@Injectable()
export class ItemService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createItemService(request: ItemDto, userId: string) {
    const generateItemId: string = `item-id-${uuid()}`;

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

    await this.prismaService.item.create({
      data: {
        itemId: generateItemId,
        createdBy: existingUser.userName,
        ...request,
      },
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
        updatedBy: existingUser.userName,
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
        deleteBy: existingUser.userName,
        deleteAt: new Date(),
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Item berhasil dihapus',
    };
  }
}
