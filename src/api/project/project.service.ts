import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  UpdateStatusDto,
} from 'src/DTO/dto.project';
import { calculateNextPage } from 'src/utils/PaginatedResponse/CalculateNextpage';
import { calculatePreviousPage } from 'src/utils/PaginatedResponse/CalculatePreviousPage';
import { calculateTotalPages } from 'src/utils/PaginatedResponse/CalculateTotalPages';
import { createPaginatedResponse } from 'src/utils/PaginatedResponse/PaginatedResponse';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}

  async createProjectService(request: CreateProjectDto) {
    // Validasi input
    if (!request.projectItem || request.projectItem.length === 0) {
      throw new Error('Project projectItem cannot be empty');
    }

    // Ambil semua itemId yang dikirimkan
    const itemIds = request.projectItem.map((item) => item.projectItemId);

    // Ambil semua ProjectItem sekaligus
    const projectItems = await this.prismaService.projectItem.findMany({
      where: {
        projectItemId: { in: itemIds },
      },
    });

    // Validasi semua item ada
    if (projectItems.length !== itemIds.length) {
      const missingItems = itemIds.filter(
        (id) => !projectItems.some((item) => item.projectItemId === id),
      );
      throw new NotFoundException(
        `ProjectItems tidak ditemukan: ${missingItems.join(', ')}`,
      );
    }

    // Hitung totalCost dan siapkan data untuk relasi
    let totalCost = 0;
    const projectItemOnProjectData = request.projectItem.map((item) => {
      const projectItem = projectItems.find(
        (pi) => pi.projectItemId === item.projectItemId,
      );

      if (!projectItem) {
        throw new NotFoundException(
          `ProjectItem dengan id ${item.projectItemId} tidak ditemukan`,
        );
      }

      const subtotal = projectItem.price * item.quantity;
      totalCost += subtotal;

      return {
        projectItemOnProjectId: `project-item-on-project-${uuid()}`,
        projectItemId: item.projectItemId,
        quantity: item.quantity,
        priceAtThatTime: projectItem.price,
      };
    });

    // Buat transaksi untuk memastikan konsistensi data
    await this.prismaService.$transaction(async (prisma) => {
      // Simpan proyek
      const newProject = await prisma.project.create({
        data: {
          projectId: `project-${uuid()}`,
          projectName: request.projectName,
          description: request.description,
          address: request.address,
          status: 'PENDING',
          totalCost,
          projectItems: {
            create: projectItemOnProjectData,
          },
        },
        include: {
          projectItems: {
            include: {
              projectItem: true,
            },
          },
        },
      });

      return newProject;
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Project berhasil dibuat',
    };
  }

  async updateProjectService(request: UpdateProjectDto, projectId: string) {
    // Cari proyek dulu
    const existingProject = await this.prismaService.project.findUnique({
      where: { projectId: projectId },
      include: { projectItems: true },
    });

    if (!existingProject) {
      throw new NotFoundException('Project tidak ditemukan');
    }

    // Jika ada projectItem baru dikirim
    let totalCost = existingProject.totalCost;

    let projectItemOnProjectData = [];

    if (request.projectItem && request.projectItem.length > 0) {
      const itemIds = request.projectItem.map((item) => item.projectItemId);
      const projectItems = await this.prismaService.projectItem.findMany({
        where: {
          projectItemId: { in: itemIds },
        },
      });

      if (projectItems.length !== itemIds.length) {
        const missingItems = itemIds.filter(
          (id) => !projectItems.some((item) => item.projectItemId === id),
        );
        throw new NotFoundException(
          `ProjectItems tidak ditemukan: ${missingItems.join(', ')}`,
        );
      }

      // Hitung ulang totalCost
      totalCost = 0;
      projectItemOnProjectData = request.projectItem.map((item) => {
        const projectItem = projectItems.find(
          (pi) => pi.projectItemId === item.projectItemId,
        );
        const subtotal = projectItem.price * item.quantity;
        totalCost += subtotal;

        return {
          projectItemOnProjectId: `project-item-on-project-${uuid()}`,
          projectItemId: item.projectItemId,
          quantity: item.quantity,
          priceAtThatTime: projectItem.price,
        };
      });
    }

    // Update data
    await this.prismaService.$transaction(async (prisma) => {
      // Update project fields
      await prisma.project.update({
        where: { projectId: projectId },
        data: {
          projectName: request.projectName,
          description: request.description,
          address: request.address,
          totalCost: totalCost,
        },
      });

      if (request.projectItem && request.projectItem.length > 0) {
        // Hapus semua projectItems lama
        await prisma.projectItemOnProject.deleteMany({
          where: {
            projectId: projectId,
          },
        });

        // Masukkan projectItems baru
        await prisma.projectItemOnProject.createMany({
          data: projectItemOnProjectData.map((item) => ({
            ...item,
            projectId: projectId,
          })),
        });
      }
    });

    return {
      statusCode: 200,
      message: 'Project berhasil diupdate',
    };
  }

  async deleteProjectService(projectId: string) {
    // Cari dulu projectnya
    const project = await this.prismaService.project.findUnique({
      where: { projectId },
      include: { projectItems: true },
    });

    if (!project) {
      throw new NotFoundException(
        `Project dengan id ${projectId} tidak ditemukan`,
      );
    }

    // Jalankan transaksi hapus semua data yang berhubungan
    await this.prismaService.$transaction(async (prisma) => {
      // Hapus semua relasi di ProjectItemOnProject
      await prisma.projectItemOnProject.deleteMany({
        where: { projectId },
      });

      // Hapus projectnya
      await prisma.project.delete({
        where: { projectId },
      });
    });

    return {
      statusCode: HttpStatus.OK,
      message: `Proyek berhasil dihapus`,
    };
  }

  async getAllProjectService(page: number, limit: number, name: string) {
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

    const totalData = await this.prismaService.project.count({
      where: whereCondition,
    });

    const projects = await this.prismaService.project.findMany({
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
      data: projects,
      totalData,
      previousPage,
      nextPage,
      totalPages,
      currentPage: validPageParams,
      limit: validLimitParams,
    });
  }

  async getDetailProjectService(projectId: string) {
    const project = await this.prismaService.project.findUnique({
      where: { projectId },
      include: {
        projectItems: {
          include: {
            projectItem: true, // Ambil data lengkap ProjectItem
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(
        `Project dengan id ${projectId} tidak ditemukan`,
      );
    }

    // Hitung total biaya semua item
    let totalCostOfItems = 0;
    const itemsWithTotal = project.projectItems.map((item) => {
      const itemTotal = item.quantity * item.priceAtThatTime; // Harga per unit * jumlah
      totalCostOfItems += itemTotal;
      return {
        name: item.projectItem.name,
        price: item.projectItem.price,
        quantity: item.quantity,
        total: itemTotal,
      };
    });

    // Menyusun response sesuai format yang diinginkan
    const projectDetail = {
      projectId: project.projectId,
      projectName: project.projectName,
      description: project.description,
      address: project.address,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      totalCost: project.totalCost,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      items: itemsWithTotal, // Daftar item beserta totalnya
      totalCostOfItems, // Total biaya item
    };

    return projectDetail;
  }

  async changeStatusProject(projectId: string, request: UpdateStatusDto) {
    let statusProject: Status;

    const project = await this.prismaService.project.findUnique({
      where: { projectId },
    });

    if (request.status === 'progress') {
      statusProject = Status.PROGRESS;

      //jalankan start date ketika progres
      await this.prismaService.project.update({
        where: { projectId: projectId },
        data: {
          startDate: new Date().toISOString(),
        },
      });
    } else if (request.status === 'completed') {
      statusProject = Status.COMPLETED;

      //Setelah end date
      await this.prismaService.project.update({
        where: { projectId: projectId },
        data: {
          endDate: new Date().toISOString(),
        },
      });
    } else {
      statusProject = Status.CANCELLED;
    }

    if (!project) {
      throw new NotFoundException(
        `Project dengan id ${projectId} tidak ditemukan`,
      );
    }

    await this.prismaService.project.update({
      where: { projectId },
      data: {
        status: statusProject,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: `Status proyek berhasil ke ${statusProject} diubah`,
    };
  }
}
