import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiCallOut, EuiFieldNumber, EuiPageContent, EuiPageContentBody, EuiPageHeader, EuiPanel } from '@elastic/eui';
import React, { useState } from 'react';
import { createCourse } from '../../../api/courses/CoursesMethods';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { CoursesCollection } from '../../../api/courses/CoursesCollection';
import { useNavigate } from 'react-router-dom';

export default function Courses() {
    const [name, setName] = useState('');
    const [credits, setCredits] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const createNewCourse = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        createCourse.callPromise({
            name: name,
            credits: credits
        }).then(() => {
            setShowSuccess(true);
        }).catch((error: any) => {
            setShowError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setError(reason);
            console.log('Details: ' + error.details);
            console.log('Message: ' + error.message);
            console.log('Error Type: ' + error.error);
            console.log('Reason: ' + error.reason);
        });
    };

    let navigate = useNavigate();

    const goToCourse = (courseId: string) => {
        navigate(`/courses/${courseId}`);
    }

    const isLoading = useSubscribe('courses.all');
    const allCourses = useFind(() => CoursesCollection.find());

    type DataRow = {
        _id: string;
        name: string;
        credits: number;
    }

    const columns: TableColumn<DataRow>[] = [
        {
            name: 'Course Name',
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
                    <EuiPanel>
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
                        <EuiForm component="form">
                            <EuiFlexGroup>
                                <EuiFlexItem>
                                    <EuiFormRow label="Course Name">
                                        <EuiFieldText name="name" onChange={(e) => setName(e.target.value)}/>
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Credits">
                                        <EuiFieldNumber name="credits" onChange={(e) => setCredits(e.target.valueAsNumber)}/>
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiFormRow hasEmptyLabelSpace>
                                        <EuiButton fill color="primary" type="submit" onClick={(e: any) => createNewCourse(e)}>Create Course</EuiButton>
                                    </EuiFormRow>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiForm>
                    </EuiPanel>

                    <EuiPanel>
                        <DataTable
                            columns={columns}
                            data={allCourses}
                            progressPending={isLoading()}
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