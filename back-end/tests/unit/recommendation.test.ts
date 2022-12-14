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

  it('Should get an recomendation given an id', async () => {
    // arrange
    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValue({} as Recommendation);
    const id = 0;

    // act
    await recommendationService.getById(id);

    // assert
    expect(recommendationRepository.find).toBeCalled();
  });

  it("Should throw if the id doesn't exist", async () => {
    // arrange
    jest.spyOn(recommendationRepository, 'find').mockResolvedValue(null);
    const id = 0;

    // act
    const promise = recommendationService.getById(id);

    // assert
    await expect(promise).rejects.toBeTruthy();
  });

  it("Should throw if there isn't any recommendations", async () => {
    // arrange
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

    // act
    const promise = recommendationService.getRandom();

    // assert
    await expect(promise).rejects.toBeTruthy();
  });

  it("Should search twice if the filter doesn't return any recommendation", async () => {
    // arrange
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue([{}] as Recommendation[]);

    // act
    await recommendationService.getRandom();

    // assert
    expect(recommendationRepository.findAll).toBeCalledTimes(2);
  });

  it('Should search once if the filter return an recommendation', async () => {
    // arrange
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue([{}] as Recommendation[]);

    // act
    await recommendationService.getRandom();

    // assert
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
  });

  it('Should return an array with length equal to amount', async () => {
    // arrange
    jest
      .spyOn(recommendationRepository, 'getAmountByScore')
      .mockResolvedValue([{}, {}, {}, {}, {}] as Recommendation[]);
    const AMOUNT = 5;

    // act
    const recomendations = await recommendationService.getTop(AMOUNT);

    // assert
    expect(recommendationRepository.getAmountByScore).toBeCalledWith(AMOUNT);
    expect(recomendations.length).toBe(AMOUNT);
  });
});
