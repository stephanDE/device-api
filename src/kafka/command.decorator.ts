import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RpcException } from '@nestjs/microservices';
import { Command } from 'src/tenant/commands/command';
import { CreateTenantCommand } from 'src/tenant/commands/createTenant.command';

export const Cmd = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const ctxData = ctx.switchToRpc().getData();
    const value = ctxData.value;

    if (!ctxData || !ctxData.value || !ctxData.topic || !value.type) {
      throw new RpcException('Invalid kafka message');
    }

    let command: Command;

    switch (value.action) {
      case 'CreateFacility':
        command = plainToClass(CreateTenantCommand, value);
        break;
      default:
        throw new RpcException('unknown command type');
    }

    // validate
    const errors = await validate(command);

    if (errors.length > 0) {
      throw new RpcException(errors);
    }

    return command;
  },
);
