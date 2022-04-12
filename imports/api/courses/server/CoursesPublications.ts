import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { CoursesCollection } from '../CoursesCollection';
import { Roles } from 'meteor/alanning:roles';
import _ from 'underscore';
import { LessonsCollection } from '../../lessons/LessonsCollection';

Meteor.publish('courses.all', function() {
    this.enableScope();

    if(!Roles.userIsInRole(this.userId, 'admin')) {
        this.ready();
        return;
    }
    return CoursesCollection.find();
})

Meteor.publish('courses.specific', function(courseId) {
    this.enableScope();
    check(courseId, String);

    return CoursesCollection.find({ _id: courseId });
});

Meteor.publish('courses.specificUser', function(userId) {
    this.enableScope();
    check(userId, String);

    const user = Meteor.users.find({ _id: userId }).fetch();
    const courseIds = _.pluck(_.flatten(_.pluck(user, 'courses')), '_id');

    return CoursesCollection.find({ _id: { $in: courseIds } });
});

Meteor.publish('courses.currentUser', function() {
    this.enableScope();

    const user = Meteor.users.find({ _id: this.userId }).fetch();
    const courseIds = _.pluck(_.flatten(_.pluck(user, 'courses')), '_id');

    return CoursesCollection.find({ _id: { $in: courseIds } });
});

Meteor.publish('courses.student.attendedLessons', function(userId, courseId) {
    this.enableScope();
    check(userId, String);
    check(courseId, String);

    const student = Meteor.users.findOne(userId);
    const lessons = LessonsCollection.find({ courseId: courseId }).fetch();

    const lessonsAttendedIds = _.chain(lessons)
                                .filter((lesson) => {
                                    return _.findWhere(_.get(lesson, 'studentAttendance'), { _id: student._id });
                                }).pluck('_id').value();

    return LessonsCollection.find({ _id: { $in: lessonsAttendedIds } });
});

Meteor.publish('courses.student.missedLessons', function(userId, courseId) {
    this.enableScope();
    check(userId, String);
    check(courseId, String);

    const student = Meteor.users.findOne(userId);
    const lessons = LessonsCollection.find({ courseId: courseId }).fetch();

    const lessonsMissedIds = _.chain(lessons)
                                .filter((lesson) => {
                                    return !_.findWhere(_.get(lesson, 'studentAttendance'), { _id: student._id });
                                }).pluck('_id').value();

    return LessonsCollection.find({ _id: { $in: lessonsMissedIds } });
});