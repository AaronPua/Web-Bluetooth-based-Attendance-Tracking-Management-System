import { Accounts } from 'meteor/accounts-base';
import React, { MouseEvent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    EuiButton, 
    EuiFieldPassword, 
    EuiFieldText, 
    EuiForm, 
    EuiFormRow 
} from '@elastic/eui';
import CenteredBody from '../layout/CenteredBody';

function RegistrationForm() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();

    const createUser = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        Accounts.createUser({
            email: email,
            password: password
        });

        navigate('/email-verification');
    }

    return (
        <CenteredBody 
            title={<h2>Sign Up</h2>}
            color="plain"
            body={
                <EuiForm component="form">
                    <EuiFormRow label="Email">
                        <EuiFieldText name="email" onChange={(e) => setEmail(e.target.value)}/>
                    </EuiFormRow>

                    <EuiFormRow label="Password">
                        <EuiFieldPassword name="password" type="dual" onChange={(e) => setPassword(e.target.value)}/>
                    </EuiFormRow>
                </EuiForm>
            }
            actions={
                <EuiButton fullWidth fill color="primary" type="submit" onClick={(e: any) => createUser(e)}>Register</EuiButton>
            }
        />
    );
}

export default RegistrationForm;