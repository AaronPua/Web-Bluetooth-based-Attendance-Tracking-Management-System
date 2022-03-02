import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Lessons:any = new Mongo.Collection('lesson');

export const lessonSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    start_time: { type: Date },
    end_time: { type: Date },
    createdAt: { type: Date },
    course: { type: Array },
    'course.$': { type: String, regEx: SimpleSchema.RegEx.Id },
    lessons: { type: Array },
    'lessons.$': { type: String, regEx: SimpleSchema.RegEx.Id }
});

Lessons.attach(lessonSchema);