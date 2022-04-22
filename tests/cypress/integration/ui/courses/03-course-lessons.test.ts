describe('course lessons', function() {
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

    it('create lesson', () => {
        cy.get('button').contains('View Lessons').click();
        cy.contains('A_Test_Course');
        cy.contains('Create Lesson');
        cy.contains('Current Lessons');

        cy.get('input[name="name"]').type('A_Test Lesson');
        cy.get('input[name="startTime"]').clear().type('19-06-2022 10:00am');
        cy.get('input[name="endTime"]').clear().type('19-06-2022 12:00pm');
        cy.get('input[name="date"]').clear().type('19-06-2022');
        cy.get('button[type="submit"]').contains('Create').click();

        cy.contains('A_Test Lesson');
    });

    it('access and edit lesson', () => {
        cy.get('div#row-0').contains('A_Test Lesson');
        cy.get('button').contains('Edit').click();
        cy.contains('Present Students');
        cy.contains('Absent Students');

        cy.get('input[name="name"]').clear().type('A_Test_Lesson');
        cy.get('input[name="startTime"]').clear().type('19-06-2022 2:00pm');
        cy.get('input[name="endTime"]').clear().type('19-06-2022 4:00pm');
        cy.get('input[name="date"]').clear().type('19-06-2022');
        cy.get('button[type="submit"]').contains('Update').click();

        cy.contains('A_Test_Lesson');
        cy.contains('Success!');
        cy.contains('Lesson updated sucessfully');
    });
});