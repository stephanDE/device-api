import { IsString, IsNotEmpty, IsNumber, Equals } from 'class-validator';

export class Event {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @Equals('event')
  readonly type: string;

  @IsString()
  @IsNotEmpty()
  readonly action: string;

  @IsNumber()
  @IsNotEmpty()
  readonly timestamp: number;
}
