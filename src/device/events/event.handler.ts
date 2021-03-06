import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { DeviceService } from '../device.service';
import { Device } from '../device.schema';
import { Event } from './event';
import { FacilityService } from 'src/facility/facility.service';
import { Facility } from 'src/facility/facility.schema';

@Injectable()
export class EventHandler {
  constructor(private facilityService: FacilityService) {}

  async handleEvent(event: Event): Promise<any> {
    throw new RpcException(`Unsupported event action: ${event.action}`);
  }
}
