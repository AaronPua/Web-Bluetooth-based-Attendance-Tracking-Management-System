import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useLocation, useNavigate } from 'react-router-dom';
import { EuiButton, EuiCallOut, EuiEmptyPrompt, EuiFieldPassword, EuiFieldText, EuiForm, EuiFormRow, EuiLink, EuiSpacer } from '@elastic/eui';
import { useFormik } from 'formik';
import * as yup from 'yup';

export const Login = () => {
    let navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    const [loginError, setLoginError] = useState('');
    const [showLoginError, setShowLoginError] = useState(false);

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
            login(values);
        }
    });

    type FormInputs = {
        email: string,
        password: string
    }

    const login = (values: FormInputs) => {
        Meteor.loginWithPassword(values.email, values.password, (error: any) => {
            if(error) {
                setShowLoginError(false);
                setShowError(true);
                const reason = error.reason != null ? error.reason : error.message;
                setError(reason);
            }
            else {
                navigate('/home');
            }
        });
    }

    useEffect(() => {
        if(Meteor.userId() && !Meteor.loggingOut()) {
            navigate('/home');
        }

        if(location.state != null && location.state.loginFirst != null) {
            setLoginError(location.state.loginFirst);
            setShowLoginError(true);
            setShowError(false);
        }

        if(location.state != null && location.state.accessDenied != null) {
            setLoginError(location.state.accessDenied);
            setShowLoginError(true);
            setShowError(false);
        }
    }, [location.state]);

    return (
        <EuiEmptyPrompt
            title={<h2>Sign In</h2>}
            color="plain"
            body={
                <>
                    { showError && 
                        <EuiCallOut title="Error" color="danger" iconType="alert">
                            <p>{error}</p>
                        </EuiCallOut>
                    }
                    { showLoginError && 
                        <EuiCallOut title="Warning" color="danger" iconType="alert">
                            <p>{loginError}</p>
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
                    Don't have an account yet? <EuiLink onClick={() => navigate('/register')}>Register Now</EuiLink>
                </p>
            }
        />
    );
}