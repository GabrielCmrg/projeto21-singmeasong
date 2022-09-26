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
    const recommendations = await prisma.recommendation.findMany();
    expect(result.status).toBe(201);
    expect(recommendations.length).toBe(1);
    expect(recommendations[0]).toBeTruthy();
  });

  it("Should fail if the name isn't string", async () => {
    const recommendation = recommendationFactory.recommendationRequest();
    delete recommendation.name;
    const result = await supertest(app)
      .post('/recommendations')
      .send(recommendation);
    expect(result.status).toBe(422);
  });

  it("Should fail if the url isn't from youtube", async () => {
    const recommendation = recommendationFactory.recommendationRequest();
    recommendation.youtubeLink = 'hhtps://google.com';
    const result = await supertest(app)
      .post('/recommendations')
      .send(recommendation);
    expect(result.status).toBe(422);
  });
});
