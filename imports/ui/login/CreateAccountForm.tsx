import { Meteor } from 'meteor/meteor';
import React, { MouseEvent, useState } from 'react';
import { 
    EuiButton, 
    EuiFieldPassword, 
    EuiFieldText, 
    EuiForm, 
    EuiFormRow 
} from '@elastic/eui';

function CreateAccountForm() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitLogin = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        Meteor.loginWithPassword(email, password);
    }

    return (
        <EuiForm component="form">
            <EuiFormRow label="Email">
                <EuiFieldText name="username" onChange={(e) => setEmail(e.target.value)}/>
            </EuiFormRow>

            <EuiFormRow label="Password">
                <EuiFieldPassword name="password" type="dual" onChange={(e) => setPassword(e.target.value)}/>
            </EuiFormRow>

            <EuiButton fill color="primary" type="submit" onClick={(e: any) => submitLogin(e)}>Login</EuiButton>
        </EuiForm>
    );
}

export default CreateAccountForm;