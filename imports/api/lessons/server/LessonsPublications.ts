import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { createPublicationFactory } from 'meteor/leaonline:publication-factory';

const createPublication = createPublicationFactory();

Meteor.publish('lessons.all', function getAllLessons() {
    return Meteor.lessons.find({});
});

const getAllLessons = createPublication({
    name: 'lessons.all',
    validate: null,
    run: () => {
        return Meteor.lessons.find({})
    }
})