import { IsNotEmpty, IsString, Equals, IsNumber } from 'class-validator';

export class Command {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  @Equals('command')
  readonly type: string;

  @IsNotEmpty()
  @IsNumber()
  readonly timestamp: number;

  @IsNotEmpty()
  @IsString()
  readonly action: string;
}
