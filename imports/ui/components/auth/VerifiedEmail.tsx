import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { EuiButton, EuiCallOut, EuiEmptyPrompt } from '@elastic/eui';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { useParams } from "react-router-dom";

function VerifiedEmail() {

    let navigate = useNavigate();
    let params = useParams();
    let token = params.token ?? '';

    const [body, setBody] = useState('');

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        Accounts.verifyEmail(token, (error: any) => {
            if (error?.reason === 'Verify email link expired') {
                setShowError(true);
                setError('The email verification link has expired.');
            }
            else if (error) {
                setShowError(true);
                setError(error.reason);
            }
            else {
                setShowSuccess(true);
                setBody('Thank you for verifying your email. \n You may now log in.');
                // navigate('/');
            }
        });
    }, []);

    return (
        <EuiEmptyPrompt
            title={<h2>Email Verification</h2>}
            color="plain"
            body={
                <Fragment>
                    { showError && 
                        <EuiCallOut title="Email Verification Failed!" color="danger" iconType="alert">
                            <p>{error}</p>
                        </EuiCallOut> 
                    }
                    { showSuccess && 
                        <EuiCallOut title="Success!" color="success" iconType="user">
                            <p>Your email has been verified.</p>
                        </EuiCallOut> 
                    }
                </Fragment>
                
            }
            // actions={
            //     <EuiButton fill color="primary" type="submit" onClick={() => navigate('/')}>Home</EuiButton>
            // }
        />
    );
}

export default VerifiedEmail;