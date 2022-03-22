import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { faker } from '@faker-js/faker';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { registerUser } from './UsersMethods';
import _ from 'underscore';
import { UserSeeder, InstructorsSeeder, StudentsSeeder } from '/imports/server/seeders/UsersSeeder';

describe('users', function() {

    const createInstructor = () => {
        const userId = Accounts.createUser({
            email: faker.internet.email(),
            password: faker.random.word(),
            profile: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                gender: faker.name.gender(true)
            }
        });
        if(userId) {
            Roles.addUsersToRoles(userId, 'instructor');
        }
        return userId;
    }

    before(function() {
        Meteor.users.remove({});
        Meteor.roleAssignment.remove({});

        Meteor.roles.remove({});
        Roles.createRole('admin');
        Roles.createRole('instructor');
        Roles.createRole('student');
    });

    describe('methods', function() {
        it('register a user', function() {
            const instructorIds = InstructorsSeeder(1);
            assert.equal(Meteor.users.find().count(), 1);
            assert.equal(Meteor.roleAssignment.find().count(), 1);

            const instructorId = _.first(instructorIds);
            const roleAssignment = Meteor.roleAssignment.find({ 'user._id': instructorId }).fetch();
            const assertUserId = _.first(_.pluck(_.pluck(roleAssignment, 'user'), '_id'));
            assert.equal(assertUserId, instructorId);
        });
    });

    afterEach(function() {
        Meteor.users.remove({});
        Meteor.roleAssignment.remove({});
    });
});