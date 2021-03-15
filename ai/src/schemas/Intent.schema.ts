import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IntentDocument = Intent & Document;

@Schema()
export class Intent {
  @Prop()
  confidence: number;

  @Prop()
  name: string;

  @Prop()
  message: string;
}

export const IntentSchema = SchemaFactory.createForClass(Intent);
