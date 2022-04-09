import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router';
import { EuiButton, EuiCallOut, EuiEmptyPrompt, EuiFieldPassword, EuiFieldText, 
    EuiForm, EuiFormRow, EuiLink, EuiSpacer } from '@elastic/eui';
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function LoginForm() {
    let navigate = useNavigate();

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    const userLoginForm = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: yup.object().shape({
            email: yup.string().email('Must be a valid email address').required('Email is required'),
            password: yup.string().required('Password is required')
        }),
        onSubmit: (values) => {
            login(values)
            .catch((error: Meteor.Error) => {
                setShowError(true);
                const reason = error.reason != null ? error.reason : error.message;
                setError(reason);
            });
        }
    });

    type FormInputs = {
        email: string,
        password: string
    }

    const login = (values: FormInputs) => {
        return new Promise((resolve, reject) => {
            Meteor.loginWithPassword(values.email, values.password, error => {
                error ? reject(error) : resolve(navigate('/home'));
            });
        });
    }

    return (
        <EuiEmptyPrompt
            title={<h2>Sign In</h2>}
            color="plain"
            body={
                <>
                    { showError && 
                        <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                            <p>{error}</p>
                        </EuiCallOut> 
                    }
                    <EuiForm component="form" onSubmit={userLoginForm.handleSubmit}>
                        <EuiFormRow label="Email" error={userLoginForm.errors.email} isInvalid={!!userLoginForm.errors.email}>
                            <EuiFieldText {...userLoginForm.getFieldProps('email')} isInvalid={!!userLoginForm.errors.email} />
                        </EuiFormRow>

                        <EuiFormRow label="Password" error={userLoginForm.errors.password} isInvalid={!!userLoginForm.errors.password}>
                            <EuiFieldPassword type="dual" {...userLoginForm.getFieldProps('password')} isInvalid={!!userLoginForm.errors.password}/>
                        </EuiFormRow>

                        <EuiSpacer />

                        <EuiButton fullWidth fill color="primary" type="submit">Sign In</EuiButton>
                    </EuiForm>
                </>
            }
            footer={
                <p>
                    Don't have an account yet? <EuiLink href="/sign-up">Register Now</EuiLink>
                </p>
            }
        />
    );
}