import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Lessons = new Mongo.Collection('lessons')

Meteor.publish('lessons.all', function getAllLessons() {
    return Lessons.find({});
})