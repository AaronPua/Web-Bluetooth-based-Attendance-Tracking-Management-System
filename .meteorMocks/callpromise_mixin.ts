jest.mock('meteor/didericis:callpromise-mixin', () => {
    return {
        __esModule: true,
        callPromise: jest.fn()
    }
});