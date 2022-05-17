describe('course attendance', function() {
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

    it('lesson view - mark student as present in current lesson', () => {
        cy.get('button').contains('View Lessons').click();
        cy.contains('A_Test_Course: Lessons');
        cy.contains('Create Lesson');
        cy.contains('Current Lessons');

        cy.get('div#row-0').contains('A_Test_Lesson');
        cy.get('button').contains('Edit').click();
        cy.contains('A_Test_Lesson');
        cy.contains('Absent Students');
        cy.contains('Mark Present');

        cy.get('button').contains('Mark Present').click();
        cy.contains('Success!');
        cy.contains('Student attendance sucessfully marked as present.');
    });

    it('lesson view - mark student as absent in current lesson', () => {
        cy.contains('A_Test_Lesson');
        cy.contains('Present Students');
        cy.contains('Mark Absent');

        cy.get('button').contains('Mark Absent').click();
        cy.contains('Success!');
        cy.contains('Student attendance sucessfully marked as absent.');
    });

    it('student view - view overall course attendance', () => {
        cy.visit("/courses");
        cy.get('div#row-0').contains('A_Test_Course');
        cy.get('button').contains('Edit').click();
        
        cy.get('button').contains('View Student').click();
        cy.contains('Add Student');
        cy.contains('Remove Student');

        cy.get('button').contains('View Attendance').click();
        cy.contains('Attended Lessons');
        cy.contains('Missed Lessons');
    });

    it('student view - mark student as present for any lesson', () => {
        cy.get('button').contains('Mark Present').click();
        cy.contains('Success!');
        cy.contains('Student attendance sucessfully marked as present.');
    });

    it('student view - mark student as absent for any lesson', () => {
        cy.get('button').contains('Mark Absent').click();
        cy.contains('Success!');
        cy.contains('Student attendance sucessfully marked as absent.');
    });
});