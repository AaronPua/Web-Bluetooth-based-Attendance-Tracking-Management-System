import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { EuiButton, EuiEmptyPrompt } from '@elastic/eui';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { useParams } from "react-router-dom";

function VerifiedEmail() {

    let navigate = useNavigate();
    let params = useParams();
    let token = params.token ?? '';

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        console.log('before verify');
        console.log(params.token);
        // Accounts.onEmailVerificationLink((token: string, done: Function) => {
        //     console.log("inside onEmailVerificationLink, before verifyEmail");
        //     Accounts.verifyEmail(token, (error: any) => {
        //         console.log("inside verifyEmail");
        //         if (error?.message === 'Verify email link expired') {
        //             console.log("Error: link expired");
        //             setTitle('Email Verification Failed!');
        //             setBody('The email verification link has expired.');
        //         }
        //         else if (error) {
        //             console.log(`Error: ${error.message}`);
        //             setTitle('Email Verification Failed!');
        //             setBody(`Email could not be verified. Error: ${error.message}`);
        //         }
        //         else {
        //             console.log('hurrah email verified yeet');
        //             setTitle('Email Verified!');
        //             setBody('Thank you for verifying your email.');
        //             done();
        //             navigate('/');
        //         }
        //     });
        // });
        Accounts.verifyEmail(token, (error: any) => {
            console.log("inside verifyEmail");
            if (error?.message === 'Verify email link expired') {
                console.log("Error: link expired");
                setTitle('Email Verification Failed!');
                setBody('The email verification link has expired.');
            }
            else if (error) {
                console.log(`Error: ${error.message}`);
                setTitle('Email Verification Failed!');
                setBody(`Email could not be verified. Error: ${error.message}`);
            }
            else {
                console.log('hurrah email verified yeet');
                setTitle('Email Verified!');
                setBody('Thank you for verifying your email. \n You may now log in.');
                // navigate('/');
            }
        });
        console.log('after verify');
    }, []);

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