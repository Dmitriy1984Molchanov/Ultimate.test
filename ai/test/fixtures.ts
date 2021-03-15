import * as request from 'supertest';
import { SuperTest, Test as STest } from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Intent, Message } from '../src/app.types';

export class Fixtures {
  app: INestApplication;
  mocks: { intent: Intent; message: Message };

  constructor() {
    this.mocks = {
      intent: {
        name: 'Greeting',
        confidence: 0.7,
        message: 'Some message',
      },
      message: {
        message: 'Some message',
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
    await this.app.init();
  }

  req(): SuperTest<STest> {
    return request(this.app.getHttpServer());
  }

  async createIntent(intent: Intent): Promise<{ id: string }> {
    return (await this.req().post(`/intents`).send(intent)).body;
  }

  async deleteIntent(id: string): Promise<void> {
    await this.req().delete(`/intents/${id}`);
  }
}
