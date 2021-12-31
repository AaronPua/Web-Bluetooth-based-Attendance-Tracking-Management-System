import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
    'users.register'([options]) {
        new SimpleSchema({
            email: String,
            password: String
        }).validate([options]);
    }
});

export const registerUser = new ValidatedMethod({

});