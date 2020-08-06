import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Facility, Floor, Flat } from './facility.schema';
import { FloorEnrolledEvent } from './events/floorEnrolled.event';
import { FlatEnrolledEvent } from './events/flatEnrolled.event';
import { map } from 'lodash';
import { RoomEnrolledEvent } from './events/roomEnrolled.event';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel('Facilities') private facilityModel: Model<Facility>,
  ) {}

  async enrollFlat(event: FlatEnrolledEvent): Promise<Facility> {
    const flat = event.data;

    const facility = await this.facilityModel.findOne({
      'floors.floorId': flat.floorId,
    });

    map(facility.floors, (floor: Floor) => {
      if (floor.floorId == flat.floorId) {
        floor.flats.push({
          flatName: flat.flatName,
          floorId: flat.floorId,
          flatId: flat._id,
          facilityId: floor.facilityId,
          rooms: [],
        });
      }
    });

    return this.facilityModel
      .findByIdAndUpdate({ _id: facility._id }, facility)
      .exec();
  }

  async enrollRoom(event: RoomEnrolledEvent): Promise<Facility> {
    const room = event.data;

    const facility = await this.facilityModel.findOne({
      'floors.flats.flatId': room.flatId,
    });

    map(facility.floors, (floor: Floor) => {
      map(floor.flats, (flat: Flat) => {
        if (flat.flatId == room.flatId) {
          flat.rooms.push({
            facilityId: flat.facilityId,
            floorId: flat.floorId,
            flatId: flat.flatId,
            roomId: room._id,
            roomName: room.roomName,
          });
        }
      });
    });

    return this.facilityModel
      .findByIdAndUpdate({ _id: facility._id }, facility)
      .exec();
  }

  async enrollFloor(event: FloorEnrolledEvent): Promise<Facility> {
    const floor = event.data;
    const facility = await this.facilityModel.findOne({
      facilityId: floor.facilityId,
    });

    return this.facilityModel.findByIdAndUpdate(
      { _id: facility._id },
      {
        floors: [
          ...facility.floors,
          {
            floorName: floor.floorName,
            floorId: floor._id,
            facilityId: facility.facilityId,
            flats: [],
          },
        ],
      },
    );
  }
  async enrollFacility(event: FloorEnrolledEvent): Promise<Facility> {
    return this.facilityModel.create({
      facilityId: event.data._id,
      address: event.data.address,
      floors: [],
    });
  }

  async findAll(): Promise<Facility[]> {
    return this.facilityModel.find().exec();
  }
}
