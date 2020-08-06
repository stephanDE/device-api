import { IsNotEmpty, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { Command } from './command';

export class Device {
  @IsNotEmpty()
  @IsString()
  readonly name;

  @IsNotEmpty()
  @IsString()
  readonly roomId: string;
}

export class CreateDeviceCommand extends Command {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Device)
  readonly data: Device;
}
