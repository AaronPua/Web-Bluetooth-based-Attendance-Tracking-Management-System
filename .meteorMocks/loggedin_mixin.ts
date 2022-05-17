jest.mock('meteor/tunifight:loggedin-mixin', () => {
    return {
        __esModule: true,
        LoggedInMixin: jest.fn()
    }
});