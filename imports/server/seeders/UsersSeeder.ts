import seeder from '@cleverbeagle/seeder';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { faker } from '@faker-js/faker';

export const InstructorSeeder = (resetCollection: boolean, seedIfExistingData: boolean, count: number) => seeder(Meteor.users, {
    resetCollection: resetCollection,
    seedIfExistingData: seedIfExistingData,
    environments: ['development', 'staging'],
    data: {
        dynamic: {
            count: count,
            seed(iteration: any, faker: any) {
                return {
                    email: `instructor${iteration + 1}@test.com`,
                    password: 'test',
                    profile: {
                        // firstName: faker.name.firstName(),
                        // lastName: faker.name.lastName(),
                        firstName: 'Instructor',
                        lastName: `${iteration + 1}`,
                        gender: 'male'
                    },
                    roles: ['instructor']
                };
            }
        }
    }
});

export const StudentSeeder = (resetCollection: boolean, seedIfExistingData: boolean, count: number) => seeder(Meteor.users, {
    resetCollection: resetCollection,
    seedIfExistingData: seedIfExistingData,
    environments: ['development', 'staging'],
    data: {
        dynamic: {
            count: count,
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

export const InstructorsSeeder = (iteration: any) => {
    let instructorIds: Array<String> = [];

    for(let i = 0; i < iteration; i++) {
        const userId = Accounts.createUser({
            email: faker.internet.email(), 
            password: 'test', 
            profile: { 
                firstName: faker.name.firstName("male"), 
                lastName: faker.name.lastName("male"),
                gender: 'male' 
            }
        });

        Roles.addUsersToRoles(userId, 'instructor');
        instructorIds.push(userId);
    }

    return instructorIds;
}

export const StudentsSeeder = (iteration: any) => {
    let studentIds: Array<String> = [];

    for(let i = 0; i < iteration; i++) {
        const userId = Accounts.createUser({
            email: faker.internet.email(), 
            password: 'test', 
            profile: { 
                firstName: faker.name.firstName("male"), 
                lastName: faker.name.lastName("male"), 
                gender: 'male' 
            }
        });

        Roles.addUsersToRoles(userId, 'student');
        studentIds.push(userId);
    }
    return studentIds;
}

export const createInstructors = () => {
    const users = [
        { email: 'instructor1@test.com', password: 'test', profile: { firstName: 'Instructor', lastName: 1, gender: 'male' } },
        { email: 'instructor2@test.com', password: 'test', profile: { firstName: 'Instructor', lastName: 2, gender: 'male' } },
        { email: 'instructor3@test.com', password: 'test', profile: { firstName: 'Instructor', lastName: 3, gender: 'male' } },
        { email: 'instructor4@test.com', password: 'test', profile: { firstName: 'Instructor', lastName: 4, gender: 'male' } },
        { email: 'instructor5@test.com', password: 'test', profile: { firstName: 'Instructor', lastName: 5, gender: 'male' } },
    ]

    let userIds: string[] = [];

    users.forEach((user) => {
        const userId = Accounts.createUser({
            email: user.email,
            password: user.password,
            profile: { 
                firstName: user.profile.firstName, lastName: user.profile.lastName, gender: user.profile.gender
            }
        });
        Roles.addUsersToRoles(userId, 'instructor');
        userIds.push(userId);
    })
    
    return userIds;
}

export const createStudents = () => {
    const users = [
        { email: 'student1@test.com', password: 'test', profile: { firstName: 'Student', lastName: 1, gender: 'male' } },
        { email: 'student2@test.com', password: 'test', profile: { firstName: 'Student', lastName: 2, gender: 'male' } },
        { email: 'student3@test.com', password: 'test', profile: { firstName: 'Student', lastName: 3, gender: 'male' } },
        { email: 'student4@test.com', password: 'test', profile: { firstName: 'Student', lastName: 4, gender: 'male' } },
        { email: 'student5@test.com', password: 'test', profile: { firstName: 'Student', lastName: 5, gender: 'male' } },
    ]

    let userIds: string[] = [];

    users.forEach((user) => {
        const userId = Accounts.createUser({
            email: user.email,
            password: user.password,
            profile: { 
                firstName: user.profile.firstName, lastName: user.profile.lastName, gender: user.profile.gender
            }
        });
        Roles.addUsersToRoles(userId, 'student');
        userIds.push(userId);
    })
    
    return userIds;
}