import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { TenantService } from '../tenant.service';
import { Tenant } from '../tenant.schema';
import { Command } from './command';
import { CreateTenantCommand } from './createTenant.command';
import { MoveTenantCommand } from './moveTenant.command';

@Injectable()
export class CommandHandler {
  constructor(private tenantService: TenantService) {}

  async handler(command: Command): Promise<Tenant> {
    switch (command.action) {
      case 'CreateTenant':
        return this.handleCreateTenantCommand(command as CreateTenantCommand);
      case 'MoveTenant':
        return this.handleMoveTenantCommand(command as MoveTenantCommand);
      default:
        throw new RpcException(`Unsupported command action: ${command.action}`);
    }
  }

  private async handleCreateTenantCommand(command: CreateTenantCommand) {
    return this.tenantService.createOne(command.data);
  }

  private async handleMoveTenantCommand(command: MoveTenantCommand) {
    return this.tenantService.tenantMoved(command.data);
  }
}
