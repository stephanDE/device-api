import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTenantDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  readonly flatId: string;
  readonly moveDate: string;
}
