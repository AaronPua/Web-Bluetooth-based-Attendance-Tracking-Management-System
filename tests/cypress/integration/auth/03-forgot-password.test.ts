describe('forgot password', function() {
    before(() => {
        cy.visit("/forgot-password");
    });

    it('user forgot their password', () => {
        cy.contains('Forgot Password');

        cy.get('input[name="email"]').type('instructor@test.com');
        cy.get('button[type="submit"]').contains('Resend').click();

        cy.contains('Password reset email has been sent.');
    });
});