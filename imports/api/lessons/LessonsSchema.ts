import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Lessons:any = new Mongo.Collection('lessons');

export const lessonSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    createdAt: { type: Date },
    course: { type: Array },
    'course.$': { type: Object, blackbox: true},
});

// Lessons.attach(lessonSchema);