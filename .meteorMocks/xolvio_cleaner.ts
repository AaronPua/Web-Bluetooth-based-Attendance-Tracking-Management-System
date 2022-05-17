jest.mock('meteor/xolvio:cleaner', () => {
    return {
        __esModule: true,
        resetDatabase: jest.fn()
    }
});