describe('course clean up', function() {
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

    it('remove test lesson', () => {
        cy.contains('View Lessons').click();
        cy.contains('A_Test_Course: Lessons');
        cy.contains('Create Lesson');

        cy.get('div#row-0').contains('A_Test_Lesson');
        cy.get('div#row-0').contains('Remove').click();
        cy.get('input[name="remove"]').first().type('remove', {force: true});
        cy.get('div.euiModalFooter').contains('Remove').click({force: true});

        cy.contains('Lesson removed sucessfully');
    });

    it('remove test beacon', () => {
        cy.visit("/courses");
        cy.get('div#row-0').contains('A_Test_Course');
        cy.get('div#row-0').contains('Edit').click();

        cy.contains('View Beacons').click();
        cy.contains('A_Test_Course: Beacons');
        cy.contains('Create Beacon');

        cy.get('div#row-0').contains('A_Test_Beacon');
        cy.get('div#row-0').contains('Remove').click();
        cy.get('input[name="remove"]').first().type('remove', {force: true});
        cy.get('div.euiModalFooter').contains('Remove').click({force: true});

        cy.contains('Beacon removed sucessfully');
    });

    it('remove test course', () => {
        cy.visit('/courses')
        cy.get('div#row-0').contains('A_Test_Course');
        cy.get('div#row-0').contains('Remove').click();
        cy.get('input[name="remove"]').first().type('remove', {force: true});
        cy.get('div.euiModalFooter').contains('Remove').click({force: true});

        cy.contains('Course removed sucessfully');
    });
});