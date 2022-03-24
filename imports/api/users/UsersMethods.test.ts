import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { faker } from '@faker-js/faker';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { registerUser } from './UsersMethods';
import _ from 'underscore';
import { UserSeeder, InstructorsSeeder, StudentsSeeder } from '/imports/server/seeders/UsersSeeder';
import { resetDatabase } from 'meteor/xolvio:cleaner';

describe('UsersMethods', function() {

    before(function() {
        resetDatabase();

        if(Meteor.roles.find().count() === 0) {
            Roles.createRole('admin');
            Roles.createRole('instructor');
            Roles.createRole('student');
        }
    });

    it('register a user', function() {
        const instructorIds = InstructorsSeeder(1);
        assert.equal(Meteor.users.find().count(), 1);
        assert.equal(Meteor.roleAssignment.find().count(), 1);

        const instructorId = _.first(instructorIds);
        const roleAssignment = Meteor.roleAssignment.find({ 'user._id': instructorId }).fetch();
        const assertUserId = _.first(_.pluck(_.pluck(roleAssignment, 'user'), '_id'));
        assert.equal(assertUserId, instructorId);
    });

    after(function() {
        resetDatabase();
    });
});