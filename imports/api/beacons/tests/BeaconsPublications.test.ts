import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { CoursesCollection } from '../../courses/CoursesCollection';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { BeaconsSeeder } from '/imports/server/seeders/BeaconsSeeder';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { AdminsSeeder, InstructorsSeeder } from '/imports/server/seeders/UsersSeeder';
import '../server/BeaconsPublications';
import _ from 'underscore';
import { assert } from 'chai';

describe('BeaconsPublications', function() {
    beforeEach(function() {
        resetDatabase();
    });

    after(function() {
        resetDatabase();
    });

    it('success - publish all beacons for admins', async function() {
        const adminIds = AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });
        
        const courseIds = CoursesSeeder(1);
        BeaconsSeeder(5, courseIds[0]);
        
        const collections = await collector.collect('beacons.all');
        assert.equal(collections.beacons.length, 5);
    });

    it('fail - publish all beacons for non-admins', async function() {
        const instructorIds = InstructorsSeeder(1);
        const collector = new PublicationCollector({ userId: instructorIds[0] });
        
        const courseIds = CoursesSeeder(1);
        BeaconsSeeder(5, courseIds[0]);
        
        const collections = await collector.collect('beacons.all');
        assert.equal(collections.beacons, null);
    });

    it('success - publish all beacons with course for admins', async function() {
        const adminIds = AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];
        BeaconsSeeder(5, courseId);
        
        const collections = await collector.collect('beacons.all.withCourse');
        assert.equal(collections.beacons.length, 5);

        const courseName = CoursesCollection.findOne(courseId)?.name;
        assert.equal(collections.beacons[0].course[0].name, courseName);
    });

    it('fail - publish all beacons with course for non-admins', async function() {
        const instructorIds = InstructorsSeeder(1);
        const collector = new PublicationCollector({ userId: instructorIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];
        BeaconsSeeder(5, courseId);
        
        const collections = await collector.collect('beacons.all.withCourse');
        assert.equal(collections.beacons, null);
    });

    it('success - publish specific beacon for admins/instructors', async function() {
        const adminIds = AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];
        const beaconIds = BeaconsSeeder(5, courseId);
        const beaconId = beaconIds[0];
        
        const collections = await collector.collect('beacons.specific', beaconId);
        assert.equal(collections.beacons.length, 1);
        assert.equal(collections.beacons[0]._id, beaconId);
    });

    it('fail - publish specific beacon for non-admins/instructors', async function() {
        const instructorIds = InstructorsSeeder(1);
        const collector = new PublicationCollector({ userId: instructorIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];
        const beaconIds = BeaconsSeeder(5, courseId);
        const beaconId = beaconIds[0];
        
        const collections = await collector.collect('beacons.specific', beaconId);
        assert.equal(collections.beacons.length, 1);
        assert.equal(collections.beacons[0]._id, beaconId);
    });

    it('success - publish beacons for a course', async function() {
        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];
        BeaconsSeeder(5, courseId);

        const collector = new PublicationCollector();
        
        const collections = await collector.collect('beacons.forOneCourse', courseId);
        assert.equal(collections.beacons.length, 5);
    });

    it('success - publish beacons for multiple courses', async function() {
        const courseIds = CoursesSeeder(2);
        BeaconsSeeder(2, courseIds[0]);
        BeaconsSeeder(2, courseIds[1]);

        const collector = new PublicationCollector();
        
        const collections = await collector.collect('beacons.forMultipleCourses', courseIds);
        assert.equal(collections.beacons.length, 4);

        const course1Name = CoursesCollection.findOne(courseIds[0])?.name;
        assert.equal(collections.beacons[0].course[0].name, course1Name);

        const course2Name = CoursesCollection.findOne(courseIds[1])?.name;
        assert.equal(collections.beacons[2].course[0].name, course2Name);
    });
});