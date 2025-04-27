import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateProjectItemDto {
  @IsString()
  projectItemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectItemDto)
  projectItem: CreateProjectItemDto[];
}
