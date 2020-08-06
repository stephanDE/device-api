import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly roomId: string;
}
