import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { userRegistrationSchema } from '/imports/api/users/UsersSchema';
import { sendPasswordResetEmail } from '/imports/api/users/UsersMethods';
import {
  AutoForm,
  AutoFields,
  ErrorsField,
  SubmitField,
} from 'uniforms-semantic';
import {
    EuiCallOut,
    EuiEmptyPrompt,
    EuiLink,
    EuiSpacer
} from '@elastic/eui';

export default function ForgotPassword() {
    const bridge = new SimpleSchema2Bridge(userRegistrationSchema.pick('email'));

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    let navigate = useNavigate();

    const forgotPassword = (model: any) => {
        sendPasswordResetEmail.callPromise({model})
        .then(() => {
            setShowSuccess(true);
        })
        .catch((error: any) => {
            setShowError(true);
            setError(error.reason);
        });
    }

    return (
        <EuiEmptyPrompt
            title={<h2>Reset Password</h2>}
            color="plain"
            body={
                <Fragment>
                    { showError && 
                        <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                            <p>{error}</p>
                        </EuiCallOut> 
                    }
                    { showSuccess && 
                        <EuiCallOut title="Success!" color="success" iconType="user">
                            <p>Password reset email has been sent.</p>
                        </EuiCallOut> 
                    }
                    <AutoForm schema={bridge} onSubmit={(model: any) => forgotPassword(model)}>
                        <ErrorsField />
                        <AutoFields />
                        <EuiSpacer />
                        <SubmitField value="Reset Password"/>
                    </AutoForm>
                </Fragment>
            }
            footer={
                <p>
                    Remembered your password? <EuiLink onClick={() => navigate('/login')}>Sign In</EuiLink>
                </p>
            }
        />
    );
}