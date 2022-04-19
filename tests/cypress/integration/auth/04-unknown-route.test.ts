describe('unknown route', function() {
    before(() => {
        cy.visit("/asdf1234");
    });

    it('user visits a url that is not defined', () => {
        cy.contains('You have arrived at an unknown page.');

        cy.get('button[type="submit"]').contains('Home').click();

        cy.contains('Sign In');
        cy.contains('Don\'t have an account yet?');

        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
});