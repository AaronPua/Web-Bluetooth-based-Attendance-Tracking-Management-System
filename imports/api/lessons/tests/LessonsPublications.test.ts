import { Meteor } from 'meteor/meteor';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert } from 'chai';
import { InstructorsSeeder, StudentsSeeder, AdminsSeeder } from '/imports/server/seeders/UsersSeeder';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { LessonsSeeder } from '/imports/server/seeders/LessonsSeeder';
import '../server/LessonsPublications';
import { CoursesCollection } from '../../courses/CoursesCollection';
import { LessonsCollection } from '../LessonsCollection';
import _ from 'underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';
import { addStudentToCourse } from '../../courses/CoursesMethods';
import { updateAttendance } from '../LessonsMethods';

describe('LessonsPublications', function() {
 
    let adminId: string, courseId: string, students, studentIds: string[], studentId: string | undefined, lessonId: string;

    before(function() {
        resetDatabase();

        if(Meteor.roles.find().count() === 0) {
            Roles.createRole('admin');
            Roles.createRole('instructor');
            Roles.createRole('student');
        }

        AdminsSeeder(1);
        InstructorsSeeder(5);
        StudentsSeeder(5);
        CoursesSeeder(1);

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

    it('publish all lessons', async function() {
        const collector = new PublicationCollector({ userId: adminId });
        
        const collections = await collector.collect('lessons.all');
        assert.equal(collections.lessons.length, 2);
    });

    it('publish specific lessons', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('lessons.specific', lessonId);
        assert.equal(collections.lessons.length, 1);
        assert.equal(collections.lessons[0]._id, lessonId);
    });

    it('publish specific lessons for a specific course', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('lessons.forOneCourse', courseId);
        assert.equal(collections.lessons.length, 2);
        assert.equal(collections.lessons[0].courseId, courseId);
        assert.equal(collections.lessons[1].courseId, courseId);
    });

    it('publish students who have attended a lesson', async function() {
        const collector = new PublicationCollector({ userId: adminId });
        
        const collections = await collector.collect('lesson.attendance.present', courseId, lessonId);
        assert.equal(collections.users.length, 1);
        assert.equal(collections.users[0]._id, studentId);
    });

    it('publish students who are absent for a lesson', async function() {
        const collector = new PublicationCollector({ userId: adminId });
        
        const collections = await collector.collect('lesson.attendance.absent', courseId, lessonId);
        const result = _.chain(collections.users).pluck('_id').contains(studentId).value();
        assert.equal(collections.users.length, 4);
        assert.equal(result, false);
    });

    after(function() {
        resetDatabase();
    });
});