describe('course instructors', function() {
    before(() => {
        cy.restoreLocalStorage();
        cy.visit("/courses");
        cy.get('div#row-0').contains('A_Test_Course');
        cy.get('button').contains('Edit').click();
        cy.contains('Edit Course');
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('add instructor to course', () => {
        cy.get('button').contains('View Instructors').click();
        cy.contains('A_Test_Course: Instructors');
        cy.contains('Add Instructor');

        cy.get('button[type="submit"]').contains('Add').click();
        cy.contains('Success!')
        cy.contains('Instructor sucessfully added to course.');
    });

    it('remove instructor from course', () => {
        cy.contains('A_Test_Course: Instructors');
        cy.contains('Remove Instructor');

        cy.get('button[type="submit"]').contains('Remove').click();
        cy.contains('Success!')
        cy.contains('Instructor sucessfully removed from course.');
    });
});