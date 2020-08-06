import {
  Controller,
  Get,
  Param,
  Inject,
  UseGuards,
  UseFilters,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ClientKafka } from '@nestjs/microservices';

import { MongoPipe } from '../pipe/mongoid.pipe';
import { KafkaTopic } from '../kafka/kafkaTopic.decorator';
import { Cmd } from '../kafka/command.decorator';
import { Roles } from '../auth/auth.decorator';
import { RoleGuard } from '../auth/auth.guard';
import { ExceptionFilter } from '../kafka/kafka.exception.filter';
import { Event } from './events/event';
import { Config } from '../config/config.interface';
import { EventHandler } from './events/event.handler';
import { Evt } from '../kafka/event.decorator';
import { Facility } from './facility.schema';
import { FacilityService } from './facility.service';

@Controller('facility')
@UseGuards(RoleGuard)
@UseFilters(ExceptionFilter)
export class FacilityController {
  constructor(
    private eventHandler: EventHandler,
    private facilityService: FacilityService,
  ) {}

  @Roles('Read')
  @Get('')
  async getAll(): Promise<Facility[]> {
    return this.facilityService.findAll();
  }

  @KafkaTopic('facility-event') async onFacilityEvent(
    @Evt() event: Event,
  ): Promise<void> {
    await this.eventHandler.handleEvent(event);
    return;
  }

  @KafkaTopic('tenant-event') async onTenantEvent(
    @Evt() event: Event,
  ): Promise<void> {
    await this.eventHandler.handleEvent(event);
    return;
  }
}
