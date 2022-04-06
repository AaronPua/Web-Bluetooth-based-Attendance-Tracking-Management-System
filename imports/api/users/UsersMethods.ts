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
    applyOptions: { noRetry: true },
    run({model}: any) {
        const userId = Accounts.createUser({
            email: model.email,
            password: model.password,
            profile: {
                firstName: model.firstName,
                lastName: model.lastName,
                gender: model.gender
            }
        });

        if(userId) {
            Roles.addUsersToRoles(userId, 'instructor');
            Accounts.sendVerificationEmail(userId);
        }
        return userId;
    }
});

export const resendVerificationEmail = new ValidatedMethod({
    name: 'users.resendVerificationEmail',
    mixins: [CallPromiseMixin],
    validate: null,
    applyOptions: { noRetry: true },
    run({model}: any) {
        if(Meteor.isServer) {
            var user = Accounts.findUserByEmail(model.email);

            if(user)
                Accounts.sendVerificationEmail(user._id);
            else
                throw new Meteor.Error("User not found", "User not found according to this email address.");   
        }
    }
});

export const sendPasswordResetEmail = new ValidatedMethod({
    name: 'users.sendPasswordResetEmail',
    mixins: [CallPromiseMixin],
    validate: null,
    applyOptions: { noRetry: true },
    run({model}: any) {
        if(Meteor.isServer) {
            var user = Accounts.findUserByEmail(model.email);

            if(user)
                Accounts.sendResetPasswordEmail(user._id);
            else
                throw new Meteor.Error("User not found", "User not found according to this email address.");   
        }
    }
});

export const updatePassword = new ValidatedMethod({
    name: 'users.updatePassword',
    mixins: [CallPromiseMixin],
    validate: null,
    applyOptions: { noRetry: true },
    run({model}: any) {
        
    }
});

export const addUserToRoles = new ValidatedMethod({
    name: 'users.addUserToRoles',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        userId: { type: String },
        roleName: { type: String },
    }).validator(),
    run({userId, roleName}: any) {
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
        userId: { type: String },
        email: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        gender: { type: String },
    }).validator(),
    run({userId, email, firstName, lastName, gender}: any) {
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