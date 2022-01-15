import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import SimpleSchema from 'simpl-schema';

SimpleSchema.defineValidationErrorTransform(error => {
    const ddpError = new Meteor.Error(error.message);
    ddpError.error = 'validation-error';
    ddpError.details = error.details;
    return ddpError;
});

export const registerUser = new ValidatedMethod({
    name: 'users.registerUser',
    mixins: [CallPromiseMixin],
    validate: null,
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

        if(userId)
            Accounts.sendVerificationEmail(userId);
    }
});

export const resendVerificationEmail = new ValidatedMethod({
    name: 'users.resendVerificationEmail',
    mixins: [CallPromiseMixin],
    validate: null,
    applyOptions: { noRetry: true },
    run() {
        Accounts.onEmailVerificationLink((token: string, done: Function) => {
            Accounts.verifyEmail(token, (error: any) => {
                if(error) {
                    // handle error
                }
                done();
            })
        }); 
    }
});