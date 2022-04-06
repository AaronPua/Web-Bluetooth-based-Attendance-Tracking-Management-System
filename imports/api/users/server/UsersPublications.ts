import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { CoursesCollection } from '../../courses/CoursesCollection';

Meteor.publish('users.all', function() {
    return Meteor.users.find();
});

Meteor.publish('users.specific', function(userId) {
    this.enableScope();
    check(userId, String);

    return Meteor.users.find({ _id: userId });
});

Meteor.publish('users.instructors', function() {
    this.enableScope();

    const instructors = Meteor.roleAssignment.find({ "role._id": 'instructor' }).fetch();
    const instructorIds = _.pluck(_.flatten(_.pluck(instructors, 'user')), '_id');

    return Meteor.users.find({ _id: { $in: instructorIds }});
});

Meteor.publish('users.students', function() {
    this.enableScope();
    
    const students = Meteor.roleAssignment.find({ "role._id": 'student' }).fetch();
    const studentIds = _.pluck(_.flatten(_.pluck(students, 'user')), '_id');

    return Meteor.users.find({ _id: { $in: studentIds }});
});

Meteor.publish('users.students.inSpecificCourse', function(courseId) {
    this.enableScope();
    check(courseId, String);

    const students = Meteor.roleAssignment.find({ "role._id": 'student' }).fetch();
    const studentIds = _.pluck(_.flatten(_.pluck(students, 'user')), '_id');

    return Meteor.users.find({
        _id: { $in: studentIds },
        "courses._id": { $eq: courseId }
    });
});

Meteor.publish('users.students.notInSpecificCourse', function(courseId) {
    this.enableScope();
    check(courseId, String);

    const students = Meteor.roleAssignment.find({ "role._id": 'student' }).fetch();
    const studentIds = _.pluck(_.flatten(_.pluck(students, 'user')), '_id');

     return Meteor.users.find({
        _id: { $in: studentIds },
        "courses._id": { $ne: courseId }
    });
});

Meteor.publish('users.instructors.inSpecificCourse', function(courseId) {
    this.enableScope();
    check(courseId, String);

    const instructors = Meteor.roleAssignment.find({ "role._id": 'instructor' }).fetch();
    const instructorIds = _.pluck(_.flatten(_.pluck(instructors, 'user')), '_id');

    return Meteor.users.find({
        _id: { $in: instructorIds },
        "courses._id": { $eq: courseId }
    });
});

Meteor.publish('users.instructors.notInSpecificCourse', function(courseId) {
    this.enableScope();
    check(courseId, String);

    const instructors = Meteor.roleAssignment.find({ "role._id": 'instructor' }).fetch();
    const instructorIds = _.pluck(_.flatten(_.pluck(instructors, 'user')), '_id');

     return Meteor.users.find({
        _id: { $in: instructorIds },
        "courses._id": { $ne: courseId }
    });
});

Meteor.publish('users.courses', function(userId) {
    this.enableScope();
    check(userId, String);

    const user = Meteor.users.find({ _id: userId }).fetch();
    const courseIds = _.pluck(_.flatten(_.pluck(user, 'courses')), '_id');

    return CoursesCollection.find({ _id: { $all: courseIds } })
});