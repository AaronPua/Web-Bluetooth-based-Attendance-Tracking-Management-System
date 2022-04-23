import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiCallOut, 
    EuiPageContent, EuiPageContentBody, EuiPageHeader, EuiPanel, EuiSpacer, EuiTitle, EuiSelect, EuiFieldPassword } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Meteor } from 'meteor/meteor';
import { updateUserAccount } from '/imports/api/users/UsersMethods';
import _ from 'underscore';

export const Account = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const genderOptions = [
        { value: 'male', text: 'Male'},
        { value: 'female', text: 'Female'}
    ];

    const { user } = useTracker(() => { 
        const user = Meteor.user();

        return { user };
    }, []);

    const updateUserForm = useFormik({
        initialValues: {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            email: email,
        },
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            firstName: yup.string().required('First Name is required'),
            lastName: yup.string().required('Last Name is required'),
            gender: yup.string().oneOf(['male', 'female']).required('Gender is required'),
            email: yup.string().email('Email must be valid').required('Email is required'),
        }),
        onSubmit: (values) => {
            updateThisUser(user?._id, values);
        }
    });

    type UserDetailsInput = {
        firstName: string,
        lastName: string,
        gender: string,
        email: string,
    }

    const updateThisUser = (userId: string | undefined, values: UserDetailsInput) => {
        updateUserAccount.callPromise({
            userId: userId,
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            email: values.email
        }).then(() => {
            setShowSuccess(true);
            setShowError(false);
        }).catch((error: any) => {
            setShowSuccess(false);
            setShowError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setError(reason);
        });
    };

    type UserPasswordInput = {
        oldPassword: string,
        newPassword: string
    }

    const updatePasswordForm = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
        },
        validationSchema: yup.object().shape({
            oldPassword: yup.string().required('Old Password is required'),
            newPassword: yup.string().required('New Password is required'),
        }),
        onSubmit: (values, actions) => {
            updateUserPassword(values);
            actions.resetForm();
        }
    });

    const updateUserPassword = (values: UserPasswordInput) => {
        Accounts.changePassword(values.oldPassword, values.newPassword, (error: any) => {
            if(error) {
                setShowPasswordSuccess(false);
                setShowPasswordError(true);
                const reason = error.reason != null ? error.reason : error.message;
                setPasswordError(reason);
            }
            else {
                setShowPasswordError(false);
                setShowPasswordSuccess(true);
            }
        });
    };

    useEffect(() => {
        if(user) {
            setFirstName(user.profile.firstName);
            setLastName(user.profile.lastName);
            setGender(user.profile.gender);
            setEmail(user.emails[0].address);
        }
    }, [user]);

    return (
        <>
            <EuiPageHeader pageTitle="Account" />
            <EuiPageContent
                hasBorder={false}
                hasShadow={false}
                paddingSize="none"
                color="plain"
                borderRadius="none"
                grow={true}
            >
                <EuiPageContentBody>
                    <EuiPanel>
                        <EuiTitle size="s">
                            <h4>Edit Details</h4>
                        </EuiTitle>
                        <EuiSpacer />
                        { showError &&
                            <EuiCallOut title="Error" color="danger" iconType="alert">
                                <p>{error}</p>
                            </EuiCallOut>
                            }
                        { showSuccess &&
                            <EuiCallOut title="Success!" color="success" iconType="user">
                                <p>Account updated sucessfully.</p>
                            </EuiCallOut>
                        }
                        <EuiForm component="form" onSubmit={updateUserForm.handleSubmit}>
                            <EuiFlexGroup>
                                <EuiFlexItem>
                                    <EuiFormRow label="Email" error={updateUserForm.errors.email} isInvalid={!!updateUserForm.errors.email}>
                                        <EuiFieldText {...updateUserForm.getFieldProps('email')} isInvalid={!!updateUserForm.errors.email} />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="First Name" error={updateUserForm.errors.firstName} isInvalid={!!updateUserForm.errors.firstName}>
                                        <EuiFieldText {...updateUserForm.getFieldProps('firstName')} isInvalid={!!updateUserForm.errors.firstName} />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Last Name" error={updateUserForm.errors.lastName} isInvalid={!!updateUserForm.errors.lastName}>
                                        <EuiFieldText {...updateUserForm.getFieldProps('lastName')} isInvalid={!!updateUserForm.errors.lastName} />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Gender" error={updateUserForm.errors.gender} isInvalid={!!updateUserForm.errors.gender}>
                                        <EuiSelect options={genderOptions} {...updateUserForm.getFieldProps('gender')}
                                            isInvalid={!!updateUserForm.errors.gender} />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow hasEmptyLabelSpace>
                                        <EuiButton fill color="primary" type="submit">Update</EuiButton>
                                    </EuiFormRow>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiForm>
                    </EuiPanel>

                    <EuiSpacer />

                    <EuiPanel>
                        <EuiTitle size="s">
                            <h4>Change Password</h4>
                        </EuiTitle>
                        <EuiSpacer />
                        { showPasswordError &&
                            <EuiCallOut title="Error" color="danger" iconType="alert">
                                <p>{passwordError}</p>
                            </EuiCallOut>
                            }
                        { showPasswordSuccess &&
                            <EuiCallOut title="Success!" color="success" iconType="user">
                                <p>Password updated sucessfully.</p>
                            </EuiCallOut>
                        }
                        <EuiForm component="form" onSubmit={updatePasswordForm.handleSubmit}>
                            <EuiFlexGroup>
                                <EuiFlexItem>
                                    <EuiFormRow label="Old Password" error={updatePasswordForm.errors.oldPassword} 
                                        isInvalid={!!updatePasswordForm.errors.oldPassword}
                                    >
                                        <EuiFieldPassword type="dual" {...updatePasswordForm.getFieldProps('oldPassword')} 
                                            isInvalid={!!updatePasswordForm.errors.oldPassword} 
                                        />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="New Password" error={updatePasswordForm.errors.newPassword} 
                                        isInvalid={!!updatePasswordForm.errors.newPassword}
                                    >
                                        <EuiFieldPassword type="dual" {...updatePasswordForm.getFieldProps('newPassword')} 
                                            isInvalid={!!updatePasswordForm.errors.newPassword} 
                                        />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow hasEmptyLabelSpace>
                                        <EuiButton fill color="primary" type="submit">Change</EuiButton>
                                    </EuiFormRow>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiForm>
                    </EuiPanel>
                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}
