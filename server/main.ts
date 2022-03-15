import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/index';
import { Roles } from 'meteor/alanning:roles';
import { UserSeeder, InstructorsSeeder, StudentsSeeder } from '/imports/server/seeders/UsersSeeder';
import { LessonSeeder } from '/imports/server/seeders/LessonsSeeder';
import { CourseSeeder } from '/imports/server/seeders/CoursesSeeder';

Meteor.startup(() => {
    if(Meteor.roles.find().count() === 0) {
        Roles.createRole('admin');
        Roles.createRole('instructor');
        Roles.createRole('student');
    }
    // Meteor.roleAssignment.remove({});
    // UserSeeder(false, true);
    // LessonSeeder(true, false);
    // CourseSeeder(true, false);

    // Meteor.roleAssignment.remove({});
    // Meteor.users.remove({});
    // InstructorsSeeder();
    // StudentsSeeder();
});
