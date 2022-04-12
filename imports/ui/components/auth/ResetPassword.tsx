import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { useNavigate, useParams } from 'react-router';
import { EuiButton, EuiCallOut, EuiEmptyPrompt, EuiFieldPassword, EuiForm, EuiFormRow, EuiLink, EuiSpacer } from '@elastic/eui';
import { useFormik } from 'formik';
import * as yup from 'yup';

export const ResetPassword = () => {
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    let navigate = useNavigate();
    let params = useParams();
    let token = params.token ?? '';

    const resetPasswordForm = useFormik({
        initialValues: {
            password: ''
        },
        validationSchema: yup.object().shape({
            password: yup.string().required('Password is required')
        }),
        onSubmit: (values) => {
            resetPassword(token, values);
        }
    });

    type FormInputs = {
        password: string
    }

    const resetPassword = (token: string, values: FormInputs) => {
        Accounts.resetPassword(token, values.password, (error: any) => {
            if(error) {
                setShowError(true);
                const reason = error.reason != null ? error.reason : error.message;
                setError(reason);
            }
            else {
                setShowSuccess(true);
            }
        });
    }

    return (
        <EuiEmptyPrompt
            title={<h2>Reset Password</h2>}
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
                            <p>Your password has been reset.</p>
                        </EuiCallOut>
                    }
                    <EuiForm component="form" onSubmit={resetPasswordForm.handleSubmit}>
                        <EuiFormRow label="Password" error={resetPasswordForm.errors.password} isInvalid={!!resetPasswordForm.errors.password}>
                            <EuiFieldPassword type="dual" {...resetPasswordForm.getFieldProps('password')} isInvalid={!!resetPasswordForm.errors.password}/>
                        </EuiFormRow>

                        <EuiSpacer />

                        <EuiButton fullWidth fill color="primary" type="submit">Reset</EuiButton>
                    </EuiForm>
                </>
            }
            footer={
                <p>
                    Password has been reset? <EuiLink onClick={() => navigate('/')}>Sign In</EuiLink>
                </p>
            }
        />
    );
}