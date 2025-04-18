import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StringResource } from 'src/StringResource/string.resource';

export class ItemDto {
  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.NAME_REQUIRED,
  })
  @MinLength(5, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.NAME_MIN_LENGTH,
  })
  @MaxLength(255, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.NAME_MAX_LENGTH,
  })
  itemName: string;

  @IsOptional()
  @IsInt({
    message: StringResource.ERROR_MESSAGES_VALIDATE.NUMBER,
  })
  itemCode: number;

  @IsInt({
    message: StringResource.ERROR_MESSAGES_VALIDATE.NUMBER,
  })
  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.STOCK_REQUIRED,
  })
  stock: number;
}
