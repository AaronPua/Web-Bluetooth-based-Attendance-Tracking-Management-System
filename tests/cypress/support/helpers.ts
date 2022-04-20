export const loginAsAdmin = () => {
    cy.visit('/');
    
    cy.contains('Sign In');

    cy.get('input[name="email"]').type('admin1@test.com');
    cy.get('input[name="password"]').type('test');
    cy.get('button[type="submit"]').contains('Sign In').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/home');
}