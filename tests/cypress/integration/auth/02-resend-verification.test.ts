describe('resend verification email', function() {
    before(() => {
        cy.visit("/verify-email");
    });

    it('fail - user requests resend verification email', () => {
        cy.contains('Click Here').click();

        cy.get('input[name="email"]').type('not_exist@fake.com');
        cy.get('button[type="submit"]').contains('Resend').click();

        cy.contains('User not found according to this email address.');
    });

    it('success - user requests resend verification email', () => {
        cy.contains('Click Here').click();

        cy.get('input[name="email"]').clear();
        cy.get('input[name="email"]').type('test_user@fake.com');
        cy.get('button[type="submit"]').contains('Resend').click();

        cy.contains('Verification email has been sent.');
    });
});