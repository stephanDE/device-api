import { PipeTransform, BadRequestException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

export class MongoPipe implements PipeTransform<string> {
  async transform(value: string): Promise<string> {
    if (!isMongoId(value)) {
      throw new BadRequestException('ID must be ObjectId');
    }
    return value;
  }
}
