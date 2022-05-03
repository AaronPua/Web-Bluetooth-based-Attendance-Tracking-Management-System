import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { AdminsSeeder, InstructorsSeeder, StudentsSeeder } from '/imports/server/seeders/UsersSeeder';
import { addStudentToCourse, addInstructorToCourse } from '../../courses/CoursesMethods';
import { CoursesSeeder } from '/imports/server/seeders/CoursesSeeder';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import '../server/UsersPublications';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import _ from 'underscore';

describe('UsersPublications', function() {
    beforeEach(function() {
        resetDatabase();
    });

    after(function() {
        resetDatabase();
    });

    it('publish all users - users.all', async function() {
        const adminIds =  AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        StudentsSeeder(1);
        InstructorsSeeder(1);
        
        const collections = await collector.collect('users.all');
        assert.equal(collections.users.length, 3);
    });

    it('publish specific user - users.specific', async function() {
        const adminIds =  AdminsSeeder(1);
        const adminId = adminIds[0];
        const collector = new PublicationCollector({ userId: adminId });
        
        const collections = await collector.collect('users.specific', adminId);
        assert.equal(collections.users.length, 1);
        assert.equal(collections.users[0]._id, adminId);
    });

    it('publish all instructors - users.instructors', async function() {
        const adminIds =  AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        InstructorsSeeder(2);

        const collections = await collector.collect('users.instructors');
        assert.equal(collections.users.length, 2);
    });

    it('publish all students - users.students', async function() {
        const adminIds =  AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        StudentsSeeder(2);

        const collections = await collector.collect('users.students');
        assert.equal(collections.users.length, 2);
    });

    it('publish all admins - users.admins', async function() {
        const adminIds =  AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const collections = await collector.collect('users.admins');
        assert.equal(collections.users.length, 1);
    });

    it('publish all students in a specific course - users.students.inSpecificCourse', async function() {
        const adminIds =  AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];

        const studentIds = StudentsSeeder(2);
        const student1Id = studentIds[0];
        const student2Id = studentIds[1];

        addStudentToCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: student1Id });
        addStudentToCourse._execute({ userId: Random.id() }, { courseId: courseId, studentId: student2Id });

        const collections = await collector.collect('users.students.inSpecificCourse', courseId);
        assert.equal(collections.users.length, 2);
    });

    it('publish all students not in a specific course - users.students.notInSpecificCourse', async function() {
        const adminIds =  AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];

        StudentsSeeder(2);

        const collections = await collector.collect('users.students.notInSpecificCourse', courseId);
        assert.equal(collections.users.length, 2);
    });

    it('publish all instructors in a specific course - users.instructors.inSpecificCourse', async function() {
        const adminIds =  AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];

        const instructorIds = InstructorsSeeder(2);
        const instructor1Id = instructorIds[0];
        const instructor2Id = instructorIds[1];

        addInstructorToCourse._execute({ userId: Random.id() }, { courseId: courseId, instructorId: instructor1Id });
        addInstructorToCourse._execute({ userId: Random.id() }, { courseId: courseId, instructorId: instructor2Id });

        const collections = await collector.collect('users.instructors.inSpecificCourse', courseId);
        assert.equal(collections.users.length, 2);
    });

    it('publish all instructors not in a specific course - users.instructors.notInSpecificCourse', async function() {
        const adminIds =  AdminsSeeder(1);
        const collector = new PublicationCollector({ userId: adminIds[0] });

        const courseIds = CoursesSeeder(1);
        const courseId = courseIds[0];

        InstructorsSeeder(2);

        const collections = await collector.collect('users.instructors.notInSpecificCourse', courseId);
        assert.equal(collections.users.length, 2);
    });
});