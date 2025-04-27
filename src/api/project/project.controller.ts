import { Body, Controller, Post } from '@nestjs/common';
import { CreateProjectDto } from 'src/DTO/dto.project';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  async create(@Body() dto: CreateProjectDto) {
    return this.projectService.createProject(dto);
  }
}
