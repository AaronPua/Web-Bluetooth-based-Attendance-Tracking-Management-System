import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { CoursesCollection } from '../CoursesCollection';
import { createCourse, removeCourse, updateCourse, addStudentToCourse, removeStudentFromCourse, 
            addInstructorToCourse, removeInstructorFromCourse } from '../CoursesMethods';
import { InstructorsSeeder, StudentsSeeder } from '/imports/server/seeders/UsersSeeder';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { assert } from 'chai';
import _ from 'underscore';

describe('CoursesMethods', function() {
    beforeEach(function() {
        resetDatabase();
    });
        
    after(function() {
        resetDatabase();
    });

    describe('Create Course', function() {
        it('success - create a course', function() {
            createCourse._execute({ userId: Random.id() }, { name: 'Course 1', credits: 3 });
            assert.equal(CoursesCollection.find().count(), 1);
        });

        it('fail - create a course without logging in', function() {
            assert.throws(() => {
                createCourse._execute({}, { name: 'Course 1', credits: 3 });
            }, Meteor.Error, 'You need to be logged in before creating a course');
        });

        it('fail - create a course without name', function() {
            assert.throws(() => {
                createCourse._execute({}, { credits: 3 });
            }, 'Name is required');
        });

        it('fail - create a course without credits', function() {
            assert.throws(() => {
                createCourse._execute({}, { name: 'Course 1' });
            }, 'Credits is required');
        });
    });

    describe('Remove Course', function() {
        it('success - remove a course', function() {
            const courseIds = CoursesSeeder(1);

            removeCourse._execute({ userId: Random.id() }, { courseId: courseIds[0] });
            assert.equal(CoursesCollection.find().count(), 0);
        });

        it('fail - remove a course without logging in', function() {
            const courseIds = CoursesSeeder(1);

            assert.throws(() => { 
                removeCourse._execute({}, { courseId: courseIds[0] });
            }, Meteor.Error, 'You need to be logged in before removing a course');
        });

        it('fail - remove a course without proper course id', function() {
            CoursesSeeder(1);

            assert.throws(() => {
                removeCourse._execute({ userId: Random.id() }, { courseId: 'ZxCv1234' });
            }, 'Course ID must be a valid alphanumeric ID');
        });
    });

    describe('Update Course', function() {
        it('success - update a course', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            updateCourse._execute({ userId: Random.id() }, { courseId: courseId, name: 'Course 3', credits: 2 });
            const course = CoursesCollection.findOne(courseId);
            assert.equal(course?.name, 'Course 3');
            assert.equal(course?.credits, 2);
        });

        it('fail - update a course without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            assert.throws(() => {
                updateCourse._execute({}, { courseId: courseId, name: 'Course 3', credits: 2 });
            }, Meteor.Error, 'You need to be logged in before updating a course');
        });

        it('fail - update a course without course ID', function() {
            CoursesSeeder(1);

            assert.throws(() => {
                updateCourse._execute({}, { name: 'Course 3', credits: 2 });
            }, 'Course ID is required');
        });

        it('fail - update a course without name', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            assert.throws(() => {
                updateCourse._execute({}, { courseId: courseId, credits: 2 });
            }, 'Name is required');
        });

        it('fail - update a course without credits', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            assert.throws(() => {
                updateCourse._execute({}, { courseId: courseId, name: 'Course 3' });
            }, 'Credits is required');
        });
    });

    describe('Add Student To Course', function() {
        it('success - add student to course', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            addStudentToCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: studentId });
            const student = Meteor.users.findOne(studentId);
            const studentCourseId = _.first(_.pluck(student.courses, '_id'));
            assert.equal(studentCourseId, courseId);
        });

        it('fail - add a student to course without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            assert.throws(() => {
                addStudentToCourse._execute({}, { courseId: courseId, studentId: studentId });
            }, Meteor.Error, 'You need to be logged in before adding students to a course');
        });

        it('fail - add a student to course without course ID', function() {
            CoursesSeeder(1);
            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            assert.throws(() => {
                addStudentToCourse._execute({}, { studentId: studentId });
            }, 'Course ID is required');
        });

        it('fail - add a student to course without student ID', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];
            StudentsSeeder(1);

            assert.throws(() => {
                addStudentToCourse._execute({}, { courseId: courseId });
            }, 'Student ID is required');
        });
    });

    describe('Remove Student From Course', function() {
        it('success - remove student from course', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            addStudentToCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: studentId });
            removeStudentFromCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: studentId });
            const student = Meteor.users.find().fetch()[0];
            const studentCourseId = _.first(_.pluck(student.courses, '_id'));
            assert.equal(studentCourseId, null);
        });

        it('fail - remove student from course without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            assert.throws(() => {
                removeStudentFromCourse._execute({}, { courseId: courseId, studentId: studentId });
            }, Meteor.Error, 'You need to be logged in before removing students from a course');
        });

        it('fail - remove student from course without course ID', function() {
            CoursesSeeder(1);
            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            assert.throws(() => {
                removeStudentFromCourse._execute({}, { studentId: studentId });
            }, 'Course ID is required');
        });

        it('fail - remove student from course without student ID', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];
            StudentsSeeder(1);

            assert.throws(() => {
                removeStudentFromCourse._execute({}, { courseId: courseId });
            }, 'Student ID is required');
        });
    });

    describe('Add Instructor To Course', function() {
        it('success - add instructor to course', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            const instructorIds = InstructorsSeeder(1);
            const instructorId = instructorIds[0];

            addInstructorToCourse._execute({ userId: Random.id() }, { courseId: courseId, instructorId: instructorId });

            const instructor = Meteor.users.find().fetch()[0];
            const instructorCourseId = _.first(_.pluck(instructor.courses, '_id'));
            assert.equal(instructorCourseId, courseId);
        });

        it('fail - add instructor to course without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            const instructorIds = InstructorsSeeder(1);
            const instructorId = instructorIds[0];

            assert.throws(() => {
                addInstructorToCourse._execute({}, { courseId: courseId, instructorId: instructorId });
            }, Meteor.Error, 'You need to be logged in before adding instructors to a course');
        });

        it('fail - add instructor from course without course ID', function() {
            CoursesSeeder(1);
            const instructorIds = InstructorsSeeder(1);
            const instructorId = instructorIds[0];

            assert.throws(() => {
                addInstructorToCourse._execute({}, { instructorId: instructorId });
            }, 'Course ID is required');
        });

        it('fail - add instructor from course without instructor ID', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];
            InstructorsSeeder(1);
            
            assert.throws(() => {
                addInstructorToCourse._execute({}, { courseId: courseId });
            }, 'Instructor ID is required');
        });
    });

    describe('Remove Instructor From Course', function() {
        it('success - remove instructor from course', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            const instructorIds = InstructorsSeeder(1);
            const instructorId = instructorIds[0];

            addInstructorToCourse._execute({ userId: Random.id() }, { courseId: courseId, instructorId: instructorId });
            removeInstructorFromCourse._execute({ userId: Random.id() }, { courseId: courseId, instructorId: instructorId });

            const instructor = Meteor.users.find().fetch()[0];
            const instructorCourseId = _.first(_.pluck(instructor.courses, '_id'));
            assert.equal(instructorCourseId, null);
        });

        it('fail - remove instructor from course without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];

            const instructorIds = InstructorsSeeder(1);
            const instructorId = instructorIds[0];

            assert.throws(() => {
                removeInstructorFromCourse._execute({}, { courseId: courseId, instructorId: instructorId });
            }, Meteor.Error, 'You need to be logged in before removing instructors from a course');
        });

        it('fail - remove instructor from course without course ID', function() {
            CoursesSeeder(1);
            const instructorIds = InstructorsSeeder(1);
            const instructorId = instructorIds[0];

            assert.throws(() => {
                removeInstructorFromCourse._execute({}, { instructorId: instructorId });
            }, 'Course ID is required');
        });

        it('fail - remove instructor from course without instructor ID', function() {
            const courseIds = CoursesSeeder(1);
            const courseId = courseIds[0];
            InstructorsSeeder(1);

            assert.throws(() => {
                removeInstructorFromCourse._execute({}, { courseId: courseId });
            }, 'Instructor ID is required');
        });
    });
});