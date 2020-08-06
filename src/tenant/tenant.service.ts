import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Tenant } from './tenant.schema';
import { CreateTenantDto } from './dto/createTenant.dto';

@Injectable()
export class TenantService {
  constructor(@InjectModel('Tenant') private tenantModel: Model<Tenant>) {}

  async findAll(): Promise<Tenant[]> {
    return this.tenantModel.find().exec();
  }

  async findOne(id: string): Promise<Tenant> {
    return this.tenantModel.findById(id).exec();
  }

  async createOne(dto: CreateTenantDto): Promise<Tenant> {
    return this.tenantModel.create(dto);
  }

  async tenantMoved(event: any): Promise<Tenant> {
    // kick old tenant out of flat
    await this.tenantModel.findOneAndUpdate(
      { flatId: event.flatId },
      {
        flatId: null,
      },
    );
    // new tenant move in
    await this.tenantModel
      .findByIdAndUpdate(
        {
          _id: event.tenantId,
        },
        {
          flatId: event.flatId,
          moveDate: event.moveDate,
        },
      )
      .exec();

    return this.tenantModel.findById(event.tenantId).exec();
  }
}
