import { IsNotEmpty, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { Command } from './command';

class Tenant {
  @IsNotEmpty()
  @IsString()
  readonly name;

  readonly flatId: string;
  readonly moveDate: string;
}

export class CreateTenantCommand extends Command {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Tenant)
  readonly data: Tenant;
}
