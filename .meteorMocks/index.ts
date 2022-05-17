jest.mock('meteor/react-meteor-data', () => {
    return {
        __esModule: true,
        useTracker: jest.fn(cb => cb && cb())
    }
});

jest.mock('meteor/mdg:validated-method', () => {
    return {
        __esModule: true,
        ValidatedMethod: jest.fn(payload => payload),
    }
});

// jest.mock('meteor/quave:collections', () => {
//     return {
//         __esModule: true,
//         createCollection: jest.fn(),
//     }
// });