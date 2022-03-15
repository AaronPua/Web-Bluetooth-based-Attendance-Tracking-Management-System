import React from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { userLoginSchema } from '/imports/api/users/UsersCollection';
import {
  AutoForm,
  AutoFields,
  ErrorsField,
  SubmitField,
} from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router';
import { 
    EuiEmptyPrompt,
    EuiLink,
    EuiSpacer
} from '@elastic/eui';
import { Roles } from 'meteor/alanning:roles';

export default function LoginForm() {
    const bridge = new SimpleSchema2Bridge(userLoginSchema);
    let navigate = useNavigate();

    const loginWithPassword = (model: any) => {
        return new Promise((resolve, reject) => {
            Meteor.loginWithPassword(model.email, model.password, error => {
                const userId = Meteor.users.findOne(model.email);
                console.log('getRolesForUser', Roles.getRolesForUser(userId));
                if(Roles.userIsInRole(userId, 'student')) {
                    throw new Meteor.Error('Students Not Allowed', 'You do not have access to this platform.')
                }
                error ? reject(error) : resolve(navigate('/home'));
            });
        });
    }

    return (
        <EuiEmptyPrompt
            title={<h2>Sign In</h2>}
            color="plain"
            body={
                <AutoForm schema={bridge} onSubmit={(model: any) => loginWithPassword(model)}>
                    <ErrorsField />
                    <AutoFields />
                    <EuiSpacer />
                    <SubmitField value="Sign In"/>
                </AutoForm>
            }
            footer={
                <p>
                    Don't have an account yet? <EuiLink href="/sign-up">Register Now</EuiLink>
                </p>
            }
        />
    );
}