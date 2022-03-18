import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { LessonsCollection } from '../LessonsCollection';
import _ from 'underscore';

Meteor.publish('lessons.all', function() {
    this.enableScope();
    return LessonsCollection.find({});
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

Meteor.publish('lesson.attendance.present', function(courseId, lessonId) {
    this.enableScope();
    check(courseId, String);
    check(lessonId, String);

    const attended = LessonsCollection.find({ _id: lessonId }, { fields: { studentAttendance: 1 } }).fetch();
    const attendedIds = _.pluck(_.flatten(_.pluck(attended, 'studentAttendance')), '_id');
    
    return Meteor.users.find({ _id: { $in: attendedIds }, "courses._id": { $eq: courseId } });
});

Meteor.publish('lesson.attendance.absent', function(courseId, lessonId) {
    this.enableScope();
    check(courseId, String);
    check(lessonId, String);

    const students = Meteor.roleAssignment.find({ "role._id": 'student' }).fetch();
    const studentIds = _.pluck(_.flatten(_.pluck(students, 'user')), '_id');

    const courseStudents = Meteor.users.find({ _id: { $in: studentIds }, "courses._id": { $eq: courseId } }).fetch();
    const courseStudentIds = _.pluck(courseStudents, '_id');

    const attended = LessonsCollection.find({ _id: lessonId }, { fields: { studentAttendance: 1 } }).fetch();
    const attendedIds = _.pluck(_.flatten(_.pluck(attended, 'studentAttendance')), '_id');

    const absentIds = _.difference(courseStudentIds, attendedIds);

    return Meteor.users.find({ _id: { $in: absentIds }, "courses._id": { $eq: courseId } });
});