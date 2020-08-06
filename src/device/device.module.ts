import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DeviceController } from './device.controller';
import { DeviceSchema } from './device.schema';
import { LoggingModule } from '../logging/logging.module';
import { DeviceService } from './device.service';
import { CommandHandler } from './commands/command.handler';
import { EventHandler } from './events/event.handler';
import { FacilityModule } from 'src/facility/facility.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Device',
        schema: DeviceSchema,
      },
    ]),
    LoggingModule,
    FacilityModule,
  ],
  controllers: [DeviceController],
  providers: [DeviceService, CommandHandler, EventHandler],
})
export class DeviceModule {}
