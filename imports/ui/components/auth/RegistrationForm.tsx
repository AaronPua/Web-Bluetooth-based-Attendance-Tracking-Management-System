import React from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  AutoField,
  ErrorsField,
  SubmitField,
} from 'uniforms-semantic';
import { useNavigate } from 'react-router';
import { 
    EuiEmptyPrompt,
    EuiSpacer
} from '@elastic/eui';
import { registerUser } from '../../../api/users/UsersMethods';
import { userRegistrationSchema } from '../../../api/users/UsersCollection';

export default function RegistrationForm() {
    const bridge = new SimpleSchema2Bridge(userRegistrationSchema);
    let navigate = useNavigate();

    const createUser = (model: any) => {
        registerUser.callPromise({model})
        .then(() => {
            navigate('/verify-email');
        });
    }

    return (
        <EuiEmptyPrompt
            title={<h2>Sign Up</h2>}
            color="plain"
            body={
                <AutoForm schema={bridge} onSubmit={(model: any) => createUser(model)}>
                    <ErrorsField />
                    <AutoField name="firstName" />
                    <AutoField name="lastName" />
                    <AutoField name="gender" options={{ male: "Male", female: "Female"}} />
                    <AutoField name="email" />
                    <AutoField name="password" />
                    <EuiSpacer />
                    <SubmitField value="Register"/>
                </AutoForm>
            }
        />
    );
}