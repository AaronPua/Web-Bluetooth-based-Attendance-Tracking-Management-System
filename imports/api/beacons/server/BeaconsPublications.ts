import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { BeaconsCollection } from '../BeaconsCollection';

Meteor.publish('beacons.all', function() {
    return BeaconsCollection.find();
})

Meteor.publish('beacons.specific', function(beaconId) {
    check(beaconId, String);
    return BeaconsCollection.find({ _id: beaconId });
});

Meteor.publish('beacons.forOneCourse', function(courseId) {
    this.enableScope();
    check(courseId, String);

    return BeaconsCollection.find({ courseId: courseId });
});