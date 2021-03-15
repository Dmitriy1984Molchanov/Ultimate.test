import * as request from 'supertest';
import { SuperTest, Test as STest } from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Intent, Message } from '../src/app.types';
import { AIService } from '@app/ai';

export class Fixtures {
  app: INestApplication;
  mocks: { intent: Intent; message: Message };
  ai: AIService;

  constructor() {
    this.mocks = {
      intent: {
        name: 'Greeting',
        confidence: 0.7,
        message: 'Some message',
      },
      message: {
        botId: 'bot1',
        message: 'Some message',
        conversationId: 'conversation1',
      },
    };
  }

  async initApp(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    this.ai = this.app.get(AIService);
    await this.app.init();
  }

  req(): SuperTest<STest> {
    return request(this.app.getHttpServer());
  }

  async createIntent(intent: Intent): Promise<{ id: string }> {
    return await this.ai.createIntent(intent);
  }

  async deleteIntent(id: string): Promise<void> {
    await this.ai.deleteIntent(id);
  }
}
