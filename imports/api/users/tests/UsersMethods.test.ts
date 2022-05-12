import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { faker } from '@faker-js/faker';
import { Roles } from 'meteor/alanning:roles';
import { addUserToRoles, isUserInRole, registerStudentUser, registerUser, removeUser,
            resendVerificationEmail, sendPasswordResetEmail, updateUser, updateUserAccount } from '../UsersMethods';
import _ from 'underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import '../UsersMethods';
import { Random } from 'meteor/random';
import { InstructorsSeeder } from '/imports/server/seeders/UsersSeeder';

describe('UsersMethods', function() {

    beforeEach(function() {
        resetDatabase();
    });

    after(function() {
        resetDatabase();
    });

    it('success - register a user/instructor', function() {
        if(!_.contains(Roles.getAllRoles(), 'instructor')) {
            Roles.createRole('instructor');
        }
        const instructorId = registerUser._execute({}, {
            email: faker.internet.email(),
            password: faker.lorem.word(5),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            gender: faker.name.gender(true).toLowerCase()
        });

        const instructor = Meteor.users.find().fetch()[0];
        assert.equal(instructor._id, instructorId);
    });

    it('success - register a student', function() {
        if(!_.contains(Roles.getAllRoles(), 'student')) {
            Roles.createRole('student');
        }
        const studentId = registerStudentUser._execute({}, {
            email: faker.internet.email(),
            password: faker.lorem.word(5),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            gender: faker.name.gender(true).toLowerCase()
        });

        const student = Meteor.users.find().fetch()[0];
        assert.equal(student._id, studentId);
    });

    it('fail - register a user without email', function () {
        assert.throws(() => {
            registerUser._execute({}, {
                password: faker.lorem.word(5),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                gender: faker.name.gender(true).toLowerCase()
            });
        }, 'Email is required');
    });

    it('fail - register a user without password', function () {
        assert.throws(() => {
            registerUser._execute({}, {
                email: faker.internet.email(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                gender: faker.name.gender(true).toLowerCase()
            });
        }, 'Password is required');
    });

    it('fail - register a user without first name', function () {
        assert.throws(() => {
            registerUser._execute({}, {
                email: faker.internet.email(),
                password: faker.lorem.word(5),
                lastName: faker.name.lastName(),
                gender: faker.name.gender(true).toLowerCase()
            });
        }, 'First name is required');
    });

    it('fail - register a user without email', function () {
        assert.throws(() => {
            registerUser._execute({}, {
                email: faker.internet.email(),
                password: faker.lorem.word(5),
                firstName: faker.name.firstName(),
                gender: faker.name.gender(true).toLowerCase()
            });
        }, 'Last name is required');
    });

    it('fail - register a user without gender', function () {
        assert.throws(() => {
            registerUser._execute({}, {
                email: faker.internet.email(),
                password: faker.lorem.word(5),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
            });
        }, 'Gender is required');
    });

    it('success - add user to a role', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        if(!_.contains(Roles.getAllRoles(), 'admin')) {
            Roles.createRole('admin');
        }
        
        addUserToRoles._execute({ userId: Random.id() }, { userId: instructorId, roleName: 'admin'});

        const roleAssignment = Meteor.roleAssignment.find({ 'role._id': 'admin' }).fetch();
        const assertUserId = _.first(_.pluck(_.pluck(roleAssignment, 'user'), '_id'));
        assert.equal(assertUserId, instructorId);
    });

    it('fail - add user to a role without ID', function() {
        assert.throws(() => {
             addUserToRoles._execute({ userId: Random.id() }, { roleName: 'admin' });
        }, 'User ID is required');
    });

    it('fail - add user to a role without role', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        assert.throws(() => {
             addUserToRoles._execute({ userId: Random.id() }, { userId: instructorId, });
        }, 'Role name is required');
    });

    it('success - check if user is in role', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        const result = isUserInRole._execute({ userId: Random.id() }, { userId: instructorId, roleName: 'instructor' });
        assert.equal(result, true);
    });

    it('fail - check if user is in role without user ID', function() {
        assert.throws(() => {
             isUserInRole._execute({ userId: Random.id() }, { roleName: 'instructor' });
        }, 'User ID is required');
    });

    it('fail - check if user is in role without role name', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        assert.throws(() => {
             isUserInRole._execute({ userId: Random.id() }, { userId: instructorId });
        }, 'Role name is required');
    });

    it('success - update user info', function() {
        InstructorsSeeder(1);

        const user = Meteor.users.find().fetch()[0];
        updateUser._execute({ userId: Random.id() }, {
            userId: user._id,
            email: 'test@test.com',
            firstName: 'test',
            lastName: 'person',
            gender: 'female',
            roles: [{ label: 'Instructor', value: 'instructor' }]
        });

        const updatedUser = Meteor.users.find().fetch()[0];
        assert.equal(updatedUser.emails[0].address, 'test@test.com');
        assert.equal(updatedUser.profile.firstName, 'test');
        assert.equal(updatedUser.profile.lastName, 'person');
        assert.equal(updatedUser.profile.gender, 'female');
    });

    it('fail - update user info without user ID', function() {
        assert.throws(() => {
            updateUser._execute({ userId: Random.id() }, {
                email: 'test@test.com',
                firstName: 'test',
                lastName: 'person',
                gender: 'female',
                roles: [{ label: 'Instructor', value: 'instructor' }]
            });
        }, 'User ID is required');
    });

    it('fail - update user info without email', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        assert.throws(() => {
            updateUser._execute({ userId: Random.id() }, {
                userId: instructorId,
                firstName: 'test',
                lastName: 'person',
                gender: 'female',
                roles: [{ label: 'Instructor', value: 'instructor' }]
            });
        }, 'Email is required');
    });

    it('fail - update user info without first name', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        assert.throws(() => {
            updateUser._execute({ userId: Random.id() }, {
                userId: instructorId,
                email: 'test@test.com',
                lastName: 'person',
                gender: 'female',
                roles: [{ label: 'Instructor', value: 'instructor' }]
            });
        }, 'First name is required');
    });

    it('fail - update user info without last name', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        assert.throws(() => {
            updateUser._execute({ userId: Random.id() }, {
                userId: instructorId,
                email: 'test@test.com',
                firstName: 'test',
                gender: 'female',
                roles: [{ label: 'Instructor', value: 'instructor' }]
            });
        }, 'Last name is required');
    });

    it('fail - update user info without gender', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        assert.throws(() => {
            updateUser._execute({ userId: Random.id() }, {
                userId: instructorId,
                email: 'test@test.com',
                firstName: 'test',
                lastName: 'person',
                roles: [{ label: 'Instructor', value: 'instructor' }]
            });
        }, 'Gender is required');
    });

    it('fail - update user info without roles', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        assert.throws(() => {
            updateUser._execute({ userId: Random.id() }, {
                userId: instructorId,
                email: 'test@test.com',
                firstName: 'test',
                lastName: 'person',
                gender: 'female',
            });
        }, 'Roles is required');
    });

    it('success - resend verification email', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];
        const instructor = Meteor.users.findOne(instructorId);

        const result = resendVerificationEmail._execute({ userId: Random.id() }, { email: instructor.emails[0].address });
        assert.equal(result, true);
    });

    it('fail - resend verification email to fake email address', function() {
        InstructorsSeeder(1);

        assert.throws(() => {
            resendVerificationEmail._execute({ userId: Random.id() }, { email: 'not_exist@test.com' });
        }, 'User not found according to this email address.');
    });

    it('success - resend password reset email', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];
        const instructor = Meteor.users.findOne(instructorId);

        const result = sendPasswordResetEmail._execute({ userId: Random.id() }, { email: instructor.emails[0].address });
        assert.equal(result, true);
    });

    it('fail - resend password reset email to fake email address', function() {
        InstructorsSeeder(1);

        assert.throws(() => {
            sendPasswordResetEmail._execute({ userId: Random.id() }, { email: 'not_exist@test.com' });
        }, 'User not found according to this email address.');
    });

    it('success - update user personal account info', function() {
        InstructorsSeeder(1);

        const user = Meteor.users.find().fetch()[0];
        updateUserAccount._execute({ userId: Random.id() }, {
            userId: user._id,
            email: 'test@test.com',
            firstName: 'test',
            lastName: 'person',
            gender: 'female',
        });

        const updatedUser = Meteor.users.find().fetch()[0];
        assert.equal(updatedUser.emails[0].address, 'test@test.com');
        assert.equal(updatedUser.profile.firstName, 'test');
        assert.equal(updatedUser.profile.lastName, 'person');
        assert.equal(updatedUser.profile.gender, 'female');
    });

    it('fail - update user personal account info without user ID', function() {
        assert.throws(() => {
            updateUserAccount._execute({ userId: Random.id() }, {
                email: 'test@test.com',
                firstName: 'test',
                lastName: 'person',
                gender: 'female'
            });
        }, 'User ID is required');
    });

    it('fail - update user personal account without email', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        assert.throws(() => {
            updateUserAccount._execute({ userId: Random.id() }, {
                userId: instructorId,
                firstName: 'test',
                lastName: 'person',
                gender: 'female'
            });
        }, 'Email is required');
    });

    it('fail - update user personal account info without first name', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        assert.throws(() => {
            updateUserAccount._execute({ userId: Random.id() }, {
                userId: instructorId,
                email: 'test@test.com',
                lastName: 'person',
                gender: 'female'
            });
        }, 'First name is required');
    });

    it('fail - update user personal account info without last name', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        assert.throws(() => {
            updateUserAccount._execute({ userId: Random.id() }, {
                userId: instructorId,
                email: 'test@test.com',
                firstName: 'test',
                gender: 'female'
            });
        }, 'Last name is required');
    });

    it('fail - update user personal account info without gender', function() {
        const instructorIds = InstructorsSeeder(1);
        const instructorId = instructorIds[0];

        assert.throws(() => {
            updateUserAccount._execute({ userId: Random.id() }, {
                userId: instructorId,
                email: 'test@test.com',
                firstName: 'test',
                lastName: 'person',
            });
        }, 'Gender is required');
    });

    it('success - remove user', function() {
        const instructorIds = InstructorsSeeder(2);
        const instructorId = instructorIds[0];

        removeUser._execute({ userId: Random.id() }, { userId: instructorId });

        const usersCount = Meteor.users.find().count();
        assert.equal(usersCount, 1);
    });

    it('fail - remove user without user ID', function() {
        InstructorsSeeder(1);

        assert.throws(() => {
            removeUser._execute({ userId: Random.id() }, { });
        }, 'User ID is required');
    });
});