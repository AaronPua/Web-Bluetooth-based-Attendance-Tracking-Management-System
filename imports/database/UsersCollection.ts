import { Meteor } from 'meteor/meteor';
import { createCollection } from 'meteor/quave:collections';
import SimpleSchema from 'simpl-schema';

const userSchema = new SimpleSchema({
    _id: { 
        type: String, 
        regEx: SimpleSchema.RegEx.Id
    },
    emails: { 
        type: Array 
    },
    'emails.$': { 
        type: Object 
    },
    'emails.$.address': { 
        type: String, 
        regEx: SimpleSchema.RegEx.Email, 
        label: "Email" 
    },
    'emails.$.verified': { 
        type: Boolean
    },
    services: { 
        type: Object,
        optional: true,
        blackbox: true 
    },
    createdAt: { 
        type: Date 
    },
});

export const UsersCollection = createCollection({
    instance: Meteor.users,
    schema: userSchema
});