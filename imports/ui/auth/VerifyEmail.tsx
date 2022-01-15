import React from 'react';
import { useNavigate } from "react-router-dom";
import { EuiButton, EuiEmptyPrompt } from '@elastic/eui';

function VerifyEmail() {

    let navigate = useNavigate();

    return (
        <EuiEmptyPrompt
            title={<h2>Verify Your Email</h2>}
            color="plain"
            body={
                <p>Please check your email inbox or spam folder for the verification email.</p>
            }
            // actions={
            //     <EuiButton fill color="primary" type="submit" onClick={() => navigate('/')}>Home</EuiButton>
            // }
        />
    );
}

export default VerifyEmail;