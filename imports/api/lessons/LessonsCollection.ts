import { Meteor } from 'meteor/meteor';
import { createCollection } from 'meteor/quave:collections';
import SimpleSchema from 'simpl-schema';

const lessonSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    day: { type: String },
    createdAt: { type: Date },
    course: { type: Array, optional: true },
    'course.$': { type: Object, blackbox: true, optional: true },
    'course.$._id': { type: String, regEx: SimpleSchema.RegEx.Id },
});

export const LessonsCollection = createCollection({
    name: 'lessons',
    schema: lessonSchema
});

if(!Meteor.lessons) {
    Meteor.lessons = LessonsCollection;
}