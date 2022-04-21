import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { BeaconsCollection } from '../BeaconsCollection';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';

Meteor.publish('beacons.all', function() {
    this.enableScope();

    if(!Roles.userIsInRole(this.userId, 'admin')) {
        this.ready();
        return;
    }

    return BeaconsCollection.find();
});

Meteor.publish('beacons.all.withCourse', function() {
    this.enableScope();

    if(!Roles.userIsInRole(this.userId, 'admin')) {
        this.ready();
        return;
    }

    ReactiveAggregate(this, BeaconsCollection, [
        {
            $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $project: {
                name: 1,
                uuid: 1,
                "course._id": 1,
                "course.name": 1,
            }
        }
    ]);
});

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