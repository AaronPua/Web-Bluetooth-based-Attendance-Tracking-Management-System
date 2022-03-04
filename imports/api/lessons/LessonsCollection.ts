import { createCollection } from 'meteor/quave:collections';
import SimpleSchema from 'simpl-schema';

const lessonSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    createdAt: { type: Date },
    course: { type: Array },
    'course.$': { type: Object, blackbox: true},
});

export const LessonsCollection = createCollection({
    name: 'lessons',
    schema: lessonSchema
});