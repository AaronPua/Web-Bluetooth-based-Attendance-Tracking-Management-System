import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/index';
import { Roles } from 'meteor/alanning:roles';

Meteor.startup(() => {
    if(Meteor.roles.find().count() === 0) {
        Roles.createRole('admin');
        Roles.createRole('instructor');
        Roles.createRole('student');
    }
});
