import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert } from 'chai';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import './CoursesPublications';
import { CoursesCollection } from '../../courses/CoursesCollection';
import _ from 'underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';

describe('CoursesPublication', function() {

    let courseId: string;

    before(function() {
        resetDatabase();
        CoursesSeeder(5);
        courseId = CoursesCollection.find().fetch()[0]._id;
    });

    it('publish all courses', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('courses.all');
        assert.equal(collections.courses.length, 5);
    });

    it('publish specific course', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('courses.specific', courseId);
        assert.equal(collections.courses.length, 1);
    });

    after(function() {
        resetDatabase();
    });
});