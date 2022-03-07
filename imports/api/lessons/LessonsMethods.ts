import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import SimpleSchema from 'simpl-schema';
import { LessonsCollection } from './LessonsCollection';
import { Roles } from 'meteor/alanning:roles';

export const createLesson = new ValidatedMethod({
    name: 'lesson.create',
    mixins: [CallPromiseMixin],
    validate: null,
    applyOptions: { noRetry: true },
    run({_id, name, startTime, endTime, day, course}: any) {
        if(!this.userId) {
            throw new Meteor.Error("lesson-not-authorized",'Not authorized to create lesson');
        }


    }
});