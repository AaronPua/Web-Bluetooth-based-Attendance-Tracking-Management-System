import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { lessonCreateSchema, LessonsCollection } from './LessonsCollection';
import SimpleSchema from 'simpl-schema';

export const createLesson = new ValidatedMethod({
    name: 'lesson.create',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before creating a lesson.',
    },
    validate: lessonCreateSchema.validator(),
    run({ courseId, name, startTime, endTime, date }:
        { courseId: string, name:string, startTime: Date, endTime: Date, date: Date }) {
        LessonsCollection.insert({
            courseId: courseId,
            name: name,
            startTime: startTime,
            endTime: endTime,
            date: date,
            createdAt: new Date()
        });
    }
});

export const removeLesson = new ValidatedMethod({
    name: 'lesson.remove',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before removing a lesson.',
    },
    validate: new SimpleSchema({
        lessonId: { type: String }
    }).validator(),
    run({ lessonId }: { lessonId: string }) {
        LessonsCollection.remove(lessonId);
    }
});

export const updateLesson = new ValidatedMethod({
    name: 'lesson.update',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before updating a lesson.',
    },
    validate: new SimpleSchema({
        lessonId: { type: String, regEx: SimpleSchema.RegEx.Id },
        name: { type: String },
        startTime: { type: Date },
        endTime: { type: Date },
        date: { type: Date }
    }).validator(),
    run({ lessonId, name, startTime, endTime, date }: 
        { lessonId: string, name:string, startTime: Date, endTime: Date, date: Date }) {
        LessonsCollection.update({ _id: lessonId }, {
            $set: {
                name: name,
                startTime: startTime,
                endTime: endTime,
                date: date,
            }
        });
    }
});

export const updateAttendance = new ValidatedMethod({
    name: 'lesson.updateAttendance',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: "You need to be logged in before updating a student's attendance.",
    },
    validate: new SimpleSchema({
        lessonId: { type: String },
        studentId: { type: String },
        action: { type: String, allowedValues: ['add', 'remove'] }
    }).validator(),
    run({ lessonId, studentId, action }: { lessonId: string, studentId: string, action: string }) {
        if(action === 'add') {
            LessonsCollection.update({ _id: lessonId }, {
                $addToSet: { studentAttendance: { _id: studentId } }
            });
        }
        if(action === 'remove') {
            LessonsCollection.update({ _id: lessonId }, {
                $pull: { studentAttendance: { _id: studentId } }
            });
        }
    }
});