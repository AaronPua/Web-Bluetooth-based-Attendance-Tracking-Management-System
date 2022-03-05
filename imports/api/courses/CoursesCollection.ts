import { Meteor } from 'meteor/meteor';
import { createCollection } from 'meteor/quave:collections';
import SimpleSchema from 'simpl-schema';

export const courseSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    credits: { type: Number },
    createdAt: { type: Date },
    users: { type: Array, optional: true, blackbox: true },
    'users.$': { type: Object },
    'users.$._id': { type: String, regEx: SimpleSchema.RegEx.Id },
    lessons: { type: Array, optional: true },
    'lessons.$': { type: Object, optional: true, blackbox: true  },
    'lessons.$._id': { type: String, regEx: SimpleSchema.RegEx.Id },
});

const CoursesCollection = createCollection({
    name: 'courses',
    schema: courseSchema
});

if(!Meteor.courses) {
    Meteor.courses = CoursesCollection;
}