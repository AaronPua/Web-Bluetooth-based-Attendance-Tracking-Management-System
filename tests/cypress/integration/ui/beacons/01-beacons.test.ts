import { createTestBeacon, createTestCourse, loginAsAdmin } from "/tests/cypress/support";

describe('beacons', function() {
    before(() => {
        cy.clearLocalStorageSnapshot();
        loginAsAdmin();
        createTestCourse();
        createTestBeacon();
        cy.saveLocalStorage();
        cy.visit('/beacons');
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('access all beacons page', () => {
        cy.contains('All Beacons');
        cy.contains('A_Test Course');
        cy.contains('A_Test Beacon');
    });

    it('edit beacon', () => {
        cy.get('div#row-0').contains('A_Test Beacon');
        cy.get('div#row-0').contains('Edit').click();
        cy.contains('A_Test Beacon');
        cy.contains('Edit Beacon');

        cy.get('input[name="name"]').clear().type('A_Test_Beacon');
        cy.get('button[type="submit"]').contains('Update').click();
        cy.contains('Success!')
        cy.contains('Beacon updated sucessfully.');
        cy.contains('A_Test_Beacon');
    });

    it('remove test beacon', () => {
        cy.go('back');
        cy.contains('All Beacons');
        cy.get('div#row-0').contains('A_Test_Beacon');
        cy.get('div#row-0').contains('Remove').click();
        
        cy.get('input[name="remove"]').first().type('remove', {force: true});
        cy.get('div.euiModalFooter').contains('Remove').click({force: true});

        cy.contains('Beacon removed sucessfully');
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