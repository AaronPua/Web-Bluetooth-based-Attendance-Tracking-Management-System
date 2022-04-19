import { Meteor } from 'meteor/meteor';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert } from 'chai';
import { AdminsSeeder, InstructorsSeeder, StudentsSeeder } from '/imports/server/seeders/UsersSeeder';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { LessonsSeeder } from '/imports/server/seeders/LessonsSeeder';
import './UsersPublications';
import { CoursesCollection } from '../../courses/CoursesCollection';
import _ from 'underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { addStudentToCourse, addInstructorToCourse } from '../../courses/CoursesMethods';

describe('UsersPublications', function() {
 
    let courseId: string, adminId: string, students, studentIds, 
    studentId: string | undefined, instructors, instructorIds, instructorId: string | undefined;

    before(function() {
        resetDatabase();

        if(Meteor.roles.find().count() === 0) {
            Roles.createRole('admin');
            Roles.createRole('instructor');
            Roles.createRole('student');
        }

        AdminsSeeder(1);
        InstructorsSeeder(5);
        StudentsSeeder(5);
        CoursesSeeder(1);

        adminId = Meteor.users.find().fetch()[0]._id;
        courseId = CoursesCollection.find().fetch()[0]._id;
        students = Meteor.roleAssignment.find({ "role._id": 'student' }).fetch();
        studentIds = _.pluck(_.flatten(_.pluck(students, 'user')), '_id');
        studentId = Meteor.users.findOne({ _id: studentIds[0] })?._id;

        instructors = Meteor.roleAssignment.find({ "role._id": 'instructor' }).fetch();
        instructorIds = _.pluck(_.flatten(_.pluck(instructors, 'user')), '_id');
        instructorId = Meteor.users.findOne({ _id: instructorIds[0] })?._id;

        addStudentToCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: studentId });
        addInstructorToCourse._execute({ userId: Random.id() }, { courseId: courseId, instructorId: instructorId });

        LessonsSeeder(1, courseId);
    });

    it('publish all users', async function() {
        const collector = new PublicationCollector({ userId: adminId });
        
        const collections = await collector.collect('users.all');
        assert.equal(collections.users.length, 11);
    });

    it('publish specific user', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('users.specific', adminId);
        assert.equal(collections.users.length, 1);
        assert.equal(collections.users[0]._id, adminId);
    });

    it('publish all instructors', async function() {
        const collector = new PublicationCollector({ userId: adminId });

        const collections = await collector.collect('users.instructors');
        assert.equal(collections.users.length, 5);
    });

    it('publish all students', async function() {
        const collector = new PublicationCollector({ userId: adminId });

        const collections = await collector.collect('users.students');
        assert.equal(collections.users.length, 5);
    });

    it('publish all students in a specific course', async function() {
        const collector = new PublicationCollector({ userId: adminId });

        const collections = await collector.collect('users.students.inSpecificCourse', courseId);
        assert.equal(collections.users.length, 1);
        assert.equal(collections.users[0]._id, studentId);
    });

    it('publish all students not in a specific course', async function() {
        const collector = new PublicationCollector({ userId: adminId });

        const collections = await collector.collect('users.students.notInSpecificCourse', courseId);
        assert.equal(collections.users.length, 4);
        assert.notEqual(collections.users[0]._id, studentId);
    });

    it('publish all instructors in a specific course', async function() {
        const collector = new PublicationCollector({ userId: adminId });

        const collections = await collector.collect('users.instructors.inSpecificCourse', courseId);
        assert.equal(collections.users.length, 1);
        assert.equal(collections.users[0]._id, instructorId);
    });

    it('publish all instructors not in a specific course', async function() {
        const collector = new PublicationCollector({ userId: adminId });

        const collections = await collector.collect('users.instructors.notInSpecificCourse', courseId);
        assert.equal(collections.users.length, 4);
        assert.notEqual(collections.users[0]._id, instructorId);
    });

    after(function() {
        resetDatabase();
    });
});