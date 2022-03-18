import { Meteor } from 'meteor/meteor';
import { createCollection } from 'meteor/quave:collections';
import SimpleSchema from 'simpl-schema';

export const courseSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    credits: { type: Number },
    createdAt: { type: Date },
    instructors: { type: Array, optional: true },
    'instructors.$': { type: String },
});

export const courseCreateSchema = courseSchema.pick('name', 'credits');

export const CoursesCollection = createCollection({
    name: 'courses',
    schema: courseSchema
});