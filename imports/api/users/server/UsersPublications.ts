import { Meteor } from 'meteor/meteor';

Meteor.publish('users.all', function getAllUsers() {
    return Meteor.users.find({});
})