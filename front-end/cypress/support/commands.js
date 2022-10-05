import { faker } from '@faker-js/faker';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
Cypress.Commands.add('postRecommendation', () => {
  const NAME_SIZE = 3;
  const CODE_SIZE = 8;
  const post = {
    name: faker.lorem.words(NAME_SIZE),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(
      CODE_SIZE,
    )}`,
  };
  cy.request('POST', 'http://localhost:5000/recommendations', post);
});

Cypress.Commands.add('downvote', (id) => {
  cy.request('POST', `http://localhost:5000/recommendations/${id}/downvote`);
});
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
