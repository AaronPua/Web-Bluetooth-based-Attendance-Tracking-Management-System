import SimpleSchema from 'simpl-schema';

export const userSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    emails: { type: Array },
    'emails.$': { type: Object },
    'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
    'emails.$.verified': { type: Boolean },
    createdAt: { type: Date },
    services: { type: Object, optional: true, blackbox: true },
    profile: { type: Object, blackbox: true },
    'profile.first_name': { type: String },
    'profile.last_name': { type: String },
    'profile.gender': { type: String, allowedValues: ['male', 'female'] },
});

export const userRegistrationSchema = new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    password: { type: String, min: 4 },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String, allowedValues: ['male', 'female'] }
});

export const userLoginSchema = userRegistrationSchema.pick('email', 'password');

export const userVerificationEmailSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    email: { type: String, regEx: SimpleSchema.RegEx.Email }
});