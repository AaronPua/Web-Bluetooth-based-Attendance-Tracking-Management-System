import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { CoursesCollection } from '../CoursesCollection';

Meteor.publish('courses.all', function() {
    return CoursesCollection.find();
})

Meteor.publish('courses.specific', function(courseId) {
    check(courseId, String);
    return CoursesCollection.find({ _id: courseId });
});