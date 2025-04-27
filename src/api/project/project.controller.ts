import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreateProjectDto,
  UpdateProjectDto,
  UpdateStatusDto,
} from 'src/DTO/dto.project';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  async createProject(@Body() request: CreateProjectDto) {
    return this.projectService.createProjectService(request);
  }

  @Put('/:id')
  async updateProject(
    @Body() request: UpdateProjectDto,
    @Param('id') projectId: string,
  ) {
    return this.projectService.updateProjectService(request, projectId);
  }

  @Delete('/:id')
  async deleteProject(@Param('id') projectId: string) {
    return this.projectService.deleteProjectService(projectId);
  }

  @Get('all')
  async getAllProject(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') name?: string,
  ) {
    const pageInt: number = isNaN(parseInt(page ?? '1', 10))
      ? 1
      : parseInt(page ?? '1', 10);
    const limitInt: number = isNaN(parseInt(limit ?? '10', 10))
      ? 10
      : parseInt(limit ?? '10', 10);
    const result = await this.projectService.getAllProjectService(
      pageInt,
      limitInt,
      name || '',
    );
    return result;
  }

  @Get('/:id/detail')
  async getDetailProject(@Param('id') projectId: string) {
    return this.projectService.getDetailProjectService(projectId);
  }

  @Patch('/:id/change-status')
  async finishProject(
    @Param('id') projectId: string,
    @Body() request: UpdateStatusDto,
  ) {
    return this.projectService.changeStatusProject(projectId, request);
  }
}
