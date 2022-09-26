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

describe('POST /recommendations/:id/upvote', () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
    const recommendation = recommendationFactory.recommendationRequest();
    await prisma.recommendation.create({ data: recommendation });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Should change the score to 1', async () => {
    const result = await supertest(app)
      .post('/recommendations/1/upvote')
      .send();
    const recommendations = await prisma.recommendation.findMany();
    expect(result.status).toBe(200);
    expect(recommendations.length).toBe(1);
    expect(recommendations[0].score).toBe(1);
  });

  it('Should fail for a non-existing id', async () => {
    const result = await supertest(app)
      .post('/recommendations/3/upvote')
      .send();
    const recommendations = await prisma.recommendation.findMany();
    expect(result.status).toBe(404);
    expect(recommendations.length).toBe(1);
    expect(recommendations[0].score).toBe(0);
  });
});

describe('POST /recommendations/:id/downvote', () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
    const recommendation = recommendationFactory.recommendationRequest();
    await prisma.recommendation.create({ data: recommendation });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Should change the score to -1', async () => {
    const result = await supertest(app)
      .post('/recommendations/1/downvote')
      .send();
    const recommendations = await prisma.recommendation.findMany();
    expect(result.status).toBe(200);
    expect(recommendations.length).toBe(1);
    expect(recommendations[0].score).toBe(-1);
  });

  it('Should fail for a non-existing id', async () => {
    const result = await supertest(app)
      .post('/recommendations/3/downvote')
      .send();
    const recommendations = await prisma.recommendation.findMany();
    expect(result.status).toBe(404);
    expect(recommendations.length).toBe(1);
    expect(recommendations[0].score).toBe(0);
  });

  it('Should delete the recommendation if the score droops to -5', async () => {
    await prisma.recommendation.update({
      where: { id: 1 },
      data: { score: -5 },
    });
    const result = await supertest(app)
      .post('/recommendations/1/downvote')
      .send();
    const recommendations = await prisma.recommendation.findMany();
    expect(result.status).toBe(200);
    expect(recommendations.length).toBe(0);
  });
});
