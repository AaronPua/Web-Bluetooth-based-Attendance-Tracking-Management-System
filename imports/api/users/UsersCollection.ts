import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { createCollection } from 'meteor/quave:collections';

export const userSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    emails: { type: Array },
    'emails.$': { type: Object },
    'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
    'emails.$.verified': { type: Boolean },
    profile: { type: Object, blackbox: true },
    'profile.firstName': { type: String },
    'profile.lastName': { type: String },
    'profile.gender': { type: String, allowedValues: ['male', 'female'] },
    services: { type: Object, optional: true, blackbox: true },
    createdAt: { type: Date },
    courses: { type: Array, optional: true },
    'courses.$': { type: Object },
    'courses.$._id': { type: String },
});

export const userRegistrationSchema = new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    password: { type: String, min: 4 },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String, allowedValues: ['male', 'female'] }
});

export const userLoginSchema = userRegistrationSchema.pick('email', 'password');

export const UsersCollection = createCollection({
    instance: Meteor.users,
    schema: userSchema
})