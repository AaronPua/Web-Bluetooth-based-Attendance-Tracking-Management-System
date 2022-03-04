import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';

export const seedLessons = () => seeder(Meteor.lessons, {
    resetCollection: true,
    seedIfExistingData: true,  
    environments: ['development', 'staging'],
    data: {
        dynamic: {
            count: 5,
            seed(iteration: any, faker: any) {
                return {
                    _id: faker.datatype.string(),
                    email: `user${iteration + 1}@test.com`,
                    password: 'test',
                    profile: {
                        firstName: faker.name.firstName(),
                        lastName: faker.name.lastName(),
                        gender: faker.name.gender(true)
                    },
                    roles: ['instructor']
                };
            }
        }
    }
});