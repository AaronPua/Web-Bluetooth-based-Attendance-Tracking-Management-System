import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert } from 'chai';
import './BeaconsPublications';
import { CoursesCollection } from '../../courses/CoursesCollection';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { BeaconsSeeder } from '/imports/server/seeders/BeaconsSeeder';
import _ from 'underscore';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { BeaconsCollection } from '../BeaconsCollection';

describe('CoursesPublication', function() {

    let courseId: string, beaconId: string;

    before(function() {
        resetDatabase();
        CoursesSeeder(1);
        courseId = CoursesCollection.find().fetch()[0]._id;
        BeaconsSeeder(5, courseId);
        beaconId = BeaconsCollection.find().fetch()[0]._id;
    });

    it('publish all beacons', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('beacons.all');
        assert.equal(collections.beacons.length, 5);
    });

    it('publish specific beacon', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('beacons.specific', beaconId);
        assert.equal(collections.beacons.length, 1);
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