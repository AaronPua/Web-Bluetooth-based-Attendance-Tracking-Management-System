import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { faker } from '@faker-js/faker';
import { Roles } from 'meteor/alanning:roles';
import { addUserToRoles, isUserInRole, registerStudentUser, registerUser, updateUser } from '../UsersMethods';
import _ from 'underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import '../UsersMethods';
import { Random } from 'meteor/random';
import { InstructorsSeeder } from '/imports/server/seeders/UsersSeeder';

describe('UsersMethods', function() {

    let instructorId: string, studentId: string;

    before(function() {
        resetDatabase();

        if(Meteor.roles.find().count() === 0) {
            Roles.createRole('admin');
            Roles.createRole('instructor');
            Roles.createRole('student');
        }
    });

    it('success - register a user/instructor', function() {
        instructorId = registerUser._execute({}, {
            email: faker.internet.email(),
            password: faker.lorem.word(5),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            gender: faker.name.gender(true).toLowerCase()
        });

        const roleAssignment = Meteor.roleAssignment.find({ 'role._id': 'instructor' }).fetch();
        const assertUserId = _.first(_.pluck(_.pluck(roleAssignment, 'user'), '_id'));
        assert.equal(assertUserId, instructorId);
    });

    it('success - register a student', function() {
        studentId = registerStudentUser._execute({}, {
            email: faker.internet.email(),
            password: faker.lorem.word(5),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            gender: faker.name.gender(true).toLowerCase()
        });

        const roleAssignment = Meteor.roleAssignment.find({ 'role._id': 'student' }).fetch();
        const assertUserId = _.first(_.pluck(_.pluck(roleAssignment, 'user'), '_id'));
        assert.equal(assertUserId, studentId);
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

    it('fail - register a user without email', function () {
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
        assert.throws(() => {
             addUserToRoles._execute({ userId: Random.id() }, { userId: instructorId, });
        }, 'Role name is required');
    });

    it('success - check if user is in role', function() {
        const result = isUserInRole._execute({ userId: Random.id() }, { userId: instructorId, roleName: 'admin'});
        assert.equal(result, true);
    });

    it('success - update user info', function() {
        InstructorsSeeder(1);
        let user = Meteor.users.find().fetch()[0];
        updateUser._execute({ userId: Random.id() }, {
            userId: user._id,
            email: 'test@test.com',
            firstName: 'test',
            lastName: 'person',
            gender: 'female',
            roles: [{ label: 'Instructor', value: 'instructor' }]
        });
        user = Meteor.users.find().fetch()[0];
        assert.equal(user.emails[0].address, 'test@test.com');
        assert.equal(user.profile.firstName, 'test');
        assert.equal(user.profile.lastName, 'person');
        assert.equal(user.profile.gender, 'female');
    });

    it('fail - update user info without user ID', function() {
        assert.throws(() => {
            updateUser._execute({ userId: Random.id() }, {
                email: 'test@test.com',
                firstName: 'test',
                lastName: 'person',
                gender: 'female'
            });
        }, 'User ID is required');
    });

    it('fail - update user info without email', function() {
        let user = Meteor.users.find().fetch()[0];
        assert.throws(() => {
            updateUser._execute({ userId: Random.id() }, {
                userId: user._id,
                firstName: 'test',
                lastName: 'person',
                gender: 'female'
            });
        }, 'Email is required');
    });

    it('fail - update user info without first name', function() {
        let user = Meteor.users.find().fetch()[0];
        assert.throws(() => {
            updateUser._execute({ userId: Random.id() }, {
                userId: user._id,
                email: 'test@test.com',
                lastName: 'person',
                gender: 'female'
            });
        }, 'First name is required');
    });

    it('fail - update user info without last name', function() {
        let user = Meteor.users.find().fetch()[0];
        assert.throws(() => {
            updateUser._execute({ userId: Random.id() }, {
                userId: user._id,
                email: 'test@test.com',
                firstName: 'test',
                gender: 'female'
            });
        }, 'Last name is required');
    });

    it('fail - update user info without gender', function() {
        let user = Meteor.users.find().fetch()[0];
        assert.throws(() => {
            updateUser._execute({ userId: Random.id() }, {
                userId: user._id,
                email: 'test@test.com',
                firstName: 'test',
                lastName: 'person',
            });
        }, 'Gender is required');
    });

    after(function() {
        resetDatabase();
    });
});