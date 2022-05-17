describe('course students', function() {
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

    it('add student to course', () => {
        cy.get('button').contains('View Students').click();
        cy.contains('A_Test_Course: Students');
        cy.contains('Enrolled Students');
        cy.contains('Add Student');

        cy.get('button[type="submit"]').contains('Add').click();
        cy.contains('Success!')
        cy.contains('Student sucessfully added to course.');
        cy.contains('View Attendance');
    });

    it('remove student from course', () => {
        cy.contains('A_Test_Course: Students');
        cy.contains('Enrolled Students');
        cy.contains('Remove Student');

        cy.get('button[type="submit"]').contains('Remove').click();
        cy.contains('Success!')
        cy.contains('Student sucessfully removed from course.');
    });

    it('re-add student to course', () => {
        cy.contains('A_Test_Course: Students');
        cy.contains('Enrolled Students');
        cy.contains('Add Student');

        cy.get('button[type="submit"]').contains('Add').click();
        cy.contains('Success!')
        cy.contains('Student sucessfully added to course.');
        cy.contains('View Attendance');
    });
});