import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Device extends Document {
  @Prop()
  name: string;

  @Prop()
  roomId: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
