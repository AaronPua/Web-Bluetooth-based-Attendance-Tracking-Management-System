import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { LessonsCollection } from '../LessonsCollection';
import _ from 'underscore';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';

Meteor.publish('lessons.all', function() {
    this.enableScope();

    if(!Roles.userIsInRole(this.userId, 'admin')) {
        this.ready();
        return;
    }

    return LessonsCollection.find({});
});

Meteor.publish('lessons.all.withCourse', function() {
    this.enableScope();

    if(!Roles.userIsInRole(this.userId, 'admin')) {
        this.ready();
        return;
    }

    ReactiveAggregate(this, LessonsCollection, [
        {
            $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $project: {
                courseId: 1,
                name: 1,
                startTime: 1,
                endTime: 1,
                date: 1,
                "course.name": 1,
                "course.credits": 1,
            }
        }
    ]);
});

Meteor.publish('lessons.specific', function(lessonId) {
    this.enableScope();
    check(lessonId, String);

    return LessonsCollection.find({ _id: lessonId });
});

Meteor.publish('lessons.forOneCourse', function(courseId) {
    this.enableScope();
    check(courseId, String);

    return LessonsCollection.find({ courseId: courseId });
});

Meteor.publish('lessons.forMultipleCourses', function(courseIds) {
    this.enableScope();
    check(courseIds, [String]);

    ReactiveAggregate(this, LessonsCollection, [
        {
            $match: { courseId: { $in: courseIds } }
        },
        {
            $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $project: {
                courseId: 1,
                name: 1,
                startTime: 1,
                endTime: 1,
                date: 1,
                "course.name": 1,
                "course.credits": 1,
            }
        }
    ]);
});

Meteor.publish('lesson.attendance.present', function(courseId, lessonId) {
    this.enableScope();
    check(courseId, String);
    check(lessonId, String);

    if(!Roles.userIsInRole(this.userId, ['admin', 'instructor'])) {
        this.ready();
        return;
    }

    const attended = LessonsCollection.find({ _id: lessonId }, { fields: { studentAttendance: 1 } }).fetch();
    const attendedIds = _.pluck(_.flatten(_.pluck(attended, 'studentAttendance')), '_id');
    
    return Meteor.users.find({ _id: { $in: attendedIds }, "courses._id": { $eq: courseId } });
});

Meteor.publish('lesson.attendance.absent', function(courseId, lessonId) {
    this.enableScope();
    check(courseId, String);
    check(lessonId, String);

    if(!Roles.userIsInRole(this.userId, ['admin', 'instructor'])) {
        this.ready();
        return;
    }

    const students = Meteor.roleAssignment.find({ "role._id": 'student' }).fetch();
    const studentIds = _.pluck(_.flatten(_.pluck(students, 'user')), '_id');

    const courseStudents = Meteor.users.find({ _id: { $in: studentIds }, "courses._id": { $eq: courseId } }).fetch();
    const courseStudentIds = _.pluck(courseStudents, '_id');

    const attended = LessonsCollection.find({ _id: lessonId }, { fields: { studentAttendance: 1 } }).fetch();
    const attendedIds = _.pluck(_.flatten(_.pluck(attended, 'studentAttendance')), '_id');

    const absentIds = _.difference(courseStudentIds, attendedIds);

    return Meteor.users.find({ _id: { $in: absentIds }, "courses._id": { $eq: courseId } });
});