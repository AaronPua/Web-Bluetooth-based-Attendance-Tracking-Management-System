import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { userRegistrationSchema } from './UsersSchema';

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
            Roles.addUsersToRoles(userId, 'instructor')
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