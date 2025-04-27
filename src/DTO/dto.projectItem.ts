import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProjectItemDto {
  @IsString({ message: 'Nama item harus String' })
  @IsNotEmpty({ message: 'Nama item tidak boleh kosong' })
  name: string;

  @IsNotEmpty({ message: 'Price tidak boleh kosong' })
  @IsNumber({}, { message: 'Price harus angka' })
  price: number;
}
