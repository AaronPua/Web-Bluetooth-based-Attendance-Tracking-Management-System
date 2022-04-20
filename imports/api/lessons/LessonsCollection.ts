import { createCollection } from 'meteor/quave:collections';
import SimpleSchema from 'simpl-schema';

const lessonSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    courseId: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    date: { type: Date },
    createdAt: { type: Date },
    studentAttendance: { type: Array, optional: true },
    "studentAttendance.$": { type: Object },
    "studentAttendance.$._id": { type: String },
});

export const lessonCreateSchema = lessonSchema.pick('courseId', 'name', 'startTime', 'endTime', 'date', 'studentAttendance');

export const LessonsCollection = createCollection({
    name: 'lessons',
    schema: lessonSchema
});