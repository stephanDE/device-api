import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Device } from './device.schema';
import { CreateDeviceDto } from './dto/createDevice.dto';

@Injectable()
export class DeviceService {
  constructor(@InjectModel('Device') private deviceModel: Model<Device>) {}

  async findAll(): Promise<Device[]> {
    return this.deviceModel.find().exec();
  }

  async findOne(id: string): Promise<Device> {
    return this.deviceModel.findById(id).exec();
  }

  async createOne(dto: CreateDeviceDto): Promise<Device> {
    return this.deviceModel.create(dto);
  }
}
