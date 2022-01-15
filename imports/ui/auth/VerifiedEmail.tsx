import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { EuiButton, EuiEmptyPrompt } from '@elastic/eui';
import { Accounts } from 'meteor/accounts-base';

function VerifiedEmail() {

    const [title, setTitle] = useState('Email Verified!')
    const [body, setBody] = useState('Thank you for verifying your email.')

    useEffect(() => {
        Accounts.onEmailVerificationLink((token: string, done: Function) => {
            Accounts.verifyEmail(token, (error: any) => {
                if(error?.reason === 'Verify email link expired') {
                    setTitle('Email Verification Failed!');
                    setBody('The email verification link has expired.');
                }
                else if(error) {
                    setTitle('Email Verification Failed!');
                    setBody(`Email could not be verified. Error: ${error.reason}`);
                }
                else {
                    setTitle('Email Verification Failed!');
                    setBody('Thank you for verifying your email.');
                    done();
                }
            })
        });
    });

    let navigate = useNavigate();

    return (
        <EuiEmptyPrompt
            title={<h2>{title}</h2>}
            color="plain"
            body={
                <p>{body}</p>
            }
            // actions={
            //     <EuiButton fill color="primary" type="submit" onClick={() => navigate('/')}>Home</EuiButton>
            // }
        />
    );
}

export default VerifiedEmail;