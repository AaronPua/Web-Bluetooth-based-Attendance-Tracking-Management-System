module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    globals: {
        // we must specify a custom tsconfig for tests because we need the typescript transform
        // to transform jsx into js rather than leaving it jsx such as the next build requires.  you
        // can see this setting in tsconfig.jest.json -> "jsx": "react"
        "ts-jest": {
            tsconfig: "tsconfig.jest.json",
            diagnostics: {
                warnOnly: true
            }
        }
    },
    setupFilesAfterEnv: ['./jest.setup.ts'],
};