import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import ObjectID from 'bson-objectid';
import { CoursesCollection } from '/imports/api/courses/CoursesCollection';
import { faker } from '@faker-js/faker';

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
                    name: `Course ${iteration + 1}`,
                    credits: faker.datatype.number({ min: 1, max: 6 }),
                    createdAt: faker.date.recent(),
                };
            }
        }
    }
});

export const CoursesSeeder = (iteration: any) => {
    let coursesIds: Array<String> = [];

    for(let i = 0; i < iteration; i++) {
        const courseId = CoursesCollection.insert({
            name: `Course ${i}`,
            credits: faker.datatype.number({ min: 1, max: 6 }),
            createdAt: faker.date.recent(),
        });

        coursesIds.push(courseId);
    }

    return coursesIds;
}