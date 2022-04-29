import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiCallOut, 
    EuiPageContent, EuiPageContentBody, EuiPageHeader, EuiPanel, EuiSpacer, EuiTitle, EuiSelect, EuiComboBox } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Meteor } from 'meteor/meteor';
import { updateUser } from '../../../api/users/UsersMethods';
import DataTable, { TableColumn } from 'react-data-table-component';
import { CoursesCollection } from '../../../api/courses/CoursesCollection';
import { Roles } from 'meteor/alanning:roles';
import _ from 'underscore';

export const User = () => {
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

    const { user, userRoles, isLoadingUser, courses, isLoadingCourses } = useTracker(() => { 
        const userSub = Meteor.subscribe('users.specific', userId);
        const isLoadingUser = !userSub.ready();
        const user = Meteor.users.findOne(userId);
        const userRoles = Roles.getRolesForUser(user);

        const coursesSub = Meteor.subscribe('courses.specificUser', userId);
        const isLoadingCourses = !coursesSub.ready();
        const courses = CoursesCollection.find(coursesSub.scopeQuery(), userId).fetch();

        return { user, userRoles, isLoadingUser, courses, isLoadingCourses };
    }, []);

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Instructor', value: 'instructor' },
        { label: 'Student', value: 'student' },
    ];

    const currentRoles = _.filter(roleOptions, (item) => {
                            return _.contains(userRoles, item.value);
                        });

    const [selectedOptions, setSelectedOptions] = useState(currentRoles);
    const onChange = (selectedOptions: any) => {
        setSelectedOptions(selectedOptions);
    };

    let navigate = useNavigate();

    const updateUserForm = useFormik({
        initialValues: {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            email: email,
            roles: selectedOptions
        },
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            firstName: yup.string().required('First Name is required'),
            lastName: yup.string().required('Last Name is required'),
            gender: yup.string().oneOf(['male', 'female']).required('Gender is required'),
            email: yup.string().email('Email must be valid').required('Email is required'),
            roles: yup.array().min(1, 'Must have at least 1 role').required('Roles is required')
        }),
        onSubmit: (values) => {
            updateThisUser(userId, values);
        }
    });

    type FormInputs = {
        firstName: string,
        lastName: string,
        gender: string,
        email: string,
        roles: {label: string}[]
    }

    const updateThisUser = (userId: string | undefined, values: FormInputs) => {
        updateUser.callPromise({
            userId: userId,
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            email: values.email,
            roles: values.roles
        }).then(() => {
            setShowError(false);
            setShowSuccess(true);
        }).catch((error: any) => {
            setShowSuccess(false);
            setShowError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setError(reason);
        });
    };

    useEffect(() => {
        if(user) {
            setFirstName(user.profile.firstName);
            setLastName(user.profile.lastName);
            setGender(user.profile.gender);
            setEmail(user.emails[0].address);
        }
        setSelectedOptions(currentRoles);
    }, [user]);

    const goToCourse = (courseId: string) => {
        navigate(`/courses/${courseId}`);
    }

    const goToStudentCourseAttendance = (courseId: string, userId: string | undefined) => {
        navigate(`/courses/${courseId}/students/${userId}/attendance`)
    }

     type DataRow = {
        _id: string;
        name: string;
        credits: number;
    }

    const nonStudentColumns: TableColumn<DataRow>[] = [
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
        {
            name: 'Actions',
            cell: row => <EuiButton size="s" color="primary" id={row._id} onClick={() => goToCourse(row._id)}>Edit</EuiButton>,
        },
    ];

    const studentColumns: TableColumn<DataRow>[] = [
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
        {
            name: 'Actions',
            cell: row => (
                <>
                    <EuiButton size="s" color="primary" id={row._id} onClick={() => goToCourse(row._id)} style={{ marginRight: "1em" }}>Edit</EuiButton>
                    <EuiButton size="s" color="primary" id={row._id} 
                        onClick={() => goToStudentCourseAttendance(row._id, userId)}>View Attendance</EuiButton>
                </>
            ),
        },
    ];

    const columns = Roles.userIsInRole(userId, 'student') ? studentColumns : nonStudentColumns;

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
                                <EuiCallOut title="Error" color="danger" iconType="alert">
                                    <p>{error}</p>
                                </EuiCallOut>
                            }
                            { showSuccess &&
                                <EuiCallOut title="Success!" color="success" iconType="user">
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
                                        <EuiFormRow label="Roles" error={updateUserForm.errors.roles} isInvalid={!!updateUserForm.errors.roles}>
                                            <EuiComboBox
                                                aria-label="Select roles for user"
                                                placeholder="Select one or more options"
                                                options={roleOptions}
                                                selectedOptions={selectedOptions}
                                                onChange={onChange}
                                                isInvalid={!!updateUserForm.errors.roles}
                                            />
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
