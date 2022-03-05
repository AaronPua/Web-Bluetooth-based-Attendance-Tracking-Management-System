import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import ObjectID from 'bson-objectid';

export const LessonSeeder = (resetCollection: boolean, seedIfExistingData: boolean) => seeder(Meteor.lessons, {
    resetCollection: resetCollection,
    seedIfExistingData: seedIfExistingData,  
    environments: ['development', 'staging'],
    data: {
        dynamic: {
            count: 5,
            seed(iteration: any, faker: any) {
                return {
                    _id: ObjectID().str,
                    name: `lesson-${iteration + 1}`,
                    startTime: faker.time.recent('date'),
                    endTime: faker.time.recent('date'),
                    day: faker.date.weekday(),
                    createdAt: faker.date.recent(),
                };
            }
        }
    }
});