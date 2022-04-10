import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { CoursesCollection, courseCreateSchema } from './CoursesCollection';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { LessonsCollection } from '../lessons/LessonsCollection';
import { updateAttendance } from '../lessons/LessonsMethods';
import _ from 'underscore';

export const createCourse = new ValidatedMethod({
    name: 'course.create',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before creating a course.',
    },
    validate: courseCreateSchema.validator(),
    run({ name, credits }: { name: string, credits: number }) {
        CoursesCollection.insert({
            name: name,
            credits: credits,
            createdAt: new Date()
        });
    }
});

export const removeCourse = new ValidatedMethod({
    name: 'course.remove',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before removing a course.',
    },
    validate: new SimpleSchema({
        courseId: { type: String, regEx: SimpleSchema.RegEx.Id }
    }).validator(),
    run({ courseId }: { courseId: string }) {
        CoursesCollection.remove(courseId);
    }
});

export const updateCourse = new ValidatedMethod({
    name: 'course.update',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before updating a course.',
    },
    validate: new SimpleSchema({
        courseId: { type: String, regEx: SimpleSchema.RegEx.Id },
        name: { type: String },
        credits: { type: Number },
    }).validator(),
    run({ courseId, name, credits }: { courseId: string, name: string, credits: string }) {
        CoursesCollection.update({ _id: courseId }, { 
            $set: { 
                name: name, 
                credits: credits 
            }
        });
    }
});

export const addStudentToCourse = new ValidatedMethod({
    name: 'course.addStudentsToCourse',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before adding students to a course.',
    },
    validate: new SimpleSchema({
        courseId: { type: String, regEx: SimpleSchema.RegEx.Id },
        studentId: { type: String, regEx: SimpleSchema.RegEx.Id },
    }).validator(),
    run({ courseId, studentId }: { courseId: string, studentId: string }) {
        Meteor.users.update({ _id: studentId }, {
            $addToSet: { courses: { _id: courseId } }
        });
    }
});

export const removeStudentFromCourse = new ValidatedMethod({
    name: 'course.removeStudentFromCourse',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before removing students from a course.',
    },
    validate: new SimpleSchema({
        courseId: { type: String, regEx: SimpleSchema.RegEx.Id },
        studentId: { type: String, regEx: SimpleSchema.RegEx.Id },
    }).validator(),
    run({ courseId, studentId }: { courseId: string, studentId: string }) {
        Meteor.users.update({ _id: studentId }, {
            $pull: { courses: { _id: courseId } }
        });

        const lessons = LessonsCollection.find({ courseId: courseId }).fetch();
        const lessonIds = _.pluck(lessons, '_id');

        _.each(lessonIds, (lessonId) => {
            updateAttendance.callPromise({
                lessonId: lessonId,
                studentId: studentId,
                action: 'remove'
            });
        });
    }
});

export const addInstructorToCourse = new ValidatedMethod({
    name: 'course.addInstructorToCourse',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before adding instructors to a course.',
    },
    validate: new SimpleSchema({
        courseId: { type: String, regEx: SimpleSchema.RegEx.Id },
        instructorId: { type: String, regEx: SimpleSchema.RegEx.Id },
    }).validator(),
    run({ courseId, instructorId }: { courseId: string, instructorId: string }) {
        Meteor.users.update({ _id: instructorId }, {
            $addToSet: { courses: { _id: courseId } }
        });
    }
});

export const removeInstructorFromCourse = new ValidatedMethod({
    name: 'course.removeInstructorFromCourse',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before removing instructors from a course.',
    },
    validate: new SimpleSchema({
        courseId: { type: String, regEx: SimpleSchema.RegEx.Id },
        instructorId: { type: String, regEx: SimpleSchema.RegEx.Id },
    }).validator(),
    run({ courseId, instructorId }: { courseId: string, instructorId: string }) {
       Meteor.users.update({ _id: instructorId }, {
            $pull: { courses: { _id: courseId } }
        });
    }
});