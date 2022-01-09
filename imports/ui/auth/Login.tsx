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
import { verifyLogin } from '/imports/api/AccountsMethods';

export default function LoginForm() {

    let navigate = useNavigate();
    let errorsMap = new Map();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const getErrorMessage = (name: string) => {
        name === errorsMap.get(name)
    }


    const loginWithPassword = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        verifyLogin.callPromise({
            email: email,
            password: password
        }).then(([email, password]: [email: String, password: string]) => {
            Meteor.loginWithPassword(email, password);
            navigate('/home');
        }).catch((err: any) => {
            setShowErrors(true);
            // console.log('Error: ' + err.error);
            // console.log('Error Type: ' + err.errorType);
            // console.log('Reason: ' + err.reason);
            // console.log('Message: ' + err.message);
            // console.log('Details: ' + err.details);
            // console.log(err);

            err.details.forEach((error: Meteor.Error) => {
                // console.log(error['message']);
                // console.log(error.message);
                // errors.push({"key": error.name, "message": error.message});
                // console.log(error.name);
                // var test = error.name;
                errorsMap.set(error.name, error.message)
            });
        });
    }

    return (
        <EuiEmptyPrompt
            title={<h2>Sign In</h2>}
            color="plain"
            body={
                <EuiForm component="form" isInvalid={showErrors}>
                    <EuiFormRow label="Email" isInvalid={showErrors} error={showErrors}>
                        <EuiFieldText name="email" onChange={(e) => setEmail(e.target.value)} isInvalid={showErrors} />
                    </EuiFormRow>

                    <EuiFormRow label="Password" isInvalid={showErrors}>
                        <EuiFieldPassword name="password" type="dual" onChange={(e) => setPassword(e.target.value)} 
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