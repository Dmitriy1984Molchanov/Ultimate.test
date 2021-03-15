import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';
import { AIIntent, Message } from './app.types';

@Controller('intents')
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/ai')
  intentsAI(@Body() message: Message): Promise<AIIntent[]> {
    return this.appService.getAIIntents(message.message);
  }
}
