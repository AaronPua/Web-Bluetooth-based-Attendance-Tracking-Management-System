import { createCollection } from 'meteor/quave:collections';
import SimpleSchema from 'simpl-schema';

const rolesSchema = new SimpleSchema({
    _id: { type: String },
    children: { type: Array },
   'children.$': { type: Object },
   'children.$._id': { type: Object },
});

export const RolesCollection = createCollection({
    name: 'roles',
    schema: rolesSchema
});