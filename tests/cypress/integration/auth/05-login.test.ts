describe('login', function() {
    beforeEach(() => {
        cy.visit("/");
    });

    it('fail - student attempts to log in', () => {
        cy.contains('Sign In');

        cy.get('input[name="email"]').type('student1@test.com');
        cy.get('input[name="password"]').type('test');
        cy.get('button[type="submit"]').contains('Sign In').click();

        cy.contains('Warning');
        cy.contains('You do not have proper permissions to access');

        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('fail - accessing protected route before logging in', () => {
        cy.visit("/home");

        cy.contains('Sign In');

        cy.contains('Warning');
        cy.contains('You must log in to access this area');

        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('fail - login with wrong password', () => {
        cy.contains('Sign In');

        cy.get('input[name="email"]').type('student1@test.com');
        cy.get('input[name="password"]').type('test1234');
        cy.get('button[type="submit"]').contains('Sign In').click();

        cy.contains('Error');
        cy.contains('Incorrect password');

        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('fail - login with wrong email', () => {
        cy.contains('Sign In');

        cy.get('input[name="email"]').type('student1234@test.com');
        cy.get('input[name="password"]').type('test');
        cy.get('button[type="submit"]').contains('Sign In').click();

        cy.contains('Error');
        cy.contains('User not found');

        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('success - instructor attempts to log in', () => {
        cy.contains('Sign In');

        cy.get('input[name="email"]').type('instructor1@test.com');
        cy.get('input[name="password"]').type('test');
        cy.get('button[type="submit"]').contains('Sign In').click();

        cy.url().should('eq', Cypress.config().baseUrl + '/home');

        cy.window().then(win => {
            // this allows accessing the window object within the browser
            const user = win.Meteor.user();
            expect(user).to.exist;
            expect(user.profile.firstName).to.equal("Instructor");
            expect(user.profile.lastName).to.equal("1");
            expect(user.emails[0].address).to.equal("instructor1@test.com");
        });
    });

    it('success - user logs out', () => {
        cy.contains('Sign In');

        cy.get('input[name="email"]').type('instructor1@test.com');
        cy.get('input[name="password"]').type('test');
        cy.get('button[type="submit"]').contains('Sign In').click();

        cy.url().should('eq', Cypress.config().baseUrl + '/home');

        cy.contains('Log Out').click();

        cy.url().should('eq', Cypress.config().baseUrl + '/');
        
        cy.contains('Sign In');
    });

    it('clean up - admin logs in and removes test user', () => {
        cy.contains('Sign In');

        cy.get('input[name="email"]').type('admin1@test.com');
        cy.get('input[name="password"]').type('test');
        cy.get('button[type="submit"]').contains('Sign In').click();

        cy.url().should('eq', Cypress.config().baseUrl + '/home');

        cy.visit('/users');

        cy.get('div#row-0').contains('A_TEST_USER');
        cy.get('div#row-0').contains('Remove').click();
        cy.get('input[name="remove"]').first().type('remove', {force: true});
        cy.get('div.euiModalFooter').contains('Remove').click({force: true});

        cy.contains('User removed sucessfully');
    });
});