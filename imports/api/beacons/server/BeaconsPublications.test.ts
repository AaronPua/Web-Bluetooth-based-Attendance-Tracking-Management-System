import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert } from 'chai';
import './BeaconsPublications';
import { CoursesCollection } from '../../courses/CoursesCollection';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { BeaconsSeeder } from '/imports/server/seeders/BeaconsSeeder';
import _ from 'underscore';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { BeaconsCollection } from '../BeaconsCollection';
import { AdminsSeeder } from '/imports/server/seeders/UsersSeeder';

describe('BeaconsPublications', function() {

    let adminId: string, courseId: string, beaconId: string;

    before(function() {
        resetDatabase();
        if(Meteor.roles.find().count() === 0) {
            Roles.createRole('admin');
            Roles.createRole('instructor');
            Roles.createRole('student');
        }

        AdminsSeeder(1);
        adminId = Meteor.users.find().fetch()[0]._id;
        CoursesSeeder(1);
        courseId = CoursesCollection.find().fetch()[0]._id;
        BeaconsSeeder(5, courseId);
        beaconId = BeaconsCollection.find().fetch()[0]._id;
    });

    it('publish all beacons', async function() {
        const collector = new PublicationCollector({ userId: adminId });
        
        const collections = await collector.collect('beacons.all');
        assert.equal(collections.beacons.length, 5);
    });

    it('publish specific beacon', async function() {
        const collector = new PublicationCollector({ userId: adminId });
        
        const collections = await collector.collect('beacons.specific', beaconId);
        assert.equal(collections.beacons.length, 1);
        assert.equal(collections.beacons[0]._id, beaconId);
    });

    it('publish beacons for a course', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('beacons.forOneCourse', courseId);
        assert.equal(collections.beacons.length, 5);
    });

    after(function() {
        resetDatabase();
    });
});