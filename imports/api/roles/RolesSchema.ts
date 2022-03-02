import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Roles:any = new Mongo.Collection('roles');

export const roleSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    code: { type: String },
    createdAt: { type: Date },
    users: { type: Array },
    'users.$': { type: String, regEx: SimpleSchema.RegEx.Id },
    lessons: { type: Array },
    'lessons.$': { type: String, regEx: SimpleSchema.RegEx.Id }
});

Roles.attach(roleSchema);