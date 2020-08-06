import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TenantController } from './tenant.controller';
import { TenantSchema } from './tenant.schema';
import { LoggingModule } from '../logging/logging.module';
import { TenantService } from './tenant.service';
import { CommandHandler } from './commands/command.handler';
import { EventHandler } from './events/event.handler';
import { FacilityModule } from 'src/facility/facility.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Tenant',
        schema: TenantSchema,
      },
    ]),
    LoggingModule,
    FacilityModule,
  ],
  controllers: [TenantController],
  providers: [TenantService, CommandHandler, EventHandler],
})
export class TenantModule {}
