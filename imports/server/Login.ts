import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

Accounts.validateLoginAttempt((options: any) => {
    if (!options.allowed) {
        return false;
    }

    if (options.user.emails[0].verified === true) {
        return true;
    } else {
        throw new Meteor.Error('email-not-verified', 'You must verify your email address before you can log in');
    }
});
