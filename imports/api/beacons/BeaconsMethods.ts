import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { BeaconsCollection, beaconCreateSchema } from './BeaconsCollection';

export const createBeacon = new ValidatedMethod({
    name: 'beacon.create',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before creating a beacon.',
    },
    validate: beaconCreateSchema.validator(),
    run({ courseId, name, uuid }: { courseId: string, name: number, uuid: string }) {
        BeaconsCollection.insert({
            courseId: courseId,
            name: name,
            uuid: uuid,
            createdAt: new Date()
        });
    }
});

export const removeBeacon = new ValidatedMethod({
    name: 'beacon.remove',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before removing a beacon.',
    },
    validate: new SimpleSchema({
        beaconId: { type: String, regEx: SimpleSchema.RegEx.Id },
    }).validator(),
    run({ beaconId }: { beaconId: string }) {
        BeaconsCollection.remove(beaconId);
    }
});

export const updateBeacon = new ValidatedMethod({
    name: 'beacon.update',
    mixins: [CallPromiseMixin, LoggedInMixin],
    checkLoggedInError: {
        error: 'not-logged-in',
        message: 'You need to be logged in before updating a beacon.',
    },
    validate: new SimpleSchema({
        beaconId: { type: String, regEx: SimpleSchema.RegEx.Id },
        courseId: { type: String, regEx: SimpleSchema.RegEx.Id },
        name: { type: String },
        uuid: { type: String },
    }).validator(),
    run({ beaconId, courseId, name, uuid }: { beaconId: string, courseId: string, name: string, uuid: string }) {
        BeaconsCollection.update({ _id: beaconId }, { 
            $set: { 
                courseId: courseId,
                name: name,
                uuid: uuid
            }
        });
    }
});