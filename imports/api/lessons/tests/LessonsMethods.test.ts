import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { StudentsSeeder } from '/imports/server/seeders/UsersSeeder';
import { CoursesCollection } from '../../courses/CoursesCollection';
import { createCourse } from '../../courses/CoursesMethods';
import { createLesson, removeLesson, updateAttendance, updateLesson } from '../LessonsMethods';
import { LessonsCollection } from '../LessonsCollection';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { LessonsSeeder } from '/imports/server/seeders/LessonsSeeder';
import moment from 'moment';
import _ from 'underscore';

describe('LessonMethods', function() {
    beforeEach(function() {
        resetDatabase();
    });

    after(function() {
        resetDatabase();
    });

    describe('Create Lesson', function() {
        it('success - create a lesson', function() {
            createCourse._execute({ userId: Random.id() }, { name: 'Course 1', credits: 3 });
            const course = CoursesCollection.find().fetch()[0];

            createLesson._execute({ userId: Random.id() }, { 
                courseId: course._id,
                name: `Lesson 1`,
                startTime: moment().hours(1).minutes(0).toDate(),
                endTime: moment().hours(3).minutes(0).toDate(),
                date: moment().day(1).toDate(),
            });
            assert.equal(LessonsCollection.find().count(), 1);
        });

        it('fail - create a lesson without logging in', function() {
            createCourse._execute({ userId: Random.id() }, { name: 'Course 1', credits: 3 });
            const course = CoursesCollection.find().fetch()[0];

            assert.throws(() => {
                createLesson._execute({}, { 
                    courseId: course._id,
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
            createCourse._execute({ userId: Random.id() }, { name: 'Course 1', credits: 3 });
            const course = CoursesCollection.find().fetch()[0];

            assert.throws(() => {
                createLesson._execute({}, { 
                    courseId: course._id,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'Name is required');
        });

        it('fail - create a lesson without start time', function() {
            createCourse._execute({ userId: Random.id() }, { name: 'Course 1', credits: 3 });
            const course = CoursesCollection.find().fetch()[0];

            assert.throws(() => {
                createLesson._execute({}, { 
                    courseId: course._id,
                    name: `Lesson 1`,
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'Start time is required');
        });

        it('fail - create a lesson without end time', function() {
            createCourse._execute({ userId: Random.id() }, { name: 'Course 1', credits: 3 });
            const course = CoursesCollection.find().fetch()[0];

            assert.throws(() => {
                createLesson._execute({}, { 
                    courseId: course._id,
                    name: `Lesson 1`,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'End time is required');
        });

        it('fail - create a lesson without date', function() {
            createCourse._execute({ userId: Random.id() }, { name: 'Course 1', credits: 3 });
            const course = CoursesCollection.find().fetch()[0];

            assert.throws(() => {
                createLesson._execute({}, { 
                    courseId: course._id,
                    name: `Lesson 1`,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                });
            }, 'Date is required');
        });
    });

    describe('Remove Lesson', function() {
        it('success - remove a lesson', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];

            removeLesson._execute({ userId: Random.id() }, { lessonId: lessonId });
            assert.equal(LessonsCollection.find().count(), 0);
        });

        it('fail - remove a lesson without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];

            assert.throws(() => { removeLesson._execute({}, { lessonId: lessonId });
            }, Meteor.Error, 'You need to be logged in before removing a lesson');
        });

        it('fail - remove a lesson without lesson ID', function() {
            const courseIds = CoursesSeeder(1);
            LessonsSeeder(1, courseIds[0]);

            assert.throws(() => { removeLesson._execute({}, {});
            }, 'Lesson ID is required');
        });
    });

    describe('Update Lesson', function() {
        it('success - update a lesson', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];

            updateLesson._execute({ userId: Random.id() }, { 
                lessonId: lessonId, 
                name: 'Lesson 2',
                startTime: moment().hours(1).minutes(0).toDate(),
                endTime: moment().hours(3).minutes(0).toDate(),
                date: moment().day(1).toDate(),
            });

            const updatedLesson = LessonsCollection.find().fetch()[0];
            assert.equal(updatedLesson.name, 'Lesson 2');
        });

        it('fail - update a lesson without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];

            assert.throws(() => {
               updateLesson._execute({}, { 
                    lessonId: lessonId,
                    name: 'Lesson 2',
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, Meteor.Error, 'You need to be logged in before updating a lesson');
        });

        it('fail - update a lesson without lesson ID', function() {
            const courseIds = CoursesSeeder(1);
            LessonsSeeder(1, courseIds[0]);

            assert.throws(() => {
                updateLesson._execute({}, { 
                    name: `Lesson 2`,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'Lesson ID is required');
        });

        it('fail - update a lesson without name', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];

            assert.throws(() => {
                updateLesson._execute({}, { 
                    lessonId: lessonId,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'Name is required');
        });

        it('fail - update a lesson without start time', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];

            assert.throws(() => {
                updateLesson._execute({}, { 
                    lessonId: lessonId,
                    name: `Lesson 2`,
                    endTime: moment().hours(3).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'Start time is required');
        });

        it('fail - update a lesson without end time', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];

            assert.throws(() => {
                updateLesson._execute({}, { 
                    lessonId: lessonId,
                    name: `Lesson 2`,
                    startTime: moment().hours(1).minutes(0).toDate(),
                    date: moment().day(1).toDate(),
                });
            }, 'End time is required');
        });
    });

    describe('Add Student Attendance', function() {
        it('success - add student attendance', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];
            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            updateAttendance._execute({ userId: Random.id() }, { lessonId: lessonId, studentId: studentId, action: 'add' });

            const updatedLesson = LessonsCollection.find().fetch()[0];
            assert.isNotNull(updatedLesson.studentAttendance);
            const studentAttendedIds = _.pluck(_.values(updatedLesson.studentAttendance), '_id');
            assert.include(studentAttendedIds, studentId);
        });

        it('fail - add student attendance without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];
            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            assert.throws(() => {
                updateAttendance._execute({}, { lessonId: lessonId, studentId: studentId, action: 'add' });
            }, Meteor.Error, "You need to be logged in before updating a student's attendance");
        });

        it('fail - add student attendance without lesson ID', function() {
            const courseIds = CoursesSeeder(1);
            LessonsSeeder(1, courseIds[0]);
            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            assert.throws(() => {
                updateAttendance._execute({}, { studentId: studentId, action: 'add' });
            }, "Lesson ID is required");
        });

        it('fail - add student attendance without student ID', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];

            assert.throws(() => {
                updateAttendance._execute({}, { lessonId: lessonId, action: 'add' });
            }, "Student ID is required");
        });

        it('fail - add student attendance without action', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];
            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            assert.throws(() => {
                lesson = LessonsCollection.find().fetch()[0];
                updateAttendance._execute({}, { lessonId: lessonId, studentId: studentId });
            }, "Action is required");
        });
    });

    describe('Remove Student Attendance', function() {
        it('success - remove student attendance', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];
            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            updateAttendance._execute({ userId: Random.id() }, { lessonId: lessonId, studentId: studentId, action: 'add' });
            updateAttendance._execute({ userId: Random.id() }, { lessonId: lessonId, studentId: studentId, action: 'remove' });

            const updated2Lesson = LessonsCollection.find().fetch()[0];
            assert.isEmpty(updated2Lesson.studentAttendance);
        });

        it('fail - remove student attendance without logging in', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];
            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            assert.throws(() => {
                updateAttendance._execute({}, { lessonId: lessonId, studentId: studentId, action: 'remove' });
            }, Meteor.Error, "You need to be logged in before updating a student's attendance");
        });

        it('fail - remove student attendance without lesson ID', function() {
            const courseIds = CoursesSeeder(1);
            LessonsSeeder(1, courseIds[0]);
            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            assert.throws(() => {
                updateAttendance._execute({}, { studentId: studentId, action: 'remove' });
            }, "Lesson ID is required");
        });

        it('fail - remove student attendance without student ID', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];

            assert.throws(() => {
                updateAttendance._execute({}, { lessonId: lessonId, action: 'remove' });
            }, "Student ID is required");
        });

        it('fail - remove student attendance without action', function() {
            const courseIds = CoursesSeeder(1);
            const lessonIds = LessonsSeeder(1, courseIds[0]);
            const lessonId = lessonIds[0];
            const studentIds = StudentsSeeder(1);
            const studentId = studentIds[0];

            assert.throws(() => {
                updateAttendance._execute({}, { lessonId: lessonId, studentId: studentId });
            }, "Action is required");
        });
    });
});