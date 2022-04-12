import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiCallOut, EuiFieldNumber, EuiPageContent, EuiPageContentBody, EuiPageHeader, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';
import React, { useState } from 'react';
import { createCourse } from '../../../api/courses/CoursesMethods';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useTracker } from 'meteor/react-meteor-data';
import { CoursesCollection } from '../../../api/courses/CoursesCollection';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

export const Courses = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const createCourseForm = useFormik({
        initialValues: {
            name: '',
            credits: 1
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Course Name is required'),
            credits: yup.number().integer('Credits must be an integer').positive('Credits must be a positive number').required('Credits is required'),
        }),
        onSubmit: (values) => {
            createNewCourse(values.name, values.credits);
        }
    });

    const createNewCourse = (name: string, credits: number) => {
        createCourse.callPromise({
            name: name,
            credits: credits
        }).then(() => {
            setShowSuccess(true);
        }).catch((error: any) => {
            setShowError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setError(reason);
        });
    };

    let navigate = useNavigate();

    const goToCourse = (courseId: string) => {
        navigate(`/courses/${courseId}`);
    }

    const { isLoadingCourses, allCourses, isLoadingUserCourses, userCourses } = useTracker(() => {
        const allCoursesSub = Meteor.subscribe('courses.all');
        const isLoadingCourses = !allCoursesSub.ready();
        const allCourses = CoursesCollection.find(allCoursesSub.scopeQuery()).fetch();

        const currentUserCoursesSub = Meteor.subscribe('courses.currentUser');
        const isLoadingUserCourses = !currentUserCoursesSub.ready();
        const userCourses = CoursesCollection.find(currentUserCoursesSub.scopeQuery()).fetch();

        return { isLoadingCourses, allCourses, isLoadingUserCourses, userCourses };
    });

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
        {
            name: 'Actions',
            cell: row => <EuiButton size="s" color="primary" id={row._id} onClick={() => goToCourse(row._id)}>Edit</EuiButton>,
        },
    ];

    return (
        <>
            <EuiPageHeader pageTitle="Courses" />
            <EuiPageContent
                hasBorder={false}
                hasShadow={false}
                paddingSize="none"
                color="plain"
                borderRadius="none"
                grow={true}
            >
                <EuiPageContentBody>
                    { Roles.userIsInRole(Meteor.userId(), 'admin') && <>
                        <EuiPanel>
                            <EuiTitle size="s">
                                <h4>Create Course</h4>
                            </EuiTitle>
                            <EuiSpacer />
                            { showError &&
                                <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                                    <p>{error}</p>
                                </EuiCallOut>
                            }
                            { showSuccess &&
                                <EuiCallOut title="Success!" color="success" iconType="user">
                                    <p>Course created sucessfully.</p>
                                </EuiCallOut>
                            }
                            <EuiForm component="form" onSubmit={createCourseForm.handleSubmit}>
                                <EuiFlexGroup justifyContent='flexStart'>
                                    <EuiFlexItem grow={false}>
                                        <EuiFormRow label="Name" error={createCourseForm.errors.name} isInvalid={!!createCourseForm.errors.name}>
                                            <EuiFieldText {...createCourseForm.getFieldProps('name')} isInvalid={!!createCourseForm.errors.name} />
                                        </EuiFormRow>
                                    </EuiFlexItem>
                                    <EuiFlexItem grow={false}>
                                        <EuiFormRow label="Credits" error={createCourseForm.errors.credits} isInvalid={!!createCourseForm.errors.credits}>
                                            <EuiFieldNumber {...createCourseForm.getFieldProps('credits')} isInvalid={!!createCourseForm.errors.credits} />
                                        </EuiFormRow>
                                    </EuiFlexItem>
                                    <EuiFlexItem grow={false}>
                                        <EuiFormRow hasEmptyLabelSpace>
                                            <EuiButton fill color="primary" type="submit">Create Course</EuiButton>
                                        </EuiFormRow>
                                    </EuiFlexItem>
                                </EuiFlexGroup>
                            </EuiForm>
                        </EuiPanel>
                        <EuiSpacer />
                        </>
                    }
                    
                    { Roles.userIsInRole(Meteor.userId(), 'admin') ? 
                        (
                            <EuiPanel>
                                <DataTable
                                    title="Courses"
                                    columns={columns}
                                    data={allCourses}
                                    progressPending={isLoadingCourses}
                                    pagination
                                    striped
                                    responsive
                                    defaultSortFieldId={1}
                                />
                            </EuiPanel>
                        ) : (
                            <EuiPanel>
                                <DataTable
                                    title="Courses"
                                    columns={columns}
                                    data={userCourses}
                                    progressPending={isLoadingUserCourses}
                                    pagination
                                    striped
                                    responsive
                                    defaultSortFieldId={1}
                                />
                            </EuiPanel>
                        )
                    }
                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}