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

@Controller('device')
@UseGuards(RoleGuard)
@UseFilters(ExceptionFilter)
export class DeviceController {
  constructor(
    private eventHandler: EventHandler,
    private deviceService: DeviceService,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    @Inject('CONFIG') private config: Config,
    private commandHandler: CommandHandler,
  ) {}

  @Roles('Read')
  @Get('')
  async getAll(): Promise<Device[]> {
    return this.deviceService.findAll();
  }

  @Get('/:id')
  async getOne(@Param('id', new MongoPipe()) id: string) {
    return this.deviceService.findOne(id);
  }

  @Post('')
  @Roles('Create')
  @UsePipes(ValidationPipe)
  async createOne(@Body() dto: CreateDeviceDto): Promise<Device> {
    const device: Device = await this.deviceService.createOne(dto);

    const event = {
      id: uuid(),
      type: 'event',
      action: 'DeviceCreated',
      timestamp: Date.now(),
      data: device,
    };

    this.kafkaClient.emit(`${this.config.kafka.prefix}-device-event`, event);

    return device;
  }

  @KafkaTopic(`device-command`) async onCommand(
    @Cmd() command: Command,
  ): Promise<void> {
    const device: Device = await this.commandHandler.handler(command);

    const event = {
      id: uuid(),
      type: 'event',
      action: 'DeviceCreated',
      timestamp: Date.now(),
      data: device,
    };

    this.kafkaClient.emit(`${this.config.kafka.prefix}-device-event`, event);

    return;
  }

  @KafkaTopic('device-event') async ondeviceEvent(
    @Evt() event: Event,
  ): Promise<void> {
    await this.eventHandler.handleEvent(event);
    return;
  }
}
