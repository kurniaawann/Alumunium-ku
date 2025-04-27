import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ProjectItemDto } from 'src/DTO/dto.projectItem';
import { calculateNextPage } from 'src/utils/PaginatedResponse/CalculateNextpage';
import { calculatePreviousPage } from 'src/utils/PaginatedResponse/CalculatePreviousPage';
import { calculateTotalPages } from 'src/utils/PaginatedResponse/CalculateTotalPages';
import { createPaginatedResponse } from 'src/utils/PaginatedResponse/PaginatedResponse';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProjectItemService {
  constructor(private prismaService: PrismaService) {}

  async createProjectItemService(request: ProjectItemDto[]) {
    // Pastikan setiap item dalam request mendapatkan projectItemId yang unik
    const projectItems = request.map((item) => ({
      projectItemId: `project-item-id-${uuid()}`,
      ...item,
    }));

    this.prismaService.projectItem.createMany({
      data: projectItems,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Project item berhasil dibuat',
    };
  }

  async editProjectItemService(request: ProjectItemDto, projectItemId: string) {
    const existingProjectItem = await this.prismaService.projectItem.findUnique(
      {
        where: { projectItemId },
      },
    );

    if (!existingProjectItem) {
      throw new NotFoundException('Project item tidak ditemukan.');
    }
    await this.prismaService.projectItem.update({
      where: { projectItemId },
      data: request,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Project item berhasil diperbarui',
    };
  }

  async deleteProjectItemService(projectItemId: string) {
    const existingProjectItem = await this.prismaService.projectItem.findUnique(
      {
        where: { projectItemId },
      },
    );
    if (!existingProjectItem) {
      throw new NotFoundException('Project item tidak ditemukan.');
    }
    await this.prismaService.projectItem.delete({
      where: { projectItemId },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Project item berhasil dihapus',
    };
  }

  async getAllProjectItemService(page: number, limit: number, name: string) {
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

    const totalData = await this.prismaService.projectItem.count({
      where: whereCondition,
    });

    const items = await this.prismaService.projectItem.findMany({
      where: whereCondition,
      skip,
      take: validLimitParams,
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
