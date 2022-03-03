import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// const Roles:any = new Mongo.Collection('roles');

export const roleSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    createdAt: { type: Date },
});

// (<any>Meteor.roles).attach(roleSchema);