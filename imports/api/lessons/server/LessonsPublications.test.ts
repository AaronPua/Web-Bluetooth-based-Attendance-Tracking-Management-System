import { Meteor } from 'meteor/meteor';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert } from 'chai';
import { InstructorsSeeder, StudentsSeeder } from '/imports/server/seeders/UsersSeeder';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { LessonsSeeder } from '/imports/server/seeders/LessonsSeeder';
import './LessonsPublications';
import { CoursesCollection } from '../../courses/CoursesCollection';
import { LessonsCollection } from '../../lessons/LessonsCollection';
import _ from 'underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';
import { addStudentToCourse } from '../../courses/CoursesMethods';
import { updateAttendance } from '../LessonsMethods';

describe('LessonsPublications', function() {
 
    let courseId: string, students, studentIds, studentId, lessonId: string;

    before(function() {
        resetDatabase();

        if(Meteor.roles.find().count() === 0) {
            Roles.createRole('admin');
            Roles.createRole('instructor');
            Roles.createRole('student');
        }

        InstructorsSeeder(5);
        StudentsSeeder(5);
        CoursesSeeder(1);

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
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('lessons.all');
        assert.equal(collections.lessons.length, 2);
    });

    it('publish specific lessons', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('lessons.specific', lessonId);
        assert.equal(collections.lessons.length, 1);
    });

    it('publish specific lessons for a specific course', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('lessons.forOneCourse', courseId);
        assert.equal(collections.lessons.length, 2);
    });

    it('publish students who have attended a lesson', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('lesson.attendance.present', courseId, lessonId);
        assert.equal(collections.users.length, 1);
    });

    it('publish students who are absent for a lesson', async function() {
        const collector = new PublicationCollector();
        
        const collections = await collector.collect('lesson.attendance.absent', courseId, lessonId);
        assert.equal(collections.users.length, 4);
    });

    after(function() {
        resetDatabase();
    });
});