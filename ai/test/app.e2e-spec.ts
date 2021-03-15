import { Fixtures } from './fixtures';
import { CreateIntentRes, Intent, Message } from '../src/app.types';

describe('AppController (e2e)', () => {
  let fixtures: Fixtures;
  let intentMock: Intent;
  let messageMock: Message;
  let createIntent: (intent: Intent) => Promise<CreateIntentRes>;
  let deleteIntent: (id: string) => Promise<void>;

  beforeAll(async () => {
    fixtures = new Fixtures();
    await fixtures.initApp();
    intentMock = fixtures.mocks.intent;
    messageMock = fixtures.mocks.message;
    createIntent = fixtures.createIntent.bind(fixtures);
    deleteIntent = fixtures.deleteIntent.bind(fixtures);
  });

  describe('/intents (POST)', () => {
    describe('Succeeds', () => {
      let intentMockId: string;

      it('with correct params', () => {
        return fixtures
          .req()
          .post('/intents')
          .send(intentMock)
          .expect(201)
          .expect(({ body }) => {
            expect(typeof body.id).toBe('string');
            intentMockId = body.id;
          });
      });

      afterEach(async () => {
        await deleteIntent(intentMockId);
      });
    });

    describe('Fails', () => {
      it('with empty params', () => {
        return fixtures
          .req()
          .post('/intents')
          .send({})
          .expect(400)
          .expect({
            statusCode: 400,
            message: [
              'confidence must be a number conforming to the specified constraints',
              'confidence should not be empty',
              'name must be a string',
              'name should not be empty',
              'message must be a string',
              'message should not be empty',
            ],
            error: 'Bad Request',
          });
      });

      it('with incorrect params', () => {
        return fixtures
          .req()
          .post('/intents')
          .send({
            name: 1,
            confidence: 'some string',
            message: 1,
          })
          .expect(400)
          .expect({
            statusCode: 400,
            message: [
              'confidence must be a number conforming to the specified constraints',
              'name must be a string',
              'message must be a string',
            ],
            error: 'Bad Request',
          });
      });

      it('fails with extra fields', () => {
        return fixtures
          .req()
          .post('/intents')
          .send({
            ...intentMock,
            extraField: 'extraValue',
          })
          .expect(400)
          .expect({
            statusCode: 400,
            message: ['property extraField should not exist'],
            error: 'Bad Request',
          });
      });
    });
  });

  describe('/intents (DELETE)', () => {
    describe('Succeeds', () => {
      let intentMockId: string;
      beforeEach(async () => {
        intentMockId = (await createIntent(intentMock)).id;
      });

      it('Success', () => {
        return fixtures
          .req()
          .delete(`/intents/${intentMockId}`)
          .expect(200)
          .expect({});
      });
    });

    describe('Fails', () => {
      it('with missing id', () => {
        return fixtures.req().delete(`/intents`).expect(404).expect({
          statusCode: 404,
          message: 'Cannot DELETE /intents',
          error: 'Not Found',
        });
      });

      it('with non-existing id', () => {
        const incorrectId = '604bcbb01072bd7c7829d6d7';
        return fixtures
          .req()
          .delete(`/intents/${incorrectId}`)
          .expect(404)
          .expect({
            statusCode: 404,
            message: "Intent with provided id doesn't exist",
            error: 'Intent Not Found',
          });
      });

      it('with wrong format  id', () => {
        const wrongFormatId = 'wrongFormatId';
        return fixtures
          .req()
          .delete(`/intents/${wrongFormatId}`)
          .expect(400)
          .expect({
            statusCode: 400,
            message: ['id must be a mongodb id'],
            error: 'Bad Request',
          });
      });
    });
  });

  describe('/intents/ai (POST)', () => {
    describe('Succeeds', () => {
      let intentMockIds: string[];

      beforeAll(async () => {
        intentMockIds = [
          (await createIntent(intentMock)).id,
          (await createIntent(intentMock)).id,
          (await createIntent({ ...intentMock, message: 'other message' })).id,
        ];
      });

      it('with correct params', () => {
        return fixtures
          .req()
          .post('/intents/ai')
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
          .send({})
          .expect(400)
          .expect({
            statusCode: 400,
            message: [
              'message must be a string',
              'message should not be empty',
            ],
            error: 'Bad Request',
          });
      });

      it('with incorrect params', () => {
        return fixtures
          .req()
          .post('/intents/ai')
          .send({
            message: 1,
          })
          .expect(400)
          .expect({
            statusCode: 400,
            message: ['message must be a string'],
            error: 'Bad Request',
          });
      });

      it('with extra fields', () => {
        return fixtures
          .req()
          .post('/intents/ai')
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
    });
  });
});
