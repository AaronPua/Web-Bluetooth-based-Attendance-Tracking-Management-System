describe('registration', function() {
    beforeEach(() => {
        cy.visit('/');
    });

    it('success - register new user', () => {
        cy.contains('Register Now').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/register');

        cy.get('input[name="firstName"]').type('Instructor');
        cy.get('input[name="lastName"]').type('Test');
        cy.get('select[name="gender"]').select('female');
        cy.get('input[name="email"]').type('instructor@test.com');
        cy.get('input[name="password"]').type('test');
        cy.get('button[type="submit"]').contains('Register').click();

        cy.url().should("eq", Cypress.config().baseUrl + '/verify-email');
        cy.contains('Verify Your Email');
        cy.contains('Did not receive the verification email?');
    });

    it('fail - register new user', () => {
        cy.contains('Register Now').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/register');

        cy.get('input[name="firstName"]').type('Instructor');
        cy.get('input[name="lastName"]').type('Test');
        cy.get('select[name="gender"]').select('female');
        cy.get('input[name="email"]').type('instructor1@test.com');
        cy.get('input[name="password"]').type('test');
        cy.get('button[type="submit"]').contains('Register').click();

        cy.url().should("eq", Cypress.config().baseUrl + '/register');
        cy.contains('Error');
        cy.contains('Email already exists');
    });
});