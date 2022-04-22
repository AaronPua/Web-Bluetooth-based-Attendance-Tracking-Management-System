import { loginAsAdmin } from "/tests/cypress/support";

describe('courses', function() {
    before(() => {
        cy.clearLocalStorageSnapshot();
        loginAsAdmin();
        cy.saveLocalStorage();
        cy.visit('/courses');
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('create course', () => {
        cy.contains('Create Course');

        cy.get('input[name="name"]').type('A_Test Course');
        cy.get('input[name="credits"]').clear().type('2');
        cy.get('button[type="submit"]').contains('Create').click();

        cy.contains('Courses');
        cy.contains('A_Test Course');
    });

    it('access and edit course', () => {
        cy.contains('A_Test Course');
        cy.get('div#row-0').contains('A_Test Course');
        cy.get('button').contains('Edit').click();
        cy.contains('Edit Course');

        cy.get('input[name="name"]').clear().type('A_Test_Course');
        cy.get('input[name="credits"]').clear().type('3');
        cy.get('button[type="submit"]').contains('Update').click();

        cy.contains('A_Test_Course');
        cy.contains('Lessons');
        cy.contains('Students');
        cy.contains('Instructors');
        cy.contains('Beacons');
    });
});