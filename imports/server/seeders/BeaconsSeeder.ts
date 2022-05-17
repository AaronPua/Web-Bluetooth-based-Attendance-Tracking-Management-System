import seeder from '@cleverbeagle/seeder';
import ObjectID from 'bson-objectid';
import { BeaconsCollection } from '/imports/api/beacons/BeaconsCollection';
import { faker } from '@faker-js/faker';
import { CoursesCollection } from '/imports/api/courses/CoursesCollection';
import uuid from 'uuid-random';

const course: any = () => {
    return CoursesCollection.insert({
        name: `Course 1`,
        credits: faker.datatype.number({ min: 1, max: 6 }),
        createdAt: faker.date.recent(),
    });
}

export const BeaconSeeder = (resetCollection: boolean, seedIfExistingData: boolean) => seeder(BeaconsCollection, {
    resetCollection: resetCollection,
    seedIfExistingData: seedIfExistingData,
    environments: ['development', 'staging'],
    data: {
        dynamic: {
            count: 5,
            seed(iteration: any, faker: any) {
                return {
                    _id: ObjectID().str,
                    courseId: course._id,
                    name: `Beacon ${iteration + 1}`,
                    uuid: uuid(),
                    createdAt: faker.date.recent(),
                };
            }
        }
    }
});

export const BeaconsSeeder = (iteration: any, courseId: String) => {
    let beaconIds: Array<String> = [];

    for(let i = 0; i < iteration; i++) {
        const beaconId = BeaconsCollection.insert({
            courseId: courseId,
            name: `Beacon ${i}`,
            uuid: uuid(),
            createdAt: faker.date.recent(),
        });

        beaconIds.push(beaconId);
    }

    return beaconIds;
}