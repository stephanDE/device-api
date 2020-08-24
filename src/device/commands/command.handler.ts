import { Injectable, Inject } from '@nestjs/common';
import { RpcException, ClientKafka } from '@nestjs/microservices';

import { DeviceService } from '../device.service';
import { Device } from '../device.schema';
import { Command } from './command';
import { CreateDeviceCommand } from './createDevice.command';
import { of } from 'rxjs';
import { Config } from 'src/config/config.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CommandHandler {
  constructor(
    private deviceService: DeviceService,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    @Inject('CONFIG') private config: Config,
  ) {}

  async handler(command: Command): Promise<Device> {
    switch (command.action) {
      case 'CreateDevice':
        return this.handleCreateDeviceCommand(command as CreateDeviceCommand);
      default:
        throw new RpcException(`Unsupported command action: ${command.action}`);
    }
  }

  private async handleCreateDeviceCommand(command: CreateDeviceCommand) {
    const device = await this.deviceService.createOne(command.data);
    const event = {
      id: uuid(),
      type: 'event',
      action: 'DeviceUpdated',
      timestamp: Date.now(),
      data: device,
    };

    this.kafkaClient.emit(`${this.config.kafka.prefix}-device-event`, event);

    return device;
  }
}
