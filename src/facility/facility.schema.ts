import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Facility extends Document {
  @Prop()
  address: string;

  @Prop()
  facilityId: string;

  @Prop()
  floors: any[];
}

@Schema()
export class Floor extends Document {
  @Prop()
  floorName: string;

  @Prop()
  facilityId: string;

  @Prop()
  floorId: string;

  @Prop()
  flats: any;
}

@Schema()
export class Flat extends Document {
  moveHistory: any[];
  flatId: string;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);
