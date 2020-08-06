import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Facility, Floor, Flat } from './facility.schema';
import { FloorEnrolledEvent } from './events/floorEnrolled.event';
import { FlatEnrolledEvent } from './events/flatEnrolled.event';
import { map } from 'lodash';

@Injectable()
export class FacilityService {
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
        });
      }
    });

    return this.facilityModel.findByIdAndUpdate(
      { _id: facility._id },
      facility,
    );
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
  constructor(
    @InjectModel('Facilities') private facilityModel: Model<Facility>,
  ) {}

  async findAll(): Promise<Facility[]> {
    return this.facilityModel.find().exec();
  }

  async tenantMoved(event: any) {
    const tenant = event.data;

    const facility = await this.facilityModel.findOne({
      'floors.flats.flatId': tenant.flatId,
    });
    console.log('mieter', tenant);
    console.log('suche haus', tenant.flatId);
    console.log('habe gefunden', facility);

    map(facility.floors, (floor: Floor) => {
      map(floor.flats, (flat: Flat) => {
        if (flat.flatId === tenant.flatId) {
          if (!flat.moveHistory) {
            flat.moveHistory = [];
          }
          flat.moveHistory.push({
            moveDate: tenant.moveDate,
            tenantId: tenant._id,
          });
        }
      });
    });

    return this.facilityModel.findByIdAndUpdate(
      { _id: facility._id },
      facility,
    );
  }
}
