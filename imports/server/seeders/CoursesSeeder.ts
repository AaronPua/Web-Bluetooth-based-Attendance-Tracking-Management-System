import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import ObjectID from 'bson-objectid';

export const CourseSeeder = (resetCollection: boolean, seedIfExistingData: boolean) => seeder(Meteor.courses, {
    resetCollection: resetCollection,
    seedIfExistingData: seedIfExistingData,
    environments: ['development', 'staging'],
    data: {
        dynamic: {
            count: 5,
            seed(iteration: any, faker: any) {
                return {
                    _id: ObjectID().str,
                    name: `course-${iteration + 1}`,
                    credits: faker.datatype.number({ min: 1, max: 6 }),
                    createdAt: faker.date.recent(),
                };
            }
        }
    }
});