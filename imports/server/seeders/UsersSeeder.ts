import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';

export const UserSeeder = (resetCollection: boolean, seedIfExistingData: boolean) => seeder(Meteor.users, {
    resetCollection: resetCollection,
    seedIfExistingData: seedIfExistingData,
    environments: ['development', 'staging'],
    data: {
        dynamic: {
            count: 5,
            seed(iteration: any, faker: any) {
                return {
                    email: `user${iteration + 1}@test.com`,
                    password: 'test',
                    profile: {
                        firstName: faker.name.firstName(),
                        lastName: faker.name.lastName(),
                        gender: 'male'
                    },
                    roles: ['instructor']
                };
            }
        }
    }
});