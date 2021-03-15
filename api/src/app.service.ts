import { BadRequestException, Injectable } from '@nestjs/common';
import { AIIntent } from './app.types';
import { AIService } from '@app/ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly aiService: AIService,
    private readonly configService: ConfigService,
  ) {}

  async getAIIntents(message: string): Promise<AIIntent[]> {
    let AIIntents = await this.aiService.getIntents(message);
    AIIntents = AIIntents.filter(
      (intent: AIIntent) =>
        intent.confidence > this.configService.get('confidenceThreshold'),
    );
    if (!AIIntents.length) {
      throw new BadRequestException(
        'AI could not give the correct answer',
        'AI Intents Not Found',
      );
    }
    return AIIntents;
  }
}
