import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FacilityController } from './facility.controller';
import { FacilitySchema } from './facility.schema';
import { LoggingModule } from '../logging/logging.module';
import { FacilityService } from './facility.service';
import { EventHandler } from './events/event.handler';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Facilities',
        schema: FacilitySchema,
      },
    ]),
    LoggingModule,
  ],
  exports: [FacilityService],
  controllers: [FacilityController],
  providers: [FacilityService, EventHandler],
})
export class FacilityModule {}
