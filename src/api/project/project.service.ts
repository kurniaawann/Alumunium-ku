import { Injectable, NotFoundException } from '@nestjs/common';
import { addHours } from 'date-fns';
import { PrismaService } from 'src/common/prisma.service';
import { CreateProjectDto } from 'src/DTO/dto.project';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(request: CreateProjectDto) {
    // Validasi input
    if (!request.projectItem || request.projectItem.length === 0) {
      throw new Error('Project projectItem cannot be empty');
    }

    // Ambil semua itemId yang dikirimkan
    const itemIds = request.projectItem.map((item) => item.projectItemId);

    // Ambil semua ProjectItem sekaligus
    const projectItems = await this.prisma.projectItem.findMany({
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
        `ProjectItems not found: ${missingItems.join(', ')}`,
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
    const project = await this.prisma.$transaction(async (prisma) => {
      const adjustedStartDate = addHours(new Date(), 7);
      // Simpan proyek
      const newProject = await prisma.project.create({
        data: {
          projectId: `project-${uuid()}`,
          projectName: request.projectName,
          description: request.description,
          startDate: adjustedStartDate,
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

    return project;
  }
}
