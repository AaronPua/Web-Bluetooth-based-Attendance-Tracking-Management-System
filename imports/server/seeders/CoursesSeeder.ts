import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';

export const seedCourses = () => seeder(Meteor.courses, {
    resetCollection: false,
    seedIfExistingData: true,  
    environments: ['development', 'staging'],
    data: {
        dynamic: {
            count: 5,
            seed(iteration: any, faker: any) {
                return {
                    _id: faker.datatype.string(),
                    name: `course-${iteration + 1}`,
                    credits: faker.datatype.number({ max: 6 }),
                    createdAt: faker.date.recent(),
                };
            }
        }
    }
});