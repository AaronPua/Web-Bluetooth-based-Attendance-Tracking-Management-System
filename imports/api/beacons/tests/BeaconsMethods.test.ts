import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { CoursesCollection } from '../../courses/CoursesCollection';
import { createBeacon, removeBeacon, updateBeacon } from '../BeaconsMethods';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { BeaconsCollection } from '../BeaconsCollection';
import uuid from 'uuid-random';
import _ from 'underscore';

describe('BeaconsMethods', function() {
    beforeEach(function() {
        resetDatabase();
    });

    after(function() {
        resetDatabase();
    });

    describe('Create Beacon', function() {
        it('success - create a beacon', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            createBeacon._execute({ userId: Random.id() }, { courseId: courseId, name: 'Beacon 1', uuid: uuid() });
            createBeacon._execute({ userId: Random.id() }, { courseId: courseId, name: 'Beacon 2', uuid: uuid() });
            assert.equal(BeaconsCollection.find().count(), 2);
        });

        it('fail - create a beacon without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            assert.throws(() => {
                createBeacon._execute({}, { courseId: courseId, name: 'Beacon 1', uuid: uuid() });
            }, Meteor.Error, 'You need to be logged in before creating a beacon');
        });

        it('fail - create a beacon without course ID', function() {
            assert.throws(() => {
                createBeacon._execute({}, { name: 'Beacon 1', uuid: uuid() });
            }, 'Course ID is required');
        });

        it('fail - create a beacon without name', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            assert.throws(() => {
                createBeacon._execute({}, { courseId: courseId, uuid: uuid() });
            }, 'Name is required');
        });

        it('fail - create a beacon without uuid', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            assert.throws(() => {
                createBeacon._execute({}, { courseId: courseId, name: 'Beacon 1' });
            }, 'Uuid is required');
        });
    });

    describe('Remove Beacon', function() {
        it('success - remove a beacon', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            createBeacon._execute({ userId: Random.id() }, { courseId: courseId, name: 'Beacon 1', uuid: uuid() });
            createBeacon._execute({ userId: Random.id() }, { courseId: courseId, name: 'Beacon 2', uuid: uuid() });
            const beacon = BeaconsCollection.find().fetch()[0];

            removeBeacon._execute({ userId: Random.id() }, { beaconId: beacon._id });
            assert.equal(CoursesCollection.find().count(), 1);
        });

        it('fail - remove a beacon without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];
            
            createBeacon._execute({ userId: Random.id() }, { courseId: courseId, name: 'Beacon 1', uuid: uuid() });
            const beacon = BeaconsCollection.find().fetch()[0];

            assert.throws(() => {
                removeBeacon._execute({}, { beaconId: beacon._id });
            }, Meteor.Error, 'You need to be logged in before removing a beacon');
        });

        it('fail - remove a beacon without proper beacon id', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];
            
            createBeacon._execute({ userId: Random.id() }, { courseId: courseId, name: 'Beacon 1', uuid: uuid() });

            assert.throws(() => {
                removeBeacon._execute({ userId: Random.id() }, { beaconId: 'ZxCv1234' });
            }, 'Beacon ID must be a valid alphanumeric ID');
        });
    });

    describe('Update Beacon', function() {
        it('success - update a beacon', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];
            
            createBeacon._execute({ userId: Random.id() }, { courseId: courseId, name: 'Beacon 1', uuid: uuid() });
            const beacon = BeaconsCollection.find().fetch()[0];

            updateBeacon._execute({ userId: Random.id() }, { beaconId: beacon._id, courseId: courseId, name: 'Beacon 3', uuid: uuid() });
            const updatedBeacon = BeaconsCollection.find().fetch()[0];

            assert.equal(updatedBeacon.name, 'Beacon 3');
        });

        it('fail - update a beacon without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];
            
            createBeacon._execute({ userId: Random.id() }, { courseId: courseId, name: 'Beacon 1', uuid: uuid() });
            const beacon = BeaconsCollection.find().fetch()[0];

            assert.throws(() => {
                updateBeacon._execute({}, { beaconId: beacon._id, courseId: courseId, name: 'Beacon 3', uuid: uuid() });
            }, Meteor.Error, 'You need to be logged in before updating a beacon');
        });
    });
});