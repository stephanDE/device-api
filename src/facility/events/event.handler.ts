import { Injectable, Inject } from '@nestjs/common';
import { RpcException, ClientKafka } from '@nestjs/microservices';
import { FloorEnrolledEvent } from './floorEnrolled.event';

import { FacilityService } from '../facility.service';
import { Facility } from '../facility.schema';
import { Event } from './event';
import { FlatEnrolledEvent } from './flatEnrolled.event';
import { FacilityEnrolledEvent } from './facilityEnrolled.event';
import { RoomEnrolledEvent } from './roomEnrolled.event';
import { Config } from 'src/config/config.interface';
import { Command } from 'src/device/commands/command';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EventHandler {
  constructor(
    private facilityService: FacilityService,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    @Inject('CONFIG') private config: Config,
  ) {}

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

      case 'RoomEnrolled': {
        return this.handleRoomEnrolledEvent(event as RoomEnrolledEvent);
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

  private async handleRoomEnrolledEvent(
    event: RoomEnrolledEvent,
  ): Promise<Facility> {
    this.kafkaClient.emit(`${this.config.kafka.prefix}-device-command`, {
      id: uuid(),
      action: 'CreateDevice',
      type: 'command',
      timestamp: Date.now(),
      data: {
        name: `device-${event.data._id}`,
        roomId: event.data._id,
      },
    } as Command);

    return this.facilityService.enrollRoom(event);
  }
}
