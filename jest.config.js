module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    verbose: true,
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
    moduleNameMapper: {
        // "^meteor/(.*)": "<rootDir>/.meteorMocks/index.ts",
        "^meteor/meteor$": "<rootDir>/.meteorMocks/meteor.ts",
        "^meteor/mongo$": "<rootDir>/.meteorMocks/mongo.ts",
        "^meteor/mdg:validated-method$": "<rootDir>/.meteorMocks/mdg_validated_method.ts",
        "^meteor/react-meteor-data$": "<rootDir>/.meteorMocks/react-meteor-data.ts",
        "^meteor/didericis:callpromise-mixin$": "<rootDir>/.meteorMocks/callpromise_mixin.ts",
        "^meteor/tunifight:loggedin-mixin$": "<rootDir>/.meteorMocks/loggedin_mixin.ts",
        "^meteor/accounts-base$": "<rootDir>/.meteorMocks/accounts_base.ts",
        "^meteor/alanning:roles$": "<rootDir>/.meteorMocks/alanning_roles.ts",
        "^meteor/xolvio:cleaner$": "<rootDir>/.meteorMocks/xolvio_cleaner.ts",
        // '^(.*):(.*)$': '$1_$2'
    },
};