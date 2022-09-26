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
    const createRecommendationData = {} as CreateRecommendationData;

    // act
    await recommendationService.insert(createRecommendationData);

    // assert
    expect(recommendationRepository.findByName).toBeCalled();
  });
});
