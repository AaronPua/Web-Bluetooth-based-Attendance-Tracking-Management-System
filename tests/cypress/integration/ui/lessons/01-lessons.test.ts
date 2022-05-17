import { createTestLesson, createTestCourse, loginAsAdmin } from "/tests/cypress/support";

describe('/lessons', function() {
    before(() => {
        cy.clearLocalStorageSnapshot();
        loginAsAdmin();
        createTestCourse();
        createTestLesson();
        cy.saveLocalStorage();
        cy.visit('/lessons');
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('access all lessons page', () => {
        cy.contains('All Lessons');
        cy.contains('A_Test Course');
        cy.contains('A_Test Lesson');
    });

    it('edit lesson', () => {
        cy.get('div#row-0').contains('A_Test Lesson');
        cy.get('div#row-0').contains('Edit').click();
        cy.contains('A_Test Lesson');
        cy.contains('Edit Lesson');

        cy.get('input[name="name"]').clear().type('A_Test_Lesson');
        cy.get('input[name="startTime"]').clear().type('19-06-2022 2:00pm');
        cy.get('input[name="endTime"]').clear().type('19-06-2022 4:00pm');
        cy.get('input[name="date"]').clear().type('19-06-2022');
        cy.get('button[type="submit"]').contains('Update').click();

        cy.contains('A_Test_Lesson');
        cy.contains('Success!');
        cy.contains('Lesson updated sucessfully');
    });

    it('remove test lesson', () => {
        cy.go('back');
        cy.get('div#row-0').contains('A_Test_Lesson');
        cy.get('div#row-0').contains('Remove').click();
        
        cy.get('input[name="remove"]').first().type('remove', {force: true});
        cy.get('div.euiModalFooter').contains('Remove').click({force: true});

        cy.contains('Lesson removed sucessfully');
    });

    it('remove test course', () => {
        cy.visit('/courses')
        cy.get('div#row-0').contains('A_Test Course');
        cy.get('div#row-0').contains('Remove').click();
        cy.get('input[name="remove"]').first().type('remove', {force: true});
        cy.get('div.euiModalFooter').contains('Remove').click({force: true});

        cy.contains('Course removed sucessfully');
    });
});