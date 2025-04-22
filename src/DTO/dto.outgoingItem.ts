import { IsInt, IsNotEmpty, MaxLength } from 'class-validator';
import { StringResource } from 'src/StringResource/string.resource';

export class OutgoingItemDto {
  @IsNotEmpty({
    message: 'Quantity tidak boleh kosong',
  })
  @IsInt({
    message: StringResource.ERROR_MESSAGES_VALIDATE.NUMBER,
  })
  quantity: number;

  @IsNotEmpty({
    message: 'Dikirimkan tidak boleh kosong',
  })
  @MaxLength(100, {
    message: 'Maximal 100 karakter',
  })
  sentTo: string;

  @IsNotEmpty({
    message: 'ditangani oleh tidak boleh kosong',
  })
  @MaxLength(100, {
    message: 'Maximal 100 karakter',
  })
  handledBy: string;

  @IsNotEmpty({
    message: 'deskripsi tidak boleh kosong',
  })
  @MaxLength(255, {
    message: 'Maximal 255 karakter',
  })
  description: string;
}
