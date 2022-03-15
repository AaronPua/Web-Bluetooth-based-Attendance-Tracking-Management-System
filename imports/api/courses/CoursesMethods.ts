import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { CoursesCollection } from './CoursesCollection';
import { courseCreateSchema } from './CoursesCollection';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';

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
    run({ courseId, name, credits }: any) {
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
        courseId: { type: String },
        studentId: { type: String },
    }).validator(),
    run({ courseId, studentId }: any) {
        Meteor.users.update({ _id: studentId }, {
            $addToSet: { "courses": courseId }
        });
    }
});