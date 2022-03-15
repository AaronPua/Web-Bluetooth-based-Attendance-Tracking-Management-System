import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { LessonsCollection } from '../LessonsCollection';

Meteor.publish('lessons.all', function() {
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