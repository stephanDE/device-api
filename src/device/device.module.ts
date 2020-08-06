import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DeviceController } from './device.controller';
import { DeviceSchema } from './device.schema';
import { LoggingModule } from '../logging/logging.module';
import { DeviceService } from './device.service';
import { CommandHandler } from './commands/command.handler';
import { EventHandler } from './events/event.handler';
import { FacilityModule } from 'src/facility/facility.module';
import { FraunhoferDeviceSchema } from './fraunhofer.device.schema';
import { FraunhoferDeviceController } from './fraunhofer.device.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Device',
        schema: DeviceSchema,
      },
      {
        name: 'FraunhoferDevice',
        schema: FraunhoferDeviceSchema,
      },
    ]),
    HttpModule,
    LoggingModule,
    FacilityModule,
  ],
  controllers: [DeviceController, FraunhoferDeviceController],
  providers: [DeviceService, CommandHandler, EventHandler],
})
export class DeviceModule {}
