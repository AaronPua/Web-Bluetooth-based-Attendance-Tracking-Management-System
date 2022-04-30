jest.mock('meteor/accounts-base', () => {
    return {
        __esModule: true,
        createUser: jest.fn(),
        sendVerificationEmail: jest.fn(),
        addEmail: jest.fn(),
    }
});