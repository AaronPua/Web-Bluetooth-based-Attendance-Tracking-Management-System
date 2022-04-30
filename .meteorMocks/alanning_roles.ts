jest.mock('meteor/alanning:roles', () => {
    return {
        __esModule: true,
        userIsInRole: jest.fn(),
        addUserInRoles: jest.fn(),
    }
});