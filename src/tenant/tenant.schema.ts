import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Tenant extends Document {
  @Prop()
  name: string;

  @Prop()
  flatId: string;

  @Prop()
  moveDate: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
