import React, { Fragment, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { EuiEmptyPrompt, EuiLink, EuiSpacer } from '@elastic/eui';
import {
  AutoForm,
  AutoFields,
  ErrorsField,
  SubmitField,
} from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { userRegistrationSchema } from '/imports/api/users/UsersCollection';
import { resendVerificationEmail } from '/imports/api/users/UsersMethods';

function VerifyEmail() {
    const bridge = new SimpleSchema2Bridge(userRegistrationSchema.pick('email'));

    const [showResend, setShowResend] = useState(false);
    const [title, setTitle] = useState('Verify Your Email');
    const [body, setBody] = useState('Please check your email inbox or spam folder for the verification email.');

    const resendEmailVerification = (model: any) => {
        resendVerificationEmail.callPromise({model})
        .then(() => {
            setTitle('Verification Email Resent');
        })
        .catch((err: Meteor.Error) => {
            setTitle('An Error Has Occured');
            setBody(err.message);
        });
    }

    return (
        <EuiEmptyPrompt
            title={<h2>{title}</h2>}
            color="plain"
            body={
                <p>{body}</p>
            }
            footer={
                // <EuiButton fill color="primary" type="submit" onClick={() => navigate('/')}>Home</EuiButton>
                <Fragment>
                    <p>
                        Did not receive the verification email? <EuiLink color="primary" onClick={() => setShowResend(true)}>Click Here.</EuiLink>
                    </p>
                    {
                        showResend && 
                        <AutoForm schema={bridge} onSubmit={(model: any) => resendEmailVerification(model)}>
                            <EuiSpacer />
                            <ErrorsField />
                            <AutoFields />
                            <EuiSpacer />
                            <SubmitField value="Resend" />
                        </AutoForm>
                    }
                </Fragment>
            }
        />
    );
}

export default VerifyEmail;