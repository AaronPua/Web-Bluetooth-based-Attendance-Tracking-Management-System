import { Meteor } from 'meteor/meteor';
import React, { MouseEvent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    EuiButton, 
    EuiEmptyPrompt, 
    EuiFieldPassword, 
    EuiFieldText, 
    EuiForm, 
    EuiFormRow,
    EuiLink
} from '@elastic/eui';
import { verifyLogin } from '../../../api/users/UsersMethods';
import { check } from 'meteor/check';

export default function LoginForm() {

    let navigate = useNavigate();

    const [inputs, setInputs] = useState({
        email: '',
        password: ''
    });
    const [showErrors, setShowErrors] = useState(false);
    const [errors, setErrors] = useState(Array());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    }

    const loginWithPassword = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        verifyLogin.callPromise({
            email: inputs.email,
            password: inputs.password
        }).then(([email, password]: [email: String, password: string]) => {
            Meteor.loginWithPassword(email, password);
            navigate('/home');
        }).catch((err: any) => {
            setShowErrors(true);

            let tempErrors = Array();
            err.details.forEach((error: Meteor.Error) => {
                tempErrors.push(error.message);
            });
            setErrors(tempErrors);
        });
    }

    return (
        <EuiEmptyPrompt
            title={<h2>Sign In</h2>}
            color="plain"
            body={
                <EuiForm component="form" isInvalid={showErrors} error={errors}>
                    <EuiFormRow label="Email" isInvalid={showErrors}>
                        <EuiFieldText name="email" onChange={handleChange} isInvalid={showErrors} />
                    </EuiFormRow>

                    <EuiFormRow label="Password" isInvalid={showErrors}>
                        <EuiFieldPassword name="password" type="dual" onChange={handleChange} 
                            isInvalid={showErrors}/>
                    </EuiFormRow>
                </EuiForm>
            }
            actions={
                <EuiButton fullWidth fill color="primary" type="submit" onClick={(e: any) => loginWithPassword(e)}>Sign In</EuiButton>
            }
            footer={
                <p>
                    Don't have an account yet? <EuiLink href="/sign-up">Register Now</EuiLink>
                </p>
            }
        />
    );
}