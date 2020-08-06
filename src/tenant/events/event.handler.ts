import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { TenantService } from '../tenant.service';
import { Tenant } from '../tenant.schema';
import { Event } from './event';
import { TenantMovedEvent } from './tenantMoved.event';
import { FacilityService } from 'src/facility/facility.service';
import { Facility } from 'src/facility/facility.schema';

@Injectable()
export class EventHandler {
  constructor(private facilityService: FacilityService) {}

  async handleEvent(event: Event): Promise<any> {
    switch (event.action) {
      case 'TenantMoved': {
        return this.handleTenantMovedEvent(event as TenantMovedEvent);
      }

      default:
        throw new RpcException(`Unsupported event action: ${event.action}`);
    }
  }

  private async handleTenantMovedEvent(
    event: TenantMovedEvent,
  ): Promise<Facility> {
    return this.facilityService.tenantMoved(event);
  }
}
