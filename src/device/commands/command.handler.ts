import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { DeviceService } from '../device.service';
import { Device } from '../device.schema';
import { Command } from './command';
import { CreateDeviceCommand } from './createDevice.command';

@Injectable()
export class CommandHandler {
  constructor(private deviceService: DeviceService) {}

  async handler(command: Command): Promise<Device> {
    switch (command.action) {
      case 'CreateDevice':
        return this.handleCreateDeviceCommand(command as CreateDeviceCommand);
      default:
        throw new RpcException(`Unsupported command action: ${command.action}`);
    }
  }

  private async handleCreateDeviceCommand(command: CreateDeviceCommand) {
    return this.deviceService.createOne(command.data);
  }
}
