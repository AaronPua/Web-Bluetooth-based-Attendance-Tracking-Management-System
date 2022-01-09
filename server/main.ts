import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '../imports/api/AccountsMethods';
import '../imports/schema/ValidationMessage';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Accounts.config({
    sendVerificationEmail: true
});

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
});
