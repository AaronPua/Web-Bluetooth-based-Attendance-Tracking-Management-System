// jest.mock('meteor/react-meteor-data', () => {
//     return {
//         __esModule: true,
//         useTracker: jest.fn(cb => cb && cb())
//     }
// });

export const useTracker = jest.fn(cb => cb && cb());