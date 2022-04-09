import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { sendPasswordResetEmail } from '/imports/api/users/UsersMethods';
import { EuiEmptyPrompt, EuiCallOut, EuiLink, EuiButton, EuiFieldText, EuiSpacer, EuiForm, EuiFormRow } from '@elastic/eui';
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function ForgotPassword() {
    let navigate = useNavigate();

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const forgotPasswordForm = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: yup.object().shape({
            email: yup.string().email('Must be a valid email address').required('Email is required'),
        }),
        onSubmit: (values) => {
            forgotPassword(values);
        }
    });

    type FormInputs = {
        email: string
    }

    const forgotPassword = (values: FormInputs) => {
        sendPasswordResetEmail.callPromise({
            email: values.email
        })
        .then(() => {
            setShowSuccess(true);
        })
        .catch((error: any) => {
            setShowError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setError(reason);
        });
    }

    return (
        <EuiEmptyPrompt
            title={<h2>Forgot Password</h2>}
            color="plain"
            body={
                <>
                    { showError && 
                        <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                            <p>{error}</p>
                        </EuiCallOut> 
                    }
                    { showSuccess && 
                        <EuiCallOut title="Success!" color="success" iconType="user">
                            <p>Password reset email has been sent.</p>
                        </EuiCallOut> 
                    }

                    <EuiSpacer />

                    <EuiForm component="form" onSubmit={forgotPasswordForm.handleSubmit}>
                        <EuiFormRow label="Email" error={forgotPasswordForm.errors.email} 
                            isInvalid={!!forgotPasswordForm.errors.email}>
                            <EuiFieldText {...forgotPasswordForm.getFieldProps('email')} 
                                isInvalid={!!forgotPasswordForm.errors.email} />
                        </EuiFormRow>
                        <EuiFormRow>
                            <EuiButton fullWidth fill color="primary" type="submit">Resend</EuiButton>
                        </EuiFormRow>
                    </EuiForm>
                </>
            }
            footer={
                <p>
                    Remembered your password? <EuiLink onClick={() => navigate('/')}>Sign In</EuiLink>
                </p>
            }
        />
    );
}