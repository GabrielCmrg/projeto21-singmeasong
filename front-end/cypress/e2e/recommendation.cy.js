import { faker } from '@faker-js/faker';

describe('recommendation creation', () => {
  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:5000/recommendations');
  });

  it('should create a recommendation', () => {
    const NAME_SIZE = 3;
    const CODE_SIZE = 8;
    const post = {
      name: faker.lorem.words(NAME_SIZE),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
        CODE_SIZE,
      )}`,
    };
    cy.visit('http://localhost:3000');

    cy.get('[data-cy="recomendation-name"]').type(post.name);
    cy.get('[data-cy="youtube-link"]').type(post.youtubeLink);
    cy.intercept('POST', '/recommendations').as('recomendationPostRequest');
    cy.get('[data-cy="post-button"]').click();
    cy.wait('@recomendationPostRequest');

    cy.get('[data-cy="posted-recomendation-name"]').should(
      'have.text',
      post.name,
    );
  });
});

describe('recommendation manipulation', () => {
  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:5000/recommendations');

    const NAME_SIZE = 3;
    const CODE_SIZE = 8;
    const post = {
      name: faker.lorem.words(NAME_SIZE),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
        CODE_SIZE,
      )}`,
    };
    cy.visit('http://localhost:3000');

    cy.get('[data-cy="recomendation-name"]').type(post.name);
    cy.get('[data-cy="youtube-link"]').type(post.youtubeLink);
    cy.intercept('POST', '/recommendations').as('recomendationPostRequest');
    cy.get('[data-cy="post-button"]').click();
    cy.wait('@recomendationPostRequest');
  });

  it('should upvote', () => {
    cy.intercept('POST', '/recommendations/1/upvote').as('upvote');
    cy.get('[data-cy="upvote-button"]').click();
    cy.wait('@upvote');
    cy.get('[data-cy="votes"]').should('have.text', 1);
  });

  it('should downvote', () => {
    cy.intercept('POST', '/recommendations/1/downvote').as('downvote');
    cy.get('[data-cy="downvote-button"]').click();
    cy.wait('@downvote');
    cy.get('[data-cy="votes"]').should('have.text', -1);
  });
});
