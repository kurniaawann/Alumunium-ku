import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';

@Injectable()
export class HomeService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async getHomeService(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { userId: userId },
      select: {
        userName: true,
        address: true,
        noHandphone: true,
      },
    });
    const item = await this.prismaService.item.findMany({
      orderBy: {
        createdAt: 'desc', // atau pakai 'id' jika tidak ada createdAt
      },
      take: 10,
    });

    return {
      data: {
        user,
        item,
      },
    };
  }
}
