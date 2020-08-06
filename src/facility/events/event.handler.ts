import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { FloorEnrolledEvent } from './floorEnrolled.event';

import { FacilityService } from '../facility.service';
import { Facility } from '../facility.schema';
import { Event } from './event';
import { FlatEnrolledEvent } from './flatEnrolled.event';
import { FacilityEnrolledEvent } from './facilityEnrolled.event';
import { TenantMovedEvent } from 'src/tenant/events/tenantMoved.event';

@Injectable()
export class EventHandler {
  constructor(private facilityService: FacilityService) {}

  async handleEvent(event: Event): Promise<any> {
    switch (event.action) {
      case 'FacilityEnrolled': {
        return this.handleFacilityEnrolledEvent(event as FacilityEnrolledEvent);
      }
      case 'FloorEnrolled': {
        return this.handleFloorEnrolledEvent(event as FloorEnrolledEvent);
      }

      case 'FlatEnrolled': {
        return this.handleFlatEnrolledEvent(event as FlatEnrolledEvent);
      }

      case 'TenantMoved': {
        return this.handleTenantMovedEvent(event as FlatEnrolledEvent);
      }

      default:
        throw new RpcException(`Unsupported event action: ${event.action}`);
    }
  }

  private async handleFacilityEnrolledEvent(
    event: FloorEnrolledEvent,
  ): Promise<Facility> {
    return this.facilityService.enrollFacility(event);
  }

  private async handleFloorEnrolledEvent(
    event: FloorEnrolledEvent,
  ): Promise<Facility> {
    return this.facilityService.enrollFloor(event);
  }

  private async handleFlatEnrolledEvent(
    event: FloorEnrolledEvent,
  ): Promise<Facility> {
    return this.facilityService.enrollFlat(event);
  }

  private async handleTenantMovedEvent(
    event: TenantMovedEvent,
  ): Promise<Facility> {
    return this.facilityService.tenantMoved(event);
  }
}
