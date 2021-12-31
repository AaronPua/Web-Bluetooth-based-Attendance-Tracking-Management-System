import { Meteor } from 'meteor/meteor';
import React, { MouseEvent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    EuiButton, 
    EuiFieldPassword, 
    EuiFieldText, 
    EuiForm, 
    EuiFormRow,
    EuiLink
} from '@elastic/eui';
import CenteredBody from '../layout/CenteredBody';

function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();

    const submitLogin = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        Meteor.loginWithPassword(email, password);
        navigate('/home');
    }

    return (
        <CenteredBody
            title={<h2>Sign In</h2>}
            color="plain"
            body={
                <EuiForm component="form">
                    <EuiFormRow label="Email">
                        <EuiFieldText name="username" onChange={(e) => setEmail(e.target.value)}/>
                    </EuiFormRow>

                    <EuiFormRow label="Password">
                        <EuiFieldPassword name="password" type="dual" onChange={(e) => setPassword(e.target.value)}/>
                    </EuiFormRow>
                </EuiForm>
            }
            actions={
                <EuiButton fullWidth fill color="primary" type="submit" onClick={(e: any) => submitLogin(e)}>Sign In</EuiButton>
            }
            footer={
                <p>
                    Don't have an account yet? <EuiLink href="/sign-up">Register Now</EuiLink>
                </p>
            }
        />
    );
}

export default LoginForm;