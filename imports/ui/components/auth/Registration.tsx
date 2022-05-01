import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { EuiButton, EuiCallOut, EuiEmptyPrompt, EuiFieldPassword, EuiFieldText, EuiFlexGroup, EuiFlexItem,
    EuiForm, EuiFormRow, EuiLink, EuiSelect, EuiSpacer } from '@elastic/eui';
import { registerUser } from '../../../api/users/UsersMethods';
import { useFormik } from 'formik';
import * as yup from 'yup';

export const Registration = () => {
    let navigate = useNavigate();

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    const genderOptions = [
        { value: 'male', text: 'Male'},
        { value: 'female', text: 'Female'}
    ];

    const createUserForm = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            gender: 'male',
            email: '',
            password: '',
        },
        validationSchema: yup.object().shape({
            firstName: yup.string().required('First Name is required'),
            lastName: yup.string().required('Last Name is required'),
            gender: yup.string().oneOf(['male', 'female']).required('Gender is required'),
            email: yup.string().email('Must be a valid email address').required('Email is required'),
            password: yup.string().required('Password is required')
        }),
        onSubmit: (values) => {
            createUser(values);
        }
    });

    type FormInputs = {
        firstName: string,
        lastName: string,
        gender: string,
        email: string,
        password: string
    }

    const createUser = (values: FormInputs) => {
        registerUser.callPromise({
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            email: values.email,
            password: values.password
        })
        .then(() => {
            navigate('/verify-email');
        })
        .catch((error: Meteor.Error) => {
            setShowError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setError(reason);
        });
    }

    return (
        <EuiEmptyPrompt
            title={<h2>Register</h2>}
            color="plain"
            body={
                <>
                    { showError && 
                        <EuiCallOut title="Error" color="danger" iconType="alert">
                            <p>{error}</p>
                        </EuiCallOut> 
                    }
                    <EuiForm component="form" onSubmit={createUserForm.handleSubmit}>
                        <EuiFlexGroup>
                            <EuiFlexItem>
                                <EuiFormRow label="First Name" error={createUserForm.errors.firstName} isInvalid={!!createUserForm.errors.firstName}>
                                    <EuiFieldText {...createUserForm.getFieldProps('firstName')} isInvalid={!!createUserForm.errors.firstName}/>
                                </EuiFormRow>
                            </EuiFlexItem>
                            <EuiFlexItem>
                                <EuiFormRow label="Last Name" error={createUserForm.errors.lastName} isInvalid={!!createUserForm.errors.lastName}>
                                    <EuiFieldText {...createUserForm.getFieldProps('lastName')} isInvalid={!!createUserForm.errors.lastName}/>
                                </EuiFormRow>
                            </EuiFlexItem>
                        </EuiFlexGroup>

                        <EuiSpacer />

                        <EuiFormRow label="Gender" fullWidth error={createUserForm.errors.gender} isInvalid={!!createUserForm.errors.gender}>
                            <EuiSelect fullWidth options={genderOptions} 
                                    {...createUserForm.getFieldProps('gender')} isInvalid={!!createUserForm.errors.gender} />
                        </EuiFormRow>

                        <EuiFormRow label="Email" fullWidth error={createUserForm.errors.email} isInvalid={!!createUserForm.errors.email}>
                            <EuiFieldText fullWidth {...createUserForm.getFieldProps('email')} isInvalid={!!createUserForm.errors.email}/>
                        </EuiFormRow>

                        <EuiFormRow label="Password" fullWidth error={createUserForm.errors.password} isInvalid={!!createUserForm.errors.password}>
                            <EuiFieldPassword fullWidth type="dual" 
                                    {...createUserForm.getFieldProps('password')} isInvalid={!!createUserForm.errors.password}/>
                        </EuiFormRow>

                        <EuiSpacer />

                        <EuiButton fullWidth fill color="primary" type="submit" isLoading={createUserForm.isSubmitting}>Register</EuiButton>
                    </EuiForm>
                </>
            }
            footer={
                <p>
                    Already have an account? <EuiLink onClick={() => navigate('/')}>Log In To Your Account</EuiLink>
                </p>
            }
        />
    );
}