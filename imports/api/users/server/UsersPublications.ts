import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

Meteor.publish('users.all', function() {
    return Meteor.users.find();
});

Meteor.publish('users.instructors', function() {
    const instructors = Meteor.roleAssignment.find({ "role._id": 'instructor' });
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