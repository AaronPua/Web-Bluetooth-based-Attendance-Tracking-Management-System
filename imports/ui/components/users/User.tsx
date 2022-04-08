import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiCallOut, 
    EuiPageContent, EuiPageContentBody, EuiPageHeader, EuiPanel, EuiSpacer, EuiTitle, EuiSelect } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Meteor } from 'meteor/meteor';
import { updateUser } from '/imports/api/users/UsersMethods';
import DataTable, { TableColumn } from 'react-data-table-component';
import { CoursesCollection } from '/imports/api/courses/CoursesCollection';

export default function User() {
    const { userId } = useParams();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const genderOptions = [
        { value: 'male', text: 'Male'},
        { value: 'female', text: 'Female'}
    ];

    const updateUserForm = useFormik({
        initialValues: {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            email: email
        },
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            firstName: yup.string().required('First Name is required'),
            lastName: yup.string().required('Last Name is required'),
            gender: yup.string().oneOf(['male', 'female']).required('Gender is required'),
            email: yup.string().email('Email must be valid').required('Email is required'),
        }),
        onSubmit: (values) => {
            updateThisUser(userId, values);
        }
    });

    type FormInputs = {
        firstName: string,
        lastName: string,
        gender: string,
        email: string
    }

    const updateThisUser = (userId: string | undefined, values: FormInputs) => {
        updateUser.callPromise({
            userId: userId,
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            email: values.email
        }).then(() => {
            setShowSuccess(true);
        }).catch((error: any) => {
            setShowError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setError(reason);
        });
    };

    const { user, isLoadingUser, courses, isLoadingCourses } = useTracker(() => { 
        const userSub = Meteor.subscribe('users.specific', userId);
        const isLoadingUser = !userSub.ready();
        const user = Meteor.users.findOne(userId);

        const coursesSub = Meteor.subscribe('users.courses.specificUser', userId);
        const isLoadingCourses = !coursesSub.ready();
        const courses = CoursesCollection.find(coursesSub.scopeQuery(), userId).fetch();

        return { user, isLoadingUser, courses, isLoadingCourses };
    }, []);

    useEffect(() => {
        if(user) {
            setFirstName(user.profile.firstName);
            setLastName(user.profile.lastName);
            setGender(user.profile.gender);
            setEmail(user.emails[0].address);
        }
    }, [user]);

     type DataRow = {
        _id: string;
        name: string;
        credits: number;
    }

    const columns: TableColumn<DataRow>[] = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Credits',
            selector: row => row.credits,
            sortable: true,
        },
    ];

    return (
        <>
            <EuiPageHeader pageTitle={`${firstName} ${lastName}`} />
            <EuiPageContent
                hasBorder={false}
                hasShadow={false}
                paddingSize="none"
                color="plain"
                borderRadius="none"
                grow={true}
            >
                <EuiPageContentBody>
                    { !isLoadingUser &&
                        <EuiPanel>
                            <EuiTitle size="s">
                                <h4>Edit User</h4>
                            </EuiTitle>
                            <EuiSpacer />
                            { showError &&
                                <EuiCallOut title="An error has occured" color="danger">
                                    <p>{error}</p>
                                </EuiCallOut>
                            }
                            { showSuccess &&
                                <EuiCallOut title="Success!" color="success">
                                    <p>User updated sucessfully.</p>
                                </EuiCallOut>
                            }
                            <EuiForm component="form" onSubmit={updateUserForm.handleSubmit}>
                                <EuiFlexGroup>
                                    <EuiFlexItem>
                                        <EuiFormRow label="Email" error={updateUserForm.errors.email} isInvalid={!!updateUserForm.errors.email}>
                                            <EuiFieldText {...updateUserForm.getFieldProps('email')} isInvalid={!!updateUserForm.errors.email}/>
                                        </EuiFormRow>
                                    </EuiFlexItem>
                                    <EuiFlexItem>
                                        <EuiFormRow label="First Name" error={updateUserForm.errors.firstName} isInvalid={!!updateUserForm.errors.firstName}>
                                            <EuiFieldText {...updateUserForm.getFieldProps('firstName')} isInvalid={!!updateUserForm.errors.firstName} />
                                        </EuiFormRow>
                                    </EuiFlexItem>
                                    <EuiFlexItem>
                                        <EuiFormRow label="Last Name" error={updateUserForm.errors.lastName} isInvalid={!!updateUserForm.errors.lastName}>
                                            <EuiFieldText {...updateUserForm.getFieldProps('lastName')} isInvalid={!!updateUserForm.errors.lastName}/>
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
                    }

                    <EuiSpacer />
                    
                    <EuiPanel>
                        <DataTable
                            title="Courses"
                            columns={columns}
                            data={courses}
                            progressPending={isLoadingCourses}
                            pagination
                            striped
                            responsive
                            defaultSortFieldId={1}
                        />
                    </EuiPanel>
                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}
