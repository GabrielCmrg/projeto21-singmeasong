import supertest from 'supertest';

import { prisma } from '../../src/database';
import app from '../../src/app';
import * as recommendationFactory from '../factories/recommendationFactory';

describe('POST /recommendations', () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Should create a recommendation', async () => {
    const recommendation = recommendationFactory.recommendationRequest();
    const result = await supertest(app)
      .post('/recommendations')
      .send(recommendation);
    expect(result.status).toBe(201);
  });
});
