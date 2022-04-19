import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert } from 'chai';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { AdminsSeeder, StudentsSeeder } from '/imports/server/seeders/UsersSeeder';
import './CoursesPublications';
import { CoursesCollection } from '../../courses/CoursesCollection';
import _ from 'underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { LessonsCollection } from '../../lessons/LessonsCollection';
import { updateAttendance } from '../../lessons/LessonsMethods';
import { addStudentToCourse } from '../CoursesMethods';
import { LessonsSeeder } from '/imports/server/seeders/LessonsSeeder';
import { Random } from 'meteor/random';

describe('CoursesPublication', function() {

    let adminId: string, students, studentIds: string[], studentId: string | undefined, courseId: string, lessonId: string;

    before(function() {
        resetDatabase();
        if(Meteor.roles.find().count() === 0) {
            Roles.createRole('admin');
            Roles.createRole('instructor');
            Roles.createRole('student');
        }

        AdminsSeeder(1);
        StudentsSeeder(5);
        CoursesSeeder(5);

        adminId = Meteor.users.find().fetch()[0]._id;
        courseId = CoursesCollection.find().fetch()[0]._id;
        students = Meteor.roleAssignment.find({ "role._id": 'student' }).fetch();
        studentIds = _.pluck(_.flatten(_.pluck(students, 'user')), '_id');
        studentId = Meteor.users.findOne({ _id: studentIds[0] })?._id;

        _.each(studentIds, (studentId) => {
            addStudentToCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: studentId })
        });
        
        LessonsSeeder(1, courseId);
        LessonsSeeder(1, courseId);

        lessonId = LessonsCollection.find().fetch()[0]._id;
        updateAttendance._execute({ userId: Random.id() }, { lessonId: lessonId, studentId: studentId, action: 'add' });
    });

    it('publish all courses', async function() {
        const collector = new PublicationCollector({ userId: adminId });
        
        const collections = await collector.collect('courses.all');
        assert.equal(collections.courses.length, 5);
    });

    it('publish specific course', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('courses.specific', courseId);
        assert.equal(collections.courses.length, 1);
    });

    it('publish specific course with lessons', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('courses.specific', courseId);
        assert.equal(collections.courses.length, 1);
    });

    it('publish courses for specific user', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('courses.specificUser', studentId);
        assert.equal(collections.courses.length, 1);
    });

    it('publish specific course for specific user with attended lessons', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('courses.student.attendedLessons', studentId, courseId);
        assert.equal(collections.lessons.length, 1);
    });

    it('publish specific course for specific user with missed lessons', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('courses.student.attendedLessons', studentId, courseId);
        assert.equal(collections.lessons.length, 1);
    });

    after(function() {
        resetDatabase();
    });
});