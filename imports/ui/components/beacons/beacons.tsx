import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiCallOut, EuiPageContent, EuiPageContentBody, EuiPageHeader, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import uuid from 'uuid-random';
import { createBeacon } from '/imports/api/beacons/BeaconsMethods';
import { BeaconsCollection } from '/imports/api/beacons/BeaconsCollection';
import { Meteor } from 'meteor/meteor';
import { CoursesCollection } from '/imports/api/courses/CoursesCollection';

export default function Beacons() {
    const { courseId } = useParams();

    const [courseName, setCourseName] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const createBeaconForm = useFormik({
        initialValues: {
            name: '',
            uuidString: uuid()
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Course Name is required'),
            uuidString: yup.string().uuid('Must be a valid uuid').required('Uuid is required')
        }),
        onSubmit: (values) => {
            createNewBeacon(courseId, values.name, values.uuidString);
        }
    });

    const createNewBeacon = (courseId: string | undefined, name: string, uuidString: string) => {
        createBeacon.callPromise({
            courseId: courseId,
            name: name,
            uuid: uuidString
        }).then(() => {
            setShowSuccess(true);
        }).catch((error: any) => {
            setShowError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setError(reason);
        });
    };

    let navigate = useNavigate();
    const goToBeacon = (courseId: string | undefined, beaconId: string) => {
        navigate(`/courses/${courseId}/beacons/${beaconId}`);
    }

    const { course, isLoadingBeacons, courseBeacons } = useTracker(() => { 
        Meteor.subscribe('courses.specific', courseId);
        const course = CoursesCollection.findOne(courseId);

        const courseBeaconsSub = Meteor.subscribe('beacons.forOneCourse', courseId);
        const isLoadingBeacons = !courseBeaconsSub.ready();
        const courseBeacons = BeaconsCollection.find(courseBeaconsSub.scopeQuery(), courseId).fetch();

        return { course, isLoadingBeacons, courseBeacons };
    }, []);

    type DataRow = {
        _id: string;
        name: string;
        uuid: string;
    }

    const columns: TableColumn<DataRow>[] = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Uuid',
            selector: row => row.uuid,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => <EuiButton size="s" color="primary" id={row._id} onClick={() => goToBeacon(courseId, row._id)}>Edit</EuiButton>,
        },
    ];

    useEffect(() => {
        if(course) {
            setCourseName(course.name);
        }
    }, [course]);

    return (
        <>
            <EuiPageHeader pageTitle={`${courseName}: Beacons`} />
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
                            <h4>Create Beacon</h4>
                        </EuiTitle>
                        <EuiSpacer />
                        { showError &&
                            <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                                <p>{error}</p>
                            </EuiCallOut>
                        }
                        { showSuccess &&
                            <EuiCallOut title="Success!" color="success" iconType="user">
                                <p>Beacon created sucessfully.</p>
                            </EuiCallOut>
                        }
                        <EuiForm component="form" onSubmit={createBeaconForm.handleSubmit}>
                            <EuiFlexGroup style={{ maxWidth: 1000 }}>
                                <EuiFlexItem>
                                    <EuiFormRow label="Name" error={createBeaconForm.errors.name} isInvalid={!!createBeaconForm.errors.name}>
                                        <EuiFieldText {...createBeaconForm.getFieldProps('name')} isInvalid={!!createBeaconForm.errors.name} />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Uuid" error={createBeaconForm.errors.uuidString} isInvalid={!!createBeaconForm.errors.uuidString}>
                                        <EuiFieldText {...createBeaconForm.getFieldProps('uuidString')} isInvalid={!!createBeaconForm.errors.uuidString}/>
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow hasEmptyLabelSpace>
                                        <EuiButton fill color="primary" type="submit">Create</EuiButton>
                                    </EuiFormRow>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiForm>
                    </EuiPanel>

                    <EuiSpacer />

                    <EuiPanel>
                        <DataTable
                            title="Beacons"
                            columns={columns}
                            data={courseBeacons}
                            progressPending={isLoadingBeacons}
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
