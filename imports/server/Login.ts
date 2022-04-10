import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles'

Accounts.validateLoginAttempt((options: any) => {
    if (!options.allowed) {
        return false;
    }

    if(Roles.userIsInRole(options.user, 'student')) {
        throw new Meteor.Error('student-not-allowed', 'You do not have access to login');
    }

    if (options.user.emails[0].verified === true) {
        return true;
    } else {
        throw new Meteor.Error('email-not-verified', 'You must verify your email address before you can log in');
    }
});
