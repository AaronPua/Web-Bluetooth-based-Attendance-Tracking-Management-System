import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { StudentsSeeder, AdminsSeeder } from '/imports/server/seeders/UsersSeeder';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { LessonsSeeder } from '/imports/server/seeders/LessonsSeeder';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { addStudentToCourse } from '../../courses/CoursesMethods';
import { updateAttendance } from '../LessonsMethods';
import { CoursesCollection } from '../../courses/CoursesCollection';
import { assert } from 'chai';
import '../server/LessonsPublications';
import _ from 'underscore';

describe('LessonsPublications', function() {
    beforeEach(function() {
        resetDatabase();
    });

    after(function() {
        resetDatabase();
    });

    it('publish all lessons - lessons.all', async function() {
        const adminIds = AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const courseIds = CoursesSeeder(1);
        LessonsSeeder(2, courseIds[0]);
        
        const collections = await collector.collect('lessons.all');
        assert.equal(collections.lessons.length, 2);
    });

    it('publish all lessons with course they belong to - lessons.all.withCourse', async function() {
        const adminIds = AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];
        LessonsSeeder(2, courseId);
        
        const collections = await collector.collect('lessons.all.withCourse');
        assert.equal(collections.lessons.length, 2);

        const courseName = CoursesCollection.findOne(courseId)?.name;
        assert.equal(collections.lessons[0].course[0].name, courseName);
        assert.equal(collections.lessons[1].course[0].name, courseName);
    });

    it('publish specific lessons - lessons.specific', async function() {
        const collector = new PublicationCollector();

        const courseIds = CoursesSeeder(1);
        const lessonIds = LessonsSeeder(2, courseIds[0]);
        const lessonId = lessonIds[0];
        
        const collections = await collector.collect('lessons.specific', lessonId);
        assert.equal(collections.lessons.length, 1);
        assert.equal(collections.lessons[0]._id, lessonId);
    });

    it('publish specific lessons for a specific course - lessons.forOneCourse', async function() {
        const collector = new PublicationCollector();

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0]
        LessonsSeeder(2, courseId);
        
        const collections = await collector.collect('lessons.forOneCourse', courseId);
        assert.equal(collections.lessons.length, 2);
        assert.equal(collections.lessons[0].courseId, courseId);
        assert.equal(collections.lessons[1].courseId, courseId);
    });

    it('publish lessons for a multiple courses - lessons.forMultipleCourses', async function() {
        const collector = new PublicationCollector();

        const courseIds = CoursesSeeder(2);
        const course1Id = courseIds[0];
        const course2Id = courseIds[1];
        LessonsSeeder(1, course1Id);
        LessonsSeeder(1, course2Id);
        
        const collections = await collector.collect('lessons.forMultipleCourses', courseIds);
        assert.equal(collections.lessons.length, 2);
        assert.equal(collections.lessons[0].courseId, course1Id);
        assert.equal(collections.lessons[1].courseId, course2Id);
    });

    it('publish students who have attended a lesson - lesson.attendance.present', async function() {
        const adminIds = AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];
        const lessonIds = LessonsSeeder(2, courseIds[0]);
        const lessonId = lessonIds[0];

        const studentIds = StudentsSeeder(2);
        const studentId = studentIds[0];

        _.each(studentIds, (studentId) => {
            addStudentToCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: studentId })
        });
        updateAttendance._execute({ userId: Random.id() }, { lessonId: lessonId, studentId: studentId, action: 'add' });
        
        const collections = await collector.collect('lesson.attendance.present', courseId, lessonId);
        assert.equal(collections.users.length, 1);
        assert.equal(collections.users[0]._id, studentId);
    });

    it('publish students who are absent for a lesson - lesson.attendance.absent', async function() {
        const adminIds = AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];
        const lessonIds = LessonsSeeder(2, courseIds[0]);
        const lessonId = lessonIds[0];

        const studentIds = StudentsSeeder(3);
        const studentId = studentIds[0];

        _.each(studentIds, (studentId) => {
            addStudentToCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: studentId })
        });
        updateAttendance._execute({ userId: Random.id() }, { lessonId: lessonId, studentId: studentId, action: 'add' });
        
        const collections = await collector.collect('lesson.attendance.absent', courseId, lessonId);
        const result = _.chain(collections.users).pluck('_id').contains(studentId).value();
        assert.equal(collections.users.length, 2);
        assert.equal(result, false);
    });
});