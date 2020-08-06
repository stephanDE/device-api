import { IsString, IsNotEmpty } from 'class-validator';

export class MoveTenantDto {
  @IsNotEmpty()
  @IsString()
  readonly tenantId: string;

  @IsNotEmpty()
  @IsString()
  readonly flatId: string;

  @IsNotEmpty()
  @IsString()
  readonly moveDate: string;
}
