import { Recommendation } from '@prisma/client';

import {
  recommendationService,
  CreateRecommendationData,
} from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';

describe('Recommentation creation', () => {
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
      .mockResolvedValue({} as Recommendation);
    const recommendationData = {} as CreateRecommendationData;

    // act
    const promise = recommendationService.insert(recommendationData);

    // assert
    await expect(promise).rejects.toBeTruthy();
  });

  it('Should create a recommendation if not exists', async () => {
    // arrange
    jest.spyOn(recommendationRepository, 'findByName').mockResolvedValue(null);
    jest
      .spyOn(recommendationRepository, 'create')
      .mockImplementation((): any => {});
    const recommendationData = {} as CreateRecommendationData;

    // act
    await recommendationService.insert(recommendationData);

    // assert
    expect(recommendationRepository.create).toBeCalled();
  });
});

describe('Recommendation vote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('Should increment the score', async () => {
    // arrange
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValue({} as Recommendation);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementation((): any => {});
    const id = 0;

    // act
    await recommendationService.upvote(id);

    // assert
    expect(recommendationRepository.updateScore).toBeCalledWith(
      id,
      'increment',
    );
  });

  it('Should decrement the score', async () => {
    // arrange
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValue({} as Recommendation);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValue({ score: 0 } as Recommendation);
    const id = 0;

    // act
    await recommendationService.downvote(id);

    // assert
    expect(recommendationRepository.updateScore).toBeCalledWith(
      id,
      'decrement',
    );
  });

  it('Should delete the recommendation of the score is lesser than -5', async () => {
    // arrange
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValue({} as Recommendation);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValue({ score: -9 } as Recommendation);
    jest
      .spyOn(recommendationRepository, 'remove')
      .mockImplementation((): any => {});
    const id = 0;

    // act
    await recommendationService.downvote(id);

    // assert
    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe('Get recommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('Should get all recomendations', async () => {
    // arrange
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementation((): any => {});

    // act
    await recommendationService.get();

    // assert
    expect(recommendationRepository.findAll).toBeCalled();
  });
});
