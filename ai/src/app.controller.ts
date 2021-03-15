import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AIIntent,
  CreateIntentRes,
  DeleteIntentByIdReq,
  Intent,
  Message,
} from './app.types';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('/intents')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({
    type: [AIIntent],
  })
  @Post('/ai')
  async AI(@Body() message: Message): Promise<AIIntent[]> {
    const intents = await this.appService.ai(message.message);
    return intents.map((intent: Intent) => ({
      name: intent.name,
      confidence: intent.confidence,
    }));
  }

  @ApiOkResponse({
    type: CreateIntentRes,
  })
  @Post()
  async create(@Body() intent: Intent): Promise<CreateIntentRes> {
    return { id: await this.appService.create(intent) };
  }

  @Delete('/:id')
  async delete(@Param() params: DeleteIntentByIdReq): Promise<void> {
    await this.appService.deleteById(params.id);
  }
}
