describe('resend verification email', function() {
    before(() => {
        cy.visit("/verify-email");
    });

    it('user requests resend verification email', () => {
        cy.contains('Click Here').click();

        cy.get('input[name="email"]').type('instructor@test.com');
        cy.get('button[type="submit"]').contains('Resend').click();

        cy.contains('Verification email has been sent.');
    });
});