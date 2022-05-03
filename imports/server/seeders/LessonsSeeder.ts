import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import ObjectID from 'bson-objectid';
import moment from 'moment';
import { LessonsCollection } from '/imports/api/lessons/LessonsCollection';

export const LessonSeeder = (resetCollection: boolean, seedIfExistingData: boolean) => seeder(LessonsCollection, {
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

export const LessonsSeeder = (iteration: any, courseId: String) => {
    let lessonIds: Array<String> = [];

    for(let i = 0; i < iteration; i++) {
        const lessonId = LessonsCollection.insert({
            courseId: courseId,
            name: `Lesson ${i}`,
            startTime: moment().hours(1).minutes(0).toDate(),
            endTime: moment().hours(3).minutes(0).toDate(),
            date: new Date().setDate(new Date().getDate() + 1),
            createdAt: new Date(),
        });

        lessonIds.push(lessonId);
    }

    return lessonIds;
}