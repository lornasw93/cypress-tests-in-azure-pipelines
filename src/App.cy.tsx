import { App } from "./App";

describe('App Component', () => {
  it('has default header text', () => {
    cy.mount(<App />);
    cy.get('h1').should('have.text', 'Hello!');
  });
});