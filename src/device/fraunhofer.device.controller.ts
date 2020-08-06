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
  Patch,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ClientKafka } from '@nestjs/microservices';

import { MongoPipe } from '../pipe/mongoid.pipe';
import { KafkaTopic } from '../kafka/kafkaTopic.decorator';
import { Cmd } from '../kafka/command.decorator';
import { Roles } from '../auth/auth.decorator';
import { RoleGuard } from '../auth/auth.guard';
import { ExceptionFilter } from '../kafka/kafka.exception.filter';
import { Command } from './commands/command';
import { Event } from './events/event';
import { Config } from '../config/config.interface';
import { CommandHandler } from './commands/command.handler';
import { EventHandler } from './events/event.handler';
import { Evt } from '../kafka/event.decorator';
import { Device } from './device.schema';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/createDevice.dto';
import { FraunhoferDevice } from './fraunhofer.device.schema';

@Controller('fraunhofer-device')
@UseGuards(RoleGuard)
@UseFilters(ExceptionFilter)
export class FraunhoferDeviceController {
  constructor(private deviceService: DeviceService) {}

  @Roles('Read')
  @Get('')
  async getAll(): Promise<FraunhoferDevice[]> {
    return this.deviceService.findAllFraunhofer();
  }

  @Get('/:id')
  async getOne(@Param('id', new MongoPipe()) id: string) {
    return this.deviceService.findOneFraunhofer(id);
  }
}
