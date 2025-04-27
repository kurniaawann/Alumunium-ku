import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProjectItemDto } from 'src/DTO/dto.projectItem';
import { ProjectItemService } from './projectItem.service';

@Controller('project-item')
export class ProjectItemController {
  constructor(private readonly projectItemController: ProjectItemService) {}

  @Post('')
  async createProjectItem(@Body('data') request: ProjectItemDto[]) {
    return this.projectItemController.createProjectItemService(request);
  }

  @Put('/:id')
  async editProjectItem(
    @Body() request: ProjectItemDto,
    @Param('id') projectItemId: string,
  ) {
    const result = this.projectItemController.editProjectItemService(
      request,
      projectItemId,
    );
    return result;
  }
  @Delete('/:id')
  async deleteProjectItem(@Param('id') projectItemId: string) {
    const result =
      this.projectItemController.deleteProjectItemService(projectItemId);
    return result;
  }

  @Get('/all')
  async getAllProjectItem(
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
    const result = await this.projectItemController.getAllProjectItemService(
      pageInt,
      limitInt,
      name || '',
    );
    return result;
  }
}
