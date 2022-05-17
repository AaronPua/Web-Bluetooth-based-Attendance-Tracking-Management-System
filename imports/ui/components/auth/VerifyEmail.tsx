import React, { Fragment, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { EuiButton, EuiEmptyPrompt, EuiFieldText, EuiFlexGroup, EuiForm, EuiFormRow, EuiLink, EuiFlexItem, EuiCallOut } from '@elastic/eui';
import { resendVerificationEmail } from '../../../api/users/UsersMethods';
import { useFormik } from 'formik';
import * as yup from 'yup';

export const VerifyEmail = () => {

    const [showResend, setShowResend] = useState(false);

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const resendEmailVerificationForm = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: yup.object().shape({
            email: yup.string().email('Must be a valid email address').required('Email is required'),
        }),
        onSubmit: (values, { setSubmitting }) => {
            resendEmailVerification(values);
            Meteor.setTimeout(() => { setSubmitting(false) }, 500);
        }
    });

    type FormInputs = {
        email: string
    }

    const resendEmailVerification = (values: FormInputs) => {
        resendVerificationEmail.callPromise({
            email: values.email
        })
        .then(() => {
            setShowError(false);
            setShowSuccess(true);
        })
        .catch((error: Meteor.Error) => {
            setShowSuccess(false);
            setShowError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setError(reason);
        });
    }

    return (
        <EuiEmptyPrompt
            title={<h2>Verify Your Email</h2>}
            color="plain"
            body={
                <p>Please check your email inbox or spam folder for the verification email.</p>
            }
            footer={
                <Fragment>
                    <p>
                        Did not receive the verification email? <EuiLink color="primary" onClick={() => setShowResend(true)}>Click Here.</EuiLink>
                    </p>

                    { showResend && 
                        <EuiForm component="form" onSubmit={resendEmailVerificationForm.handleSubmit}>
                            { showError && 
                                <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                                    <p>{error}</p>
                                </EuiCallOut> 
                            }
                            { showSuccess && 
                                <EuiCallOut title="Success!" color="success" iconType="user">
                                    <p>Verification email has been sent.</p>
                                </EuiCallOut> 
                            }
                            <EuiFlexGroup>
                                <EuiFlexItem>
                                    <EuiFormRow label="Email" error={resendEmailVerificationForm.errors.email} 
                                        isInvalid={!!resendEmailVerificationForm.errors.email}>
                                        <EuiFieldText {...resendEmailVerificationForm.getFieldProps('email')} 
                                            isInvalid={!!resendEmailVerificationForm.errors.email} />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiFormRow hasEmptyLabelSpace>
                                        <EuiButton fill color="primary" type="submit" isLoading={resendEmailVerificationForm.isSubmitting}>Resend</EuiButton>
                                    </EuiFormRow>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiForm>
                    }
                </Fragment>
            }
        />
    );
}