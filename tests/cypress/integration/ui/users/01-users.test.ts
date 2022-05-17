import { createTestUser, loginAsAdmin } from "/tests/cypress/support";

describe('/users', function() {
    before(() => {
        cy.clearLocalStorageSnapshot();
        createTestUser();
        loginAsAdmin();
        cy.saveLocalStorage();
        cy.visit('/users');
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('access all users page', () => {
        cy.contains('All Users');
        cy.contains('A_Test_User');
    });

    it('edit user details', () => {
        cy.get('div#row-0').contains('A_Test_User');
        cy.get('button').contains('Edit').click();
        cy.contains('A_Test_User');
        cy.contains('Edit User');
        cy.contains('Instructor');

        cy.get('input[name="email"]').clear().type('a_test_user@fake.com');
        cy.get('input[name="lastName"]').clear().type('Fake 2');
        cy.get('select[name="gender"]').select('male');
        cy.get('button[type="submit"]').contains('Update').click();

        cy.contains('Success!');
        cy.contains('User updated sucessfully.');
        cy.contains('A_Test_User Fake 2');
    });

    it('access admin users page', () => {
        cy.visit('/users/admins');
        cy.contains('All Admins');
        cy.contains('Edit');
        cy.contains('Remove');
    });

    it('access instructor users page', () => {
        cy.visit('/users/instructors');
        cy.contains('All Instructors');
        cy.contains('A_Test_User');
        cy.contains('Edit');
        cy.contains('Remove');
    });

    it('access student users page', () => {
        cy.visit('/users/students');
        cy.contains('All Students');
        cy.contains('Edit');
        cy.contains('Remove');
    });
});