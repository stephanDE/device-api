import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FraunhoferDevice extends Document {
  @Prop()
  fraunhoferRoomNr: number;

  @Prop()
  fraunhoferFlatId: string;

  @Prop()
  roomId: string;

  @Prop()
  deviceId: string;

  @Prop()
  temperature: any;

  @Prop()
  meterValue: any;
}

export const FraunhoferDeviceSchema = SchemaFactory.createForClass(
  FraunhoferDevice,
);
