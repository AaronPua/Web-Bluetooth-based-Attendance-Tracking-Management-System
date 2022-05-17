import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { AdminsSeeder, InstructorsSeeder, StudentsSeeder } from '/imports/server/seeders/UsersSeeder';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { updateAttendance } from '../../lessons/LessonsMethods';
import { addStudentToCourse } from '../CoursesMethods';
import { LessonsSeeder } from '/imports/server/seeders/LessonsSeeder';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import '../server/CoursesPublications';

describe('CoursesPublications', function() {
    beforeEach(function() {
        resetDatabase();
    });

    after(function() {
        resetDatabase();
    });

    it('success - publish all courses for admins', async function() {
        const adminIds =  AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        CoursesSeeder(5);
        
        const collections = await collector.collect('courses.all');
        assert.equal(collections.courses.length, 5);
    });

    it('fail - publish all courses for non-admins', async function() {
        const instructorIds =  InstructorsSeeder(1);
        const collector = new PublicationCollector({ userId: instructorIds[0] });

        CoursesSeeder(5);
        
        const collections = await collector.collect('courses.all');
        assert.equal(collections.courses, null);
    });

    it('success - publish specific course', async function() {
        const collector = new PublicationCollector();

        const courseIds = CoursesSeeder(2);
        const courseId = courseIds[0];
        
        const collections = await collector.collect('courses.specific', courseId);
        assert.equal(collections.courses.length, 1);
        assert.equal(collections.courses[0]._id, courseId);
    });

    it('success - publish specific course with lessons', async function() {
        const collector = new PublicationCollector();

        const courseIds = CoursesSeeder(2);
        const courseId = courseIds[0];

        LessonsSeeder(2, courseId);
        
        const collections = await collector.collect('courses.specific.withLessons', courseId);
        assert.equal(collections.courses.length, 1);
        assert.equal(collections.courses[0].lessons.length, 2);
    });

    it('success - publish courses for specific user', async function() {
        const collector = new PublicationCollector();

        const courseIds = CoursesSeeder(2);
        const course1Id = courseIds[0];
        const course2Id = courseIds[1];

        const studentIds = StudentsSeeder(1);
        const studentId = studentIds[0];

        addStudentToCourse._execute({ userId: Random.id() }, { courseId: course1Id, studentId: studentId });
        addStudentToCourse._execute({ userId: Random.id() }, { courseId: course2Id, studentId: studentId });
        
        const collections = await collector.collect('courses.specificUser', studentId);
        assert.equal(collections.courses.length, 2);
    });

    it('success - publish specific course for specific student with attended lessons', async function() {
        const collector = new PublicationCollector();

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];

        const studentIds = StudentsSeeder(1);
        const studentId = studentIds[0];

        const lessonIds = LessonsSeeder(2, courseId);
        const lessonId = lessonIds[0];

        updateAttendance._execute({ userId: Random.id() }, { lessonId: lessonId, studentId: studentId, action: 'add' });
        
        const collections = await collector.collect('courses.student.attendedLessons', studentId, courseId);
        assert.equal(collections.lessons.length, 1);
        assert.equal(collections.lessons[0]._id, lessonId);
    });

    it('success - publish specific course for specific student with missed lessons', async function() {
        const collector = new PublicationCollector();

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];

        const studentIds = StudentsSeeder(1);
        const studentId = studentIds[0];

        // By default, students are absent.
        LessonsSeeder(2, courseId);
        
        const collections = await collector.collect('courses.student.missedLessons', studentId, courseId);
        assert.equal(collections.lessons.length, 2);
    });
});