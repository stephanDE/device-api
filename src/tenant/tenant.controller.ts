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
import { Tenant } from './tenant.schema';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/createTenant.dto';
import { MoveTenantCommand } from './commands/moveTenant.command';
import { MoveTenantDto } from './dto/moveTenant.dto';

@Controller('tenant')
@UseGuards(RoleGuard)
@UseFilters(ExceptionFilter)
export class TenantController {
  constructor(
    private eventHandler: EventHandler,
    private tenantService: TenantService,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    @Inject('CONFIG') private config: Config,
    private commandHandler: CommandHandler,
  ) {}

  @Roles('Read')
  @Get('')
  async getAll(): Promise<Tenant[]> {
    return this.tenantService.findAll();
  }

  @Get('/:id')
  async getOne(@Param('id', new MongoPipe()) id: string) {
    return this.tenantService.findOne(id);
  }

  @Post('')
  @Roles('Create')
  @UsePipes(ValidationPipe)
  async createOne(@Body() dto: CreateTenantDto): Promise<Tenant> {
    const tenant: Tenant = await this.tenantService.createOne(dto);

    const event = {
      id: uuid(),
      type: 'event',
      action: 'TenantCreated',
      timestamp: Date.now(),
      data: tenant,
    };

    this.kafkaClient.emit(`${this.config.kafka.prefix}-tenant-event`, event);

    return tenant;
  }

  @Patch('')
  @Roles('Move')
  @UsePipes(ValidationPipe)
  async move(@Body() dto: MoveTenantDto): Promise<Tenant> {
    const tenant: Tenant = await this.tenantService.tenantMoved(dto);

    const event = {
      id: uuid(),
      type: 'event',
      action: 'TenantMoved',
      timestamp: Date.now(),
      data: tenant,
    };

    this.kafkaClient.emit(`${this.config.kafka.prefix}-tenant-event`, event);

    return tenant;
  }

  @KafkaTopic(`tenant-command`) async onCommand(
    @Cmd() command: Command,
  ): Promise<void> {
    const tenant: Tenant = await this.commandHandler.handler(command);

    const event = {
      id: uuid(),
      type: 'event',
      action: command.action === 'MoveTenant' ? 'TenantMoved' : 'TenantCreated',
      timestamp: Date.now(),
      data: tenant,
    };

    this.kafkaClient.emit(`${this.config.kafka.prefix}-tenant-event`, event);

    return;
  }

  @KafkaTopic('tenant-event') async onTenantEvent(
    @Evt() event: Event,
  ): Promise<void> {
    await this.eventHandler.handleEvent(event);
    return;
  }
}
