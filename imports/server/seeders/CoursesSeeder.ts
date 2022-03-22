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
    for(let i = 0; i < iteration; i++) {
        CoursesCollection.insert({
            name: `Course ${iteration + 1}`,
            credits: faker.datatype.number({ min: 1, max: 6 }),
            createdAt: faker.date.recent(),
        });
    }
}