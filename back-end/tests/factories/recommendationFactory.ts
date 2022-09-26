import { faker } from '@faker-js/faker';

export function recommendationRequest() {
  const CODE_SIZE = 8;
  return {
    name: faker.music.songName(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
      CODE_SIZE,
    )}`,
  };
}
