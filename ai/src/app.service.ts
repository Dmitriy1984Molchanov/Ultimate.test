import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Intent, IntentDocument } from './schemas/Intent.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Intent.name) private intentModel: Model<IntentDocument>,
  ) {}

  async ai(message: string): Promise<Intent[]> {
    return await this.intentModel.find({ message }).exec();
  }

  async create(intent: Intent): Promise<string> {
    return (await this.intentModel.create(intent))._id;
  }

  async deleteById(_id: string): Promise<void> {
    const res = await this.intentModel.deleteOne({ _id }).exec();
    if (res.deletedCount === 0)
      throw new NotFoundException(
        "Intent with provided id doesn't exist",
        'Intent Not Found',
      );
  }
}
