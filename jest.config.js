module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    automock: true,
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.test.json"
        }
    }
};