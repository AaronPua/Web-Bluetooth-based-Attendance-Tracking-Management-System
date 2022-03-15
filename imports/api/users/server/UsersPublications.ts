import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';

Meteor.publish('users.all', function() {
    return Meteor.users.find();
});

Meteor.publish('users.instructors', function() {
    const instructors = Meteor.roleAssignment.find({ "role._id": 'instructor' });
    const instructorIds = instructors.map((instructor: any) => { return instructor.user._id });

    return Meteor.users.find({ _id: { $in: instructorIds }});
});

Meteor.publish('users.students', function() {
    this.enableScope();
    const students = Meteor.roleAssignment.find({ "role._id": 'student' });
    const studentIds = students.map((student: any) => { return student.user._id });

    return Meteor.users.find({ _id: { $in: studentIds }});
});

Meteor.publish('users.students.inSpecificCourse', function(courseId) {
    this.enableScope();

    check(courseId, String);

    const students = Meteor.roleAssignment.find({ "role._id": 'student' });
    const studentIds = students.map((student: any) => { return student.user._id });

    return Meteor.users.find({
        _id: { $in: studentIds },
        courses: { $eq: courseId }
    });
});

Meteor.publish('users.students.notInSpecificCourse', function(courseId) {
    this.enableScope();

    check(courseId, String);
    const students = Meteor.roleAssignment.find({ "role._id": 'student' });
    const studentIds = students.map((student: any) => { return student.user._id });

     return Meteor.users.find({
        _id: { $in: studentIds },
        courses: { $ne: courseId }
    });
});