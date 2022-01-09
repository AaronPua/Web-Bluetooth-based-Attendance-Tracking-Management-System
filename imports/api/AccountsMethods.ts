import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { userRegistrationSchema } from '/imports/schema/UsersSchema';
import { Accounts } from 'meteor/accounts-base';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

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
    run({email, password, first_name, last_name, gender}: any) {
        Accounts.createUser({
            email: email,
            password: password,
            profile: {
                firstName: first_name,
                lastName: last_name,
                gender: gender
            }
        });

        return Meteor.userId();
    }
});

export const verifyLogin = new ValidatedMethod({
    name: 'users.verifyLogin',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        email: { type: String, regEx: SimpleSchema.RegEx.Email },
        password: { type: String, min: 4 },
    }, { check }).validator({ clean: true }),
    // applyOptions: { noRetry: true },
    run({email, password}: {email: string, password: string}) {
        return [email, password];
    }
});

export const verifyEmail = new ValidatedMethod({
    name: 'users.verifyEmail',
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

Meteor.methods({
    'users.testVerifyLogin'({email, password}: {email: string, password: string}) {
        const loginSchema = new SimpleSchema({
            email: { type: String, regEx: SimpleSchema.RegEx.Email },
            password: { type: String, min: 4 },
        }).newContext();

        loginSchema.validate([email, password]);
        if(!loginSchema.isValid) {
            console.log(loginSchema.validationErrors());
        }

        return [email, password];
    }
});