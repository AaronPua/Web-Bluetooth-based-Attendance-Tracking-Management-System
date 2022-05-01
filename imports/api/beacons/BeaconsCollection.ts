// import { createCollection } from 'meteor/quave:collections';
import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';

export const BeaconsCollection = new Mongo.Collection('beacons');

export const beaconSchema = new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    courseId: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String },
    uuid: { type: String },
    createdAt: { type: Date }
});

BeaconsCollection.attachSchema(beaconSchema);

export const beaconCreateSchema = beaconSchema.pick('courseId', 'name', 'uuid');

// export const BeaconsCollection = createCollection({
//     name: 'beacons',
//     schema: beaconSchema
// });