import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import _ from 'underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { StudentsSeeder } from '/imports/server/seeders/UsersSeeder';
import { Roles } from 'meteor/alanning:roles';
import { CoursesCollection } from '../courses/CoursesCollection';
import { createCourse } from '../courses/CoursesMethods';
import { createLesson, removeLesson, updateAttendance, updateLesson } from './LessonsMethods';
import moment from 'moment';
import { LessonsCollection } from './LessonsCollection';

describe('LessonMethods', function() {

    let courseId: string, course: any, student: Meteor.User, studentId: string, lesson: any;

    before(function() {
        resetDatabase();

        if(Meteor.roles.find().count() === 0) {
            Roles.createRole('admin');
            Roles.createRole('instructor');
            Roles.createRole('student');
        }

        createCourse._execute({ userId: Random.id() }, { name: 'Course 1', credits: 3 });
        course = CoursesCollection.find().fetch()[0];
        courseId = course._id;

        StudentsSeeder(1);
        student = Meteor.users.find().fetch()[0];
        studentId = student._id;
    });

    describe('Create Lesson', function() {
        it('success - create a lesson', function() {
            createLesson._execute({ userId: Random.id() }, { 
                courseId: courseId,
                name: `Lesson 1`,
                startTime: moment().hours(1).minutes(0).toDate(),
                endTime: moment().hours(3).minutes(0).toDate(),
                date: moment().day(1).toDate(),
            });
            assert.equal(LessonsCollection.find().count(), 1);
        });

        it('fail - create a lesson without logging in', function() {
            assert.throws(() => {
                createLesson._execute({}, { 
                    courseId: courseId,
                    name: `Lesson 1`,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, Meteor.Error, 'You need to be logged in before creating a lesson');
        });

        it('fail - create a lesson without course ID', function() {
            assert.throws(() => {
                createLesson._execute({}, { 
                    name: `Lesson 1`,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'Course ID is required');
        });

        it('fail - create a lesson without name', function() {
            assert.throws(() => {
                createLesson._execute({}, { 
                    courseId: courseId,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'Name is required');
        });

        it('fail - create a lesson without start time', function() {
            assert.throws(() => {
                createLesson._execute({}, { 
                    courseId: courseId,
                    name: `Lesson 1`,
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'Start time is required');
        });

        it('fail - create a lesson without end time', function() {
            assert.throws(() => {
                createLesson._execute({}, { 
                    courseId: courseId,
                    name: `Lesson 1`,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'End time is required');
        });

        it('fail - create a lesson without date', function() {
            assert.throws(() => {
                createLesson._execute({}, { 
                    courseId: courseId,
                    name: `Lesson 1`,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                });
            }, 'Date is required');
        });
    });

    describe('Remove Lesson', function() {
        it('success - remove a lesson', function() {
            createLesson._execute({ userId: Random.id() }, { 
                courseId: courseId,
                name: `Lesson 2`,
                startTime: moment().hours(1).minutes(0).toDate(),
                endTime: moment().hours(3).minutes(0).toDate(),
                date: moment().day(1).toDate(),
            });
            lesson = LessonsCollection.find().fetch()[1];
            removeLesson._execute({ userId: Random.id() }, { lessonId: lesson._id });
            assert.equal(LessonsCollection.find().count(), 1);
        });

        it('fail - remove a lesson without logging in', function() {
            lesson = LessonsCollection.find().fetch()[0];
            assert.throws(() => { removeLesson._execute({}, { lessonId: lesson._id });
            }, Meteor.Error, 'You need to be logged in before removing a lesson');
        });

        it('fail - remove a lesson without lesson ID', function() {
            lesson = LessonsCollection.find().fetch()[0];
            assert.throws(() => { removeLesson._execute({}, {});
            }, 'Lesson ID is required');
        });
    });

    describe('Update Lesson', function() {
        it('success - update a lesson', function() {
            lesson = LessonsCollection.find().fetch()[0];
            updateLesson._execute({ userId: Random.id() }, { 
                lessonId: lesson._id, 
                name: 'Lesson 3',
                startTime: moment().hours(1).minutes(0).toDate(),
                endTime: moment().hours(3).minutes(0).toDate(),
                date: moment().day(1).toDate(),
            });
            lesson = LessonsCollection.find().fetch()[0];
            assert.equal(lesson.name, 'Lesson 3');
        });

        it('fail - update a lesson without logging in', function() {
            assert.throws(() => {
               updateLesson._execute({}, { 
                    lessonId: lesson._id,
                    name: 'Lesson 3',
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, Meteor.Error, 'You need to be logged in before updating a lesson');
        });

        it('fail - update a lesson without lesson ID', function() {
            assert.throws(() => {
                updateLesson._execute({}, { 
                    name: `Lesson 1`,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'Lesson ID is required');
        });

        it('fail - update a lesson without name', function() {
            assert.throws(() => {
                updateLesson._execute({}, { 
                    lessonId: lesson._id,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'Name is required');
        });

        it('fail - update a lesson without start time', function() {
            assert.throws(() => {
                updateLesson._execute({}, { 
                    lessonId: lesson._id,
                    name: `Lesson 1`,
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'Start time is required');
        });

        it('fail - update a lesson without end time', function() {
            assert.throws(() => {
                updateLesson._execute({}, { 
                    lessonId: lesson._id,
                    name: `Lesson 1`,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'End time is required');
        });
    });

    describe('Add Student Attendance', function() {
        it('success - add student attendance', function() {
            lesson = LessonsCollection.find().fetch()[0];
            updateAttendance._execute({ userId: Random.id() }, { lessonId: lesson._id, studentId: studentId, action: 'add' });
            lesson = LessonsCollection.find().fetch()[0];
            assert.isNotNull(lesson.studentAttendance);
            const studentAttendedIds = _.pluck(_.values(lesson.studentAttendance), '_id');
            assert.include(studentAttendedIds, studentId);
        });

        it('fail - add student attendance without logging in', function() {
            assert.throws(() => {
                lesson = LessonsCollection.find().fetch()[0];
                updateAttendance._execute({}, { lessonId: lesson._id, studentId: studentId, action: 'add' });
            }, Meteor.Error, "You need to be logged in before updating a student's attendance");
        });

        it('fail - add student attendance without lesson ID', function() {
            assert.throws(() => {
                lesson = LessonsCollection.find().fetch()[0];
                updateAttendance._execute({}, { studentId: studentId, action: 'add' });
            }, "Lesson ID is required");
        });

        it('fail - add student attendance without student ID', function() {
            assert.throws(() => {
                lesson = LessonsCollection.find().fetch()[0];
                updateAttendance._execute({}, { lessonId: lesson._id, action: 'add' });
            }, "Student ID is required");
        });

        it('fail - add student attendance without action', function() {
            assert.throws(() => {
                lesson = LessonsCollection.find().fetch()[0];
                updateAttendance._execute({}, { lessonId: lesson._id, studentId: studentId });
            }, "Action is required");
        });
    });

    describe('Remove Student Attendance', function() {
        it('success - remove student attendance', function() {
            lesson = LessonsCollection.find().fetch()[0];
            updateAttendance._execute({ userId: Random.id() }, { lessonId: lesson._id, studentId: studentId, action: 'remove' });
            lesson = LessonsCollection.find().fetch()[0];
            assert.isEmpty(lesson.studentAttendance);
        });

        it('fail - remove student attendance without logging in', function() {
            assert.throws(() => {
                lesson = LessonsCollection.find().fetch()[0];
                updateAttendance._execute({}, { lessonId: lesson._id, studentId: studentId, action: 'remove' });
            }, Meteor.Error, "You need to be logged in before updating a student's attendance");
        });

        it('fail - remove student attendance without lesson ID', function() {
            assert.throws(() => {
                lesson = LessonsCollection.find().fetch()[0];
                updateAttendance._execute({}, { studentId: studentId, action: 'remove' });
            }, "Lesson ID is required");
        });

        it('fail - remove student attendance without student ID', function() {
            assert.throws(() => {
                lesson = LessonsCollection.find().fetch()[0];
                updateAttendance._execute({}, { lessonId: lesson._id, action: 'remove' });
            }, "Student ID is required");
        });

        it('fail - remove student attendance without action', function() {
            assert.throws(() => {
                lesson = LessonsCollection.find().fetch()[0];
                updateAttendance._execute({}, { lessonId: lesson._id, studentId: studentId });
            }, "Action is required");
        });
    });
    
    after(function() {
        resetDatabase();
    });
});