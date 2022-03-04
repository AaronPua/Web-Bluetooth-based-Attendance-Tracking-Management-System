import React, { Fragment, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { userRegistrationSchema } from '/imports/api/users/UsersCollection';
import {
  AutoForm,
  AutoFields,
  ErrorsField,
  SubmitField,
} from 'uniforms-semantic';
import {
    EuiCallOut,
    EuiEmptyPrompt,
    EuiSpacer
} from '@elastic/eui';
import { Accounts } from 'meteor/accounts-base';

export default function ResetPassword() {
    const bridge = new SimpleSchema2Bridge(userRegistrationSchema.pick('password'));

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    let navigate = useNavigate();
    let params = useParams();
    let token = params.token ?? '';

    const resetPassword = (model: any) => {
        Accounts.resetPassword(token, model.password, (error: any) => {
            if(error) {
                setShowError(true);
                setError(error.reason);
            }
            else
                setShowSuccess(true);
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
                            <p>Your password has been reset.</p>
                        </EuiCallOut>
                    }
                    <AutoForm schema={bridge} onSubmit={(model: any) => resetPassword(model)}>
                        <ErrorsField />
                        <AutoFields />
                        <EuiSpacer />
                        <SubmitField value="Reset Password"/>
                    </AutoForm>
                </Fragment>
            }
        />
    );
}