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

    it('create beacon', () => {
        cy.get('button').contains('View Beacons').click();
        cy.contains('A_Test_Course: Beacons');
        cy.contains('Create Beacon');

        cy.get('input[name="name"]').type('A_Test Beacon');
        cy.get('button[type="submit"]').contains('Create').click();
        cy.contains('Success!')
        cy.contains('Beacon created sucessfully.');
        cy.contains('A_Test Beacon');
    });

    it('edit beacon', () => {
        cy.get('div#row-0').contains('A_Test Beacon');
        cy.get('button').contains('Edit').click();
        cy.contains('A_Test Beacon');
        cy.contains('Edit Beacon');

        cy.get('input[name="name"]').type('A_Test_Beacon');
        cy.get('button[type="submit"]').contains('Update').click();
        cy.contains('Success!')
        cy.contains('Beacon updated sucessfully.');
        cy.contains('A_Test_Beacon');
    });
});