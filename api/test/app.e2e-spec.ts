import { Fixtures } from './fixtures';
import { CreateIntentRes, Intent, Message } from '../src/app.types';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let fixtures: Fixtures;
  let intentMock: Intent;
  let messageMock: Message;
  let createIntent: (intent: Intent) => Promise<CreateIntentRes>;
  let deleteIntent: (id: string) => Promise<void>;
  let configService: ConfigService;

  beforeAll(async () => {
    fixtures = new Fixtures();
    await fixtures.initApp();
    intentMock = fixtures.mocks.intent;
    messageMock = fixtures.mocks.message;
    createIntent = fixtures.createIntent.bind(fixtures);
    deleteIntent = fixtures.deleteIntent.bind(fixtures);
    configService = fixtures.app.get(ConfigService);
  });

  describe('/intents/ai (POST)', () => {
    describe('Succeeds', () => {
      let intentMockIds: string[];

      beforeAll(async () => {
        intentMockIds = [
          (await createIntent(intentMock)).id,
          (await createIntent(intentMock)).id,
          (await createIntent({ ...intentMock, message: 'other message' })).id,
          (await createIntent({ ...intentMock, confidence: 0.4 })).id,
        ];
      });

      it('with correct params', () => {
        return fixtures
          .req()
          .post('/intents/ai')
          .set('api-key', configService.get('apiKey'))
          .send(messageMock)
          .expect(201)
          .expect([
            {
              confidence: intentMock.confidence,
              name: intentMock.name,
            },
            {
              confidence: intentMock.confidence,
              name: intentMock.name,
            },
          ]);
      });

      afterEach(async () => {
        await Promise.all([intentMockIds.map((id) => deleteIntent(id))]);
      });
    });

    describe('Fails', () => {
      it('with empty params', () => {
        return fixtures
          .req()
          .post('/intents/ai')
          .set('api-key', configService.get('apiKey'))
          .send({})
          .expect(400)
          .expect({
            statusCode: 400,
            message: [
              'botId must be a string',
              'botId should not be empty',
              'message must be a string',
              'message should not be empty',
              'conversationId must be a string',
              'conversationId should not be empty',
            ],
            error: 'Bad Request',
          });
      });

      it('with incorrect params', () => {
        return fixtures
          .req()
          .post('/intents/ai')
          .set('api-key', configService.get('apiKey'))
          .send({
            botId: 1,
            message: 1,
            conversationId: 1,
          })
          .expect(400)
          .expect({
            statusCode: 400,
            message: [
              'botId must be a string',
              'message must be a string',
              'conversationId must be a string',
            ],
            error: 'Bad Request',
          });
      });

      it('with extra fields', () => {
        return fixtures
          .req()
          .post('/intents/ai')
          .set('api-key', configService.get('apiKey'))
          .send({
            ...messageMock,
            extraField: 'extraValue',
          })
          .expect(400)
          .expect({
            statusCode: 400,
            message: ['property extraField should not exist'],
            error: 'Bad Request',
          });
      });

      it('with non existing message', () => {
        return fixtures
          .req()
          .post('/intents/ai')
          .set('api-key', configService.get('apiKey'))
          .send({
            ...messageMock,
            message: 'non-existing message',
          })
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'AI could not give the correct answer',
            error: 'AI Intents Not Found',
          });
      });
    });
  });
});
