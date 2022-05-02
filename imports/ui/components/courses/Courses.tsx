import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiCallOut, EuiFieldNumber, EuiPageContent, EuiPageContentBody, EuiPageHeader, EuiPanel, EuiSpacer, EuiTitle, EuiConfirmModal } from '@elastic/eui';
import React, { useState } from 'react';
import { createCourse, removeCourse } from '../../../api/courses/CoursesMethods';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useTracker } from 'meteor/react-meteor-data';
import { CoursesCollection } from '../../../api/courses/CoursesCollection';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import _ from 'underscore';

export const Courses = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const [showRemoveSuccess, setShowRemoveSuccess] = useState(false);
    const [showRemoveError, setShowRemoveError] = useState(false);
    const [removeError, setRemoveError] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [courseId, setCourseId] = useState('');
    const [courseName, setCourseName] = useState('');
    const [value, setValue] = useState('');
    const onChange = (e: any) => {
        setValue(e.target.value);
    };

    const createCourseForm = useFormik({
        initialValues: {
            name: '',
            credits: 1
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Course Name is required'),
            credits: yup.number().integer('Credits must be an integer').positive('Credits must be a positive number').required('Credits is required'),
        }),
        onSubmit: (values, { setSubmitting, resetForm }) => {
            createNewCourse(values.name, values.credits);
            Meteor.setTimeout(() => { setSubmitting(false) }, 500);
            resetForm({ values: { name: '', credits: 1 } });
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

    const removeThisCourse = (courseId: string) => {
        removeCourse.callPromise({
            courseId: courseId
        }).then(() => {
            setShowRemoveError(false);
            setShowRemoveSuccess(true);
        }).catch((error: any) => {
            setShowRemoveSuccess(false);
            setShowRemoveError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setRemoveError(reason);
        });
    }

    const { allCourses, userCourses } = useTracker(() => {
        Meteor.subscribe('courses.all');
        const allCourses = CoursesCollection.find().fetch();
        
        Meteor.subscribe('courses.currentUser');
        const userCourses = CoursesCollection.find().fetch();

        return { allCourses, userCourses };
    });

    const showRemoveCourseModal = (courseId: string, courseName: string) => {
        setIsModalVisible(true);
        setCourseId(courseId);
        setCourseName(courseName);
    }

    let modal: any;
    if (isModalVisible) {
        modal = (
            <EuiConfirmModal
                title={`Remove ${courseName}?`}
                onCancel={() => {
                    setIsModalVisible(false);
                    setValue('');
                }}
                onConfirm={() => {
                    removeThisCourse(courseId);
                    setIsModalVisible(false);
                    setValue('');
                }}
                confirmButtonText="Remove"
                cancelButtonText="Cancel"
                buttonColor="danger"
                confirmButtonDisabled={value.toLowerCase() !== 'remove'}
            >
                <EuiFormRow label="Type the word 'remove' to confirm">
                <EuiFieldText
                    name="remove"
                    value={value}
                    onChange={onChange}
                />
                </EuiFormRow>
            </EuiConfirmModal>
        );
    }

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
            cell: row => (
                <>
                    <EuiButton size="s" color="primary" id={row._id} onClick={() => goToCourse(row._id)} style={{ marginRight: "1em" }}>Edit</EuiButton>
                    { Roles.userIsInRole(Meteor.userId(), 'admin') &&
                        <EuiButton size="s" color="text" id={row._id} onClick={() => showRemoveCourseModal(row._id, row.name)}>Remove</EuiButton>
                    }
                    { modal }
                </>
            ),
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
                                <EuiCallOut title="Error" color="danger" iconType="alert">
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
                                            <EuiButton fill color="primary" type="submit">Create</EuiButton>
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
                                { showRemoveError &&
                                    <EuiCallOut title="Error" color="danger" iconType="alert">
                                        <p>{removeError}</p>
                                    </EuiCallOut>
                                }
                                { showRemoveSuccess &&
                                    <EuiCallOut title="Success!" color="success" iconType="user">
                                        <p>Course removed sucessfully.</p>
                                    </EuiCallOut>
                                }
                                <DataTable
                                    title="Courses"
                                    columns={columns}
                                    data={allCourses}
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