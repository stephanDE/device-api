import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: true,
  });

  const configService: ConfigService = app.get(ConfigService);
  const logger: LoggingService = app.get(LoggingService);
  const config = configService.getConfig();

  app.enableCors();
  app.setGlobalPrefix(config.prefix);
  app.useLogger(logger);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.kafka.clientId,
        brokers: config.kafka.brokerUris,
      },
      consumer: {
        groupId: `${config.kafka.prefix}-${config.kafka.clientId}-consumer`,
      },
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(config.port);

  logger.log(`Facility service running on port ${config.port}`);
  logger.warn('servus du da');
}
bootstrap();
