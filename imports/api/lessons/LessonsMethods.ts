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
    applyOptions: { noRetry: true },
    run({ courseId, name, startTime, endTime, date }: any) {
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
    applyOptions: { noRetry: true },
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
    applyOptions: { noRetry: true },
    run({ lessonId, name, startTime, endTime, date }: any) {
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