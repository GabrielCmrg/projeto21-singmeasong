import supertest from 'supertest';
import Joi from 'joi';

import { prisma } from '../../src/database';
import app from '../../src/app';
import * as recommendationFactory from '../factories/recommendationFactory';

describe('POST /recommendations', () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
  });

  afterAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
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
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
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
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
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

  it('Should delete the recommendation if the score drops to -5', async () => {
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

describe('GET /recommendations', () => {
  beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
    const promises = [];
    for (let i = 0; i < 11; i += 1) {
      const recommendation = recommendationFactory.recommendationRequest();
      const promise = prisma.recommendation.create({ data: recommendation });
      promises.push(promise);
    }
    await Promise.all(promises);
  });

  afterAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
    await prisma.$disconnect();
  });

  it('Should get the last 10 recommendations', async () => {
    const result = await supertest(app).get('/recommendations').send();
    const recommendationSchema = Joi.object({
      id: Joi.number().integer().required(),
      name: Joi.string().required(),
      youtubeLink: Joi.string().uri().required(),
      score: Joi.number().integer().required(),
    });
    const resultSchema = Joi.array().items(recommendationSchema);
    const validation = resultSchema.validate(result.body);
    let ordened = true;
    result.body.forEach((element, index, array) => {
      if (index !== 0 && element.id > array[index - 1].id) {
        ordened = false;
      }
    });
    expect(result.status).toBe(200);
    expect(validation.error).toBeFalsy();
    expect(result.body.length).toBe(10);
    expect(ordened).toBe(true);
  });
});

describe('GET /recommendations/:id', () => {
  beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
    const recommendation = recommendationFactory.recommendationRequest();
    await prisma.recommendation.create({ data: recommendation });
  });

  afterAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
    await prisma.$disconnect();
  });

  it('Should get a recommendation given id', async () => {
    const result = await supertest(app).get('/recommendations/1').send();
    const resultSchema = Joi.object({
      id: Joi.number().integer().required(),
      name: Joi.string().required(),
      youtubeLink: Joi.string().uri().required(),
      score: Joi.number().integer().required(),
    });
    const validation = resultSchema.validate(result.body);
    expect(result.status).toBe(200);
    expect(validation.error).toBeFalsy();
  });

  it("Should fail if the recommendation id doesn't exist", async () => {
    const result = await supertest(app).get('/recommendations/3').send();
    const resultSchema = Joi.object({
      id: Joi.number().integer().required(),
      name: Joi.string().required(),
      youtubeLink: Joi.string().uri().required(),
      score: Joi.number().integer().required(),
    });
    const validation = resultSchema.validate(result.body);
    expect(result.status).toBe(200);
    expect(validation.error).toBeFalsy();
  });
});
