export const loginAsAdmin = () => {
    cy.visit('/');
    
    cy.contains('Sign In');

    cy.get('input[name="email"]').type('admin1@test.com');
    cy.get('input[name="password"]').type('test');
    cy.get('button[type="submit"]').contains('Sign In').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/home');
}

export const createTestUser = () => {
    cy.visit('/');
    cy.contains('Register Now').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/register');

    cy.get('input[name="firstName"]').type('A_Test_User');
    cy.get('input[name="lastName"]').type('Fake');
    cy.get('select[name="gender"]').select('female');
    cy.get('input[name="email"]').type('test_user@fake.com');
    cy.get('input[name="password"]').type('test');
    cy.get('button[type="submit"]').contains('Register').click();

    cy.url().should("eq", Cypress.config().baseUrl + '/verify-email');
    cy.contains('Verify Your Email');
    cy.contains('Did not receive the verification email?');
}

export const createTestCourse = () => {
    cy.visit('/courses');
    cy.contains('Create Course');

    cy.get('input[name="name"]').type('A_Test Course');
    cy.get('input[name="credits"]').clear().type('2');
    cy.get('button[type="submit"]').contains('Create').click();

    cy.contains('Courses');
    cy.contains('A_Test Course');
}

export const createTestLesson = () => {
    cy.visit("/courses");
    cy.get('div#row-0').contains('A_Test Course');
    cy.get('button').contains('Edit').click();
    cy.contains('Edit Course');

    cy.get('button').contains('View Lessons').click();
    cy.contains('A_Test Course: Lessons');
    cy.contains('Create Lesson');
    cy.contains('Current Lessons');

    cy.get('input[name="name"]').type('A_Test Lesson');
    cy.get('input[name="startTime"]').clear().type('19-06-2022 10:00am');
    cy.get('input[name="endTime"]').clear().type('19-06-2022 12:00pm');
    cy.get('input[name="date"]').clear().type('19-06-2022');
    cy.get('button[type="submit"]').contains('Create').click();
}

export const createTestBeacon = () => {
    cy.visit("/courses");
    cy.get('div#row-0').contains('A_Test Course');
    cy.get('button').contains('Edit').click();
    cy.contains('Edit Course');

    cy.get('button').contains('View Beacons').click();
    cy.contains('A_Test Course: Beacons');
    cy.contains('Create Beacon');

    cy.get('input[name="name"]').type('A_Test Beacon');
    cy.get('button[type="submit"]').contains('Create').click();
    cy.contains('Success!')
    cy.contains('Beacon created sucessfully.');
    cy.contains('A_Test Beacon');
}