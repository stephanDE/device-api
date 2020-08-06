/* eslint-disable */
import { Transport } from '@nestjs/microservices';

import { ConfigService } from '../config/config.service';

const PATTERN_METADATA = 'microservices:pattern';
const TRANSPORT_METADATA = 'microservices:transport';
const PATTERN_HANDLER_METADATA = 'microservices:handler_type';

export const KafkaTopic = (metadata?: string): MethodDecorator => {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const configService: ConfigService = new ConfigService();
    const config = configService.getConfig().kafka;

    Reflect.defineMetadata(
      PATTERN_METADATA,
      `${config.prefix}-${metadata}`,
      descriptor.value,
    );
    Reflect.defineMetadata(PATTERN_HANDLER_METADATA, 2, descriptor.value);
    Reflect.defineMetadata(
      TRANSPORT_METADATA,
      Transport.KAFKA,
      descriptor.value,
    );

    return descriptor;
  };
};
