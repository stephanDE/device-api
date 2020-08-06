import { IsNotEmpty, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { Command } from './command';

export class MoveTenant {
  @IsNotEmpty()
  @IsString()
  readonly tenantId;

  @IsNotEmpty()
  @IsString()
  readonly flatId: string;

  @IsNotEmpty()
  @IsString()
  readonly moveDate: string;
}

export class MoveTenantCommand extends Command {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MoveTenant)
  readonly data: MoveTenant;
}
