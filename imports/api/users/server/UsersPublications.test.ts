import { Meteor } from 'meteor/meteor';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert } from 'chai';
import { InstructorsSeeder, StudentsSeeder } from '/imports/server/seeders/UsersSeeder';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { LessonsSeeder } from '/imports/server/seeders/LessonsSeeder';
import './UsersPublications';
import { CoursesCollection } from '../../courses/CoursesCollection';
import _ from 'underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { addStudentToCourse } from '../../courses/CoursesMethods';

describe('UsersPublications', function() {
 
    let courseId: string, students, studentIds, studentId;

    before(function() {
        resetDatabase();

        if(Meteor.roles.find().count() === 0) {
            Roles.createRole('admin');
            Roles.createRole('instructor');
            Roles.createRole('student');
        }

        InstructorsSeeder(5);
        StudentsSeeder(5);
        CoursesSeeder(1);

        courseId = CoursesCollection.find().fetch()[0]._id;
        students = Meteor.roleAssignment.find({ "role._id": 'student' }).fetch();
        studentIds = _.pluck(_.flatten(_.pluck(students, 'user')), '_id');
        studentId = Meteor.users.findOne({ _id: studentIds[0] })?._id;

        addStudentToCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: studentId });

        LessonsSeeder(1, courseId);
    });

    it('publish all users', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('users.all');
        assert.equal(collections.users.length, 10);
    });

    it('publish all instructors', async function() {
        const collector = new PublicationCollector();

        const collections = await collector.collect('users.instructors');
        assert.equal(collections.users.length, 5);
    });

    it('publish all students', async function() {
        const collector = new PublicationCollector();

        const collections = await collector.collect('users.students');
        assert.equal(collections.users.length, 5);
    });

    it('publish all students in a specific course', async function() {
        const collector = new PublicationCollector();

        const collections = await collector.collect('users.students.inSpecificCourse', courseId);
        assert.equal(collections.users.length, 1);
    });

    it('publish all students not in a specific course', async function() {
        const collector = new PublicationCollector();

        const collections = await collector.collect('users.students.notInSpecificCourse', courseId);
        assert.equal(collections.users.length, 4);
    });

    after(function() {
        resetDatabase();
    });
});