import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { userRegistrationSchema } from './UsersCollection';

SimpleSchema.defineValidationErrorTransform(error => {
    const ddpError = new Meteor.Error(error.message);
    ddpError.error = 'validation-error';
    ddpError.details = error.details;
    return ddpError;
});

export const registerUser = new ValidatedMethod({
    name: 'users.registerUser',
    mixins: [CallPromiseMixin],
    validate: userRegistrationSchema.validator(),
    run({ email, password, firstName, lastName, gender }: 
        { email: string, password: string, firstName: string, lastName: string, gender: string }) {
        const userId = Accounts.createUser({
            email: email,
            password: password,
            profile: {
                firstName: firstName,
                lastName: lastName,
                gender: gender
            }
        });

        if(userId) {
            Roles.addUsersToRoles(userId, 'instructor');
            Accounts.sendVerificationEmail(userId);
        }
        return userId;
    }
});

export const registerStudentUser = new ValidatedMethod({
    name: 'users.registerStudentUser',
    mixins: [CallPromiseMixin],
    validate: userRegistrationSchema.validator(),
    run({ email, password, firstName, lastName, gender }: 
        { email: string, password: string, firstName: string, lastName: string, gender: string }) {
        const userId = Accounts.createUser({
            email: email,
            password: password,
            profile: {
                firstName: firstName,
                lastName: lastName,
                gender: gender
            }
        });

        if(userId) {
            Roles.addUsersToRoles(userId, 'student');
            Accounts.sendVerificationEmail(userId);
        }
        return userId;
    }
});

export const resendVerificationEmail = new ValidatedMethod({
    name: 'users.resendVerificationEmail',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        email: { type: String, regEx: SimpleSchema.RegEx.Email }
    }).validator(),
    run({ email }: { email: string }) {
        if(Meteor.isServer) {
            const user = Accounts.findUserByEmail(email);

            if(user)
                Accounts.sendVerificationEmail(user._id);
            else
                throw new Meteor.Error("user-not-found", "User not found according to this email address.");
        }
    }
});

export const sendPasswordResetEmail = new ValidatedMethod({
    name: 'users.sendPasswordResetEmail',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        email: { type: String, regEx: SimpleSchema.RegEx.Email }
    }).validator(),
    run({ email }: { email: string }) {
        if(Meteor.isServer) {
            const user = Accounts.findUserByEmail(email);

            if(user)
                Accounts.sendResetPasswordEmail(user._id);
            else
                throw new Meteor.Error("user-not-found", "User not found according to this email address.");
        }
    }
});

export const changePassword = new ValidatedMethod({
    name: 'users.changePassword',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        oldPassword: { type: String },
        newPassword: { type: String },
    }).validator(),
    run({ oldPassword, newPassword }: { oldPassword: string, newPassword: string }) {
        if(!Meteor.userId) {
            throw new Meteor.Error("not-logged-in", 'You need to be logged in before changing your password.')
        }
        Accounts.setPassword(oldPassword, newPassword);
    }
});

export const addUserToRoles = new ValidatedMethod({
    name: 'users.addUserToRoles',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        userId: { type: String, regEx: SimpleSchema.RegEx.Id },
        roleName: { type: String },
    }).validator(),
    run({ userId, roleName }: { userId: string, roleName: string | string[] }) {
        Roles.addUsersToRoles(userId, roleName);
    }
});

export const updateUser = new ValidatedMethod({
    name: 'users.updateUser',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before updating a user.',
    },
    validate: new SimpleSchema({
        userId: { type: String, regEx: SimpleSchema.RegEx.Id },
        email: { type: String, regEx: SimpleSchema.RegEx.Email },
        firstName: { type: String },
        lastName: { type: String },
        gender: { type: String },
    }).validator(),
    run({ userId, email, firstName, lastName, gender }: 
        { userId: string, email: string, firstName: string, lastName: string, gender: string }) {
        Meteor.users.update({ _id: userId }, {
            $set: {
                "emails.0.address": email,
                "profile.firstName": firstName,
                "profile.lastName": lastName,
                "profile.gender": gender,
            }
        });
    }
});

export const isUserInRole = new ValidatedMethod({
    name: 'users.isUserInRole',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        userId: { type: String, regEx: SimpleSchema.RegEx.Id },
        roleName: { type: String },
    }).validator(),
    run({ userId, roleName }: { userId: string, roleName: string }) {
        return Roles.userIsInRole(userId, roleName);
    }
});