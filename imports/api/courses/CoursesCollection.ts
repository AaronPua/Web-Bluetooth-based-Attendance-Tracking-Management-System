// import { createCollection } from 'meteor/quave:collections';
import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';

export const CoursesCollection = new Mongo.Collection('courses');

export const courseSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    credits: { type: Number },
    createdAt: { type: Date },
});

CoursesCollection.attachSchema(courseSchema);

export const courseCreateSchema = courseSchema.pick('name', 'credits');

// export const CoursesCollection = createCollection({
//     name: 'courses',
//     schema: courseSchema
// });