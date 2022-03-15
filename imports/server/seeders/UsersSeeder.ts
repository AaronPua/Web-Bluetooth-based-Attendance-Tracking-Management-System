import seeder from '@cleverbeagle/seeder';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

export const UserSeeder = (resetCollection: boolean, seedIfExistingData: boolean) => seeder(Meteor.users, {
    resetCollection: resetCollection,
    seedIfExistingData: seedIfExistingData,
    environments: ['development', 'staging'],
    data: {
        dynamic: {
            count: 5,
            seed(iteration: any, faker: any) {
                return {
                    email: `student${iteration + 1}@test.com`,
                    password: 'test',
                    profile: {
                        // firstName: faker.name.firstName(),
                        // lastName: faker.name.lastName(),
                        firstName: 'Student',
                        lastName: `${iteration + 1}`,
                        gender: 'male'
                    },
                    roles: ['student']
                };
            }
        }
    }
});

export const InstructorsSeeder = () => {
    const users = [
        { email: 'instructor1@test.com', password: 'test', profile: { firstName: 'Instructor', lastName: '1', gender: 'male' }, },
        { email: 'instructor2@test.com', password: 'test', profile: { firstName: 'Instructor', lastName: '2', gender: 'male' }, },
        { email: 'instructor3@test.com', password: 'test', profile: { firstName: 'Instructor', lastName: '3', gender: 'male' }, },
        { email: 'instructor4@test.com', password: 'test', profile: { firstName: 'Instructor', lastName: '4', gender: 'male' }, },
        { email: 'instructor5@test.com', password: 'test', profile: { firstName: 'Instructor', lastName: '5', gender: 'male' }, },
    ]

    users.forEach(function (user) {
        const userId = Accounts.createUser({
            email: user.email,
            password: user.password,
            profile: { firstName: user.profile.firstName, lastName: user.profile.lastName, gender: user.profile.gender }
        });

        Roles.addUsersToRoles(userId, 'instructor');
    });
}

export const StudentsSeeder = () => {
    const users = [
        { email: 'student1@test.com', password: 'test', profile: { firstName: 'Student', lastName: '1', gender: 'male' }, },
        { email: 'student2@test.com', password: 'test', profile: { firstName: 'Student', lastName: '2', gender: 'male' }, },
        { email: 'student3@test.com', password: 'test', profile: { firstName: 'Student', lastName: '3', gender: 'male' }, },
        { email: 'student4@test.com', password: 'test', profile: { firstName: 'Student', lastName: '4', gender: 'male' }, },
        { email: 'student5@test.com', password: 'test', profile: { firstName: 'Student', lastName: '5', gender: 'male' }, },
    ]

    users.forEach(function (user) {
        const userId = Accounts.createUser({
            email: user.email,
            password: user.password,
            profile: { firstName: user.profile.firstName, lastName: user.profile.lastName, gender: user.profile.gender }
        });

        Roles.addUsersToRoles(userId, 'student');
    });
}