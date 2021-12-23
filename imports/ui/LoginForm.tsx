import { Meteor } from 'meteor/meteor';
import React, { MouseEvent, useState } from 'react';
import { 
    EuiButton, 
    EuiFieldPassword, 
    EuiFieldText, 
    EuiForm, 
    EuiFormRow 
} from '@elastic/eui';

function LoginForm() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submitLogin = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        Meteor.loginWithPassword(username, password);
    }

    return (
        <EuiForm component="form">
            <EuiFormRow label="Username">
                <EuiFieldText name="username" onChange={(e) => setUsername(e.target.value)}/>
            </EuiFormRow>

            <EuiFormRow label="Password">
                <EuiFieldPassword name="password" type="dual" onChange={(e) => setPassword(e.target.value)}/>
            </EuiFormRow>

            <EuiButton fill color="primary" type="submit" onClick={(e: any) => submitLogin(e)}>Login</EuiButton>
        </EuiForm>
    );
}

export default LoginForm;