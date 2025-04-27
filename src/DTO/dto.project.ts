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
  @IsString({ message: 'Item ID Harus String' })
  @IsNotEmpty({ message: 'Item ID tidak boleh kosong' })
  projectItemId: string;

  @IsInt({ message: 'Quantity harus angka' })
  @Min(1)
  quantity: number;
}

export class CreateProjectDto {
  @IsString({ message: 'Project Name Harus String' })
  @IsNotEmpty({ message: 'Project Name tidak boleh kosong' })
  projectName: string;

  @IsString({ message: 'Address Harus String' })
  @IsNotEmpty({ message: 'Address tidak boleh kosong' })
  address: string;

  @IsNotEmpty({ message: 'Description tidak boleh kosong' })
  @IsString({ message: 'Description Harus String' })
  description: string;

  @IsArray({ message: 'Project Item Harus Array' })
  @ValidateNested({ each: true })
  @Type(() => CreateProjectItemDto)
  projectItem: CreateProjectItemDto[];
}

export class UpdateProjectDto {
  projectName?: string;
  description?: string;
  address?: string;
  projectItem?: {
    projectItemId: string;
    quantity: number;
  }[];
}

export class UpdateStatusDto {
  @IsString({ message: 'Status harus string' })
  status: string;
}
