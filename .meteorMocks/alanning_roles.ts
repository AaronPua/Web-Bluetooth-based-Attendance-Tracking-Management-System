// jest.mock('meteor/alanning:roles', () => {
//     return {
//         __esModule: true,
//         userIsInRole: jest.fn(),
//         addUserInRoles: jest.fn(),
//     }
// });

export const Roles = {
    userIsInRole: jest.fn(),
    addUsersToRoles: jest.fn(),
    removeUsersFromRoles: jest.fn(),
    setUserRoles: jest.fn(),
    createRole: jest.fn(),
}