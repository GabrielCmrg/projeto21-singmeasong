import { Prisma, Recommendation } from '@prisma/client';

import {
  recommendationService,
  CreateRecommendationData,
} from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';

describe('Recommentation service test suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('Should verify recommendation existance', async () => {
    // arrange
    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementation((): null => null);
    jest
      .spyOn(recommendationRepository, 'create')
      .mockImplementation((): any => {});
    const recommendationData = {} as CreateRecommendationData;

    // act
    await recommendationService.insert(recommendationData);

    // assert
    expect(recommendationRepository.findByName).toBeCalled();
  });

  it('Should throw if recommendation exists', async () => {
    // arrange
    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockReturnValue(
        {} as Prisma.Prisma__RecommendationClient<Recommendation>,
      );
    const recommendationData = {} as CreateRecommendationData;

    // act
    const promise = recommendationService.insert(recommendationData);

    // assert
    await expect(promise).rejects.toBeTruthy();
  });
});
