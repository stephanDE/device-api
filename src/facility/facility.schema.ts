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
  @Prop()
  floorId: string;

  @Prop()
  facilityId: string;

  @Prop()
  flatId: string;

  @Prop()
  flatName: string;

  @Prop()
  rooms: any[];
}

@Schema()
export class Room extends Document {
  @Prop()
  floorId: string;

  @Prop()
  facilityId: string;

  @Prop()
  flatId: string;

  @Prop()
  roomId: String;

  @Prop()
  roomName: string;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);
