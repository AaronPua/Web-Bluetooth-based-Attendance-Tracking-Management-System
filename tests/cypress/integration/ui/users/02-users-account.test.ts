describe('/account', function() {
    before(() => {
        cy.restoreLocalStorage();
        cy.visit('/account');
        cy.saveLocalStorage();
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('access current user account page', () => {
        cy.contains('Account');
        cy.contains('Edit Details');
        cy.contains('Change Password');
    });

    it('edit current user details', () => {
        cy.get('input[name="lastName"]').clear().type('Fake 2');
        cy.get('select[name="gender"]').select('male');
        cy.get('button[type="submit"]').contains('Update').click();

        cy.contains('Success!');
        cy.contains('Account updated sucessfully.');
    });

    it('success - edit current user password', () => {
        cy.get('input[name="oldPassword"]').clear().type('test');
        cy.get('input[name="newPassword"]').clear().type('test2');
        cy.get('button[type="submit"]').contains('Change').click();

        cy.contains('Success!');
        cy.contains('Password updated sucessfully.');

         cy.get('input[name="oldPassword"]').clear().type('test2');
        cy.get('input[name="newPassword"]').clear().type('test');
        cy.get('button[type="submit"]').contains('Change').click();

        cy.contains('Success!');
        cy.contains('Password updated sucessfully.');
    });

    it('fail - edit current user password', () => {
        cy.get('input[name="oldPassword"]').clear().type('wrong');
        cy.get('input[name="newPassword"]').clear().type('newPassword');
        cy.get('button[type="submit"]').contains('Change').click();

        cy.contains('Error');
        cy.contains('Incorrect password');
    });

    it('remove test user', () => {
        cy.visit('/users');
        cy.get('div#row-0').contains('A_Test_User');
        cy.get('div#row-0').contains('Remove').click();

        cy.get('input[name="remove"]').first().type('remove', {force: true});
        cy.get('div.euiModalFooter').contains('Remove').click({force: true});

        cy.contains('User removed sucessfully');
    });
});