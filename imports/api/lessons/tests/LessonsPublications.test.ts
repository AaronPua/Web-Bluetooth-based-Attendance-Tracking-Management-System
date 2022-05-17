import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { StudentsSeeder, AdminsSeeder, InstructorsSeeder } from '/imports/server/seeders/UsersSeeder';
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

    it('success - publish all lessons for admins', async function() {
        const adminIds = AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const courseIds = CoursesSeeder(1);
        LessonsSeeder(2, courseIds[0]);
        
        const collections = await collector.collect('lessons.all');
        assert.equal(collections.lessons.length, 2);
    });

    it('fail - publish all lessons for non-admins', async function() {
        const instructorIds = InstructorsSeeder(1);
        const collector = new PublicationCollector({ userId: instructorIds[0] });

        const courseIds = CoursesSeeder(1);
        LessonsSeeder(2, courseIds[0]);
        
        const collections = await collector.collect('lessons.all');
        assert.equal(collections.lessons, null);
    });

    it('success - publish all lessons with course they belong to for admins', async function() {
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

    it('fail - publish all lessons with course they belong to for non-admins', async function() {
        const instructorIds = InstructorsSeeder(1);
        const collector = new PublicationCollector({ userId: instructorIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];
        LessonsSeeder(2, courseId);
        
        const collections = await collector.collect('lessons.all.withCourse');
        assert.equal(collections.lessons, null);
    });

    it('success - publish specific lessons', async function() {
        const collector = new PublicationCollector();

        const courseIds = CoursesSeeder(1);
        const lessonIds = LessonsSeeder(2, courseIds[0]);
        const lessonId = lessonIds[0];
        
        const collections = await collector.collect('lessons.specific', lessonId);
        assert.equal(collections.lessons.length, 1);
        assert.equal(collections.lessons[0]._id, lessonId);
    });

    it('success - publish all lessons for a specific course', async function() {
        const collector = new PublicationCollector();

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0]
        LessonsSeeder(2, courseId);
        
        const collections = await collector.collect('lessons.forOneCourse', courseId);
        assert.equal(collections.lessons.length, 2);
        assert.equal(collections.lessons[0].courseId, courseId);
        assert.equal(collections.lessons[1].courseId, courseId);
    });

    it('success - publish lessons for multiple courses', async function() {
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

    it('success - publish students who have attended a lesson for admins/instructors', async function() {
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

    it('fail - publish students who have attended a lesson non-admins/instructors', async function() {
        const studentIds = StudentsSeeder(2);
        const studentId = studentIds[0];
        const collector = new PublicationCollector({ userId: studentId });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];
        const lessonIds = LessonsSeeder(2, courseIds[0]);
        const lessonId = lessonIds[0];

        _.each(studentIds, (studentId) => {
            addStudentToCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: studentId })
        });
        updateAttendance._execute({ userId: Random.id() }, { lessonId: lessonId, studentId: studentId, action: 'add' });
        
        const collections = await collector.collect('lesson.attendance.present', courseId, lessonId);
        assert.equal(collections.users, null);
    });

    it('success - publish students who are absent for a lesson for admins/instructors', async function() {
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

    it('fail - publish students who are absent for a lesson for non-admins/instructors', async function() {
        const studentIds = StudentsSeeder(3);
        const studentId = studentIds[0];
        const collector = new PublicationCollector({ userId: studentId });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];
        const lessonIds = LessonsSeeder(2, courseIds[0]);
        const lessonId = lessonIds[0];

        _.each(studentIds, (studentId) => {
            addStudentToCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: studentId })
        });
        updateAttendance._execute({ userId: Random.id() }, { lessonId: lessonId, studentId: studentId, action: 'add' });
        
        const collections = await collector.collect('lesson.attendance.absent', courseId, lessonId);
        assert.equal(collections.users, null);
    });
});