import { createCollection } from 'meteor/quave:collections';
import SimpleSchema from 'simpl-schema';

export const courseSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    code: { type: String },
    createdAt: { type: Date },
    users: { type: Array },
    'users.$': { type: Object },
    'users.$._id': { type: Object },
    lessons: { type: Array },
    'lessons.$': { type: Object },
    'lessons.$._id': { type: Object },
});

export const CoursesCollection = createCollection({
    name: 'courses',
    schema: courseSchema
});