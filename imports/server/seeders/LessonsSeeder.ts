import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import ObjectID from 'bson-objectid';
import moment from 'moment';

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
                    courseId: 'ZcvqqKDgLKigXgBTR',
                    name: `lesson-${iteration + 1}`,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: new Date().setDate(new Date().getDate() + 1),
                    createdAt: new Date(),
                };
            }
        }
    }
});