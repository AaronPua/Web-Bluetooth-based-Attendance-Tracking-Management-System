import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { BeaconsCollection } from '../BeaconsCollection';

Meteor.publish('beacons.all', function() {
    this.enableScope();

    if(!Roles.userIsInRole(this.userId, 'admin')) {
        this.ready();
        return;
    }

    return BeaconsCollection.find();
})

Meteor.publish('beacons.specific', function(beaconId) {
    this.enableScope();
    check(beaconId, String);

    if(!Roles.userIsInRole(this.userId, ['admin', 'instructor'])) {
        this.ready();
        return;
    }

    return BeaconsCollection.find({ _id: beaconId });
});

Meteor.publish('beacons.forOneCourse', function(courseId) {
    this.enableScope();
    check(courseId, String);

    return BeaconsCollection.find({ courseId: courseId });
});